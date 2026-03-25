import { subjectDefinitions } from "../../lib/subjects";

const aiLogicCards = [
  {
    icon: "SCAN",
    title: "AI spots the weak point",
    body: "The system detects exactly what is weak before the student wastes time guessing."
  },
  {
    icon: "FIX",
    title: "AI explains the better answer",
    body: "Students see the stronger version and understand why it scores better."
  },
  {
    icon: "NEXT",
    title: "AI gives the next move",
    body: "Every subject ends with one clear task instead of a vague reminder to study more."
  }
];

const subjectShowcase = [
  {
    slug: "english",
    icon: "EN",
    hero: "Improve Writing & Grammar",
    focus: "Sentence upgrade",
    bestFor: "Essays + CEFR writing",
    resultTag: "Band lift",
    previewTag: "AI writing check",
    previewWeak: "Weakness: basic sentence",
    previewFix: "Upgrade: add tense + clearer reason",
    struggle: "Weak sentences, unclear ideas, and vocabulary that sounds too basic.",
    aiHelps: [
      "Fix weak sentences instantly",
      "Get better sentence versions",
      "Learn how to express ideas clearly"
    ],
    improves: "Essays, grammar control, and band progress.",
    startWith: "Writing Coach",
    chips: ["Writing", "Grammar", "Vocabulary"],
    before: "\"I go school because important\"",
    after: "\"I go to school because it is important for my future.\""
  },
  {
    slug: "bahasa-melayu",
    icon: "BM",
    hero: "Karangan & Struktur Ayat",
    focus: "Ayat + huraian",
    bestFor: "Karangan + pemahaman",
    resultTag: "Bahasa fluency",
    previewTag: "AI karangan coach",
    previewWeak: "Weakness: ayat terlalu ringkas",
    previewFix: "Upgrade: huraian lebih matang",
    struggle: "Ayat lemah, idea karangan tidak matang, dan struktur jawapan kurang kemas.",
    aiHelps: [
      "Betulkan ayat lemah",
      "Perbaiki idea karangan",
      "Gunakan ayat lebih matang"
    ],
    improves: "Karangan flow, tatabahasa, and pemahaman confidence.",
    startWith: "Tatabahasa",
    chips: ["Karangan", "Tatabahasa", "Pemahaman"],
    before: "\"Faedah bersukan ialah badan sihat dan kita gembira.\"",
    after: "\"Antara faedah bersukan ialah meningkatkan kesihatan fizikal serta membentuk disiplin diri yang lebih baik.\""
  },
  {
    slug: "sejarah",
    icon: "SJ",
    hero: "Answering & Explanation",
    focus: "Fakta + huraian",
    bestFor: "KBAT + source answers",
    resultTag: "Answer logic",
    previewTag: "AI answer builder",
    previewWeak: "Weakness: fakta tanpa huraian",
    previewFix: "Upgrade: tambah sebab + kesan",
    struggle: "Students know the topic, but the answer stays too short and too vague.",
    aiHelps: [
      "Understand question requirements",
      "Structure answers more clearly",
      "Use fakta dan huraian with better flow"
    ],
    improves: "Source answers, KBAT logic, and stronger explanation.",
    startWith: "Timeline Recall",
    chips: ["Timeline", "Source", "KBAT"],
    before: "\"British came and changed things\"",
    after: "\"The British introduced administrative reforms which significantly impacted local governance.\""
  },
  {
    slug: "geografi",
    icon: "GG",
    hero: "Concepts & Explanation",
    focus: "Konsep + data",
    bestFor: "Short answer structure",
    resultTag: "Clear explanation",
    previewTag: "AI concept support",
    previewWeak: "Weakness: jawapan terlalu umum",
    previewFix: "Upgrade: guna konsep lebih tepat",
    struggle: "Konsep terasa kabur and answers sound too general.",
    aiHelps: [
      "Understand key konsep clearly",
      "Answer struktur soalan dengan tepat",
      "Avoid vague answers"
    ],
    improves: "Concept recall, data reading, and clearer structured answers.",
    startWith: "Map and Data Drill",
    chips: ["Concepts", "Data", "Short answer"],
    before: "\"Urbanisation causes many problems\"",
    after: "\"Urbanisation increases traffic congestion, raises housing demand, and places pressure on public facilities.\""
  },
  {
    slug: "math",
    icon: "MT",
    hero: "Step-by-step Solving",
    focus: "Method check",
    bestFor: "Core working accuracy",
    resultTag: "Step precision",
    previewTag: "AI step check",
    previewWeak: "Weakness: wrong subtraction step",
    previewFix: "Upgrade: isolate x first",
    struggle: "Wrong working steps and repeated method mistakes cost marks fast.",
    aiHelps: [
      "Detect wrong steps",
      "Show the correct method",
      "Explain where you went wrong"
    ],
    improves: "Method accuracy, cleaner working, and fewer careless errors.",
    startWith: "Topic Practice",
    chips: ["Steps", "Methods", "Accuracy"],
    before: "\"2x + 4 = 10, so x = 7\"",
    after: "\"2x + 4 = 10 → 2x = 6 → x = 3\""
  },
  {
    slug: "add-math",
    icon: "AM",
    hero: "Advanced Problem Solving",
    focus: "Flow control",
    bestFor: "Harder structured solving",
    resultTag: "Method confidence",
    previewTag: "AI method flow",
    previewWeak: "Weakness: solving order breaks",
    previewFix: "Upgrade: simplify before differentiating",
    struggle: "Complex questions feel too big, and students lose track of the solving flow.",
    aiHelps: [
      "Break down complex questions",
      "Show clear solving flow",
      "Improve method and final accuracy"
    ],
    improves: "Advanced steps, flow control, and confidence in harder topics.",
    startWith: "Step Check Drill",
    chips: ["Flow", "Functions", "Precision"],
    before: "\"Differentiate first, maybe simplify later?\"",
    after: "\"Simplify the expression first, then differentiate step by step to avoid method loss.\""
  }
];

const aiActionFlow = [
  {
    step: "Question",
    body: "The student answers one short task."
  },
  {
    step: "AI detects",
    body: "The system spots the exact weak point."
  },
  {
    step: "AI explains",
    body: "Students see a better version and why it works."
  },
  {
    step: "Better answer",
    body: "The next response becomes clearer and more exam-ready."
  }
];

const sameSystemSteps = [
  "AI detects your weak point",
  "You do 1 short mission",
  "AI shows the better version",
  "You improve"
];

const subjectProgress = [
  { label: "English", value: "Writing clarity ↑" },
  { label: "Bahasa Melayu", value: "Karangan structure ↑" },
  { label: "Math", value: "Method accuracy ↑" }
];

export default function SubjectsPage() {
  const subjectMap = new Map(subjectDefinitions.map((subject) => [subject.slug, subject]));

  return (
    <main className="page-shell landing-shell subjects-page-shell">
      <section className="landing-hero subjects-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow landing-hero-chip">Six SPM subjects. One AI guide.</p>
          <h1>Master Your SPM Subjects with AI Guidance</h1>
          <p className="landing-lead">
            See exactly how AI helps you improve in English, BM, Sejarah, Geografi, Math, and Add Math.
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
              <p className="dashboard-label">What this page shows</p>
              <h3>How AI actually helps in each subject, not just a subject list.</h3>
              <p>Each lane shows the common struggle, the AI help, and the stronger answer students are aiming for.</p>
            </div>
            <img alt="Multi-subject AI learning map" className="landing-map-image" src="/landing/subjects-map.svg" />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">How AI works across the page</p>
          <h2>How AI helps you in each subject</h2>
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
          <p className="eyebrow">Subject breakdown</p>
          <h2>See what AI does in every subject lane.</h2>
        </div>
        <div className="subjects-showcase-grid">
          {subjectShowcase.map((item) => {
            const subject = subjectMap.get(item.slug);
            if (!subject) return null;
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
                    <p className="subject-showcase-hero">{item.hero}</p>
                  </div>
                  <span className="subject-showcase-icon">{item.icon}</span>
                </div>

                <div className="subject-showcase-chips">
                  {item.chips.map((chip) => (
                    <span className="subject-showcase-chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="subject-showcase-meta">
                  <span className="subject-showcase-meta-pill">
                    <strong>AI focus</strong>
                    {item.focus}
                  </span>
                  <span className="subject-showcase-meta-pill">
                    <strong>Best for</strong>
                    {item.bestFor}
                  </span>
                  <span className="subject-showcase-meta-pill is-accent">
                    <strong>Result</strong>
                    {item.resultTag}
                  </span>
                </div>

                <div className="subject-showcase-mockup">
                  <div className="subject-showcase-mockup-top">
                    <span className="dashboard-label">{item.previewTag}</span>
                    <span className="status-pill">Live preview</span>
                  </div>
                  <div className="subject-showcase-mockup-line is-weak">
                    <span>{item.previewWeak}</span>
                  </div>
                  <div className="subject-showcase-mockup-line is-fix">
                    <span>{item.previewFix}</span>
                  </div>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">The struggle</span>
                  <p>{item.struggle}</p>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">AI helps by</span>
                  <ul className="subject-showcase-list">
                    {item.aiHelps.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">You improve in</span>
                  <p>{item.improves}</p>
                </div>

                <div className="subject-showcase-compare">
                  <div className="subject-compare-panel is-before">
                    <span className="dashboard-label">Before</span>
                    <p>{item.before}</p>
                  </div>
                  <div className="subject-compare-panel is-after">
                    <span className="dashboard-label">After</span>
                    <p>{item.after}</p>
                  </div>
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
          <p className="eyebrow">AI in action</p>
          <h2>What learning with AI looks like</h2>
        </div>
        <article className="subject-ai-flow-card">
          <div className="subject-ai-flow">
            {aiActionFlow.map((item, index) => (
              <div className="subject-ai-flow-step" key={item.step}>
                <div className="subject-ai-flow-chip">{item.step}</div>
                <p>{item.body}</p>
                {index < aiActionFlow.length - 1 ? <span className="subject-ai-flow-arrow">→</span> : null}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Same system for every subject</p>
          <h2>One simple learning flow across all six.</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-4">
          {sameSystemSteps.map((step, index) => (
            <article className="landing-glass-card subject-system-card" key={step}>
              <span className="landing-icon-chip">0{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">Across-subject results</p>
          <h2>Students improve across subjects, not just one.</h2>
        </div>
        <div className="subject-progress-strip">
          {subjectProgress.map((item) => (
            <article className="subject-progress-card" key={item.label}>
              <span className="dashboard-label">{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">Start all 6 subjects with one system</p>
          <h2>Start improving all your subjects today.</h2>
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
