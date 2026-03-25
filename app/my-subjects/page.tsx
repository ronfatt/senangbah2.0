import { MySubjectsClient } from "../../components/my-subjects-client";

export default function MySubjectsPage() {
  return (
    <main className="page-shell dashboard-shell">
      <section className="section-heading dashboard-page-heading">
        <p className="eyebrow">My subjects</p>
        <h1 className="dashboard-title">My Subjects</h1>
        <p className="dashboard-helper dashboard-page-helper">
          This page is for logged-in students. Open a subject, start one mission, and then come back to your report.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/dashboard">
            Back to Dashboard
          </a>
          <a className="btn btn-secondary" href="/progress">
            Open Progress Report
          </a>
        </div>
      </section>

      <MySubjectsClient />
    </main>
  );
}
