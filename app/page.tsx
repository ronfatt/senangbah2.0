const subjectCards = [
  {
    name: "English",
    status: "Core Launch",
    blurb: "Writing, Grammar, Reading, and Vocabulary rebuilt for daily progress."
  },
  {
    name: "Bahasa Melayu",
    status: "Core Launch",
    blurb: "Tatabahasa, pemahaman, and karangan modules for daily language mastery."
  },
  {
    name: "Sejarah",
    status: "Premium Expansion",
    blurb: "Structured fact recall, timeline review, and source-based question practice."
  },
  {
    name: "Geografi",
    status: "Premium Expansion",
    blurb: "Topic drills, map interpretation, and short-answer practice with clearer revision paths."
  },
  {
    name: "Math",
    status: "Premium Expansion",
    blurb: "Topic-based problem sets, worked solutions, and mistake-pattern tracking."
  },
  {
    name: "Add Math",
    status: "Premium Expansion",
    blurb: "Higher-difficulty step-by-step practice for algebra, functions, and exam technique."
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SenangBah 2.0</p>
          <h1>Build a premium learning platform, not just another drill app.</h1>
          <p className="hero-text">
            A Vercel and Supabase rebuild for daily student progress, multi-subject growth,
            and clearer premium unlocks.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/blueprint">View Product Blueprint</a>
            <a className="btn btn-secondary" href="/subjects">Explore Subjects</a>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">Launch Sequence</p>
          <ol>
            <li>Core platform and auth</li>
            <li>English and BM module launch</li>
            <li>Billing and entitlements</li>
            <li>Sejarah, Geografi, Math, and Add Math premium rollout</li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Subjects</p>
          <h2>Launch with strong language pillars, then expand into core exam subjects.</h2>
        </div>
        <div className="subject-grid">
          {subjectCards.map((subject) => (
            <article className="subject-card" key={subject.name}>
              <p className="subject-status">{subject.status}</p>
              <h3>{subject.name}</h3>
              <p>{subject.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">Student Experience</p>
          <h2>Daily missions, clearer feedback, stronger premium logic.</h2>
          <ul className="feature-list">
            <li>Today-first dashboard with streaks and weak-skill focus</li>
            <li>Reusable practice engine across languages, humanities, and math subjects</li>
            <li>Premium unlocks that map to real subject access</li>
          </ul>
        </article>
        <article className="feature-panel alt">
          <p className="eyebrow">Platform Foundation</p>
          <h2>Built for migration, growth, and cleaner operations.</h2>
          <ul className="feature-list">
            <li>Supabase data model designed for multi-subject attempts</li>
            <li>Vercel-friendly app structure instead of a long-lived server</li>
            <li>Legacy import support for old users and history mapping</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
