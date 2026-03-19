import { NextResponse } from "next/server";
import {
  buildAchievements,
  computeStreak,
  formatDateOnly,
  getMonday
} from "../../../../lib/achievements";
import { resolveAccessSnapshot } from "../../../../lib/access";
import { getWeeklyDropBonusForMission } from "../../../../lib/avatar-catalog";
import { syncAchievementAvatarUnlocks } from "../../../../lib/avatar";
import { hasPublicSupabaseEnv } from "../../../../lib/env";
import { getStarPointsForStars } from "../../../../lib/rewards";
import { getModuleBySlugs } from "../../../../lib/subjects";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "supabase_env_missing" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const authUserId = String(body?.authUserId || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const subjectSlug = String(body?.subjectSlug || "").trim();
  const moduleSlug = String(body?.moduleSlug || "").trim();
  const eventType = String(body?.eventType || "started").trim();
  const accuracyPercent = Number(body?.accuracyPercent ?? 0);
  const score = Number(body?.score ?? 0);
  const requestedStars = Number(body?.stars ?? 0);
  const elapsedMs = Number(body?.elapsedMs ?? 0);
  const metadata =
    body?.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? body.metadata
      : {};

  if ((!authUserId && !email) || !subjectSlug || !moduleSlug) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const match = getModuleBySlugs(subjectSlug, moduleSlug);
  if (!match) {
    return NextResponse.json({ ok: false, error: "module_not_found" }, { status: 404 });
  }

  try {
    const supabase = getSupabaseServerClient();
    let userQuery = supabase.from("users").select("id, email").limit(1);

    if (authUserId) {
      userQuery = userQuery.eq("auth_user_id", authUserId);
    } else {
      userQuery = userQuery.eq("email", email);
    }

    const { data: userRows, error: userError } = await userQuery;
    if (userError) throw userError;

    const user = userRows?.[0];
    if (!user) {
      return NextResponse.json({ ok: false, error: "user_not_found" }, { status: 404 });
    }

    const { data: subjectRows, error: subjectError } = await supabase
      .from("subjects")
      .select("id")
      .eq("code", match.subject.code)
      .limit(1);

    if (subjectError) throw subjectError;

    const subjectId = subjectRows?.[0]?.id;
    if (!subjectId) {
      return NextResponse.json({ ok: false, error: "subject_not_seeded" }, { status: 404 });
    }

    const { data: moduleRows } = await supabase
      .from("modules")
      .select("id")
      .eq("code", `${match.subject.code}:${moduleSlug}`)
      .limit(1);

    const moduleId = moduleRows?.[0]?.id || null;
    const nowIso = new Date().toISOString();
    const snapshotDate = nowIso.slice(0, 10);
    const status = eventType === "completed" ? "completed" : "in_progress";
    const normalizedAccuracy = Number.isFinite(accuracyPercent)
      ? Math.max(0, Math.min(100, accuracyPercent))
      : 0;
    const normalizedScore = Number.isFinite(score) ? Math.max(0, score) : 0;
    const stars =
      eventType === "completed"
        ? Math.max(1, Math.min(3, Number.isFinite(requestedStars) ? requestedStars : 1))
        : 0;
    const baseStarPoints = eventType === "completed" ? getStarPointsForStars(stars) : 0;
    const weeklyDropBonus =
      eventType === "completed"
        ? getWeeklyDropBonusForMission({
            subjectSlug,
            moduleSlug
          })
        : null;
    const bonusPoints = weeklyDropBonus?.bonusPoints || 0;
    const earnedPoints = baseStarPoints + bonusPoints;

    const { data: attemptRows, error: attemptError } = await supabase
      .from("attempts")
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        module_id: moduleId,
        status,
        score: eventType === "completed" ? normalizedScore : null,
        accuracy_percent: eventType === "completed" ? normalizedAccuracy : null,
        stars,
        elapsed_ms: Number.isFinite(elapsedMs) && elapsedMs > 0 ? elapsedMs : null,
        started_at: nowIso,
        completed_at: eventType === "completed" ? nowIso : null,
        summary: {
          subject_code: match.subject.code,
          subject_slug: subjectSlug,
          subject_name: match.subject.name,
          module_slug: moduleSlug,
          module_name: match.module.name,
          event_type: eventType,
          ...metadata
        }
      })
      .select("id")
      .limit(1);

    if (attemptError) throw attemptError;
    const attemptId = attemptRows?.[0]?.id || null;

    const { data: snapshotRows, error: snapshotLookupError } = await supabase
      .from("progress_snapshots")
      .select("id, metrics")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .eq("snapshot_type", "daily_rollup")
      .eq("snapshot_date", snapshotDate)
      .order("created_at", { ascending: false })
      .limit(1);

    if (snapshotLookupError) throw snapshotLookupError;

    const previousMetrics = snapshotRows?.[0]?.metrics || {};
    const nextMetrics = {
      ...previousMetrics,
      last_module_slug: moduleSlug,
      last_module_name: match.module.name,
      last_event_type: eventType,
      touched_at: nowIso,
      last_accuracy_percent: eventType === "completed" ? normalizedAccuracy : previousMetrics.last_accuracy_percent,
      last_score: eventType === "completed" ? normalizedScore : previousMetrics.last_score,
      stars_today: Number(previousMetrics.stars_today || 0) + stars,
      points_today: Number(previousMetrics.points_today || 0) + earnedPoints,
      completed_today:
        Number(previousMetrics.completed_today || 0) + (eventType === "completed" ? 1 : 0),
      started_today:
        Number(previousMetrics.started_today || 0) + (eventType === "started" ? 1 : 0)
    };

    if (snapshotRows?.[0]?.id) {
      const { error: snapshotUpdateError } = await supabase
        .from("progress_snapshots")
        .update({
          metrics: nextMetrics
        })
        .eq("id", snapshotRows[0].id);

      if (snapshotUpdateError) throw snapshotUpdateError;
    } else {
      const { error: snapshotInsertError } = await supabase.from("progress_snapshots").insert({
        user_id: user.id,
        subject_id: subjectId,
        snapshot_type: "daily_rollup",
        snapshot_date: snapshotDate,
        metrics: nextMetrics
      });

      if (snapshotInsertError) throw snapshotInsertError;
    }

    if (earnedPoints > 0) {
      const { error: pointLedgerError } = await supabase.from("point_ledger").insert({
        user_id: user.id,
        source_type: "attempt_completion",
        source_id: attemptId,
        delta_points: earnedPoints,
        metadata: {
          subject_code: match.subject.code,
          subject_slug: subjectSlug,
          subject_name: match.subject.name,
          module_slug: moduleSlug,
          module_name: match.module.name,
          stars,
          accuracy_percent: normalizedAccuracy,
          base_star_points: baseStarPoints,
          bonus_points: bonusPoints,
          weekly_drop_headline: weeklyDropBonus?.headline || null,
          weekly_drop_item_name: weeklyDropBonus?.itemName || null
        }
      });

      if (pointLedgerError) {
        const pointLedgerMessage = pointLedgerError.message || "";
        if (!pointLedgerMessage.includes("point_ledger")) {
          throw pointLedgerError;
        }
      }
    }

    let totalPoints: number | null = null;
    let unlockedAvatarItems: { code: string; name: string; badgeCode: string | null }[] = [];
    if (earnedPoints > 0) {
      const { data: pointRows, error: pointRowsError } = await supabase
        .from("point_ledger")
        .select("delta_points")
        .eq("user_id", user.id);

      if (!pointRowsError) {
        totalPoints = (pointRows || []).reduce((sum, row) => sum + Number(row.delta_points || 0), 0);
      }
    }

    if (eventType === "completed") {
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

      const achievements = buildAchievements({
        completedCount,
        totalStars,
        streakDays,
        weeklyCompletedCount,
        averageAccuracy,
        unlockedCount: access.unlockedSubjectCodes.length || 2
      });

      const unlockedBadgeCodes = achievements.filter((achievement) => achievement.unlocked).map((achievement) => achievement.code);
      try {
        unlockedAvatarItems = await syncAchievementAvatarUnlocks({
          userId: user.id,
          unlockedBadgeCodes
        });
      } catch (avatarUnlockError) {
        const avatarUnlockMessage =
          avatarUnlockError instanceof Error ? avatarUnlockError.message : "avatar_unlock_failed";
        if (!avatarUnlockMessage.includes("avatar_")) {
          throw avatarUnlockError;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      status,
      subjectName: match.subject.name,
      moduleName: match.module.name,
      stars,
      baseStarPoints,
      bonusPoints,
      weeklyDropHeadline: weeklyDropBonus?.headline || null,
      weeklyDropItemName: weeklyDropBonus?.itemName || null,
      starPoints: earnedPoints,
      totalPoints,
      unlockedAvatarItems,
      accuracyPercent: normalizedAccuracy
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "progress_log_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
