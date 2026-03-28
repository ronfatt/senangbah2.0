import { getServerLocale } from "../lib/server-locale";

type SubjectCard = {
  title: string;
  strap: string;
  body: string;
  accent: string;
  icon: string;
};

export default async function HomePage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";

  const howSteps = isMalay
    ? [
        {
          number: "1",
          title: "AI cari jurang anda",
          body: "Satu tugasan ringkas menunjukkan apa yang sebenarnya anda perlu baiki. Tiada lagi meneka.",
          accent: "blue",
          icon: "AI"
        },
        {
          number: "2",
          title: "Dapat pembaikan segera",
          body: "Lihat titik lemah anda dan versi yang lebih baik secara sebelah-menyebelah.",
          accent: "purple",
          icon: "FX"
        },
        {
          number: "3",
          title: "Berlatih dengan lebih bijak",
          body: "Anda membaikinya dengan jawapan yang lebih jelas, susunan yang lebih kuat, atau langkah yang lebih kemas.",
          accent: "orange",
          icon: "GO"
        },
        {
          number: "4",
          title: "Lihat kemajuan sebenar",
          body: "Datang semula esok dan teruskan membina. Kemenangan kecil setiap hari jadi keputusan peperiksaan yang besar.",
          accent: "green",
          icon: "UP"
        }
      ]
    : [
        {
          number: "1",
          title: "AI finds your gaps",
          body: "One short task reveals exactly what you need to work on. No more guessing.",
          accent: "blue",
          icon: "AI"
        },
        {
          number: "2",
          title: "Get instant fixes",
          body: "See the weak point and the better version side-by-side, right away.",
          accent: "purple",
          icon: "FX"
        },
        {
          number: "3",
          title: "Practice smart",
          body: "You fix it with a clearer answer, stronger wording, or cleaner method.",
          accent: "orange",
          icon: "GO"
        },
        {
          number: "4",
          title: "See real progress",
          body: "Come back tomorrow and keep building. Small daily wins become better exam results.",
          accent: "green",
          icon: "UP"
        }
      ];

  const subjects: SubjectCard[] = isMalay
    ? [
        {
          title: "Bahasa Inggeris",
          strap: "Penulisan lebih baik, ayat lebih jelas",
          body: "Struktur harian yang ringkas dengan bimbingan AI untuk penulisan, tatabahasa, dan kosa kata.",
          accent: "blue",
          icon: "EN"
        },
        {
          title: "Bahasa Melayu",
          strap: "Tatabahasa lebih kuat, struktur lebih baik",
          body: "AI membantu karangan, struktur ayat, dan jawapan pemahaman menjadi lebih matang.",
          accent: "green",
          icon: "BM"
        },
        {
          title: "Sejarah",
          strap: "Faham lebih cepat, jawab dengan yakin",
          body: "AI bantu susun fakta, huraian, dan kejelasan jawapan supaya lebih tepat.",
          accent: "peach",
          icon: "SJ"
        },
        {
          title: "Geografi",
          strap: "Konsep penting diterangkan dengan jelas",
          body: "Belajar konsep utama, struktur jawapan, dan cara elakkan jawapan yang terlalu kabur.",
          accent: "pink",
          icon: "GG"
        },
        {
          title: "Matematik",
          strap: "Langkah penyelesaian yang lebih masuk akal",
          body: "AI semak langkah kerja, tunjuk kesilapan, dan terangkan kaedah dengan lebih jelas.",
          accent: "indigo",
          icon: "MT"
        },
        {
          title: "Matematik Tambahan",
          strap: "Pecahkan soalan sukar dengan lebih jelas",
          body: "Bina aliran kerja yang lebih teratur untuk soalan yang kompleks dan sukar.",
          accent: "lavender",
          icon: "AM"
        }
      ]
    : [
        {
          title: "English",
          strap: "Better writing, clearer sentences",
          body: "Short daily structure with AI guidance for writing, grammar, and vocabulary.",
          accent: "blue",
          icon: "EN"
        },
        {
          title: "Bahasa Melayu",
          strap: "Stronger grammar, better structure",
          body: "AI supports karangan, sentence structure, and clearer comprehension answers.",
          accent: "green",
          icon: "BM"
        },
        {
          title: "Sejarah",
          strap: "Understand faster, answer with confidence",
          body: "AI helps students organise facts, huraian, and clearer answer structure.",
          accent: "peach",
          icon: "SJ"
        },
        {
          title: "Geografi",
          strap: "Key concepts clearly explained",
          body: "Learn core concepts, structured explanations, and how to avoid vague answers.",
          accent: "pink",
          icon: "GG"
        },
        {
          title: "Math",
          strap: "Step-by-step solutions that click",
          body: "AI checks working steps, spots wrong turns, and explains the cleaner method.",
          accent: "indigo",
          icon: "MT"
        },
        {
          title: "Add Math",
          strap: "Break down tough questions clearly",
          body: "Build a clearer solving flow for more advanced and complex questions.",
          accent: "lavender",
          icon: "AM"
        }
      ];

  const testimonials = isMalay
    ? [
        { quote: "Sekarang saya faham kesilapan saya dan bukan sekadar ulang benda yang sama.", name: "Aisyah", role: "Pelajar Tingkatan 5" },
        { quote: "Cukup ringkas sampai saya memang buat setiap hari selepas sekolah.", name: "Hakim", role: "Pelajar Tingkatan 4" },
        { quote: "Saya boleh nampak apa yang bertambah baik dan apa yang masih perlu dibaiki.", name: "Puan Lim", role: "Ibu bapa" },
        { quote: "AI sentiasa beritahu langkah seterusnya. Saya tidak rasa hilang arah lagi.", name: "Arif", role: "Pelajar Tingkatan 5" },
        { quote: "Band Bahasa Inggeris saya naik dari 3 ke 4 dalam beberapa minggu.", name: "Siti", role: "Pelajar Tingkatan 4" },
        { quote: "Akhirnya ada sistem yang tidak membebankan anak saya.", name: "Encik Ahmad", role: "Ibu bapa" }
      ]
    : [
        { quote: "Now I understand my mistakes instead of repeating the same thing.", name: "Aisyah", role: "Form 5 student" },
        { quote: "Short enough that I actually do it every day after school.", name: "Hakim", role: "Form 4 student" },
        { quote: "I can see what improved and what still needs work.", name: "Mrs. Lim", role: "Parent" },
        { quote: "AI always tells me the next step, so I never feel lost.", name: "Arif", role: "Form 5 student" },
        { quote: "My English band moved from 3 to 4 in just a few weeks.", name: "Siti", role: "Form 4 student" },
        { quote: "Finally a system that does not overwhelm my daughter.", name: "Mr. Ahmad", role: "Parent" }
      ];

  const footerLinks = isMalay
    ? {
        quick: "Pautan Pantas",
        subjects: "Subjek SPM",
        contact: "Hubungi Kami"
      }
    : {
        quick: "Quick Links",
        subjects: "SPM Subjects",
        contact: "Connect With Us"
      };

  return (
    <main className="page-shell landing-v2-shell">
      <section className="landing-v2-hero">
        <div className="landing-v2-hero-copy">
          <span className="landing-v2-badge">{isMalay ? "Hanya 15 minit sehari!" : "Just 15 minutes a day!"}</span>
          <h1>
            {isMalay ? "Kuasai SPM anda" : "Ace Your SPM"}
            <br />
            <span>{isMalay ? "dalam 15 Minit" : "in 15 Minutes"}</span>
            <br />
            {isMalay ? "sehari!" : "a Day!"} 🚀
          </h1>
          <p className="landing-v2-lead">
            {isMalay
              ? "AI pintar membimbing anda melalui Bahasa Inggeris, BM, Sejarah, Geografi, Matematik, dan Matematik Tambahan."
              : "Smart AI guides you through English, BM, Sejarah, Geografi, Math, and Add Math."}
            <br />
            {isMalay
              ? "Tiada lagi belajar berjam-jam — hanya kemajuan harian yang lebih bijak."
              : "No more long hours, just smart daily progress."}
          </p>
          <div className="hero-actions">
            <a className="btn landing-v2-primary-btn" href="/register">
              {isMalay ? "Mula Belajar Percuma" : "Start Learning Free"} ✨
            </a>
            <a className="btn landing-v2-secondary-btn" href="/how-it-works">
              {isMalay ? "Lihat Cara Ia Berfungsi" : "See How It Works"}
            </a>
          </div>
          <div className="landing-v2-proof">
            <div className="landing-v2-proof-dots" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <strong>{isMalay ? "1,200+ pelajar" : "1,200+ students"}</strong>
              <p>{isMalay ? "Meningkat setiap minggu!" : "Improving every week!"} ⭐</p>
            </div>
          </div>
        </div>

        <article className="landing-v2-hero-panel">
          <span className="landing-v2-floating-chip top">{isMalay ? "15 min/hari" : "15 min/day"}</span>
          <span className="landing-v2-floating-chip bottom">{isMalay ? "Dikuasakan AI" : "AI Powered"}</span>
          <div className="landing-v2-panel-card landing-v2-panel-mission">
            <div className="landing-v2-panel-head">
              <div>
                <h3>{isMalay ? "Misi Hari Ini" : "Today's Mission"}</h3>
                <p>{isMalay ? "Hari 12 🔥" : "Day 12 🔥"}</p>
              </div>
              <span className="landing-v2-day-pill">{isMalay ? "Hari 12" : "Day 12"}</span>
            </div>
            <div className="landing-v2-mission-list">
              <div className="landing-v2-mission-item">
                <strong>
                  <span className="landing-v2-mission-dot green" aria-hidden="true" />
                  {isMalay ? "Baiki 1 ayat lemah" : "Fix 1 weak sentence"}
                </strong>
                <span>{isMalay ? "Penulisan Bahasa Inggeris" : "English writing"}</span>
              </div>
              <div className="landing-v2-mission-item">
                <strong>
                  <span className="landing-v2-mission-dot blue" aria-hidden="true" />
                  {isMalay ? "Perbaiki 1 idea" : "Improve 1 idea"}
                </strong>
                <span>{isMalay ? "Kejelasan Bahasa Melayu" : "Bahasa Melayu clarity"}</span>
              </div>
            </div>
          </div>
          <div className="landing-v2-panel-card landing-v2-panel-progress">
            <h4>{isMalay ? "Kemajuan Anda" : "Your Progress"} 📈</h4>
            <div className="landing-v2-progress-row">
              <span>English</span>
              <span>{isMalay ? "Band 4 → 5" : "Band 4 → 5"}</span>
            </div>
            <div className="landing-v2-progress-bar"><span style={{ width: "82%" }} /></div>
            <div className="landing-v2-progress-row">
              <span>Math</span>
              <span>B → A</span>
            </div>
            <div className="landing-v2-progress-bar alt"><span style={{ width: "68%" }} /></div>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-light">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "CARA IA BERFUNGSI" : "HOW IT WORKS"} ⚡</span>
          <h2>{isMalay ? "Cukup mudah untuk mula hari ini!" : "Simple Enough to Start Today!"} 💣</h2>
          <p>{isMalay ? "Satu tugasan ringkas. Satu pembaikan jelas. Satu langkah seterusnya yang nyata. Ulang setiap hari dan lihat diri anda bertambah baik." : "One short task. One clear fix. One obvious next step. Repeat daily and watch yourself improve."}</p>
        </div>
        <div className="landing-v2-step-grid">
          {howSteps.map((step, index) => (
            <article className={`landing-v2-step-card ${step.accent}`} key={step.title}>
              <span className="landing-v2-step-number">{step.number}</span>
              <div className="landing-v2-step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {index < howSteps.length - 1 ? <span className="landing-v2-step-arrow">→</span> : null}
            </article>
          ))}
        </div>
        <article className="landing-v2-gradient-banner">
          <h3>{isMalay ? "Setiap sesi berakhir dengan anda tahu tepat apa yang sudah bertambah baik." : "You leave every session knowing exactly what got better."} 🎊</h3>
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
          <span className="landing-v2-pill">{isMalay ? "SEMUA SUBJEK ANDA" : "ALL YOUR SUBJECTS"} 📚</span>
          <h2>{isMalay ? "Satu sistem. Semua enam subjek SPM!" : "One System. All Six SPM Subjects!"} 💪</h2>
          <p>{isMalay ? "SenangBah menyimpan subjek, bimbingan AI, dan kemajuan harian di dalam satu sistem yang jelas." : "SenangBah keeps subjects, AI guidance, and daily progress inside one clear system."}</p>
        </div>
        <div className="landing-v2-subject-grid">
          {subjects.map((subject) => (
            <article className={`landing-v2-subject-card ${subject.accent}`} key={subject.title}>
              <div className="landing-v2-subject-icon">{subject.icon}</div>
              <h3>{subject.title}</h3>
              <strong>{subject.strap}</strong>
              <p>{subject.body}</p>
            </article>
          ))}
        </div>
        <article className="landing-v2-subject-note">
          <h3>{isMalay ? "Pelajar tidak perlukan enam aplikasi berasingan!" : "Students don't need six separate apps!"} 🎉</h3>
          <p>{isMalay ? "Semua yang anda perlukan ada dalam satu tempat yang kemas dan jelas." : "Everything you need lives in one clear, daily system."}</p>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-cream">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "SEBELUM / SELEPAS" : "SEE THE DIFFERENCE"} 💣</span>
          <h2>{isMalay ? "Lihat perbezaannya" : "See the Difference!"} </h2>
          <p>{isMalay ? "Contoh sebelum dan selepas yang pelajar boleh terus faham." : "Simple before-and-after snapshots students and parents can understand right away."}</p>
        </div>
        <div className="landing-v2-compare-grid">
          <article className="landing-v2-compare-card before">
            <span>{isMalay ? "Bahasa Inggeris sebelum" : "English before"}</span>
            <p>"Studying with no friends keeps me unmotivated"</p>
          </article>
          <article className="landing-v2-compare-card after">
            <span>{isMalay ? "Bahasa Inggeris selepas" : "English after"}</span>
            <p>"Consequently, the outcome was favourable"</p>
          </article>
          <article className="landing-v2-compare-card before">
            <span>{isMalay ? "Matematik sebelum" : "Math before"}</span>
            <p>"I just try the formula and hope the answer is correct"</p>
          </article>
          <article className="landing-v2-compare-card after">
            <span>{isMalay ? "Matematik selepas" : "Math after"}</span>
            <p>"I check each step carefully, so I can see where the method starts going wrong"</p>
          </article>
        </div>
        <article className="landing-v2-stats-banner">
          <h3>{isMalay ? "Peningkatan sebenar yang boleh anda lihat!" : "Real Improvement You Can See!"} 📊</h3>
          <div className="landing-v2-stats-grid">
            <div><strong>58% → 74%</strong><span>{isMalay ? "Ketepatan tatabahasa" : "Grammar Accuracy"}</span></div>
            <div><strong>+21%</strong><span>{isMalay ? "Kosa kata" : "Vocabulary"}</span></div>
            <div><strong>3.8 → 4.6</strong><span>{isMalay ? "Band / kesilapan semakin menurun" : "Band / mistakes going down"}</span></div>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-white">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "SUARA PELAJAR" : "STUDENT VOICES"} 💬</span>
          <h2>{isMalay ? "Apa Kata Pelajar!" : "What Students Say!"} ✨</h2>
          <p>{isMalay ? "Maklum balas sebenar daripada pelajar dan ibu bapa." : "Real feedback from students and parents using the daily system."}</p>
        </div>
        <div className="landing-v2-testimonial-grid">
          {testimonials.map((item) => (
            <article className="landing-v2-testimonial-card" key={`${item.name}-${item.quote}`}>
              <div className="landing-v2-stars">★★★★★</div>
              <p>{item.quote}</p>
              <div className="landing-v2-testimonial-person">
                <span>{item.name.slice(0, 1)}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-v2-section landing-v2-parent">
        <article className="landing-v2-parent-panel">
          <div className="landing-v2-parent-copy">
            <span className="landing-v2-pill">{isMalay ? "KEPERCAYAAN IBU BAPA" : "PARENT TRUST"} 👪</span>
            <h2>{isMalay ? "Dibina untuk menyokong peningkatan peperiksaan sebenar!" : "Built to Support Real Exam Improvement!"} 💣</h2>
            <p>{isMalay ? "SenangBah mengekalkan kerja harian yang ringkas, menunjukkan apa yang bertambah baik, dan menjadikan langkah seterusnya jelas tanpa membiarkan keluarga meneka." : "SenangBah keeps daily work short, shows what improved, and makes the next step clear instead of leaving families guessing."}</p>
            <article className="landing-v2-parent-highlight">
              <h3>{isMalay ? "Cukup jelas untuk ibu bapa juga" : "Clear enough for parents too"}</h3>
              <p>{isMalay ? "Kemajuan, bahagian lemah, dan langkah seterusnya mudah difahami sepintas lalu." : "Progress, weak areas, and next steps are easy to understand at a glance."}</p>
            </article>
          </div>
          <div className="landing-v2-parent-points">
            <article><h3>{isMalay ? "Pelajar dapat bimbingan" : "Students Get Guidance"}</h3><p>{isMalay ? "Maklum balas yang jelas tentang apa yang lemah dan bagaimana untuk membaikinya." : "Clear feedback on what's weak and how to fix it."}</p></article>
            <article><h3>{isMalay ? "Ibu bapa nampak kemajuan" : "Parents See Progress"}</h3><p>{isMalay ? "Jejak peningkatan dari masa ke masa dengan metrik yang jelas." : "Track improvement over time with clear metrics."}</p></article>
            <article><h3>{isMalay ? "Selaras dengan format SPM" : "Aligned with SPM Format"}</h3><p>{isMalay ? "Struktur harian menyokong kemajuan peperiksaan yang konsisten." : "Daily structure supports steady exam progress."}</p></article>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-cream">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "SISTEM HARIAN" : "DAILY SYSTEM"} 🧠</span>
          <h2>{isMalay ? "Anda tidak perlukan berjam-jam. Hanya konsisten!" : "You Don't Need Hours. Just Consistency!"} 🔥</h2>
          <p>{isMalay ? "SenangBah berfungsi paling baik apabila belajar terasa ringan untuk dimulakan dan jelas untuk diulang esok." : "SenangBah works best when studying feels light enough to start and clear enough to repeat tomorrow."}</p>
        </div>
        <div className="landing-v2-daily-grid">
          <article className="landing-v2-daily-photo">
            <img alt="Student using a laptop and smiling during a short study session" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" />
            <div className="landing-v2-photo-tag">{isMalay ? "Dibina untuk sesi fokus yang ringkas" : "Built for focused short sessions"} ⚡</div>
          </article>
          <div className="landing-v2-daily-points">
            <article><span>⏱</span><div><strong>{isMalay ? "1 misi sehari" : "1 mission per day"}</strong><p>{isMalay ? "Cukup ringkas untuk benar-benar dibuat selepas sekolah" : "Short enough to actually do it after school"}</p></div></article>
            <article><span>⚡</span><div><strong>{isMalay ? "5-15 minit" : "5-15 minutes"}</strong><p>{isMalay ? "Dibina untuk sesi pendek yang fokus" : "Built for focused short sessions, not long boring classes"}</p></div></article>
            <article><span>📈</span><div><strong>{isMalay ? "Tunjuk kemajuan anda" : "Shows your progress"}</strong><p>{isMalay ? "Lihat apa yang bertambah baik dari masa ke masa" : "Track real improvement over time, see what improved"}</p></div></article>
            <article><span>🎯</span><div><strong>{isMalay ? "Beritahu langkah seterusnya" : "Tells you what to do next"}</strong><p>{isMalay ? "Setiap sesi berakhir dengan langkah seterusnya yang jelas" : "Every session ends with a clear next step instead of more confusion"}</p></div></article>
          </div>
        </div>
      </section>

      <section className="landing-v2-section landing-v2-final">
        <div className="landing-v2-final-copy">
          <span className="landing-v2-badge">{isMalay ? "MULA HARI INI" : "START TODAY"} 🚀</span>
          <h2>{isMalay ? "Mula Bertambah Baik Hari Ini!" : "Start Improving Today!"} 🎉</h2>
          <p>{isMalay ? "Tanpa tekanan. Hanya kemajuan harian kecil dengan AI yang membantu anda tahu apa perlu dibuat seterusnya." : "No stress. Just small daily progress with AI helping you know what to do next."}</p>
          <ul>
            <li>{isMalay ? "15 minit sehari - itu sahaja" : "15 minutes per day - that's it!"}</li>
            <li>{isMalay ? "Semua 6 subjek SPM dalam satu sistem" : "All 6 SPM subjects in one system"}</li>
            <li>{isMalay ? "AI tunjuk tepat apa yang perlu diperbaiki" : "AI shows you exactly what to improve"}</li>
          </ul>
          <div className="hero-actions">
            <a className="btn landing-v2-white-btn" href="/register">{isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"} →</a>
            <a className="btn landing-v2-outline-light-btn" href="/login">{isMalay ? "Log Masuk untuk Terus Belajar" : "Login to Continue Learning"}</a>
          </div>
          <p className="landing-v2-final-note">{isMalay ? "Percubaan percuma tersedia • Tiada kad kredit diperlukan • Mula dalam beberapa saat" : "Free trial available • No credit card required • Start in seconds"}</p>
        </div>
        <article className="landing-v2-final-photo">
          <img alt="Student celebrating progress after seeing better results" src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80" />
          <div className="landing-v2-final-stat top">+21%<span>{isMalay ? "Kosa kata naik" : "Vocabulary ↑"}</span></div>
          <div className="landing-v2-final-stat middle">{isMalay ? "15 min" : "15 min"}<span>{isMalay ? "sehari" : "per day"}</span></div>
          <div className="landing-v2-final-stat bottom">1,200+<span>{isMalay ? "Pelajar gembira" : "Happy students"}</span></div>
        </article>
      </section>

      <footer className="landing-v2-footer">
        <div className="landing-v2-footer-brand">
          <div className="brand">
            <span className="brand-mark">✦</span>
            <div className="brand-copy">
              <strong>SenangBah</strong>
              <span>AI Study Platform</span>
            </div>
          </div>
          <p>{isMalay ? "Kemajuan harian yang bijak untuk pelajar SPM. 15 minit sehari untuk capai keputusan lebih baik." : "Smart daily progress for SPM students. 15 minutes a day to ace your exams."} 🚀</p>
        </div>
        <div className="landing-v2-footer-links">
          <div>
            <h4>{footerLinks.quick}</h4>
            <a href="/how-it-works">{isMalay ? "Cara Ia Berfungsi" : "How It Works"}</a>
            <a href="/subjects">{isMalay ? "Subjek" : "Subjects"}</a>
            <a href="/pricing">{isMalay ? "Harga" : "Pricing"}</a>
            <a href="/login">Login</a>
          </div>
          <div>
            <h4>{footerLinks.subjects}</h4>
            <span>English</span>
            <span>Bahasa Melayu</span>
            <span>Sejarah</span>
            <span>Geografi</span>
            <span>Math</span>
            <span>Add Math</span>
          </div>
          <div>
            <h4>{footerLinks.contact}</h4>
            <span>Instagram</span>
            <span>Facebook</span>
            <span>hello@senangbah.com</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
