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
