const whyCards = [
  {
    title: "Short daily missions",
    body: "Clear missions across English, BM, Sejarah, Geografi, Math, and Add Math.",
    icon: "01"
  },
  {
    title: "AI that explains",
    body: "See your weak point, the fix, and the better version right away.",
    icon: "02"
  },
  {
    title: "Progress you can see",
    body: "Track missions, streaks, accuracy, and subject-by-subject improvement.",
    icon: "03"
  }
];

const subjectCards = [
  {
    title: "English",
    body: "Writing, grammar, reading, and vocabulary missions with AI upgrades."
  },
  {
    title: "Bahasa Melayu",
    body: "Tatabahasa, pemahaman, and karangan practice with clearer next steps."
  },
  {
    title: "Sejarah",
    body: "Timeline recall, source drills, and revision sets for stronger exam recall."
  },
  {
    title: "Geografi",
    body: "Map reading, concept review, and short-answer practice with AI support."
  },
  {
    title: "Math",
    body: "Topic drills, worked solutions, and error tracking for cleaner method work."
  },
  {
    title: "Add Math",
    body: "Step-check practice for harder questions and more precise working."
  }
];

const aiCards = [
  {
    title: "AI diagnosis",
    body: "Find the subject, topic, or skill that needs work first."
  },
  {
    title: "AI feedback",
    body: "Get clear fixes, stronger answers, and cleaner explanations."
  },
  {
    title: "AI next step",
    body: "Know what to do after every mission instead of guessing."
  }
];

const progressStats = [
  {
    label: "Subjects",
    value: "6 lanes"
  },
  {
    label: "Mission Progress",
    value: "3 / 14"
  },
  {
    label: "Grammar Accuracy",
    value: "62% → 78%"
  },
  {
    label: "Estimated Band",
    value: "3.8 → 4.6"
  }
];

const testimonials = [
  "I can see which subject to do next instead of wasting time deciding.",
  "The AI actually explains what is weak and how to fix it.",
  "The missions are short enough that I really do them every day."
];

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow">AI Learning Platform</p>
          <h1>Upgrade Across English, BM, Sejarah, Geografi, Math, and Add Math.</h1>
          <p className="landing-lead">
            SenangBah is an AI-powered study platform built for students who want short daily missions, clearer feedback, and progress they can actually track.
          </p>
          <p className="landing-proof">Start your account, unlock your trial, and begin improving subject by subject.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Register as Member
            </a>
            <a className="btn btn-secondary" href="/pricing">
              Start Free Trial
            </a>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="mission-mockup">
            <div className="mission-mockup-head">
              <p className="dashboard-label">AI Mission Control</p>
              <span className="mission-day-badge">Trial active</span>
            </div>

            <div className="mission-checklist">
              <div className="mission-check-item">
                <span className="mission-check-bullet" />
                <strong>English: fix 1 weak sentence</strong>
              </div>
              <div className="mission-check-item">
                <span className="mission-check-bullet" />
                <strong>Sejarah: answer 1 source question</strong>
              </div>
              <div className="mission-check-item">
                <span className="mission-check-bullet" />
                <strong>Math: check 1 worked solution</strong>
              </div>
            </div>

            <div className="mission-upgrade-panel">
              <p className="dashboard-label">AI Feedback</p>
              <strong>Weakness: grammar accuracy and sentence clarity</strong>
              <p className="dashboard-helper">Upgrade: use a clearer connector, stronger verb, and one more precise detail.</p>
            </div>

            <div className="sentence-upgrade-preview">
              <div>
                <p className="dashboard-label">Weak answer</p>
                <p className="sentence-preview-copy sentence-preview-copy-before">
                  The project result was very good for the team.
                </p>
              </div>
              <div className="sentence-preview-arrow">→</div>
              <div>
                <p className="dashboard-label">AI upgrade</p>
                <p className="sentence-preview-copy">
                  The project result helped the team work faster and communicate more clearly.
                </p>
              </div>
            </div>

            <div className="mission-stats-grid">
              <div className="mission-stat">
                <span className="dashboard-label">Current focus</span>
                <strong>English + Math</strong>
              </div>
              <div className="mission-stat">
                <span className="dashboard-label">AI mode</span>
                <strong>Daily guidance</strong>
              </div>
              <div className="mission-stat mission-stat-wide">
                <span className="dashboard-label">Progress</span>
                <strong>Short missions. Clear fixes. Better results.</strong>
              </div>
            </div>

            <div className="mission-progress-rail">
              <div className="mission-progress-head">
                <span className="dashboard-label">Membership path</span>
                <strong>Register → Trial → Keep Improving</strong>
              </div>
              <div className="target-progress">
                <div className="target-progress-bar" style={{ width: "42%" }} />
              </div>
            </div>

            <p className="mission-signoff">Learn smarter. Improve faster.</p>
          </article>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Why students use it</p>
          <h2>Built for students who want AI help without boring study flow.</h2>
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

      <section className="section" id="subjects">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Subjects</p>
          <h2>One account opens a full AI study system across six subjects.</h2>
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

      <section className="section" id="how-it-works">
        <div className="section-heading landing-heading">
          <p className="eyebrow">How it works</p>
          <h2>Register once, get AI guidance, and keep improving every day.</h2>
        </div>
        <div className="steps-row">
          <article className="step-card">
            <div className="step-badge">1</div>
            <h3>Register</h3>
            <p>Start your account and unlock your 7-day full access trial.</p>
          </article>
          <article className="step-card">
            <div className="step-badge">2</div>
            <h3>Get missions</h3>
            <p>See the next task for English, BM, Sejarah, Geografi, Math, or Add Math.</p>
          </article>
          <article className="step-card">
            <div className="step-badge">3</div>
            <h3>Use AI feedback</h3>
            <p>Fix what is weak, see the upgrade, and know the next step.</p>
          </article>
          <article className="step-card">
            <div className="step-badge">4</div>
            <h3>Track progress</h3>
            <p>Watch your missions, streak, points, and subject improvement grow.</p>
          </article>
        </div>
      </section>

      <section className="section" id="progress">
        <div className="section-heading landing-heading">
          <p className="eyebrow">AI + progress</p>
          <h2>Not just practice. Real measurable progress with AI guidance.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {aiCards.map((card) => (
            <article className="landing-glass-card" key={card.title}>
              <p className="dashboard-label">AI layer</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <div className="progress-preview">
          <article className="landing-glass-card progress-card-large">
            <div className="progress-metric-grid">
              {progressStats.map((item) => (
                <div className="progress-metric" key={item.label}>
                  <span className="dashboard-label">{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <p className="landing-footnote">Your dashboard keeps every subject, mission, and AI next step in one place.</p>
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

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">Ready to start?</p>
          <h2>Register now and start your AI learning trial.</h2>
          <p className="landing-lead">
            Join SenangBah to access short daily missions, AI feedback, and multi-subject progress tracking in one place.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Register as Member
            </a>
            <a className="btn btn-secondary" href="/login">
              Login to Continue Learning
            </a>
          </div>
          <p className="landing-proof">Start with trial access, then continue with the subject bundle that fits you best.</p>
        </article>
      </section>
    </main>
  );
}
