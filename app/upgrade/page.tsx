import { getPlanCatalog } from "../../lib/catalog";
import { UpgradeIntentPanel } from "../../components/upgrade-intent-panel";

export default async function UpgradePage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const plans = await getPlanCatalog();
  const params = await searchParams;
  const selectedPlanCode = params.plan || "all_access";
  const selectedPlan = plans.find((plan) => plan.code === selectedPlanCode) || plans.find((plan) => plan.code === "all_access") || plans[0];

  return (
    <main className="page-shell">
      <section className="subject-hero">
        <div className="subject-hero-copy">
          <p className="eyebrow">Upgrade flow</p>
          <h1 className="dashboard-title">Prepare a clean path into {selectedPlan?.name}.</h1>
          <p className="hero-text">
            This is the first checkout placeholder for SenangBah 2.0. The product path is now clear: dashboard and pricing can both send a student into one specific bundle instead of stopping at explanation only.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start with 7-day trial
            </a>
            <a className="btn btn-secondary" href="/pricing">
              Compare all plans
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <p className="panel-label">Selected plan</p>
          <h2>{selectedPlan?.name || "Plan"}</h2>
          <p className="hero-text">{selectedPlan?.priceLabel || "RM0"}</p>
          <p className="hero-text">{selectedPlan?.detail || "Plan details will show here."}</p>
        </div>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">What this page should do next</p>
          <h2>Checkout-ready product handoff</h2>
          <ul className="feature-list">
            <li>Show the chosen bundle clearly</li>
            <li>Confirm included subjects and modules</li>
            <li>Hand the student into a real payment step</li>
          </ul>
        </article>

        <UpgradeIntentPanel
          planCode={selectedPlan?.code || "all_access"}
          planName={selectedPlan?.name || "All Access"}
          priceLabel={selectedPlan?.priceLabel || "RM0"}
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
                    {plan.code === selectedPlan?.code ? "Selected" : "Switch"}
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
