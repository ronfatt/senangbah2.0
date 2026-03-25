const flowSteps = [
  {
    step: "01",
    label: "Diagnose",
    icon: "AI",
    title: "AI finds exactly where you're weak.",
    body: "SenangBah reads your writing or answers and highlights the issue before you waste more time repeating it.",
    points: ["Grammar issues", "Weak ideas", "Basic vocabulary"],
    tone: "diagnose"
  },
  {
    step: "02",
    label: "Train",
    icon: "GO",
    title: "You get 1 simple mission a day.",
    body: "Each mission is short, clear, and designed to fit into a real school day.",
    points: ["Fix 1 sentence", "Improve 1 idea", "Use 1 better word"],
    tone: "train"
  },
  {
    step: "03",
    label: "Upgrade",
    icon: "UP",
    title: "AI shows the better version.",
    body: "You see the weak answer, the stronger answer, and the reason the upgrade works.",
    points: ["Before → After", "Clear explanation", "Next action"],
    tone: "upgrade"
  },
  {
    step: "04",
    label: "Improve",
    icon: "OK",
    title: "You build real skills over time.",
    body: "Daily missions stack up into stronger writing, clearer answers, better methods, and higher confidence.",
    points: ["Band 4 → 5", "Progress bar", "Streak + daily wins"],
    tone: "improve"
  }
];

const dailyCards = [
  {
    icon: "10",
    title: "10-15 min only",
    body: "No long study sessions. Just one short mission that feels easy to start."
  },
  {
    icon: "AI",
    title: "AI explains",
    body: "Not just answers. You understand the mistake, the fix, and the better version."
  },
  {
    icon: "UP",
    title: "Real progress",
    body: "You can actually see what improved instead of just hoping it worked."
  }
];

const subjects = ["English", "Bahasa Melayu", "Sejarah", "Geografi", "Math", "Add Math"];

const whyWorks = [
  {
    title: "You fix mistakes immediately",
    body: "The error is fresh, the correction is clear, and the better version appears right away.",
    icon: "FX"
  },
  {
    title: "You don't waste time guessing",
    body: "AI points at the exact weak area, so students do not spend energy on the wrong thing.",
    icon: "AI"
  },
  {
    title: "You practise every day",
    body: "Short missions are easier to repeat, and consistency is what changes results over time.",
    icon: "DAY"
  }
];

export default function HowItWorksPage() {
  return (
    <main className="page-shell landing-shell how-shell">
      <section className="landing-hero how-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow landing-hero-chip">What actually happens after you start</p>
          <h1>How SenangBah Works</h1>
          <p className="landing-lead">
            No guessing. No long lessons. Just clear steps to improve every day.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start My AI Learning
            </a>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="mission-mockup mission-mockup-conversion">
            <div className="mission-mockup-head">
              <div>
                <p className="dashboard-label">14-day AI flow</p>
                <strong className="mission-mockup-title">One clear loop, every day</strong>
              </div>
              <span className="mission-day-badge">Simple</span>
            </div>
            <div className="hero-mission-list">
              <div className="hero-mission-item is-complete">
                <strong>1. Diagnose</strong>
                <span>Find the weak point first</span>
              </div>
              <div className="hero-mission-item is-active">
                <strong>2. Train</strong>
                <span>Do one short mission</span>
              </div>
              <div className="hero-mission-item">
                <strong>3. Upgrade</strong>
                <span>See the better answer</span>
              </div>
              <div className="hero-mission-item">
                <strong>4. Improve</strong>
                <span>Track the result clearly</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">14-day learning flow</p>
          <h2>Your 14-Day AI Learning Flow</h2>
        </div>
        <div className="how-flow-intro-visual">
          <article className="landing-visual-card landing-visual-card-wide">
            <div className="landing-visual-copy">
              <p className="dashboard-label">See the loop clearly</p>
              <h3>Every mission follows the same easy rhythm.</h3>
              <p>Students do not have to guess what comes next. Diagnose, train, upgrade, improve.</p>
            </div>
            <img alt="AI flow illustration showing learning progression" className="landing-visual-image how-float-visual" src="/landing/ai-wave.svg" />
          </article>
        </div>
        <div className="how-flow-grid">
          {flowSteps.map((item) => (
            <article className={`how-flow-card how-flow-card-${item.tone}`} key={item.step}>
              <div className="how-flow-head">
                <div className="how-flow-head-row">
                  <span className="step-badge">{item.step}</span>
                  <span className="how-flow-icon">{item.icon}</span>
                </div>
                <div>
                  <p className="dashboard-label">{item.label}</p>
                  <h3>{item.title}</h3>
                </div>
              </div>
              <p>{item.body}</p>
              <div className="how-flow-points">
                {item.points.map((point) => (
                  <span className="how-flow-pill" key={point}>
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Real example</p>
          <h2>What this looks like in real life</h2>
        </div>
        <div className="how-example-grid">
          <article className="before-after-card before-after-card-featured">
            <div>
              <p className="dashboard-label">Before</p>
              <p className="before-copy">I study with my friends because fun.</p>
            </div>
            <div className="before-after-arrow">→</div>
            <div>
              <p className="dashboard-label">After</p>
              <p className="after-copy">Studying with my friends keeps me motivated and improves my discipline.</p>
            </div>
          </article>
          <article className="how-example-note">
            <p className="dashboard-label">AI explanation</p>
            <h3>Why the second version is better</h3>
            <p>It uses a clearer subject, a stronger verb, and a more natural connector. That is the kind of fix students can actually learn from.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Daily experience</p>
          <h2>What you actually do every day</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {dailyCards.map((card, index) => (
            <article className="landing-glass-card" key={card.title}>
              <span className="landing-icon-chip">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Subjects</p>
          <h2>Works across all your SPM subjects</h2>
        </div>
        <div className="how-subject-grid">
          {subjects.map((subject) => (
            <article className="landing-tool-card how-subject-card" key={subject}>
              <p className="dashboard-label">Subject lane</p>
              <h3>{subject}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Progress</p>
          <h2>Track your improvement clearly</h2>
        </div>
        <div className="progress-preview-rich how-progress-rich">
          <div className="progress-metric-grid how-progress-grid">
            <div className="progress-metric">
              <span className="dashboard-label">Grammar %</span>
              <strong>58% → 74%</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">Vocab growth</span>
              <strong>+21%</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">Band score</span>
              <strong>3.8 → 4.6</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">Streak</span>
              <strong>7 days</strong>
            </div>
          </div>
          <article className="landing-progress-orb-card how-progress-orb-wrap">
            <img alt="Progress orb showing AI band improvement" className="landing-progress-orb how-float-visual" src="/landing/progress-orb.svg" />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Why it works</p>
          <h2>Why students actually improve</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {whyWorks.map((point) => (
            <article className="landing-glass-card why-card" key={point.title}>
              <span className="landing-icon-chip">{point.icon}</span>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">Start today</p>
          <h2>Start your first mission today.</h2>
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
