const problemPoints = [
  "Don't know what you're doing wrong",
  "Keep repeating the same mistakes",
  "Spend hours studying, but results don't change"
];

const solutionCards = [
  {
    title: "Find your weak points",
    body: "AI detects what you don't see, so you stop guessing and start fixing."
  },
  {
    title: "Fix your mistakes",
    body: "See what is weak, why it is weak, and how to make it better."
  },
  {
    title: "Improve every day",
    body: "One short mission at a time. Small progress that adds up."
  }
];

const subjectCards = [
  {
    title: "English",
    body: "Better writing, clearer sentences, and stronger grammar."
  },
  {
    title: "Bahasa Melayu",
    body: "Stronger karangan, better structure, and clearer answers."
  },
  {
    title: "Sejarah",
    body: "Understand faster and answer source questions with more confidence."
  },
  {
    title: "Geografi",
    body: "Learn the key concepts clearly and answer with more precision."
  },
  {
    title: "Math",
    body: "Step-by-step solutions that help you avoid common errors."
  },
  {
    title: "Add Math",
    body: "Break down difficult questions into clearer working steps."
  }
];

const aiCards = [
  {
    icon: "AI",
    title: "AI explains your mistakes",
    body: "Not just right or wrong. You see what happened and how to fix it."
  },
  {
    icon: "UP",
    title: "Shows your progress",
    body: "Track subject progress, weak areas, and improvement over time."
  },
  {
    icon: "GO",
    title: "Tells you what to do next",
    body: "Every mission ends with a clear next step instead of more confusion."
  }
];

const beforeAfterRows = [
  {
    subject: "English",
    before: "I study with my friends because fun.",
    after: "Studying with my friends keeps me motivated and improves my discipline."
  },
  {
    subject: "Math",
    before: "I just try the formula and hope the answer is correct.",
    after: "I check each step carefully, so I can see where the method starts going wrong."
  },
  {
    subject: "Sejarah",
    before: "I know the topic, but I don't know how to answer properly.",
    after: "I understand the point, choose the right evidence, and answer more clearly."
  }
];

const testimonials = [
  "Now I understand my mistakes.",
  "Short enough that I actually do it.",
  "Feels like I'm improving."
];

const parentTrustPoints = [
  "Aligned with SPM exam format",
  "Focus on writing, answering, and understanding",
  "Helps students improve consistently, not just practise"
];

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <section className="landing-hero landing-hero-conversion">
        <div className="landing-hero-copy">
          <p className="eyebrow">AI study system for SPM students</p>
          <h1>Improve Your SPM Subjects in Just 15 Minutes a Day.</h1>
          <p className="landing-lead">
            Fix mistakes. Understand better. See real progress with AI guidance across English, BM, Sejarah, Geografi, Math, and Add Math.
          </p>
          <p className="landing-proof">Used by 100+ SPM students</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start My AI Learning
            </a>
            <a className="btn btn-secondary" href="/#how-it-works">
              See How It Works
            </a>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="mission-mockup mission-mockup-conversion">
            <div className="mission-mockup-head">
              <p className="dashboard-label">Today's mission</p>
              <span className="mission-day-badge">Day 3 of 14</span>
            </div>

            <div className="hero-mission-list">
              <div className="hero-mission-item">
                <strong>Fix 1 weak sentence</strong>
                <span>English writing</span>
              </div>
              <div className="hero-mission-item">
                <strong>Learn 1 better word</strong>
                <span>Vocabulary upgrade</span>
              </div>
              <div className="hero-mission-item">
                <strong>Improve 1 idea</strong>
                <span>Clearer exam answer</span>
              </div>
            </div>

            <div className="mission-upgrade-panel">
              <p className="dashboard-label">AI feedback</p>
              <strong>Weakness: grammar accuracy</strong>
              <p className="dashboard-helper">Upgrade: use a clearer connector and one stronger verb.</p>
            </div>

            <div className="hero-dashboard-stats">
              <div className="mission-stat">
                <span className="dashboard-label">Subjects live</span>
                <strong>6 subjects</strong>
              </div>
              <div className="mission-stat">
                <span className="dashboard-label">Daily time</span>
                <strong>5-15 min</strong>
              </div>
              <div className="mission-stat mission-stat-wide">
                <span className="dashboard-label">Focus now</span>
                <strong>One short mission. One clear improvement.</strong>
              </div>
            </div>

            <div className="mission-progress-rail">
              <div className="mission-progress-head">
                <span className="dashboard-label">Progress</span>
                <strong>Small daily wins add up</strong>
              </div>
              <div className="target-progress">
                <div className="target-progress-bar" style={{ width: "46%" }} />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="problem">
        <div className="section-heading landing-heading">
          <p className="eyebrow">The problem</p>
          <h2>Studying hard, but still not improving?</h2>
        </div>
        <div className="problem-strip">
          {problemPoints.map((point) => (
            <article className="landing-glass-card problem-card" key={point}>
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-heading landing-heading">
          <p className="eyebrow">The solution</p>
          <h2>SenangBah is your AI learning system.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {solutionCards.map((card, index) => (
            <article className="landing-glass-card" key={card.title}>
              <span className="landing-icon-chip">{`0${index + 1}`}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="section-heading landing-heading">
          <p className="eyebrow">How it works</p>
          <h2>Simple enough to start today.</h2>
        </div>
        <div className="steps-row">
          <article className="step-card">
            <div className="step-badge">1</div>
            <h3>Do 1 short task</h3>
            <p>Start one mission instead of feeling buried by too much work.</p>
          </article>
          <article className="step-card">
            <div className="step-badge">2</div>
            <h3>AI shows what's wrong</h3>
            <p>See the exact weak point instead of guessing what happened.</p>
          </article>
          <article className="step-card">
            <div className="step-badge">3</div>
            <h3>You fix it</h3>
            <p>Get a clearer answer, stronger wording, or cleaner method.</p>
          </article>
          <article className="step-card">
            <div className="step-badge">4</div>
            <h3>You improve</h3>
            <p>Come back tomorrow and keep building one daily win at a time.</p>
          </article>
        </div>
      </section>

      <section className="section" id="subjects">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Subject power</p>
          <h2>One system. All your SPM subjects.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {subjectCards.map((subject) => (
            <article className="landing-tool-card" key={subject.title}>
              <p className="dashboard-label">AI subject lane</p>
              <h3>{subject.title}</h3>
              <p>{subject.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Daily system</p>
          <h2>You don't need hours. Just consistency.</h2>
        </div>
        <article className="landing-glass-card daily-system-card">
          <div className="daily-system-points">
            <div className="daily-pill">1 mission per day</div>
            <div className="daily-pill">5-15 minutes</div>
            <div className="daily-pill">Focus on 1 improvement</div>
          </div>
          <p>
            SenangBah works best when studying feels light enough to start and clear enough to repeat tomorrow.
          </p>
        </article>
      </section>

      <section className="section" id="ai-difference">
        <div className="section-heading landing-heading">
          <p className="eyebrow">AI difference</p>
          <h2>This is not just practice.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {aiCards.map((card) => (
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
          <p className="eyebrow">Before / after</p>
          <h2>See the difference.</h2>
        </div>
        <div className="before-after-list">
          {beforeAfterRows.map((row) => (
            <article className="before-after-card" key={row.subject}>
              <div>
                <p className="dashboard-label">{row.subject} before</p>
                <p className="before-copy">{row.before}</p>
              </div>
              <div className="before-after-arrow">→</div>
              <div>
                <p className="dashboard-label">{row.subject} after</p>
                <p className="after-copy">{row.after}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="progress">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Progress</p>
          <h2>Real improvement you can see.</h2>
        </div>
        <div className="progress-preview">
          <article className="landing-glass-card progress-card-large">
            <div className="progress-metric-grid">
              <div className="progress-metric">
                <span className="dashboard-label">Grammar accuracy</span>
                <strong>58% → 74%</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">Vocabulary</span>
                <strong>+21%</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">Band estimate</span>
                <strong>3.8 → 4.6</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">Mistakes</span>
                <strong>Going down</strong>
              </div>
            </div>
            <p className="landing-footnote">Not just practice. Real measurable progress that students and parents can both understand.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Student voices</p>
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
          <p className="eyebrow">Parent trust</p>
          <h2>Built to support real exam improvement.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {parentTrustPoints.map((point) => (
            <article className="landing-glass-card" key={point}>
              <h3>{point}</h3>
              <p>Clear daily structure with AI guidance that supports steady exam progress.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">Start today</p>
          <h2>Start improving today.</h2>
          <p className="landing-lead">No stress. Just small daily progress with AI helping you know what to do next.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start My AI Learning
            </a>
            <a className="btn btn-secondary" href="/login">
              Login to Continue Learning
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
