import { hasPublicSupabaseEnv } from "./env";
import { planDefinitions } from "./plans";
import { subjectDefinitions } from "./subjects";
import { getSupabaseServerClient } from "./supabase/server";

export async function getSubjectCatalog() {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return subjectDefinitions.map((subject) => ({
      code: subject.code,
      name: subject.name,
      description: subject.summary,
      is_premium: !subject.isCore
    }));
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("subjects")
      .select("code, name, description, is_premium")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return subjectDefinitions.map((subject) => ({
        code: subject.code,
        name: subject.name,
        description: subject.summary,
        is_premium: !subject.isCore
      }));
    }

    return data;
  } catch {
    return subjectDefinitions.map((subject) => ({
      code: subject.code,
      name: subject.name,
      description: subject.summary,
      is_premium: !subject.isCore
    }));
  }
}

export async function getPlanCatalog() {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return planDefinitions;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("plans")
      .select("code, name, price_cents, metadata")
      .eq("is_active", true);

    if (error || !data?.length) {
      return planDefinitions;
    }

    return data.map((plan) => ({
      code: plan.code,
      name: plan.name,
      priceLabel: plan.price_cents ? `RM${Math.round(plan.price_cents / 100)}` : "RM0",
      detail: String(plan.metadata?.description || ""),
      points: Array.isArray(plan.metadata?.subject_codes)
        ? (plan.metadata.subject_codes as string[]).map((code) => `Includes ${String(code).replaceAll("_", " ")}`)
        : planDefinitions.find((item) => item.code === plan.code)?.points || []
    }));
  } catch {
    return planDefinitions;
  }
}
