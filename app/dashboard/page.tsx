import { DashboardOverview } from "../../components/dashboard-overview";

import { subjectDefinitions } from "../../lib/subjects";

const modules = [
  { subject: "English", slug: "english", module: "Writing Coach", status: "Ready" },
  { subject: "English", slug: "english", module: "Grammar Lab", status: "Ready" },
  { subject: "English", slug: "english", module: "Reading Decoder", status: "Ready" },
  { subject: "English", slug: "english", module: "Vocabulary Builder", status: "Ready" },
  { subject: "Bahasa Melayu", slug: "bahasa-melayu", module: "Tatabahasa", status: "Ready next" },
  { subject: "Bahasa Melayu", slug: "bahasa-melayu", module: "Karangan Coach", status: "Ready next" },
  { subject: "Sejarah", slug: "sejarah", module: "Timeline Recall", status: "Premium next" },
  { subject: "Geografi", slug: "geografi", module: "Map and Data Drill", status: "Premium next" },
  { subject: "Math", slug: "math", module: "Topic Practice", status: "Premium next" },
  { subject: "Add Math", slug: "add-math", module: "Step Check Drill", status: "Premium next" }
];

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ billing?: string; plan?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="page-shell dashboard-shell">
      <section className="section-heading">
        <p className="eyebrow">Dashboard Prototype</p>
        <h1 className="dashboard-title">A calmer command center for daily progress.</h1>
      </section>

      <DashboardOverview billingPlan={params.plan || null} billingStatus={params.billing || null} />

      <section className="dashboard-subject-strip">
        {subjectDefinitions.map((subject) => (
          <a className="subject-chip" href={`/subjects/${subject.slug}`} key={subject.code}>
            <span>{subject.name}</span>
            <strong>{subject.launchState}</strong>
          </a>
        ))}
      </section>

      <section className="dashboard-table-wrap">
        <div className="table-head">
          <div>
            <p className="eyebrow">Modules</p>
            <h2>Initial rollout map</h2>
          </div>
          <div className="table-actions">
            <a className="btn btn-secondary" href="/avatar">Open avatar closet</a>
            <a className="btn btn-secondary" href="/subjects">Browse subjects</a>
            <a className="btn btn-secondary" href="/pricing">View access tiers</a>
          </div>
        </div>

        <div className="module-table">
          {modules.map((item) => (
            <div className="module-row" key={`${item.subject}-${item.module}`}>
              <a className="module-subject-link" href={`/subjects/${item.slug}`}>
                {item.subject}
              </a>
              <strong>{item.module}</strong>
              <span className="status-pill">{item.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
