import { MySubjectsClient } from "../../components/my-subjects-client";
import { getServerLocale } from "../../lib/server-locale";

export default async function MySubjectsPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell dashboard-shell dashboard-shell-v3">
      <MySubjectsClient locale={locale} />
    </main>
  );
}
