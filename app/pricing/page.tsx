import { getPlanCatalog } from "../../lib/catalog";

export default async function PricingPage() {
  const plans = await getPlanCatalog();

  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">Pricing Direction</p>
        <h1 className="dashboard-title">7 days full access, then clear bundle upgrades.</h1>
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
                Choose {plan.name}
              </a>
              <a className="btn btn-secondary" href="/dashboard">
                Back to dashboard
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
