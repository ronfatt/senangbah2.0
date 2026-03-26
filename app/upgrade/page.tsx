import { getPlanCatalog } from "../../lib/catalog";
import { UpgradeIntentPanel } from "../../components/upgrade-intent-panel";
import { getServerLocale } from "../../lib/server-locale";

export default async function UpgradePage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";
  const plans = await getPlanCatalog();
  const params = await searchParams;
  const selectedPlanCode = params.plan || "all_access";
  const selectedPlan = plans.find((plan) => plan.code === selectedPlanCode) || plans.find((plan) => plan.code === "all_access") || plans[0];

  return (
    <main className="page-shell">
      <section className="subject-hero">
        <div className="subject-hero-copy">
          <p className="eyebrow">{isMalay ? "Keahlian" : "Membership"}</p>
          <h1 className="dashboard-title">
            {isMalay ? `Pilih pelan pembelajaran seterusnya untuk ${selectedPlan?.name}.` : `Choose the next study plan for ${selectedPlan?.name}.`}
          </h1>
          <p className="hero-text">
            {isMalay
              ? "Pilih pakej subjek yang sepadan dengan matlamat belajar anda, kekalkan bimbingan AI aktif, dan teruskan dengan misi yang lebih jelas serta penjejakan kemajuan yang lebih kuat."
              : "Pick the subject bundle that fits your study goals, keep your AI guidance active, and move forward with clearer missions and stronger progress tracking."}
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              {isMalay ? "Daftar dan Mula Percubaan" : "Register and Start Trial"}
            </a>
            <a className="btn btn-secondary" href="/login">
              {isMalay ? "Log Masuk untuk Terus Belajar" : "Login to Continue Learning"}
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <p className="panel-label">{isMalay ? "Keahlian dipilih" : "Selected membership"}</p>
          <h2>{selectedPlan?.name || (isMalay ? "Pelan" : "Plan")}</h2>
          <p className="hero-text">{selectedPlan?.priceLabel || "RM0"}</p>
          <p className="hero-text">{selectedPlan?.detail || (isMalay ? "Butiran pelan akan dipaparkan di sini." : "Plan details will show here.")}</p>
        </div>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">{isMalay ? "Apa yang anda dapat" : "What you get"}</p>
          <h2>{isMalay ? "Pastikan aliran belajar anda terus bergerak" : "Keep your study flow moving"}</h2>
          <ul className="feature-list">
            <li>{isMalay ? "Akses yang jelas kepada subjek dalam pakej ini" : "Clear access to the subjects in this bundle"}</li>
            <li>{isMalay ? "Misi AI harian dan panduan langkah seterusnya yang lebih kuat" : "Daily AI missions and stronger next-step guidance"}</li>
            <li>{isMalay ? "Kemajuan, streak, mata, dan ganjaran avatar di satu tempat" : "Progress, streaks, points, and avatar rewards in one place"}</li>
          </ul>
        </article>

        <UpgradeIntentPanel
          planCode={selectedPlan?.code || "all_access"}
          planName={selectedPlan?.name || "All Access"}
          priceLabel={selectedPlan?.priceLabel || "RM0"}
          locale={locale}
        />
      </section>

      <section className="section">
        <div className="bundle-grid">
          {plans
            .filter((plan) => !["free", "trial_full_access"].includes(plan.code))
            .map((plan) => (
              <a className="bundle-card" href={`/upgrade?plan=${plan.code}`} key={plan.code}>
                <div className="module-card-head">
                  <div>
                    <p className="dashboard-label">{plan.priceLabel}</p>
                    <h3>{plan.name}</h3>
                  </div>
                  <span className={`module-state ${plan.code === selectedPlan?.code ? "state-ready" : "state-coming_soon"}`}>
                    {plan.code === selectedPlan?.code
                      ? isMalay
                        ? "Dipilih"
                        : "Selected"
                      : isMalay
                        ? "Tukar"
                        : "Switch"}
                  </span>
                </div>
                <p className="dashboard-helper">{plan.detail}</p>
              </a>
            ))}
        </div>
      </section>
    </main>
  );
}
