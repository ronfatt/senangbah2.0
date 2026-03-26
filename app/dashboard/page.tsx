import { DashboardOverview } from "../../components/dashboard-overview";
import { getServerLocale } from "../../lib/server-locale";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ billing?: string; focus?: string; plan?: string; welcome?: string }>;
}) {
  const locale = await getServerLocale();
  const params = await searchParams;
  const focusLabel = params.focus ? params.focus.replaceAll("_", " ") : "";

  return (
    <main className="page-shell dashboard-shell">
      <section className="section-heading dashboard-page-heading">
        <p className="eyebrow">{locale === "ms" ? "Dashboard anda" : "Your dashboard"}</p>
        <h1 className="dashboard-title">{locale === "ms" ? "Dashboard" : "Dashboard"}</h1>
        <p className="dashboard-helper dashboard-page-helper">
          {params.welcome === "done"
            ? locale === "ms"
              ? `Fokus belajar pertama anda sudah disimpan${focusLabel ? ` untuk ${focusLabel}` : ""}. Mulakan satu misi, kemudian buka laporan anda untuk lihat apa yang bertambah baik dahulu.`
              : `Your first study focus is saved${focusLabel ? ` for ${focusLabel}` : ""}. Start one mission, then open your report to see what improves first.`
            : locale === "ms"
              ? "Pastikan mudah: mula satu misi, semak kemajuan anda, kemudian tentukan subjek seterusnya."
              : "Keep this simple: start one mission, check your progress, and then decide the next subject."}
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/progress">
            {locale === "ms" ? "Buka Laporan Kemajuan" : "Open Progress Report"}
          </a>
          <a className="btn btn-secondary" href="/my-subjects">
            {locale === "ms" ? "Buka Subjek Saya" : "Open My Subjects"}
          </a>
        </div>
      </section>

      <DashboardOverview billingPlan={params.plan || null} billingStatus={params.billing || null} locale={locale} />
    </main>
  );
}
