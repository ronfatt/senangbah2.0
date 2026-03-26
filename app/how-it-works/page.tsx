import { getServerLocale } from "../../lib/server-locale";

const flowSteps = {
  en: [
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
  ],
  ms: [
    {
      step: "01",
      label: "Diagnos",
      icon: "AI",
      title: "AI mencari dengan tepat di mana kelemahan anda.",
      body: "SenangBah membaca penulisan atau jawapan anda dan menonjolkan isu itu sebelum anda membuang lebih banyak masa mengulanginya.",
      points: ["Isu tatabahasa", "Idea lemah", "Kosa kata asas"],
      tone: "diagnose"
    },
    {
      step: "02",
      label: "Latih",
      icon: "GO",
      title: "Anda dapat 1 misi ringkas setiap hari.",
      body: "Setiap misi adalah ringkas, jelas, dan direka untuk muat dalam hari persekolahan yang sebenar.",
      points: ["Baiki 1 ayat", "Perbaiki 1 idea", "Guna 1 perkataan lebih baik"],
      tone: "train"
    },
    {
      step: "03",
      label: "Naik taraf",
      icon: "UP",
      title: "AI menunjukkan versi yang lebih baik.",
      body: "Anda lihat jawapan lemah, jawapan yang lebih kuat, dan sebab kenapa peningkatan itu berkesan.",
      points: ["Sebelum → Selepas", "Penerangan jelas", "Tindakan seterusnya"],
      tone: "upgrade"
    },
    {
      step: "04",
      label: "Maju",
      icon: "OK",
      title: "Anda bina kemahiran sebenar dari semasa ke semasa.",
      body: "Misi harian terkumpul menjadi penulisan lebih kuat, jawapan lebih jelas, kaedah lebih baik, dan keyakinan lebih tinggi.",
      points: ["Band 4 → 5", "Bar kemajuan", "Streak + kemenangan harian"],
      tone: "improve"
    }
  ]
} as const;

export default async function HowItWorksPage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";
  const currentFlowSteps = flowSteps[locale];
  const dailyCards = isMalay
    ? [
        {
          icon: "10",
          title: "10-15 minit sahaja",
          body: "Tiada sesi belajar yang panjang. Hanya satu misi ringkas yang mudah untuk dimulakan."
        },
        {
          icon: "AI",
          title: "AI menerangkan",
          body: "Bukan sekadar jawapan. Anda faham kesilapan, pembetulan, dan versi yang lebih baik."
        },
        {
          icon: "UP",
          title: "Kemajuan sebenar",
          body: "Anda benar-benar dapat melihat apa yang bertambah baik, bukan sekadar berharap ia berkesan."
        }
      ]
    : [
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
  const subjects = isMalay
    ? ["Bahasa Inggeris", "Bahasa Melayu", "Sejarah", "Geografi", "Matematik", "Matematik Tambahan"]
    : ["English", "Bahasa Melayu", "Sejarah", "Geografi", "Math", "Add Math"];
  const whyWorks = isMalay
    ? [
        {
          title: "Anda membaiki kesilapan dengan segera",
          body: "Kesilapan itu masih segar, pembetulan jelas, dan versi yang lebih baik muncul serta-merta.",
          icon: "FX"
        },
        {
          title: "Anda tidak membuang masa meneka",
          body: "AI menunjukkan bahagian lemah yang tepat, jadi pelajar tidak membazir tenaga pada perkara yang salah.",
          icon: "AI"
        },
        {
          title: "Anda berlatih setiap hari",
          body: "Misi ringkas lebih mudah diulang, dan konsistensi itulah yang mengubah keputusan dari masa ke masa.",
          icon: "DAY"
        }
      ]
    : [
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
  return (
    <main className="page-shell landing-shell how-shell">
      <section className="landing-hero how-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow landing-hero-chip">{isMalay ? "Apa yang sebenarnya berlaku selepas anda mula" : "What actually happens after you start"}</p>
          <h1>{isMalay ? "Cara SenangBah Berfungsi" : "How SenangBah Works"}</h1>
          <p className="landing-lead">
            {isMalay ? "Tiada teka-teki. Tiada pelajaran panjang. Hanya langkah jelas untuk maju setiap hari." : "No guessing. No long lessons. Just clear steps to improve every day."}
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="mission-mockup mission-mockup-conversion">
            <div className="mission-mockup-head">
              <div>
                <p className="dashboard-label">{isMalay ? "Aliran AI 14 hari" : "14-day AI flow"}</p>
                <strong className="mission-mockup-title">{isMalay ? "Satu kitaran jelas, setiap hari" : "One clear loop, every day"}</strong>
              </div>
              <span className="mission-day-badge">{isMalay ? "Mudah" : "Simple"}</span>
            </div>
            <div className="hero-mission-list">
              <div className="hero-mission-item is-complete">
                <strong>{isMalay ? "1. Diagnos" : "1. Diagnose"}</strong>
                <span>{isMalay ? "Cari titik lemah dahulu" : "Find the weak point first"}</span>
              </div>
              <div className="hero-mission-item is-active">
                <strong>{isMalay ? "2. Latih" : "2. Train"}</strong>
                <span>{isMalay ? "Buat satu misi ringkas" : "Do one short mission"}</span>
              </div>
              <div className="hero-mission-item">
                <strong>{isMalay ? "3. Naik taraf" : "3. Upgrade"}</strong>
                <span>{isMalay ? "Lihat jawapan yang lebih baik" : "See the better answer"}</span>
              </div>
              <div className="hero-mission-item">
                <strong>{isMalay ? "4. Maju" : "4. Improve"}</strong>
                <span>{isMalay ? "Jejak hasil dengan jelas" : "Track the result clearly"}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Aliran belajar 14 hari" : "14-day learning flow"}</p>
          <h2>{isMalay ? "Aliran Pembelajaran AI 14 Hari Anda" : "Your 14-Day AI Learning Flow"}</h2>
        </div>
        <div className="how-flow-intro-visual">
          <article className="landing-visual-card landing-visual-card-wide">
            <div className="landing-visual-copy">
              <p className="dashboard-label">{isMalay ? "Lihat kitaran dengan jelas" : "See the loop clearly"}</p>
              <h3>{isMalay ? "Setiap misi mengikuti rentak mudah yang sama." : "Every mission follows the same easy rhythm."}</h3>
              <p>{isMalay ? "Pelajar tidak perlu meneka apa yang datang seterusnya. Diagnos, latih, naik taraf, maju." : "Students do not have to guess what comes next. Diagnose, train, upgrade, improve."}</p>
            </div>
            <img alt="AI flow illustration showing learning progression" className="landing-visual-image how-float-visual" src="/landing/ai-wave.svg" />
          </article>
        </div>
        <div className="how-flow-grid">
          {currentFlowSteps.map((item) => (
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
          <p className="eyebrow">{isMalay ? "Contoh sebenar" : "Real example"}</p>
          <h2>{isMalay ? "Bagaimana rupanya dalam situasi sebenar" : "What this looks like in real life"}</h2>
        </div>
        <div className="how-example-grid">
          <article className="before-after-card before-after-card-featured">
            <div>
              <p className="dashboard-label">{isMalay ? "Sebelum" : "Before"}</p>
              <p className="before-copy">I study with my friends because fun.</p>
            </div>
            <div className="before-after-arrow">→</div>
            <div>
              <p className="dashboard-label">{isMalay ? "Selepas" : "After"}</p>
              <p className="after-copy">Studying with my friends keeps me motivated and improves my discipline.</p>
            </div>
          </article>
          <article className="how-example-note">
            <p className="dashboard-label">{isMalay ? "Penerangan AI" : "AI explanation"}</p>
            <h3>{isMalay ? "Kenapa versi kedua lebih baik" : "Why the second version is better"}</h3>
            <p>{isMalay ? "Ia menggunakan subjek yang lebih jelas, kata kerja yang lebih kuat, dan penghubung yang lebih semula jadi. Inilah jenis pembaikan yang benar-benar boleh dipelajari oleh pelajar." : "It uses a clearer subject, a stronger verb, and a more natural connector. That is the kind of fix students can actually learn from."}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Pengalaman harian" : "Daily experience"}</p>
          <h2>{isMalay ? "Apa yang anda benar-benar buat setiap hari" : "What you actually do every day"}</h2>
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
          <p className="eyebrow">{isMalay ? "Subjek" : "Subjects"}</p>
          <h2>{isMalay ? "Berfungsi merentas semua subjek SPM anda" : "Works across all your SPM subjects"}</h2>
        </div>
        <div className="how-subject-grid">
          {subjects.map((subject) => (
            <article className="landing-tool-card how-subject-card" key={subject}>
              <p className="dashboard-label">{isMalay ? "Laluan subjek" : "Subject lane"}</p>
              <h3>{subject}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Kemajuan" : "Progress"}</p>
          <h2>{isMalay ? "Jejak peningkatan anda dengan jelas" : "Track your improvement clearly"}</h2>
        </div>
        <div className="progress-preview-rich how-progress-rich">
          <div className="progress-metric-grid how-progress-grid">
            <div className="progress-metric">
              <span className="dashboard-label">{isMalay ? "Tatabahasa %" : "Grammar %"}</span>
              <strong>58% → 74%</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">{isMalay ? "Peningkatan kosa kata" : "Vocab growth"}</span>
              <strong>+21%</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">{isMalay ? "Skor band" : "Band score"}</span>
              <strong>3.8 → 4.6</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">Streak</span>
              <strong>{isMalay ? "7 hari" : "7 days"}</strong>
            </div>
          </div>
          <article className="landing-progress-orb-card how-progress-orb-wrap">
            <img alt="Progress orb showing AI band improvement" className="landing-progress-orb how-float-visual" src="/landing/progress-orb.svg" />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Kenapa ia berkesan" : "Why it works"}</p>
          <h2>{isMalay ? "Kenapa pelajar benar-benar bertambah baik" : "Why students actually improve"}</h2>
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
          <p className="eyebrow">{isMalay ? "Mula hari ini" : "Start today"}</p>
          <h2>{isMalay ? "Mulakan misi pertama anda hari ini." : "Start your first mission today."}</h2>
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
