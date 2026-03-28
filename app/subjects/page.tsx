import { getServerLocale } from "../../lib/server-locale";

const subjectCards = {
  en: [
    {
      title: "English",
      icon: "EN",
      accent: "blue",
      struggle: "Weak grammar, unclear ideas, and basic vocabulary.",
      helps: "Fix weak sentences, upgrade wording, and explain why the better version works.",
      result: "Clearer writing and stronger band progress.",
      before: "\"I go school because important\"",
      after: "\"I go to school because it is important for my future.\""
    },
    {
      title: "Bahasa Melayu",
      icon: "BM",
      accent: "green",
      struggle: "Ayat lemah, idea karangan tidak matang, struktur kurang kemas.",
      helps: "Betulkan ayat lemah, perbaiki idea karangan, dan gunakan ayat lebih matang.",
      result: "Karangan lebih jelas dan pemahaman lebih yakin.",
      before: "\"Faedah bersukan ialah badan sihat dan kita gembira.\"",
      after: "\"Antara faedah bersukan ialah meningkatkan kesihatan fizikal serta membentuk disiplin diri yang lebih baik.\""
    },
    {
      title: "Sejarah",
      icon: "SJ",
      accent: "peach",
      struggle: "Students know the topic, but answers stay too short and vague.",
      helps: "Show what the question needs, how to structure the answer, and how to connect fakta + huraian.",
      result: "Stronger source answers and clearer KBAT logic.",
      before: "\"British came and changed things\"",
      after: "\"The British introduced administrative reforms which significantly impacted local governance.\""
    },
    {
      title: "Geografi",
      icon: "GG",
      accent: "pink",
      struggle: "Concepts feel fuzzy and answers sound too general.",
      helps: "Clarify key konsep, tighten structure, and avoid vague answers.",
      result: "Sharper explanations and more confident short answers.",
      before: "\"Urbanisation causes many problems\"",
      after: "\"Urbanisation increases traffic congestion, raises housing demand, and places pressure on public facilities.\""
    },
    {
      title: "Math",
      icon: "MT",
      accent: "indigo",
      struggle: "Wrong steps and repeated method mistakes cost marks fast.",
      helps: "Detect the wrong step, show the correct method, and explain where the working breaks.",
      result: "Cleaner solutions and fewer careless errors.",
      before: "\"2x + 4 = 10, so x = 7\"",
      after: "\"2x + 4 = 10 → 2x = 6 → x = 3\""
    },
    {
      title: "Add Math",
      icon: "AM",
      accent: "lavender",
      struggle: "Complex questions feel too big and students lose the solving flow.",
      helps: "Break the question down, show the method flow, and improve final accuracy.",
      result: "More control in harder topics and stronger method confidence.",
      before: "\"Differentiate first, maybe simplify later?\"",
      after: "\"Simplify the expression first, then differentiate step by step to avoid method loss.\""
    }
  ],
  ms: [
    {
      title: "Bahasa Inggeris",
      icon: "EN",
      accent: "blue",
      struggle: "Tatabahasa lemah, idea kurang jelas, dan kosa kata terlalu asas.",
      helps: "Baiki ayat lemah, naik taraf wording, dan terangkan kenapa versi lebih baik itu berkesan.",
      result: "Penulisan lebih jelas dan kemajuan band yang lebih kuat.",
      before: "\"I go school because important\"",
      after: "\"I go to school because it is important for my future.\""
    },
    {
      title: "Bahasa Melayu",
      icon: "BM",
      accent: "green",
      struggle: "Ayat lemah, idea karangan tidak matang, struktur kurang kemas.",
      helps: "Betulkan ayat lemah, perbaiki idea karangan, dan gunakan ayat lebih matang.",
      result: "Karangan lebih jelas dan pemahaman lebih yakin.",
      before: "\"Faedah bersukan ialah badan sihat dan kita gembira.\"",
      after: "\"Antara faedah bersukan ialah meningkatkan kesihatan fizikal serta membentuk disiplin diri yang lebih baik.\""
    },
    {
      title: "Sejarah",
      icon: "SJ",
      accent: "peach",
      struggle: "Pelajar tahu topik, tetapi jawapan masih terlalu pendek dan kabur.",
      helps: "Tunjuk kehendak soalan, susunan jawapan, dan cara sambungkan fakta + huraian.",
      result: "Jawapan sumber lebih kuat dan logik KBAT lebih jelas.",
      before: "\"British came and changed things\"",
      after: "\"The British introduced administrative reforms which significantly impacted local governance.\""
    },
    {
      title: "Geografi",
      icon: "GG",
      accent: "pink",
      struggle: "Konsep terasa kabur dan jawapan terlalu umum.",
      helps: "Jelaskan konsep utama, kemaskan struktur, dan elak jawapan yang terlalu vague.",
      result: "Penerangan lebih tepat dan jawapan ringkas lebih yakin.",
      before: "\"Urbanisation causes many problems\"",
      after: "\"Urbanisation increases traffic congestion, raises housing demand, and places pressure on public facilities.\""
    },
    {
      title: "Matematik",
      icon: "MT",
      accent: "indigo",
      struggle: "Langkah salah dan kesilapan kaedah menyebabkan markah hilang dengan cepat.",
      helps: "Kesan langkah salah, tunjuk kaedah yang betul, dan jelaskan di mana working mula rosak.",
      result: "Penyelesaian lebih kemas dan kurang careless mistakes.",
      before: "\"2x + 4 = 10, so x = 7\"",
      after: "\"2x + 4 = 10 → 2x = 6 → x = 3\""
    },
    {
      title: "Matematik Tambahan",
      icon: "AM",
      accent: "lavender",
      struggle: "Soalan kompleks terasa terlalu besar dan pelajar hilang aliran penyelesaian.",
      helps: "Pecahkan soalan, tunjuk aliran kaedah, dan baiki ketepatan akhir.",
      result: "Lebih terkawal dalam topik sukar dan lebih yakin dengan kaedah.",
      before: "\"Differentiate first, maybe simplify later?\"",
      after: "\"Simplify the expression first, then differentiate step by step to avoid method loss.\""
    }
  ]
} as const;

export default async function SubjectsPage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";
  const cards = subjectCards[locale];

  return (
    <main className="page-shell landing-v2-shell public-detail-shell">
      <section className="public-detail-hero public-detail-hero-subjects">
        <div className="public-detail-copy">
          <span className="landing-v2-badge">{isMalay ? "SUBJEK + AI" : "SUBJECTS + AI"} 📚</span>
          <h1>{isMalay ? "Kuasai Subjek SPM Anda dengan Bimbingan AI" : "Master Your SPM Subjects with AI Guidance"}</h1>
          <p className="public-detail-lead">
            {isMalay
              ? "Lihat bagaimana AI membantu anda bertambah baik dalam Bahasa Inggeris, BM, Sejarah, Geografi, Matematik, dan Matematik Tambahan."
              : "See exactly how AI helps you improve in English, BM, Sejarah, Geografi, Math, and Add Math."}
          </p>
          <div className="hero-actions">
            <a className="btn landing-v2-primary-btn" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
            <a className="btn landing-v2-secondary-btn" href="/how-it-works">
              {isMalay ? "Lihat Cara Ia Berfungsi" : "See How It Works"}
            </a>
          </div>
        </div>
        <article className="public-detail-preview">
          <div className="public-detail-preview-card">
            <span className="dashboard-label">{isMalay ? "Apa yang AI buat" : "What AI actually does"}</span>
            <h3>{isMalay ? "Setiap subjek dapat sistem yang sama, tetapi pembaikan yang khusus." : "Every subject gets the same system, but subject-specific improvement."}</h3>
            <div className="public-detail-preview-flow">
              <div><strong>{isMalay ? "Kesan" : "Detect"}</strong><span>{isMalay ? "Cari bahagian lemah" : "Find the weak point"}</span></div>
              <div><strong>{isMalay ? "Terang" : "Explain"}</strong><span>{isMalay ? "Tunjuk versi lebih baik" : "Show the better version"}</span></div>
              <div><strong>{isMalay ? "Baiki" : "Fix"}</strong><span>{isMalay ? "Bina jawapan lebih kuat" : "Build a stronger answer"}</span></div>
              <div><strong>{isMalay ? "Maju" : "Improve"}</strong><span>{isMalay ? "Jejak kemajuan" : "Track progress"}</span></div>
            </div>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-light">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "BAGAIMANA AI MEMBANTU" : "HOW AI HELPS"} 🧠</span>
          <h2>{isMalay ? "Lihat apa yang AI lakukan dalam setiap subjek" : "How AI helps you in each subject"}</h2>
        </div>
        <div className="public-subject-grid">
          {cards.map((card) => (
            <article className={`public-subject-card ${card.accent}`} key={card.title}>
              <div className="public-subject-head">
                <div className="public-subject-icon">{card.icon}</div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.struggle}</p>
                </div>
              </div>
              <div className="public-subject-body">
                <div>
                  <span>{isMalay ? "AI membantu dengan" : "AI helps by"}</span>
                  <p>{card.helps}</p>
                </div>
                <div>
                  <span>{isMalay ? "Anda bertambah baik dalam" : "You improve in"}</span>
                  <p>{card.result}</p>
                </div>
              </div>
              <div className="public-subject-compare">
                <div className="before">
                  <small>{isMalay ? "SEBELUM" : "BEFORE"}</small>
                  <p>{card.before}</p>
                </div>
                <div className="after">
                  <small>{isMalay ? "SELEPAS" : "AFTER"}</small>
                  <p>{card.after}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-v2-section landing-v2-white">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "AI DALAM TINDAKAN" : "AI IN ACTION"} ⚡</span>
          <h2>{isMalay ? "Bagaimana pembelajaran dengan AI kelihatan" : "What learning with AI looks like"}</h2>
        </div>
        <div className="public-flow-rail">
          <article><strong>{isMalay ? "Soalan" : "Question"}</strong><p>{isMalay ? "Pelajar jawab satu tugasan." : "The student answers one short task."}</p></article>
          <article><strong>{isMalay ? "AI mengesan" : "AI detects"}</strong><p>{isMalay ? "Sistem mengesan jurang sebenar." : "The system spots the real weak point."}</p></article>
          <article><strong>{isMalay ? "AI menerangkan" : "AI explains"}</strong><p>{isMalay ? "AI tunjuk kenapa jawapan itu lemah dan bagaimana membaikinya." : "AI shows why the answer is weak and how to fix it."}</p></article>
          <article><strong>{isMalay ? "Jawapan lebih baik" : "Better answer"}</strong><p>{isMalay ? "Pelajar bina jawapan yang lebih kuat dan lebih jelas." : "The student builds a stronger and clearer answer."}</p></article>
        </div>
      </section>

      <section className="landing-v2-section landing-v2-cream">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "LOGIK YANG SAMA" : "SAME SIMPLE SYSTEM"} 🔁</span>
          <h2>{isMalay ? "Sistem mudah yang sama untuk semua subjek" : "Same simple system for every subject"}</h2>
        </div>
        <div className="landing-v2-card-triplet">
          <article className="public-soft-card">
            <h3>{isMalay ? "AI mengesan titik lemah anda" : "AI detects your weak point"}</h3>
            <p>{isMalay ? "Setiap subjek bermula dengan mengenal pasti apa yang sebenarnya lemah." : "Every subject begins by identifying what is actually weak."}</p>
          </article>
          <article className="public-soft-card">
            <h3>{isMalay ? "Anda buat 1 misi ringkas" : "You do 1 short mission"}</h3>
            <p>{isMalay ? "Belajar kekal ringan, jelas, dan mudah diulang setiap hari." : "Learning stays light, clear, and easy to repeat daily."}</p>
          </article>
          <article className="public-soft-card">
            <h3>{isMalay ? "AI tunjuk versi lebih baik" : "AI shows the better version"}</h3>
            <p>{isMalay ? "Pelajar nampak pembaikan secara nyata, bukan sekadar tahu betul atau salah." : "Students see the improvement clearly, not just right or wrong."}</p>
          </article>
        </div>
      </section>

      <section className="landing-v2-section landing-v2-light">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "KEMAJUAN MERENTAS SUBJEK" : "CROSS-SUBJECT RESULTS"} 📈</span>
          <h2>{isMalay ? "Pelajar maju merentas subjek, bukan hanya satu" : "Students improve across subjects, not just one"}</h2>
        </div>
        <article className="landing-v2-stats-banner">
          <h3>{isMalay ? "Kemajuan yang boleh dilihat oleh pelajar dan ibu bapa" : "Progress students and parents can actually see"}</h3>
          <div className="landing-v2-stats-grid">
            <div><strong>English ↑</strong><span>{isMalay ? "Kejelasan penulisan dan band" : "Writing clarity and band progress"}</span></div>
            <div><strong>BM ↑</strong><span>{isMalay ? "Struktur karangan dan ayat" : "Karangan structure and sentence quality"}</span></div>
            <div><strong>Math ↑</strong><span>{isMalay ? "Ketepatan kaedah dan langkah" : "Method accuracy and cleaner working"}</span></div>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-final">
        <div className="landing-v2-final-copy">
          <span className="landing-v2-badge">{isMalay ? "MULA HARI INI" : "START TODAY"} 🚀</span>
          <h2>{isMalay ? "Mula tingkatkan semua subjek anda hari ini." : "Start improving all your subjects today"}</h2>
          <p>{isMalay ? "Buka satu sistem yang jelas untuk keenam-enam subjek SPM anda." : "Unlock one clear system for all your SPM subjects."}</p>
          <div className="hero-actions">
            <a className="btn landing-v2-white-btn" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
          </div>
        </div>
        <article className="public-detail-side-card">
          <div className="public-detail-side-stat">
            <strong>6</strong>
            <span>{isMalay ? "laluan subjek" : "subject lanes"}</span>
          </div>
          <div className="public-detail-side-stat">
            <strong>AI</strong>
            <span>{isMalay ? "bimbingan dalam setiap subjek" : "guidance in every subject"}</span>
          </div>
          <div className="public-detail-side-stat">
            <strong>1</strong>
            <span>{isMalay ? "sistem harian yang jelas" : "clear daily system"}</span>
          </div>
        </article>
      </section>
    </main>
  );
}
