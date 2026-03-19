import { getSupabaseServerClient } from "./supabase/server";

export async function ensureAvatarBootstrapForUser(userId: string) {
  const supabase = getSupabaseServerClient();

  const { error: profileError } = await supabase.from("avatar_profiles").upsert(
    {
      user_id: userId,
      display_style: "study-core",
      mood: "focused"
    },
    { onConflict: "user_id" }
  );

  if (profileError) {
    throw profileError;
  }

  const { data: starterItems, error: starterItemsError } = await supabase
    .from("avatar_items")
    .select("id")
    .eq("unlock_type", "starter")
    .eq("is_active", true);

  if (starterItemsError) {
    throw starterItemsError;
  }

  if (starterItems?.length) {
    const starterRows = starterItems.map((item) => ({
      user_id: userId,
      item_id: item.id,
      unlock_source: "starter",
      points_spent: 0
    }));

    const { error: inventoryError } = await supabase
      .from("avatar_inventory")
      .upsert(starterRows, { onConflict: "user_id,item_id", ignoreDuplicates: false });

    if (inventoryError) {
      throw inventoryError;
    }
  }
}

export async function syncAchievementAvatarUnlocks({
  userId,
  unlockedBadgeCodes
}: {
  userId: string;
  unlockedBadgeCodes: string[];
}) {
  const supabase = getSupabaseServerClient();
  const badgeCodes = Array.from(new Set(unlockedBadgeCodes)).filter(Boolean);

  if (!badgeCodes.length) {
    return [];
  }

  const { data: achievementItems, error: achievementItemsError } = await supabase
    .from("avatar_items")
    .select("id, code, name, required_badge_code")
    .eq("unlock_type", "achievement")
    .in("required_badge_code", badgeCodes)
    .eq("is_active", true);

  if (achievementItemsError) {
    throw achievementItemsError;
  }

  if (!achievementItems?.length) {
    return [];
  }

  const { data: existingInventory, error: existingInventoryError } = await supabase
    .from("avatar_inventory")
    .select("item_id")
    .eq("user_id", userId);

  if (existingInventoryError) {
    throw existingInventoryError;
  }

  const ownedItemIds = new Set((existingInventory || []).map((item) => item.item_id));
  const newItems = achievementItems.filter((item) => !ownedItemIds.has(item.id));

  if (!newItems.length) {
    return [];
  }

  const rows = newItems.map((item) => ({
    user_id: userId,
    item_id: item.id,
    unlock_source: "achievement",
    points_spent: 0,
    metadata: {
      item_code: item.code,
      item_name: item.name,
      required_badge_code: item.required_badge_code
    }
  }));

  const { error: inventoryInsertError } = await supabase
    .from("avatar_inventory")
    .upsert(rows, { onConflict: "user_id,item_id", ignoreDuplicates: false });

  if (inventoryInsertError) {
    throw inventoryInsertError;
  }

  return newItems.map((item) => ({
    code: item.code,
    name: item.name,
    badgeCode: item.required_badge_code
  }));
}
