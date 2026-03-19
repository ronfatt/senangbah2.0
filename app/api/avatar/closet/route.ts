import { NextResponse } from "next/server";
import {
  buildAchievements,
  computeStreak,
  formatDateOnly,
  getAchievementTitle,
  getMonday
} from "../../../../lib/achievements";
import { resolveAccessSnapshot } from "../../../../lib/access";
import { ensureAvatarBootstrapForUser } from "../../../../lib/avatar";
import { hasPublicSupabaseEnv } from "../../../../lib/env";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

async function resolveUserId({
  authUserId,
  email
}: {
  authUserId: string;
  email: string;
}) {
  const supabase = getSupabaseServerClient();
  let userQuery = supabase.from("users").select("id, email").limit(1);

  if (authUserId) {
    userQuery = userQuery.eq("auth_user_id", authUserId);
  } else {
    userQuery = userQuery.eq("email", email);
  }

  const { data: userRows, error } = await userQuery;
  if (error) throw error;
  return userRows?.[0] || null;
}

export async function POST(request: Request) {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "supabase_env_missing" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const authUserId = String(body?.authUserId || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const action = String(body?.action || "snapshot").trim();
  const itemCode = String(body?.itemCode || "").trim();

  if (!authUserId && !email) {
    return NextResponse.json({ ok: false, error: "missing_identity" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const user = await resolveUserId({ authUserId, email });

    if (!user) {
      return NextResponse.json({ ok: false, error: "user_not_found" }, { status: 404 });
    }

    try {
      await ensureAvatarBootstrapForUser(user.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "avatar_bootstrap_failed";
      if (message.includes("avatar_")) {
        return NextResponse.json({ ok: false, error: "avatar_schema_missing" }, { status: 500 });
      }
      throw error;
    }

    if (action === "purchase") {
      if (!itemCode) {
        return NextResponse.json({ ok: false, error: "missing_item_code" }, { status: 400 });
      }

      const [{ data: itemRows, error: itemError }, { data: inventoryRows, error: inventoryError }, { data: ledgerRows, error: ledgerError }] =
        await Promise.all([
          supabase
            .from("avatar_items")
            .select("id, code, name, price_points, unlock_type, is_active")
            .eq("code", itemCode)
            .limit(1),
          supabase
            .from("avatar_inventory")
            .select("item_id, points_spent")
            .eq("user_id", user.id),
          supabase.from("point_ledger").select("delta_points").eq("user_id", user.id)
        ]);

      if (itemError) throw itemError;
      if (inventoryError) throw inventoryError;
      if (ledgerError) throw ledgerError;

      const item = itemRows?.[0];
      if (!item || !item.is_active) {
        return NextResponse.json({ ok: false, error: "item_not_found" }, { status: 404 });
      }

      if (item.unlock_type !== "shop") {
        return NextResponse.json({ ok: false, error: "item_not_purchasable" }, { status: 400 });
      }

      const alreadyOwned = (inventoryRows || []).some((row) => row.item_id === item.id);
      if (alreadyOwned) {
        return NextResponse.json({ ok: false, error: "already_owned" }, { status: 400 });
      }

      const totalPoints = (ledgerRows || []).reduce((sum, row) => sum + Number(row.delta_points || 0), 0);
      const spentPoints = (inventoryRows || []).reduce((sum, row) => sum + Number(row.points_spent || 0), 0);
      const availablePoints = totalPoints - spentPoints;

      if (availablePoints < Number(item.price_points || 0)) {
        return NextResponse.json(
          {
            ok: false,
            error: "insufficient_points",
            availablePoints,
            requiredPoints: item.price_points
          },
          { status: 400 }
        );
      }

      const { error: purchaseError } = await supabase.from("avatar_inventory").insert({
        user_id: user.id,
        item_id: item.id,
        unlock_source: "shop",
        points_spent: Number(item.price_points || 0),
        metadata: {
          item_code: item.code,
          item_name: item.name
        }
      });

      if (purchaseError) throw purchaseError;
    }

    if (action === "equip") {
      if (!itemCode) {
        return NextResponse.json({ ok: false, error: "missing_item_code" }, { status: 400 });
      }

      const { data: itemRows, error: itemError } = await supabase
        .from("avatar_items")
        .select("id, code, category_id")
        .eq("code", itemCode)
        .limit(1);

      if (itemError) throw itemError;

      const item = itemRows?.[0];
      if (!item) {
        return NextResponse.json({ ok: false, error: "item_not_found" }, { status: 404 });
      }

      const { data: inventoryRows, error: inventoryError } = await supabase
        .from("avatar_inventory")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", item.id)
        .limit(1);

      if (inventoryError) throw inventoryError;
      if (!inventoryRows?.length) {
        return NextResponse.json({ ok: false, error: "item_not_owned" }, { status: 400 });
      }

      const { error: equipError } = await supabase.from("avatar_equipped_items").upsert(
        {
          user_id: user.id,
          category_id: item.category_id,
          item_id: item.id,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id,category_id" }
      );

      if (equipError) throw equipError;
    }

    const [{ data: itemRows, error: itemRowsError }, { data: inventoryRows, error: inventoryRowsError }, { data: equippedRows, error: equippedRowsError }, { data: ledgerRows, error: ledgerRowsError }] =
      await Promise.all([
        supabase
          .from("avatar_items")
          .select("id, code, name, rarity, price_points, unlock_type, collection_name, required_badge_code, avatar_item_categories(code, name)")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("avatar_inventory")
          .select("item_id, points_spent, unlock_source")
          .eq("user_id", user.id),
        supabase
          .from("avatar_equipped_items")
          .select("item_id, avatar_items(code, name), avatar_item_categories(code, name)")
          .eq("user_id", user.id),
        supabase.from("point_ledger").select("delta_points").eq("user_id", user.id)
      ]);

    if (itemRowsError) throw itemRowsError;
    if (inventoryRowsError) throw inventoryRowsError;
    if (equippedRowsError) throw equippedRowsError;
    if (ledgerRowsError) throw ledgerRowsError;

    const inventoryByItemId = new Map((inventoryRows || []).map((row) => [row.item_id, row]));
    const totalPoints = (ledgerRows || []).reduce((sum, row) => sum + Number(row.delta_points || 0), 0);
    const spentPoints = (inventoryRows || []).reduce((sum, row) => sum + Number(row.points_spent || 0), 0);
    const [{ data: completedAttempts }, { data: progressRows }] = await Promise.all([
      supabase
        .from("attempts")
        .select("stars, accuracy_percent, status")
        .eq("user_id", user.id)
        .eq("status", "completed"),
      supabase
        .from("progress_snapshots")
        .select("snapshot_date, metrics")
        .eq("user_id", user.id)
        .eq("snapshot_type", "daily_rollup")
        .gte("snapshot_date", formatDateOnly(new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)))
    ]);
    const completedCount = (completedAttempts || []).length;
    const totalStars = (completedAttempts || []).reduce((sum, attempt) => sum + Number(attempt.stars || 0), 0);
    const averageAccuracy = completedCount
      ? Math.round(
          (completedAttempts || []).reduce((sum, attempt) => sum + Number(attempt.accuracy_percent || 0), 0) /
            completedCount
        )
      : 0;
    const activeDates = (progressRows || [])
      .filter((row) => {
        const metrics =
          row.metrics && typeof row.metrics === "object" && !Array.isArray(row.metrics)
            ? (row.metrics as Record<string, unknown>)
            : {};
        return Number(metrics.completed_today || 0) > 0 || Number(metrics.started_today || 0) > 0;
      })
      .map((row) => row.snapshot_date);
    const streakDays = computeStreak(activeDates);
    const monday = getMonday(new Date());
    const weekKeys = new Set(
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday);
        date.setUTCDate(monday.getUTCDate() + index);
        return formatDateOnly(date);
      })
    );
    const weeklyCompletedCount = (progressRows || []).reduce((sum, row) => {
      if (!weekKeys.has(row.snapshot_date)) return sum;
      const metrics =
        row.metrics && typeof row.metrics === "object" && !Array.isArray(row.metrics)
          ? (row.metrics as Record<string, unknown>)
          : {};
      return sum + Number(metrics.completed_today || 0);
    }, 0);
    const access = await resolveAccessSnapshot({
      authUserId: authUserId || undefined,
      email: user.email || email
    });
    const unlockedBadgeCodes = new Set(
      buildAchievements({
        completedCount,
        totalStars,
        streakDays,
        weeklyCompletedCount,
        averageAccuracy,
        unlockedCount: access.unlockedSubjectCodes.length || 2
      })
        .filter((achievement) => achievement.unlocked)
        .map((achievement) => achievement.code)
    );
    const normalizedItems = (itemRows || []).map((item) => {
      const category = Array.isArray(item.avatar_item_categories)
        ? item.avatar_item_categories[0]
        : item.avatar_item_categories;

      return {
        code: item.code,
        name: item.name,
        rarity: item.rarity,
        pricePoints: Number(item.price_points || 0),
        unlockType: item.unlock_type,
        collectionName: item.collection_name,
        requiredBadgeCode: item.required_badge_code,
        requiredBadgeTitle: getAchievementTitle(item.required_badge_code),
        badgeUnlocked: item.required_badge_code ? unlockedBadgeCodes.has(item.required_badge_code) : true,
        slot: category?.code || "unknown",
        slotName: category?.name || "Unknown",
        owned: inventoryByItemId.has(item.id)
      };
    });
    const collectionProgress = Object.values(
      normalizedItems.reduce<Record<string, { collectionName: string; ownedCount: number; totalCount: number }>>(
        (acc, item) => {
          const key = item.collectionName;
          const current = acc[key] || { collectionName: key, ownedCount: 0, totalCount: 0 };
          current.totalCount += 1;
          if (item.owned) current.ownedCount += 1;
          acc[key] = current;
          return acc;
        },
        {}
      )
    )
      .map((collection) => ({
        ...collection,
        progressPercent: Math.round((collection.ownedCount / collection.totalCount) * 100)
      }))
      .sort((a, b) => {
        if (b.progressPercent !== a.progressPercent) return b.progressPercent - a.progressPercent;
        return a.totalCount - b.totalCount;
      });

    return NextResponse.json({
      ok: true,
      closet: {
        totalPoints,
        spentPoints,
        availablePoints: totalPoints - spentPoints,
        collectionProgress,
        items: normalizedItems,
        equipped: (equippedRows || []).map((row) => {
          const category = Array.isArray(row.avatar_item_categories)
            ? row.avatar_item_categories[0]
            : row.avatar_item_categories;
          const item = Array.isArray(row.avatar_items) ? row.avatar_items[0] : row.avatar_items;

          return {
            slot: category?.code || "unknown",
            slotName: category?.name || "Unknown",
            itemCode: item?.code || "",
            itemName: item?.name || ""
          };
        })
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "avatar_closet_failed";
    if (
      message.includes("avatar_") ||
      message.includes("point_ledger") ||
      message.includes("relation") ||
      message.includes("does not exist")
    ) {
      return NextResponse.json({ ok: false, error: "avatar_schema_missing" }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
