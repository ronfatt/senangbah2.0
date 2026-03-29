export function hasPublicSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isFullAccessTestingEnabled() {
  return process.env.FULL_ACCESS_TESTING === "true";
}
