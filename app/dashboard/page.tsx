import { DashboardOverview } from "../../components/dashboard-overview";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ billing?: string; plan?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="page-shell dashboard-shell">
      <section className="section-heading">
        <p className="eyebrow">Your dashboard</p>
        <h1 className="dashboard-title">See today&apos;s mission, your progress, and your next step.</h1>
      </section>

      <DashboardOverview billingPlan={params.plan || null} billingStatus={params.billing || null} />
    </main>
  );
}
