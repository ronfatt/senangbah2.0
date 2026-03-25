import { getPlanCatalog } from "../../lib/catalog";

export default async function PricingPage() {
  const plans = await getPlanCatalog();

  const freePlan = plans.find((plan) => plan.code === "free");
  const languagePack = plans.find((plan) => plan.code === "language_pack");
  const humanitiesPack = plans.find((plan) => plan.code === "humanities_pack");
  const mathPack = plans.find((plan) => plan.code === "math_pack");
  const allAccess = plans.find((plan) => plan.code === "all_access");

  const focusPacks = [languagePack, humanitiesPack, mathPack].filter(Boolean);

  return (
    <main className="page-shell pricing-shell">
      <section className="pricing-hero">
        <div className="pricing-hero-copy">
          <p className="eyebrow">Choose your upgrade path</p>
          <h1 className="dashboard-title">Pick your upgrade path. Start improving in 7 days.</h1>
          <p className="landing-lead">
            No guessing. Just clear progress across your SPM subjects.
          </p>
          <div className="pricing-hero-badges">
            <span className="pricing-popular-badge">Most students choose All Access</span>
            <span className="pricing-trial-pill">7-day full access trial included</span>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/upgrade?plan=all_access">
              Start full access
            </a>
            <a className="btn btn-secondary" href="/register">
              Start free trial
            </a>
          </div>
        </div>

        <article className="pricing-hero-panel">
          <p className="dashboard-label">Why students choose this</p>
          <h2>Most students start with All Access because it removes the guesswork.</h2>
          <ul className="pricing-trigger-list">
            <li>They don&apos;t want to guess what to study</li>
            <li>They want faster improvement across subjects</li>
            <li>They are preparing seriously for SPM</li>
          </ul>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Your study options</p>
          <h2>Choose the level that matches how focused you want your prep to be.</h2>
        </div>

        <div className="pricing-tier-grid">
          <article className="pricing-tier-card pricing-tier-card-free">
            <p className="pricing-name">Free Starter</p>
            <h2>{freePlan?.priceLabel || "RM0"}</h2>
            <p className="pricing-detail">Daily basic missions, limited subjects, and basic feedback.</p>
            <ul className="feature-list">
              <li>Daily basic missions</li>
              <li>Limited subjects</li>
              <li>Basic feedback</li>
            </ul>
            <div className="hero-actions">
              <a className="btn btn-secondary" href="/register">
                Try free
              </a>
            </div>
          </article>

          <article className="pricing-tier-card pricing-tier-card-pack">
            <p className="pricing-name">Subject Pack</p>
            <h2>RM19 / RM29</h2>
            <p className="pricing-detail">Improve specific subjects with full AI feedback and daily missions.</p>
            <div className="pricing-pack-options">
              {focusPacks.map((plan) => (
                <div className="pricing-pack-option" key={plan!.code}>
                  <div>
                    <strong>{plan!.name}</strong>
                    <span>{plan!.priceLabel}</span>
                  </div>
                  <p>{plan!.detail}</p>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/upgrade?plan=language_pack">
                Choose your subjects
              </a>
              <a className="btn btn-secondary" href="/login">
                Login to continue
              </a>
            </div>
          </article>

          <article className="pricing-tier-card pricing-tier-card-highlight">
            <div className="pricing-highlight-top">
              <span className="pricing-popular-badge">Most Popular</span>
            </div>
            <p className="pricing-name">All Subjects Access</p>
            <h2>{allAccess?.priceLabel || "RM59"}</h2>
            <p className="pricing-detail">Everything you need to improve faster.</p>
            <ul className="feature-list">
              <li>All 6 subjects unlocked</li>
              <li>Full AI feedback system</li>
              <li>Faster improvement tracking</li>
              <li>Best value for exam prep</li>
            </ul>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/upgrade?plan=all_access">
                Start full access
              </a>
              <a className="btn btn-secondary" href="/login">
                Login to continue
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">What students get</p>
          <h2>What students get after upgrading</h2>
        </div>

        <div className="pricing-results-grid">
          <article className="pricing-result-card">
            <span className="dashboard-label">English</span>
            <strong>Grammar accuracy ↑</strong>
          </article>
          <article className="pricing-result-card">
            <span className="dashboard-label">Language growth</span>
            <strong>Vocabulary range ↑</strong>
          </article>
          <article className="pricing-result-card">
            <span className="dashboard-label">Overall performance</span>
            <strong>Band score ↑</strong>
          </article>
        </div>
      </section>

      <section className="section">
        <article className="pricing-trigger-panel">
          <div>
            <p className="eyebrow">Why students choose All Access</p>
            <h2>Most students start with All Access because they want the fastest path.</h2>
          </div>
          <ul className="pricing-trigger-list">
            <li>They don&apos;t want to guess what to study</li>
            <li>They want faster improvement</li>
            <li>They are preparing for SPM seriously</li>
          </ul>
        </article>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">Start your 7-day full access now</p>
          <h2>Start improving today.</h2>
          <p className="landing-lead">No stress. Just small daily progress that adds up.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start My AI Learning
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
