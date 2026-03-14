import { hasPublicSupabaseEnv } from "./env";
import { getSupabaseServerClient } from "./supabase/server";

type AccessSnapshot = {
  foundUser: boolean;
  trialActive: boolean;
  activePlanCodes: string[];
  unlockedSubjectCodes: string[];
};

function emptySnapshot(): AccessSnapshot {
  return {
    foundUser: false,
    trialActive: false,
    activePlanCodes: [],
    unlockedSubjectCodes: []
  };
}

export async function resolveAccessSnapshot({
  authUserId,
  email
}: {
  authUserId?: string;
  email?: string;
}) {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return emptySnapshot();
  }

  if (!authUserId && !email) {
    return emptySnapshot();
  }

  try {
    const supabase = getSupabaseServerClient();
    let query = supabase.from("users").select("id").limit(1);

    if (authUserId) {
      query = query.eq("auth_user_id", authUserId);
    } else if (email) {
      query = query.eq("email", email);
    }

    const { data: userRows } = await query;
    const user = userRows?.[0];

    if (!user) {
      return emptySnapshot();
    }

    const now = new Date().toISOString();

    const [{ data: trials }, { data: entitlements }] = await Promise.all([
      supabase
        .from("trial_windows")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .lte("starts_at", now)
        .gte("ends_at", now),
      supabase
        .from("entitlements")
        .select("plans(code, metadata), subjects(code)")
        .eq("user_id", user.id)
        .eq("is_active", true)
    ]);

    const activePlanCodes = new Set<string>();
    const unlockedSubjectCodes = new Set<string>();
    const trialActive = Boolean(trials?.length);

    if (trialActive) {
      activePlanCodes.add("trial_full_access");
      ["english", "bahasa_melayu", "sejarah", "geografi", "math", "add_math"].forEach((code) =>
        unlockedSubjectCodes.add(code)
      );
    }

    for (const entitlement of entitlements || []) {
      const plan = Array.isArray(entitlement.plans) ? entitlement.plans[0] : entitlement.plans;
      const subject = Array.isArray(entitlement.subjects) ? entitlement.subjects[0] : entitlement.subjects;

      if (plan?.code) {
        activePlanCodes.add(plan.code);
      }

      if (subject?.code) {
        unlockedSubjectCodes.add(subject.code);
      }

      if (Array.isArray(plan?.metadata?.subject_codes)) {
        for (const code of plan.metadata.subject_codes) {
          unlockedSubjectCodes.add(String(code));
        }
      }

      if (plan?.code === "all_access") {
        ["english", "bahasa_melayu", "sejarah", "geografi", "math", "add_math"].forEach((code) =>
          unlockedSubjectCodes.add(code)
        );
      }
    }

    return {
      foundUser: true,
      trialActive,
      activePlanCodes: Array.from(activePlanCodes),
      unlockedSubjectCodes: Array.from(unlockedSubjectCodes)
    };
  } catch {
    return emptySnapshot();
  }
}
