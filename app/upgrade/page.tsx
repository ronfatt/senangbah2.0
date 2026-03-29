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
    <main className="page-shell dashboard-shell dashboard-shell-v3 upgrade-v3-shell">
      <section className="dashboard-v3-hero dashboard-v3-page-hero">
        <p className="dashboard-v3-welcome">{isMalay ? "Keahlian" : "Membership"}</p>
        <h1>{isMalay ? "Pilih laluan naik taraf anda." : "Pick your upgrade path."}</h1>
        <p className="dashboard-v3-hero-copy">
          {isMalay
            ? `Pelan semasa dipilih: ${selectedPlan?.name}. Kekalkan bimbingan AI aktif, buka lebih banyak subjek, dan teruskan dengan misi yang lebih jelas.`
            : `Current selected plan: ${selectedPlan?.name}. Keep your AI guidance active, unlock more subjects, and continue with clearer missions.`}
        </p>
        <div className="dashboard-v3-hero-actions">
          <a className="btn btn-primary" href="/register">
            {isMalay ? "Daftar dan Mula Percubaan" : "Register and Start Trial"}
          </a>
          <a className="btn btn-secondary" href="/login">
            {isMalay ? "Log Masuk untuk Terus Belajar" : "Login to Continue Learning"}
          </a>
        </div>
      </section>

      <section className="dashboard-v3-summary-grid upgrade-v3-top-grid">
        <article className="dashboard-v3-summary-card tone-blue">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{isMalay ? "Pelan dipilih" : "Selected plan"}</p></div>
            <span className="dashboard-v3-icon-box tone-plan">RM</span>
          </div>
          <p className="dashboard-v3-summary-title">{selectedPlan?.name || (isMalay ? "Pelan" : "Plan")}</p>
          <h2>{selectedPlan?.priceLabel || "RM0"}</h2>
          <p className="dashboard-helper">{selectedPlan?.detail || (isMalay ? "Butiran pelan akan dipaparkan di sini." : "Plan details will show here.")}</p>
        </article>

        <article className="dashboard-v3-summary-card tone-pink">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{isMalay ? "Apa yang anda dapat" : "What you get"}</p></div>
            <span className="dashboard-v3-icon-box tone-achievements">AI</span>
          </div>
          <p className="dashboard-v3-summary-title">
            {isMalay ? "Pastikan aliran belajar anda terus bergerak" : "Keep your study flow moving"}
          </p>
          <ul className="feature-list">
            <li>{isMalay ? "Akses yang jelas kepada subjek dalam pakej ini" : "Clear access to the subjects in this bundle"}</li>
            <li>{isMalay ? "Misi AI harian dan panduan langkah seterusnya yang lebih kuat" : "Daily AI missions and stronger next-step guidance"}</li>
            <li>{isMalay ? "Kemajuan, streak, mata, dan ganjaran avatar di satu tempat" : "Progress, streaks, points, and avatar rewards in one place"}</li>
          </ul>
        </article>
      </section>

      <section className="dashboard-v3-summary-grid upgrade-v3-top-grid">
        <UpgradeIntentPanel
          planCode={selectedPlan?.code || "all_access"}
          planName={selectedPlan?.name || "All Access"}
          priceLabel={selectedPlan?.priceLabel || "RM0"}
          locale={locale}
        />
        <article className="dashboard-v3-summary-card tone-blue upgrade-v3-switch-card">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{isMalay ? "Tukar pelan" : "Switch plan"}</p></div>
            <span className="dashboard-v3-icon-box tone-blue">↔</span>
          </div>
          <p className="dashboard-v3-summary-title">
            {isMalay ? "Bandingkan pakej lain jika matlamat belajar anda berubah." : "Compare other bundles if your study goal changes."}
          </p>
          <div className="upgrade-v3-switch-list">
            {plans
              .filter((plan) => !["free", "trial_full_access"].includes(plan.code))
              .map((plan) => (
                <a className={`bundle-card upgrade-v3-switch-item${plan.code === selectedPlan?.code ? " is-selected" : ""}`} href={`/upgrade?plan=${plan.code}`} key={plan.code}>
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
        </article>
      </section>
    </main>
  );
}
