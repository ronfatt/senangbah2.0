import { ProgressReportClient } from "../../components/progress-report-client";
import { getServerLocale } from "../../lib/server-locale";

export default async function ProgressPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">{locale === "ms" ? "Laporan kemajuan" : "Progress report"}</p>
        <h1 className="dashboard-title">
          {locale === "ms"
            ? "Lihat apa yang bertambah baik, apa yang masih perlu dibaiki, dan apa yang perlu dibuat seterusnya."
            : "See what improved, what needs work, and what to do next."}
        </h1>
      </section>

      <ProgressReportClient locale={locale} />
    </main>
  );
}
