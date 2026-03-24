import { NextResponse } from "next/server";
import { hasPublicSupabaseEnv } from "../../../lib/env";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "supabase_env_missing" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const authUserId = String(body?.authUserId || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const focusSubjectCode = String(body?.focusSubjectCode || "").trim();
  const missionPreference = String(body?.missionPreference || "").trim();

  if ((!authUserId && !email) || !focusSubjectCode || !missionPreference) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    let userQuery = supabase
      .from("users")
      .select("id, profiles(id, preferences)")
      .limit(1);

    if (authUserId) {
      userQuery = userQuery.eq("auth_user_id", authUserId);
    } else {
      userQuery = userQuery.eq("email", email);
    }

    const { data: users, error: userError } = await userQuery;
    if (userError) throw userError;

    const user = users?.[0];
    if (!user) {
      return NextResponse.json({ ok: false, error: "user_not_found" }, { status: 404 });
    }

    const profile = Array.isArray(user.profiles) ? user.profiles[0] : user.profiles;
    if (!profile?.id) {
      return NextResponse.json({ ok: false, error: "profile_not_found" }, { status: 404 });
    }

    const existingPreferences =
      profile.preferences && typeof profile.preferences === "object" && !Array.isArray(profile.preferences)
        ? profile.preferences
        : {};

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        preferences: {
          ...existingPreferences,
          focus_subject_code: focusSubjectCode,
          mission_preference: missionPreference
        },
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "onboarding_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
