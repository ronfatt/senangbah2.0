import { getServerLocale } from "../../lib/server-locale";

export default async function HowItWorksPage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";

  const steps = isMalay
    ? [
        { number: "1", icon: "AI", title: "AI cari jurang anda", body: "Satu tugasan ringkas menunjukkan dengan tepat apa yang perlu anda baiki.", accent: "blue" },
        { number: "2", icon: "FX", title: "Dapat pembaikan segera", body: "Lihat titik lemah anda dan versi yang lebih baik secara sebelah-menyebelah.", accent: "purple" },
        { number: "3", icon: "GO", title: "Berlatih dengan bijak", body: "Anda membaikinya dengan jawapan lebih jelas, wording lebih kuat, atau langkah lebih kemas.", accent: "orange" },
        { number: "4", icon: "UP", title: "Lihat kemajuan sebenar", body: "Datang semula esok dan teruskan membina. Kemenangan kecil jadi keputusan besar.", accent: "green" }
      ]
    : [
        { number: "1", icon: "AI", title: "AI finds your gaps", body: "One short task reveals exactly what you need to fix.", accent: "blue" },
        { number: "2", icon: "FX", title: "Get instant fixes", body: "See the weak point and the better version side-by-side.", accent: "purple" },
        { number: "3", icon: "GO", title: "Practice smart", body: "You fix it with a clearer answer, stronger wording, or cleaner method.", accent: "orange" },
        { number: "4", icon: "UP", title: "See real progress", body: "Come back tomorrow and keep building. Small wins become better exam results.", accent: "green" }
      ];

  const dailyCards = isMalay
    ? [
        { icon: "10", title: "10-15 minit sahaja", body: "Tiada sesi belajar panjang. Hanya satu misi yang mudah untuk dimulakan." },
        { icon: "AI", title: "AI menerangkan", body: "Bukan sekadar jawapan. Anda faham kesilapan, pembetulan, dan versi lebih baik." },
        { icon: "UP", title: "Kemajuan sebenar", body: "Anda dapat melihat apa yang sudah bertambah baik dari hari ke hari." }
      ]
    : [
        { icon: "10", title: "10-15 min only", body: "No long study sessions. Just one short mission that feels easy to start." },
        { icon: "AI", title: "AI explains", body: "Not just answers. You understand the mistake, the fix, and the better version." },
        { icon: "UP", title: "Real progress", body: "You can actually see what improved from day to day." }
      ];

  const subjects = isMalay
    ? ["Bahasa Inggeris", "Bahasa Melayu", "Sejarah", "Geografi", "Matematik", "Matematik Tambahan"]
    : ["English", "Bahasa Melayu", "Sejarah", "Geografi", "Math", "Add Math"];

  const whyWorks = isMalay
    ? [
        { title: "Anda baiki kesilapan dengan segera", body: "AI menunjukkan kesilapan semasa ia masih segar, jadi pembetulan lebih mudah melekat." },
        { title: "Anda tidak membuang masa meneka", body: "Pelajar tidak perlu cuba semua benda. AI tunjuk apa yang benar-benar lemah." },
        { title: "Anda berlatih setiap hari", body: "Misi ringkas lebih mudah diulang, dan konsistensi itulah yang menukar keputusan." }
      ]
    : [
        { title: "You fix mistakes immediately", body: "AI shows the error while it is still fresh, so the correction sticks faster." },
        { title: "You don't waste time guessing", body: "Students do not have to try everything. AI points at what is actually weak." },
        { title: "You practise every day", body: "Short missions are easier to repeat, and consistency is what changes results." }
      ];

  return (
    <main className="page-shell landing-v2-shell public-detail-shell">
      <section className="public-detail-hero public-detail-hero-how">
        <div className="public-detail-copy">
          <span className="landing-v2-badge">{isMalay ? "BAGAIMANA IA BERFUNGSI" : "HOW IT WORKS"} ⚡</span>
          <h1>{isMalay ? "Cara SenangBah Berfungsi" : "How SenangBah Works"}</h1>
          <p className="public-detail-lead">
            {isMalay
              ? "Tiada teka-teki. Tiada pelajaran panjang. Hanya langkah yang jelas untuk maju setiap hari."
              : "No guessing. No long lessons. Just clear steps to improve every day."}
          </p>
          <div className="hero-actions">
            <a className="btn landing-v2-primary-btn" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
          </div>
        </div>

        <article className="public-detail-preview">
          <div className="public-detail-preview-card">
            <span className="dashboard-label">{isMalay ? "Aliran AI 14 hari" : "Your 14-day AI flow"}</span>
            <h3>{isMalay ? "Apa yang berlaku selepas anda mula" : "What actually happens after you start"}</h3>
            <div className="public-detail-preview-flow">
              <div><strong>{isMalay ? "Diagnos" : "Diagnose"}</strong><span>{isMalay ? "Cari titik lemah" : "Find the weak point"}</span></div>
              <div><strong>{isMalay ? "Latih" : "Train"}</strong><span>{isMalay ? "Satu misi ringkas" : "One short mission"}</span></div>
              <div><strong>{isMalay ? "Naik taraf" : "Upgrade"}</strong><span>{isMalay ? "Lihat versi lebih baik" : "See the better version"}</span></div>
              <div><strong>{isMalay ? "Maju" : "Improve"}</strong><span>{isMalay ? "Jejak perubahan jelas" : "Track clear improvement"}</span></div>
            </div>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-light">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "ALIRAN 14 HARI" : "14-DAY FLOW"} 🚀</span>
          <h2>{isMalay ? "Aliran pembelajaran AI anda" : "Your AI learning flow"}</h2>
          <p>{isMalay ? "Empat langkah ringkas yang sama diulang supaya pelajar tidak pernah tertanya-tanya apa yang perlu dibuat seterusnya." : "The same four simple steps repeat so students never wonder what to do next."}</p>
        </div>
        <div className="landing-v2-step-grid">
          {steps.map((step, index) => (
            <article className={`landing-v2-step-card ${step.accent}`} key={step.title}>
              <span className="landing-v2-step-number">{step.number}</span>
              <div className="landing-v2-step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {index < steps.length - 1 ? <span className="landing-v2-step-arrow">→</span> : null}
            </article>
          ))}
        </div>
        <article className="landing-v2-gradient-banner">
          <h3>{isMalay ? "Anda tamat setiap sesi dengan tahu tepat apa yang sudah bertambah baik." : "You leave every session knowing exactly what got better."}</h3>
          <p>{isMalay ? "SenangBah menunjukkan kesilapan, memberi pembaikan, dan membuka langkah seterusnya." : "SenangBah shows the mistake, gives the fix, and unlocks your next move."}</p>
          <div className="landing-v2-banner-pills">
            <span>{isMalay ? "1 misi jelas" : "1 clear mission"}</span>
            <span>{isMalay ? "AI + jawapan lebih baik" : "AI + better answer"}</span>
            <span>{isMalay ? "Langkah seterusnya terbuka" : "Next step unlocked"}</span>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-white">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "AI DALAM TINDAKAN" : "AI IN ACTION"} 🧠</span>
          <h2>{isMalay ? "Bagaimana satu jawapan menjadi lebih baik" : "What learning with AI looks like"}</h2>
        </div>
        <div className="public-flow-rail">
          <article><strong>{isMalay ? "Soalan" : "Question"}</strong><p>{isMalay ? "Pelajar jawab satu tugasan ringkas." : "The student answers one short task."}</p></article>
          <article><strong>{isMalay ? "AI mengesan" : "AI detects"}</strong><p>{isMalay ? "Sistem mengesan titik lemah yang tepat." : "The system spots the exact weak point."}</p></article>
          <article><strong>{isMalay ? "AI menerangkan" : "AI explains"}</strong><p>{isMalay ? "Pelajar melihat versi yang lebih baik dan sebab ia berkesan." : "Students see a better version and why it works."}</p></article>
          <article><strong>{isMalay ? "Jawapan lebih baik" : "Better answer"}</strong><p>{isMalay ? "Jawapan seterusnya lebih jelas dan lebih bersedia untuk peperiksaan." : "The next response becomes clearer and more exam-ready."}</p></article>
        </div>
        <div className="public-before-after-panel">
          <div className="public-before-after-card before">
            <span>{isMalay ? "SEBELUM" : "BEFORE"}</span>
            <p>I study with my friends because fun.</p>
          </div>
          <div className="public-before-after-card after">
            <span>{isMalay ? "SELEPAS" : "AFTER"}</span>
            <p>Studying with my friends keeps me motivated and improves my discipline.</p>
          </div>
        </div>
      </section>

      <section className="landing-v2-section landing-v2-cream">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "PENGALAMAN HARIAN" : "DAILY EXPERIENCE"} ☀️</span>
          <h2>{isMalay ? "Apa yang anda benar-benar buat setiap hari" : "What you actually do every day"}</h2>
        </div>
        <div className="landing-v2-card-triplet">
          {dailyCards.map((card) => (
            <article className="public-soft-card" key={card.title}>
              <span className="public-soft-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-v2-section landing-v2-white">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "SEMUA SUBJEK" : "ALL SUBJECTS"} 📚</span>
          <h2>{isMalay ? "Sistem yang sama untuk semua subjek SPM anda" : "Same simple system for every subject"}</h2>
        </div>
        <div className="public-chip-grid">
          {subjects.map((subject) => (
            <span className="public-chip-card" key={subject}>{subject}</span>
          ))}
        </div>
      </section>

      <section className="landing-v2-section landing-v2-light">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "KENAPA IA BERKESAN" : "WHY IT WORKS"} ✅</span>
          <h2>{isMalay ? "Kenapa pelajar benar-benar bertambah baik" : "Why students actually improve"}</h2>
        </div>
        <div className="landing-v2-card-triplet">
          {whyWorks.map((item) => (
            <article className="public-soft-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-v2-section landing-v2-final">
        <div className="landing-v2-final-copy">
          <span className="landing-v2-badge">{isMalay ? "MULA SEKARANG" : "START NOW"} 🚀</span>
          <h2>{isMalay ? "Mulakan misi pertama anda hari ini." : "Start your first mission today."}</h2>
          <p>{isMalay ? "Tiada tekanan. Hanya kemajuan kecil yang jelas setiap hari." : "No stress. Just clear daily progress."}</p>
          <div className="hero-actions">
            <a className="btn landing-v2-white-btn" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
          </div>
        </div>
        <article className="public-detail-side-card">
          <div className="public-detail-side-stat">
            <strong>58% → 74%</strong>
            <span>{isMalay ? "Ketepatan tatabahasa" : "Grammar accuracy"}</span>
          </div>
          <div className="public-detail-side-stat">
            <strong>+21%</strong>
            <span>{isMalay ? "Pertumbuhan kosa kata" : "Vocabulary growth"}</span>
          </div>
          <div className="public-detail-side-stat">
            <strong>3.8 → 4.6</strong>
            <span>{isMalay ? "Band semakin meningkat" : "Band progress"}</span>
          </div>
        </article>
      </section>
    </main>
  );
}
