import { subjectDefinitions } from "../../lib/subjects";

const aiLogicCards = [
  {
    icon: "AI",
    title: "AI finds the weak point",
    body: "Students stop guessing because the system points to the exact issue first."
  },
  {
    icon: "UP",
    title: "AI shows the better answer",
    body: "The student sees the stronger version, not just a mark or score."
  },
  {
    icon: "GO",
    title: "AI tells the next step",
    body: "Every subject lane ends with a clear next move instead of more confusion."
  }
];

const subjectShowcase = [
  {
    slug: "english",
    struggle: "Weak grammar, unclear ideas, and basic vocabulary.",
    aiHelps: "Upgrades sentence clarity, fixes weak writing, and explains why the better version works.",
    improves: "Essays, grammar confidence, and band progress.",
    startWith: "Writing Coach"
  },
  {
    slug: "bahasa-melayu",
    struggle: "Karangan structure feels weak and tatabahasa mistakes keep repeating.",
    aiHelps: "Shows clearer structure, explains sentence corrections, and improves comprehension answers.",
    improves: "Karangan flow, tatabahasa, and BM confidence.",
    startWith: "Tatabahasa"
  },
  {
    slug: "sejarah",
    struggle: "Students know the topic, but do not know how to answer clearly.",
    aiHelps: "Breaks down source questions, sharpens fact use, and improves answer logic.",
    improves: "Source-based answers, revision structure, and exam recall.",
    startWith: "Timeline Recall"
  },
  {
    slug: "geografi",
    struggle: "Concepts, maps, and short answers feel scattered and hard to organise.",
    aiHelps: "Clarifies concepts, explains data interpretation, and guides structured short answers.",
    improves: "Concept confidence, map reading, and exam structure.",
    startWith: "Map and Data Drill"
  },
  {
    slug: "math",
    struggle: "Working breaks halfway and the same mistakes keep repeating.",
    aiHelps: "Checks the method, shows where the working goes wrong, and guides cleaner steps.",
    improves: "Step accuracy, topic confidence, and fewer careless errors.",
    startWith: "Topic Practice"
  },
  {
    slug: "add-math",
    struggle: "Harder questions feel too big, and students lose track of the method.",
    aiHelps: "Breaks down difficult working into smaller checks and clearer step logic.",
    improves: "Step precision, harder question confidence, and advanced topic control.",
    startWith: "Step Check Drill"
  }
];

const differenceExamples = [
  {
    subject: "English",
    beforeLabel: "The weak answer",
    before: "\"I goes to the shop yesterday to buy bread.\"",
    afterLabel: "AI improved",
    after: "\"I went to the shop yesterday to buy bread.\"",
    note: "AI explanation: Because it happened yesterday, we use the past tense of 'go'."
  },
  {
    subject: "Math",
    beforeLabel: "Unclear working",
    before: "2x + 4 = 10, so x = 7?",
    afterLabel: "AI step-by-step",
    after: "1. Subtract 4: 2x = 6\n2. Divide by 2: x = 3",
    note: "AI explanation: It shows the exact step where the method breaks."
  },
  {
    subject: "Sejarah",
    beforeLabel: "Basic idea",
    before: "Nasionalisme penting sebab orang mahu merdeka.",
    afterLabel: "AI upgraded",
    after: "Nasionalisme penting kerana ia mendorong rakyat menentang penjajah dan mempertahankan maruah bangsa.",
    note: "AI explanation: The answer becomes clearer, more complete, and more exam-ready."
  }
];

export default function SubjectsPage() {
  const subjectMap = new Map(subjectDefinitions.map((subject) => [subject.slug, subject]));

  return (
    <main className="page-shell landing-shell subjects-page-shell">
      <section className="landing-hero subjects-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow landing-hero-chip">Six subject lanes. One clear AI system.</p>
          <h1>See how AI helps students improve in every SPM subject.</h1>
          <p className="landing-lead">
            From writing and comprehension to source questions and step-by-step Math working, SenangBah helps students see what is weak, fix it clearly, and improve over time.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              Start My AI Learning
            </a>
            <a className="btn btn-secondary" href="/how-it-works">
              See How It Works
            </a>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="landing-map-card subjects-hero-map">
            <div className="landing-map-copy">
              <p className="dashboard-label">What the system covers</p>
              <h3>One AI learning flow across all 6 SPM subjects.</h3>
              <p>Same daily mission logic. Same progress tracking. Different subject-specific improvement.</p>
            </div>
            <img alt="Multi-subject AI learning map" className="landing-map-image" src="/landing/subjects-map.svg" />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">What AI actually does</p>
          <h2>The same AI system helps students across every subject lane.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {aiLogicCards.map((card) => (
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
          <p className="eyebrow">Subject lanes</p>
          <h2>How AI helps students improve in each subject</h2>
        </div>
        <div className="subjects-showcase-grid">
          {subjectShowcase.map((item) => {
            const subject = subjectMap.get(item.slug);
            if (!subject) return null;
            const readyCount = subject.modules.filter((module) => module.status === "ready").length;
            const toneClass =
              subject.bundle === "Language Pack"
                ? "subject-showcase-language"
                : subject.bundle === "Humanities Pack"
                  ? "subject-showcase-humanities"
                  : "subject-showcase-math";

            return (
              <article className={`subject-showcase-card ${toneClass}`} key={subject.slug}>
                <div className="subject-showcase-head">
                  <div>
                    <p className="subject-status">{subject.group}</p>
                    <h3>{subject.name}</h3>
                  </div>
                  <span className="status-pill">{readyCount} ready</span>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">The struggle</span>
                  <p>{item.struggle}</p>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">AI helps by</span>
                  <p>{item.aiHelps}</p>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">You improve in</span>
                  <p>{item.improves}</p>
                </div>

                <div className="subject-showcase-footer">
                  <div>
                    <span className="dashboard-label">Start with</span>
                    <strong>{item.startWith}</strong>
                  </div>
                  <a className="btn btn-secondary" href={`/subjects/${subject.slug}`}>
                    Open {subject.name}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">See the difference</p>
          <h2>AI helps students move from unclear answers to stronger ones.</h2>
        </div>
        <div className="subject-difference-grid">
          {differenceExamples.map((item) => (
            <article className="subject-difference-card" key={item.subject}>
              <p className="subject-status">{item.subject}</p>
              <div className="subject-difference-panels">
                <div className="subject-difference-panel is-before">
                  <span className="dashboard-label">{item.beforeLabel}</span>
                  <p>{item.before}</p>
                </div>
                <div className="subject-difference-panel is-after">
                  <span className="dashboard-label">{item.afterLabel}</span>
                  <p>{item.after}</p>
                </div>
              </div>
              <p className="subject-difference-note">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">One AI system. Six subject paths.</p>
          <h2>Start with one subject, then keep improving across all six.</h2>
          <p className="landing-lead">
            SenangBah keeps the same clear mission logic, AI feedback, and progress tracking across every subject lane.
          </p>
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
