import { DashboardOverview } from "../../components/dashboard-overview";
import { getServerLocale } from "../../lib/server-locale";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ billing?: string; focus?: string; plan?: string; welcome?: string }>;
}) {
  const locale = await getServerLocale();
  const params = await searchParams;

  return (
    <main className="page-shell dashboard-shell dashboard-shell-v3">
      <DashboardOverview billingPlan={params.plan || null} billingStatus={params.billing || null} locale={locale} />
    </main>
  );
}
