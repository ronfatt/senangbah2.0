import { NextResponse } from "next/server";
import { ensureAvatarBootstrapForUser } from "../../../../lib/avatar";
import { hasPublicSupabaseEnv } from "../../../../lib/env";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";

const FULL_SUBJECT_CODES = ["english", "bahasa_melayu", "sejarah", "geografi", "math", "add_math"];

export async function POST(request: Request) {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "supabase_env_missing" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const authUserId = String(body?.authUserId || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const fullName = String(body?.fullName || "").trim();

  if (!authUserId || !email) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data: existingUsers } = await supabase
      .from("users")
      .select("id")
      .or(`auth_user_id.eq.${authUserId},email.eq.${email}`)
      .limit(1);

    let userId = existingUsers?.[0]?.id || null;

    if (!userId) {
      const { data: createdUsers, error: createUserError } = await supabase
        .from("users")
        .insert({
          auth_user_id: authUserId,
          email,
          role: "student",
          status: "active"
        })
        .select("id")
        .limit(1);

      if (createUserError) throw createUserError;
      userId = createdUsers?.[0]?.id || null;
    } else {
      const { error: syncUserError } = await supabase
        .from("users")
        .update({
          auth_user_id: authUserId,
          email,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);

      if (syncUserError) throw syncUserError;
    }

    if (!userId) {
      throw new Error("user_bootstrap_failed");
    }

    const { data: existingProfiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    if (!existingProfiles?.length) {
      const displayName = fullName || email.split("@")[0] || "Student";
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: userId,
        display_name: displayName,
        full_name: fullName || null
      });

      if (profileError) throw profileError;
    }

    const { data: existingTrials } = await supabase
      .from("trial_windows")
      .select("id, status")
      .eq("user_id", userId)
      .limit(1);

    if (!existingTrials?.length) {
      const startsAt = new Date();
      const endsAt = new Date(startsAt.getTime() + 7 * 24 * 60 * 60 * 1000);

      const { error: trialError } = await supabase.from("trial_windows").insert({
        user_id: userId,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: "active"
      });

      if (trialError) throw trialError;
    }

    const { data: existingTrialEntitlements } = await supabase
      .from("entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("source", "trial_bootstrap")
      .limit(1);

    if (!existingTrialEntitlements?.length) {
      const { data: plans } = await supabase
        .from("plans")
        .select("id, code")
        .eq("code", "trial_full_access")
        .limit(1);

      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, code")
        .in("code", FULL_SUBJECT_CODES);

      const planId = plans?.[0]?.id;

      if (planId && subjects?.length) {
        const startsAt = new Date();
        const endsAt = new Date(startsAt.getTime() + 7 * 24 * 60 * 60 * 1000);

        const rows = subjects.map((subject) => ({
          user_id: userId,
          plan_id: planId,
          subject_id: subject.id,
          entitlement_type: "subject_access",
          source: "trial_bootstrap",
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          is_active: true,
          metadata: { subject_code: subject.code, trial: true }
        }));

        const { error: entitlementError } = await supabase.from("entitlements").insert(rows);
        if (entitlementError) throw entitlementError;
      }
    }

    try {
      await ensureAvatarBootstrapForUser(userId);
    } catch {
      // Avatar tables may not be migrated yet. Keep auth bootstrap non-blocking.
    }

    return NextResponse.json({ ok: true, userId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bootstrap_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
