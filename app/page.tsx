const whyCards = [
  {
    title: "Short daily missions",
    body: "6-10 minutes a day. No long boring lessons.",
    icon: "01"
  },
  {
    title: "AI that actually explains",
    body: "See what is weak, why it is weak, and how to fix it.",
    icon: "02"
  },
  {
    title: "Feels like progress",
    body: "Track your level, streak, and band improvement.",
    icon: "03"
  }
];

const steps = [
  {
    title: "Diagnose",
    body: "Find your current English level and weak areas."
  },
  {
    title: "Train",
    body: "Do one short writing, grammar, or vocab mission every day."
  },
  {
    title: "Upgrade",
    body: "AI shows better sentence versions and clearer expression."
  },
  {
    title: "Improve",
    body: "Track your writing progress over 14 days."
  }
];

const tools = [
  {
    title: "Writing Booster",
    body: "Fix weak sentences, improve ideas, and write more clearly.",
    href: "/subjects/english/writing-coach",
    featured: true
  },
  {
    title: "Grammar Lab",
    body: "Spot common mistakes and learn how to correct them fast.",
    href: "/subjects/english/grammar-lab"
  },
  {
    title: "Vocabulary Engine",
    body: "Use stronger words in real sentences, not just memorise lists.",
    href: "/subjects/english/vocabulary-builder"
  }
];

const transformations = [
  {
    before: "I study with my friends because fun.",
    after: "Studying with my friends keeps me motivated and improves my discipline."
  },
  {
    before: "The internet give many information for student.",
    after: "The internet gives students fast access to useful information and better learning resources."
  },
  {
    before: "My school is good because have many teacher.",
    after: "My school supports students well because it has committed teachers and a strong learning environment."
  }
];

const testimonials = [
  "I used to get stuck writing one sentence. Now I know how to improve it.",
  "The missions are short, so I actually finish them.",
  "I can finally see what mistakes I keep repeating."
];

const audience = [
  "Form 4 and Form 5 students",
  "Students preparing for SPM English",
  "Students who want clearer writing and fewer grammar mistakes",
  "Students who prefer short daily practice over long boring classes"
];

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow">SPM English Upgrade System</p>
          <h1>Improve Your SPM English in 14 Days.</h1>
          <p className="landing-lead">
            AI-powered writing, grammar, and vocabulary training designed for students who want clearer writing and better results.
          </p>
          <p className="landing-proof">Already used by 100+ students.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start My 14-Day Upgrade
            </a>
            <a className="btn btn-secondary" href="#how-it-works">
              See How It Works
            </a>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="mission-mockup">
            <div className="mission-mockup-head">
              <p className="dashboard-label">Today&apos;s Mission</p>
              <span className="mission-day-badge">Day 3 of 14</span>
            </div>
            <div className="mission-checklist">
              <div className="mission-check-item">
                <span className="mission-check-bullet" />
                <strong>Fix 1 weak sentence</strong>
              </div>
              <div className="mission-check-item">
                <span className="mission-check-bullet" />
                <strong>Learn 1 better word</strong>
              </div>
              <div className="mission-check-item">
                <span className="mission-check-bullet" />
                <strong>Improve 1 idea</strong>
              </div>
            </div>
            <div className="mission-upgrade-panel">
              <p className="dashboard-label">AI Feedback</p>
              <strong>Weakness: grammar accuracy</strong>
              <p className="dashboard-helper">Upgrade: use a clearer connector and a stronger verb.</p>
            </div>
            <div className="sentence-upgrade-preview">
              <div>
                <p className="dashboard-label">Before</p>
                <p className="sentence-preview-copy sentence-preview-copy-before">
                  I join study group because make me happy.
                </p>
              </div>
              <div className="sentence-preview-arrow">→</div>
              <div>
                <p className="dashboard-label">After</p>
                <p className="sentence-preview-copy">
                  Joining a study group keeps me motivated and improves my confidence.
                </p>
              </div>
            </div>
            <div className="mission-stats-grid">
              <div className="mission-stat">
                <span className="dashboard-label">Current Band</span>
                <strong>4</strong>
              </div>
              <div className="mission-stat">
                <span className="dashboard-label">Target Band</span>
                <strong>5</strong>
              </div>
              <div className="mission-stat mission-stat-wide">
                <span className="dashboard-label">Grammar Accuracy</span>
                <strong>62% → 78%</strong>
              </div>
            </div>
            <div className="mission-progress-rail">
              <div className="mission-progress-head">
                <span className="dashboard-label">Progress</span>
                <strong>3 / 14 days</strong>
              </div>
              <div className="target-progress">
                <div className="target-progress-bar" style={{ width: "21%" }} />
              </div>
            </div>
            <p className="mission-signoff">Write better. Score higher.</p>
          </article>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Why Students Like It</p>
          <h2>Built for students who hate boring English practice.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {whyCards.map((card) => (
            <article className="landing-glass-card" key={card.title}>
              <span className="landing-icon-chip">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="section-heading landing-heading">
          <p className="eyebrow">How It Works</p>
          <h2>How SenangBah works</h2>
        </div>
        <div className="steps-row">
          {steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <div className="step-badge">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Core Tools</p>
          <h2>Three tools. One goal: better English.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {tools.map((tool) => (
            <a className={`landing-tool-card${tool.featured ? " is-featured" : ""}`} href={tool.href} key={tool.title}>
              <p className="dashboard-label">{tool.featured ? "Main track" : "Core tool"}</p>
              <h3>{tool.title}</h3>
              <p>{tool.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Before / After</p>
          <h2>See the difference</h2>
        </div>
        <div className="before-after-list">
          {transformations.map((example) => (
            <article className="before-after-card" key={example.before}>
              <div>
                <p className="dashboard-label">Before</p>
                <p className="before-copy">{example.before}</p>
              </div>
              <div className="before-after-arrow">→</div>
              <div>
                <p className="dashboard-label">After</p>
                <p className="after-copy">{example.after}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="landing-footnote">SenangBah helps students write more naturally, clearly, and confidently.</p>
      </section>

      <section className="section" id="progress">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Progress</p>
          <h2>Track real improvement</h2>
        </div>
        <div className="progress-preview">
          <article className="landing-glass-card progress-card-large">
            <div className="progress-metric-grid">
              <div className="progress-metric">
                <span className="dashboard-label">Grammar Accuracy</span>
                <strong>58% → 74%</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">Vocabulary Range</span>
                <strong>+21%</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">Sentence Complexity</span>
                <strong>Improved</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">Estimated Band</span>
                <strong>3.8 → 4.6</strong>
              </div>
            </div>
            <p className="landing-footnote">Not just practice. Real measurable progress.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Student Voices</p>
          <h2>What students say</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {testimonials.map((quote) => (
            <article className="landing-quote-card" key={quote}>
              <p>{quote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2>Who should use SenangBah?</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-2">
          {audience.map((item) => (
            <article className="landing-glass-card audience-card" key={item}>
              <span className="audience-dot" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">Ready to upgrade your English?</p>
          <h2>Start your first mission today.</h2>
          <p className="landing-lead">
            Start with your first mission and see how SenangBah helps you improve in just a few minutes a day.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start My 14-Day Upgrade
            </a>
          </div>
          <p className="landing-proof">No long lessons. No boring drills. Just smart daily progress.</p>
        </article>
      </section>
    </main>
  );
}
