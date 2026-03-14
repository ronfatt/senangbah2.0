import { NextResponse } from "next/server";
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
    const earnedPoints = eventType === "completed" ? getStarPointsForStars(stars) : 0;

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
          accuracy_percent: normalizedAccuracy
        }
      });

      if (pointLedgerError) {
        const pointLedgerMessage = pointLedgerError.message || "";
        if (!pointLedgerMessage.includes("point_ledger")) {
          throw pointLedgerError;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      status,
      subjectName: match.subject.name,
      moduleName: match.module.name,
      stars,
      starPoints: earnedPoints,
      accuracyPercent: normalizedAccuracy
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "progress_log_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
