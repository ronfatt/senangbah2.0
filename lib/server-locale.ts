import { cookies } from "next/headers";
import { normalizeLocale } from "./locale";

export async function getServerLocale() {
  const store = await cookies();
  return normalizeLocale(store.get("sb-locale")?.value);
}
