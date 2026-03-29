import { ProgressReportClient } from "../../components/progress-report-client";
import { getServerLocale } from "../../lib/server-locale";

export default async function ProgressPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell dashboard-shell dashboard-shell-v3">
      <ProgressReportClient locale={locale} />
    </main>
  );
}
