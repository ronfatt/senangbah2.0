import { ProgressReportClient } from "../../components/progress-report-client";

export default function ProgressPage() {
  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">Progress report</p>
        <h1 className="dashboard-title">See what improved, what needs work, and what to do next.</h1>
      </section>

      <ProgressReportClient />
    </main>
  );
}
