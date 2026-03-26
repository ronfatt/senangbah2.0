import { MySubjectsClient } from "../../components/my-subjects-client";
import { getServerLocale } from "../../lib/server-locale";

export default async function MySubjectsPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell dashboard-shell">
      <section className="section-heading dashboard-page-heading">
        <p className="eyebrow">{locale === "ms" ? "Subjek saya" : "My subjects"}</p>
        <h1 className="dashboard-title">{locale === "ms" ? "Subjek Saya" : "My Subjects"}</h1>
        <p className="dashboard-helper dashboard-page-helper">
          {locale === "ms"
            ? "Halaman ini untuk pelajar yang sudah log masuk. Buka satu subjek, mula satu misi, kemudian kembali ke laporan anda."
            : "This page is for logged-in students. Open a subject, start one mission, and then come back to your report."}
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/dashboard">
            {locale === "ms" ? "Kembali ke Dashboard" : "Back to Dashboard"}
          </a>
          <a className="btn btn-secondary" href="/progress">
            {locale === "ms" ? "Buka Laporan Kemajuan" : "Open Progress Report"}
          </a>
        </div>
      </section>

      <MySubjectsClient locale={locale} />
    </main>
  );
}
