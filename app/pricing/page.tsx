import { getPlanCatalog } from "../../lib/catalog";

export default async function PricingPage() {
  const plans = await getPlanCatalog();

  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">Choose your study path</p>
        <h1 className="dashboard-title">Start with 7 days free, then unlock the subjects you need most.</h1>
        <p className="landing-lead">
          SenangBah is a multi-subject AI learning platform. Start with full access first, then continue with the bundle that matches the subjects you want to improve.
        </p>
      </section>

      <section className="pricing-grid">
        {plans.map((plan) => (
          <article className="pricing-card" key={plan.code}>
            <p className="pricing-name">{plan.name}</p>
            <h2>{plan.priceLabel}</h2>
            <p className="pricing-detail">{plan.detail}</p>
            <ul className="feature-list">
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`/upgrade?plan=${plan.code}`}>
                {plan.code === "trial_full_access" ? "Start Free Trial" : `Register for ${plan.name}`}
              </a>
              <a className="btn btn-secondary" href="/login">
                Login to Continue
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
