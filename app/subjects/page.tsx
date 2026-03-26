import { subjectDefinitions } from "../../lib/subjects";
import { getServerLocale } from "../../lib/server-locale";
import { getSubjectDisplayName } from "../../lib/locale";

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

export default async function SubjectsPage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";
  const subjectMap = new Map(subjectDefinitions.map((subject) => [subject.slug, subject]));
  const aiLogicCards = isMalay
    ? [
        {
          icon: "SCAN",
          title: "AI mengesan titik lemah",
          body: "Sistem mengesan dengan tepat apa yang lemah sebelum pelajar membuang masa meneka."
        },
        {
          icon: "FIX",
          title: "AI menerangkan jawapan yang lebih baik",
          body: "Pelajar melihat versi yang lebih kuat dan faham mengapa ia mendapat markah lebih baik."
        },
        {
          icon: "NEXT",
          title: "AI beri langkah seterusnya",
          body: "Setiap subjek berakhir dengan satu tugasan jelas, bukan sekadar ingatan samar untuk belajar lebih lagi."
        }
      ]
    : [
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
  const aiActionFlow = isMalay
    ? [
        { step: "Soalan", body: "Pelajar menjawab satu tugasan ringkas." },
        { step: "AI mengesan", body: "Sistem mengesan titik lemah yang tepat." },
        { step: "AI menerangkan", body: "Pelajar melihat versi yang lebih baik dan sebab ia berkesan." },
        { step: "Jawapan lebih baik", body: "Jawapan seterusnya menjadi lebih jelas dan lebih bersedia untuk peperiksaan." }
      ]
    : [
        { step: "Question", body: "The student answers one short task." },
        { step: "AI detects", body: "The system spots the exact weak point." },
        { step: "AI explains", body: "Students see a better version and why it works." },
        { step: "Better answer", body: "The next response becomes clearer and more exam-ready." }
      ];
  const sameSystemSteps = isMalay
    ? [
        "AI mengesan titik lemah anda",
        "Anda buat 1 misi ringkas",
        "AI menunjukkan versi yang lebih baik",
        "Anda semakin maju"
      ]
    : [
        "AI detects your weak point",
        "You do 1 short mission",
        "AI shows the better version",
        "You improve"
      ];
  const subjectProgress = isMalay
    ? [
        { label: "Bahasa Inggeris", value: "Kejelasan penulisan ↑" },
        { label: "Bahasa Melayu", value: "Struktur karangan ↑" },
        { label: "Matematik", value: "Ketepatan kaedah ↑" }
      ]
    : [
        { label: "English", value: "Writing clarity ↑" },
        { label: "Bahasa Melayu", value: "Karangan structure ↑" },
        { label: "Math", value: "Method accuracy ↑" }
      ];

  return (
    <main className="page-shell landing-shell subjects-page-shell">
      <section className="landing-hero subjects-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow landing-hero-chip">{isMalay ? "Enam subjek SPM. Satu panduan AI." : "Six SPM subjects. One AI guide."}</p>
          <h1>{isMalay ? "Kuasai Subjek SPM Anda dengan Bimbingan AI" : "Master Your SPM Subjects with AI Guidance"}</h1>
          <p className="landing-lead">
            {isMalay ? "Lihat dengan tepat bagaimana AI membantu anda maju dalam Bahasa Inggeris, BM, Sejarah, Geografi, Matematik, dan Matematik Tambahan." : "See exactly how AI helps you improve in English, BM, Sejarah, Geografi, Math, and Add Math."}
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
            <a className="btn btn-secondary" href="/how-it-works">
              {isMalay ? "Lihat Cara Ia Berfungsi" : "See How It Works"}
            </a>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="landing-map-card subjects-hero-map">
            <div className="landing-map-copy">
              <p className="dashboard-label">{isMalay ? "Apa yang halaman ini tunjukkan" : "What this page shows"}</p>
              <h3>{isMalay ? "Bagaimana AI benar-benar membantu dalam setiap subjek, bukan sekadar senarai subjek." : "How AI actually helps in each subject, not just a subject list."}</h3>
              <p>{isMalay ? "Setiap laluan menunjukkan cabaran biasa, bantuan AI, dan jawapan yang lebih kuat yang disasarkan oleh pelajar." : "Each lane shows the common struggle, the AI help, and the stronger answer students are aiming for."}</p>
            </div>
            <img alt="Multi-subject AI learning map" className="landing-map-image" src="/landing/subjects-map.svg" />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Bagaimana AI berfungsi di halaman ini" : "How AI works across the page"}</p>
          <h2>{isMalay ? "Bagaimana AI membantu anda dalam setiap subjek" : "How AI helps you in each subject"}</h2>
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
          <p className="eyebrow">{isMalay ? "Pecahan subjek" : "Subject breakdown"}</p>
          <h2>{isMalay ? "Lihat apa yang AI lakukan dalam setiap laluan subjek." : "See what AI does in every subject lane."}</h2>
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
                    <p className="subject-status">
                      {isMalay
                        ? subject.group === "Languages"
                          ? "Bahasa"
                          : subject.group === "Humanities"
                            ? "Kemanusiaan"
                            : "Matematik"
                        : subject.group}
                    </p>
                    <h3>{getSubjectDisplayName(subject.name, locale)}</h3>
                    <p className="subject-showcase-hero">
                      {isMalay
                        ? item.slug === "english"
                          ? "Tingkatkan Penulisan & Tatabahasa"
                          : item.slug === "bahasa-melayu"
                            ? "Karangan & Struktur Ayat"
                            : item.slug === "sejarah"
                              ? "Menjawab & Huraian"
                              : item.slug === "geografi"
                                ? "Konsep & Penerangan"
                                : item.slug === "math"
                                  ? "Penyelesaian Langkah demi Langkah"
                                  : "Penyelesaian Masalah Lanjutan"
                        : item.hero}
                    </p>
                  </div>
                  <span className="subject-showcase-icon">{item.icon}</span>
                </div>

                <div className="subject-showcase-chips">
                  {(isMalay
                    ? item.slug === "english"
                      ? ["Penulisan", "Tatabahasa", "Kosa kata"]
                      : item.slug === "bahasa-melayu"
                        ? ["Karangan", "Tatabahasa", "Pemahaman"]
                        : item.slug === "sejarah"
                          ? ["Garis masa", "Sumber", "KBAT"]
                          : item.slug === "geografi"
                            ? ["Konsep", "Data", "Jawapan ringkas"]
                            : item.slug === "math"
                              ? ["Langkah", "Kaedah", "Ketepatan"]
                              : ["Aliran", "Fungsi", "Ketepatan"]
                    : item.chips
                  ).map((chip) => (
                    <span className="subject-showcase-chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="subject-showcase-meta">
                  <span className="subject-showcase-meta-pill">
                    <strong>{isMalay ? "Fokus AI" : "AI focus"}</strong>
                      {isMalay
                        ? item.slug === "english"
                          ? "Naik taraf ayat"
                          : item.slug === "bahasa-melayu"
                            ? "Ayat + huraian"
                            : item.slug === "sejarah"
                              ? "Fakta + huraian"
                              : item.slug === "geografi"
                                ? "Konsep + data"
                                : item.slug === "math"
                                  ? "Semak kaedah"
                                  : "Kawal aliran penyelesaian"
                        : item.focus}
                  </span>
                  <span className="subject-showcase-meta-pill">
                    <strong>{isMalay ? "Paling sesuai" : "Best for"}</strong>
                      {isMalay
                        ? item.slug === "english"
                          ? "Esei + penulisan CEFR"
                          : item.slug === "bahasa-melayu"
                            ? "Karangan + pemahaman"
                            : item.slug === "sejarah"
                              ? "KBAT + jawapan sumber"
                              : item.slug === "geografi"
                                ? "Jawapan struktur"
                                : item.slug === "math"
                                  ? "Ketepatan langkah asas"
                                  : "Penyelesaian lebih sukar"
                        : item.bestFor}
                  </span>
                  <span className="subject-showcase-meta-pill is-accent">
                    <strong>{isMalay ? "Hasil" : "Result"}</strong>
                    {isMalay
                      ? item.slug === "english"
                        ? "Peningkatan band"
                        : item.slug === "bahasa-melayu"
                          ? "Kelancaran bahasa"
                          : item.slug === "sejarah"
                            ? "Logik jawapan"
                            : item.slug === "geografi"
                              ? "Penerangan jelas"
                              : item.slug === "math"
                                ? "Ketepatan langkah"
                                : "Keyakinan kaedah"
                      : item.resultTag}
                  </span>
                </div>

                <div className="subject-showcase-mockup">
                  <div className="subject-showcase-mockup-top">
                    <span className="dashboard-label">
                      {isMalay
                        ? item.slug === "english"
                          ? "Semakan penulisan AI"
                          : item.slug === "bahasa-melayu"
                            ? "Jurulatih karangan AI"
                            : item.slug === "sejarah"
                              ? "Pembina jawapan AI"
                              : item.slug === "geografi"
                                ? "Sokongan konsep AI"
                                : item.slug === "math"
                                  ? "Semakan langkah AI"
                                  : "Aliran kaedah AI"
                        : item.previewTag}
                    </span>
                    <span className="status-pill">{isMalay ? "Pratonton langsung" : "Live preview"}</span>
                  </div>
                  <div className="subject-showcase-mockup-line is-weak">
                    <span>
                      {isMalay
                        ? item.slug === "english"
                          ? "Kelemahan: ayat terlalu asas"
                          : item.slug === "bahasa-melayu"
                            ? "Kelemahan: ayat terlalu ringkas"
                            : item.slug === "sejarah"
                              ? "Kelemahan: fakta tanpa huraian"
                              : item.slug === "geografi"
                                ? "Kelemahan: jawapan terlalu umum"
                                : item.slug === "math"
                                  ? "Kelemahan: langkah tolak salah"
                                  : "Kelemahan: urutan penyelesaian terputus"
                        : item.previewWeak}
                    </span>
                  </div>
                  <div className="subject-showcase-mockup-line is-fix">
                    <span>
                      {isMalay
                        ? item.slug === "english"
                          ? "Naik taraf: tambah tense + sebab yang lebih jelas"
                          : item.slug === "bahasa-melayu"
                            ? "Naik taraf: huraian lebih matang"
                            : item.slug === "sejarah"
                              ? "Naik taraf: tambah sebab + kesan"
                              : item.slug === "geografi"
                                ? "Naik taraf: guna konsep lebih tepat"
                                : item.slug === "math"
                                  ? "Naik taraf: asingkan x dahulu"
                                  : "Naik taraf: ringkaskan sebelum membeza"
                        : item.previewFix}
                    </span>
                  </div>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">{isMalay ? "Cabarannya" : "The struggle"}</span>
                  <p>
                    {isMalay
                      ? item.slug === "english"
                        ? "Ayat lemah, idea tidak jelas, dan kosa kata yang kedengaran terlalu asas."
                        : item.slug === "bahasa-melayu"
                          ? "Ayat lemah, idea karangan kurang matang, dan struktur jawapan tidak kemas."
                          : item.slug === "sejarah"
                            ? "Pelajar tahu topik, tetapi jawapan masih terlalu pendek dan terlalu umum."
                            : item.slug === "geografi"
                              ? "Konsep terasa kabur dan jawapan kedengaran terlalu umum."
                              : item.slug === "math"
                                ? "Langkah kerja yang salah dan kesilapan kaedah yang berulang cepat menyebabkan kehilangan markah."
                                : "Soalan kompleks terasa terlalu besar, dan pelajar hilang jejak aliran penyelesaian."
                      : item.struggle}
                  </p>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">{isMalay ? "AI membantu dengan" : "AI helps by"}</span>
                  <ul className="subject-showcase-list">
                    {(isMalay
                      ? item.slug === "english"
                        ? ["Baiki ayat lemah dengan segera", "Dapatkan versi ayat yang lebih baik", "Belajar menyampaikan idea dengan jelas"]
                        : item.slug === "bahasa-melayu"
                          ? ["Betulkan ayat lemah", "Perbaiki idea karangan", "Gunakan ayat yang lebih matang"]
                          : item.slug === "sejarah"
                            ? ["Fahami kehendak soalan", "Susun jawapan dengan lebih jelas", "Gunakan fakta dan huraian dengan aliran yang lebih baik"]
                            : item.slug === "geografi"
                              ? ["Fahami konsep utama dengan jelas", "Jawab struktur soalan dengan tepat", "Elakkan jawapan yang kabur"]
                              : item.slug === "math"
                                ? ["Kesan langkah yang salah", "Tunjukkan kaedah yang betul", "Terangkan di mana anda silap"]
                                : ["Pecahkan soalan kompleks", "Tunjukkan aliran penyelesaian yang jelas", "Tingkatkan kaedah dan ketepatan akhir"]
                      : item.aiHelps
                    ).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="subject-showcase-block">
                  <span className="dashboard-label">{isMalay ? "Anda maju dalam" : "You improve in"}</span>
                  <p>
                    {isMalay
                      ? item.slug === "english"
                        ? "Esei, kawalan tatabahasa, dan kemajuan band."
                        : item.slug === "bahasa-melayu"
                          ? "Aliran karangan, tatabahasa, dan keyakinan pemahaman."
                          : item.slug === "sejarah"
                            ? "Jawapan sumber, logik KBAT, dan huraian yang lebih kuat."
                            : item.slug === "geografi"
                              ? "Ingatan konsep, bacaan data, dan jawapan berstruktur yang lebih jelas."
                              : item.slug === "math"
                                ? "Ketepatan kaedah, kerja yang lebih kemas, dan kurang kesilapan cuai."
                                : "Langkah lanjutan, kawalan aliran, dan keyakinan dalam topik yang lebih sukar."
                      : item.improves}
                  </p>
                </div>

                <div className="subject-showcase-compare">
                  <div className="subject-compare-panel is-before">
                    <span className="dashboard-label">{isMalay ? "Sebelum" : "Before"}</span>
                    <p>{item.before}</p>
                  </div>
                  <div className="subject-compare-panel is-after">
                    <span className="dashboard-label">{isMalay ? "Selepas" : "After"}</span>
                    <p>{item.after}</p>
                  </div>
                </div>

                <div className="subject-showcase-footer">
                  <div>
                    <span className="dashboard-label">{isMalay ? "Mula dengan" : "Start with"}</span>
                    <strong>
                      {isMalay
                        ? item.slug === "english"
                          ? "Writing Coach"
                          : item.slug === "bahasa-melayu"
                            ? "Tatabahasa"
                            : item.slug === "sejarah"
                              ? "Timeline Recall"
                              : item.slug === "geografi"
                                ? "Map and Data Drill"
                                : item.slug === "math"
                                  ? "Topic Practice"
                                  : "Step Check Drill"
                        : item.startWith}
                    </strong>
                  </div>
                  <a className="btn btn-secondary" href={`/subjects/${subject.slug}`}>
                    {isMalay ? `Buka ${getSubjectDisplayName(subject.name, locale)}` : `Open ${subject.name}`}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "AI sedang bertindak" : "AI in action"}</p>
          <h2>{isMalay ? "Bagaimana pembelajaran dengan AI kelihatan" : "What learning with AI looks like"}</h2>
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
          <p className="eyebrow">{isMalay ? "Sistem yang sama untuk setiap subjek" : "Same system for every subject"}</p>
          <h2>{isMalay ? "Satu aliran pembelajaran mudah merentas keenam-enam subjek." : "One simple learning flow across all six."}</h2>
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
          <p className="eyebrow">{isMalay ? "Hasil merentas subjek" : "Across-subject results"}</p>
          <h2>{isMalay ? "Pelajar maju merentas subjek, bukan hanya satu." : "Students improve across subjects, not just one."}</h2>
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
          <p className="eyebrow">{isMalay ? "Mulakan semua 6 subjek dengan satu sistem" : "Start all 6 subjects with one system"}</p>
          <h2>{isMalay ? "Mulakan peningkatan semua subjek anda hari ini." : "Start improving all your subjects today."}</h2>
          <p className="landing-lead">
            {isMalay ? "SenangBah mengekalkan logik misi yang sama jelas, maklum balas AI, dan penjejakan kemajuan dalam setiap laluan subjek." : "SenangBah keeps the same clear mission logic, AI feedback, and progress tracking across every subject lane."}
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
