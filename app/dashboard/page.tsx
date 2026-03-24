import { DashboardOverview } from "../../components/dashboard-overview";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ billing?: string; focus?: string; plan?: string; welcome?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="page-shell dashboard-shell">
      <section className="section-heading dashboard-page-heading">
        <p className="eyebrow">Your dashboard</p>
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-helper dashboard-page-helper">
          {params.welcome === "done"
            ? `Your first study focus is saved${params.focus ? ` for ${params.focus.replaceAll("_", " ")}` : ""}. Start one mission, then open your report to see what improves first.`
            : "Keep this simple: start one mission, check your progress, and then decide the next subject."}
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/progress">
            Open Progress Report
          </a>
          <a className="btn btn-secondary" href="/subjects">
            Browse Subjects
          </a>
        </div>
      </section>

      <DashboardOverview billingPlan={params.plan || null} billingStatus={params.billing || null} />
    </main>
  );
}
