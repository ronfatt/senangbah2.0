import { getServerLocale } from "../lib/server-locale";

export default async function HomePage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";
  const problemPoints = isMalay
    ? [
        "Tidak pasti apa kesalahan sebenar anda",
        "Masih mengulang kesilapan yang sama",
        "Belajar berjam-jam, tetapi keputusan tidak berubah"
      ]
    : [
        "Don't know what you're doing wrong",
        "Keep repeating the same mistakes",
        "Spend hours studying, but results don't change"
      ];
  const solutionCards = isMalay
    ? [
        { title: "Cari titik lemah anda", body: "AI mengesan apa yang anda tidak nampak, supaya anda berhenti meneka dan mula membaiki." },
        { title: "Baiki kesilapan anda", body: "Lihat bahagian yang lemah, kenapa ia lemah, dan bagaimana untuk memperbaikinya." },
        { title: "Maju setiap hari", body: "Satu misi ringkas pada satu masa. Kemajuan kecil yang terkumpul." }
      ]
    : [
        { title: "Find your weak points", body: "AI detects what you don't see, so you stop guessing and start fixing." },
        { title: "Fix your mistakes", body: "See what is weak, why it is weak, and how to make it better." },
        { title: "Improve every day", body: "One short mission at a time. Small progress that adds up." }
      ];
  const subjectCards = isMalay
    ? [
        { title: "Bahasa Inggeris", body: "Penulisan lebih baik, ayat lebih jelas, dan tatabahasa lebih kuat." },
        { title: "Bahasa Melayu", body: "Karangan lebih mantap, struktur lebih baik, dan jawapan lebih jelas." },
        { title: "Sejarah", body: "Faham lebih cepat dan jawab soalan sumber dengan lebih yakin." },
        { title: "Geografi", body: "Pelajari konsep utama dengan jelas dan jawab dengan lebih tepat." },
        { title: "Matematik", body: "Penyelesaian langkah demi langkah yang membantu anda elak kesilapan biasa." },
        { title: "Matematik Tambahan", body: "Pecahkan soalan sukar kepada langkah kerja yang lebih jelas." }
      ]
    : [
        { title: "English", body: "Better writing, clearer sentences, and stronger grammar." },
        { title: "Bahasa Melayu", body: "Stronger karangan, better structure, and clearer answers." },
        { title: "Sejarah", body: "Understand faster and answer source questions with more confidence." },
        { title: "Geografi", body: "Learn the key concepts clearly and answer with more precision." },
        { title: "Math", body: "Step-by-step solutions that help you avoid common errors." },
        { title: "Add Math", body: "Break down difficult questions into clearer working steps." }
      ];
  const aiCards = isMalay
    ? [
        { icon: "AI", title: "AI menerangkan kesilapan anda", body: "Bukan sekadar betul atau salah. Anda nampak apa yang berlaku dan bagaimana membaikinya." },
        { icon: "UP", title: "Tunjukkan kemajuan anda", body: "Jejak kemajuan subjek, bahagian lemah, dan peningkatan dari masa ke masa." },
        { icon: "GO", title: "Beritahu apa langkah seterusnya", body: "Setiap misi berakhir dengan langkah seterusnya yang jelas, bukan kekeliruan." }
      ]
    : [
        { icon: "AI", title: "AI explains your mistakes", body: "Not just right or wrong. You see what happened and how to fix it." },
        { icon: "UP", title: "Shows your progress", body: "Track subject progress, weak areas, and improvement over time." },
        { icon: "GO", title: "Tells you what to do next", body: "Every mission ends with a clear next step instead of more confusion." }
      ];
  const beforeAfterRows = isMalay
    ? [
        { subject: "Bahasa Inggeris", before: "I study with my friends because fun.", after: "Studying with my friends keeps me motivated and improves my discipline." },
        { subject: "Matematik", before: "I just try the formula and hope the answer is correct.", after: "I check each step carefully, so I can see where the method starts going wrong." },
        { subject: "Sejarah", before: "I know the topic, but I don't know how to answer properly.", after: "I understand the point, choose the right evidence, and answer more clearly." }
      ]
    : [
        { subject: "English", before: "I study with my friends because fun.", after: "Studying with my friends keeps me motivated and improves my discipline." },
        { subject: "Math", before: "I just try the formula and hope the answer is correct.", after: "I check each step carefully, so I can see where the method starts going wrong." },
        { subject: "Sejarah", before: "I know the topic, but I don't know how to answer properly.", after: "I understand the point, choose the right evidence, and answer more clearly." }
      ];
  const testimonials = isMalay
    ? [
        { quote: "Sekarang saya faham kesilapan saya, bukan sekadar ulang kesalahan yang sama.", name: "Aisyah", role: "Pelajar Tingkatan 5", accent: "language" },
        { quote: "Cukup ringkas sampai saya betul-betul buat selepas sekolah.", name: "Hakim", role: "Pelajar Tingkatan 4", accent: "math" },
        { quote: "Saya akhirnya dapat lihat apa yang sudah bertambah baik dan apa yang masih perlu dibaiki.", name: "Puan Lim", role: "Ibu bapa", accent: "parent" }
      ]
    : [
        { quote: "Now I understand my mistakes instead of repeating them.", name: "Aisyah", role: "Form 5 student", accent: "language" },
        { quote: "Short enough that I actually do it after school.", name: "Hakim", role: "Form 4 student", accent: "math" },
        { quote: "I can finally see what improved and what still needs work.", name: "Mrs. Lim", role: "Parent", accent: "parent" }
      ];
  const parentTrustPoints = isMalay
    ? [
        "Selaras dengan format peperiksaan SPM",
        "Fokus pada penulisan, menjawab, dan pemahaman",
        "Membantu pelajar maju secara konsisten, bukan sekadar berlatih"
      ]
    : [
        "Aligned with SPM exam format",
        "Focus on writing, answering, and understanding",
        "Helps students improve consistently, not just practise"
      ];

  return (
    <main className="page-shell landing-shell">
      <section className="landing-hero landing-hero-conversion">
        <div className="landing-hero-copy">
          <p className="eyebrow landing-hero-chip">
            {isMalay ? "Tiada kelas panjang. Hanya kemajuan harian yang bijak." : "No long lessons. Just smart daily progress."}
          </p>
          <h1>
            {isMalay ? "Tingkatkan" : "Improve Your"}
            <br />
            {isMalay ? "Subjek SPM anda dalam" : "SPM Subjects in"}
            <br />
            <span className="landing-hero-highlight">{isMalay ? "15 Minit" : "15 Minutes"}</span> {isMalay ? "Sehari." : "a Day."}
          </h1>
          <p className="landing-lead">
            {isMalay
              ? "Baiki kesilapan, faham dengan lebih baik, dan lihat kemajuan sebenar dengan AI yang membimbing anda dalam Bahasa Inggeris, BM, Sejarah, Geografi, Matematik, dan Matematik Tambahan."
              : "Fix mistakes, understand better, and see real progress with AI guiding you across English, BM, Sejarah, Geografi, Math, and Add Math."}
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
            <a className="btn btn-secondary" href="/how-it-works">
              {isMalay ? "Lihat Cara Ia Berfungsi" : "See How It Works"}
            </a>
          </div>
          <div className="landing-proof-row">
            <div className="landing-proof-avatars" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <strong>{isMalay ? "1,200+ pelajar" : "1,200+ students"}</strong>
              <p className="landing-proof">
                {isMalay ? "Menggunakan misi AI yang ringkas untuk maju setiap minggu." : "Using short AI missions to improve every week."}
              </p>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual">
          <article className="mission-mockup mission-mockup-conversion">
            <div className="mission-mockup-head">
              <div>
                <p className="dashboard-label">{isMalay ? "Misi hari ini" : "Today's mission"}</p>
                <strong className="mission-mockup-title">{isMalay ? "Streak harian: 12 hari" : "Daily streak: 12 days"}</strong>
              </div>
              <span className="mission-day-badge">{isMalay ? "Hari 3 / 14" : "Day 3 of 14"}</span>
            </div>

            <div className="hero-mission-list">
              <div className="hero-mission-item is-complete">
                <strong>{isMalay ? "Baiki 1 ayat lemah" : "Fix 1 weak sentence"}</strong>
                <span>{isMalay ? "Penulisan Bahasa Inggeris" : "English writing"}</span>
              </div>
              <div className="hero-mission-item is-active">
                <strong>{isMalay ? "Perbaiki 1 idea" : "Improve 1 idea"}</strong>
                <span>{isMalay ? "Kejelasan Bahasa Melayu" : "Bahasa Melayu clarity"}</span>
              </div>
              <div className="hero-mission-item">
                <strong>{isMalay ? "Semak 1 langkah lemah" : "Check 1 weak step"}</strong>
                <span>{isMalay ? "Langkah Matematik" : "Math working"}</span>
              </div>
            </div>

            <div className="mission-upgrade-panel mission-upgrade-panel-highlight">
              <p className="dashboard-label">{isMalay ? "Wawasan tutor AI" : "AI tutor insight"}</p>
              <strong>{isMalay ? "Kelemahan: kejelasan tatabahasa dalam peralihan" : "Weakness: grammar clarity in transitions"}</strong>
              <p className="dashboard-helper">{isMalay ? "Cadangan: guna “Consequently” berbanding “And then”." : "Suggestion: use “Consequently” instead of “And then”."}</p>
            </div>

            <div className="sentence-upgrade-preview">
              <div>
                <p className="dashboard-label">{isMalay ? "Sebelum" : "Before"}</p>
                <p className="sentence-preview-copy sentence-preview-copy-before">And then the result was bad...</p>
              </div>
              <div className="sentence-preview-arrow">→</div>
              <div>
                <p className="dashboard-label">{isMalay ? "Selepas" : "After"}</p>
                <p className="sentence-preview-copy">Consequently, the outcome was unfavourable.</p>
              </div>
            </div>

            <div className="mission-progress-rail">
              <div className="mission-progress-head">
                <span className="dashboard-label">{isMalay ? "Status semasa" : "Current status"}</span>
                <strong>{isMalay ? "Band 4 → Band 5" : "Band 4 → Band 5"}</strong>
              </div>
              <div className="target-progress">
                <div className="target-progress-bar" style={{ width: "42%" }} />
              </div>
              <div className="mission-progress-meta">
                <span>{isMalay ? "Bimbingan AI merentas 6 subjek" : "AI guidance across 6 subjects"}</span>
                <span>{isMalay ? "15 minit sehari" : "15 min a day"}</span>
              </div>
            </div>

            <div className="mission-achievement-badge">
              <span className="dashboard-label">{isMalay ? "Pencapaian" : "Achievement"}</span>
              <strong>{isMalay ? "Master Kosa Kata" : "Vocabulary Master"}</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="problem">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Masalahnya" : "The problem"}</p>
          <h2>{isMalay ? "Belajar bersungguh-sungguh, tapi masih belum bertambah baik?" : "Studying hard, but still not improving?"}</h2>
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
          <p className="eyebrow">{isMalay ? "Penyelesaiannya" : "The solution"}</p>
          <h2>{isMalay ? "SenangBah ialah sistem pembelajaran AI anda." : "SenangBah is your AI learning system."}</h2>
        </div>
        <div className="landing-visual-split">
          <article className="landing-visual-card landing-visual-card-wide">
            <div className="landing-visual-copy">
              <p className="dashboard-label">{isMalay ? "Kepintaran teras" : "Core intelligence"}</p>
              <h3>{isMalay ? "Cari titik lemah secara automatik." : "Find weak points automatically."}</h3>
              <p>{isMalay ? "AI mengesan jurang yang tepat terlebih dahulu, supaya pelajar berhenti belajar secara membuta tuli dan mula maju dengan arah yang jelas." : "AI detects the exact gap first, so students stop studying blindly and start improving with direction."}</p>
            </div>
            <img alt="AI wave illustration for finding weak points" className="landing-visual-image" src="/landing/ai-wave.svg" />
          </article>
          <article className="landing-visual-card landing-visual-card-accent">
            <div className="landing-visual-copy">
              <p className="dashboard-label">{isMalay ? "Baiki dengan pantas" : "Fast fixes"}</p>
              <h3>{isMalay ? "Baiki kesilapan secara masa nyata." : "Fix mistakes in real time."}</h3>
              <p>{isMalay ? "Dapatkan titik lemah, versi yang lebih baik, dan langkah seterusnya dalam satu aliran yang jelas." : "Get the weak point, the better version, and the next step in one clear flow."}</p>
            </div>
          </article>
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
          <p className="eyebrow">{isMalay ? "Cara ia berfungsi" : "How it works"}</p>
          <h2>{isMalay ? "Cukup mudah untuk mula hari ini." : "Simple enough to start today."}</h2>
          <p className="landing-how-lead">{isMalay ? "Satu tugasan ringkas. Satu pembaikan jelas. Satu langkah seterusnya yang nyata." : "One short task. One clear fix. One obvious next step."}</p>
        </div>
        <div className="steps-row steps-row-enhanced">
          <article className="step-card step-card-diagnose">
            <div className="step-badge">1</div>
            <p className="dashboard-label">Diagnose</p>
            <h3>Do 1 short task</h3>
            <p>Start one mission instead of feeling buried by too much work.</p>
            <span className="step-hint">5-15 minutes only</span>
          </article>
          <article className="step-card step-card-analyze">
            <div className="step-badge">2</div>
            <p className="dashboard-label">Analyze</p>
            <h3>AI shows what's wrong</h3>
            <p>See the exact weak point instead of guessing what happened.</p>
            <span className="step-hint">Weak point becomes clear</span>
          </article>
          <article className="step-card step-card-fix">
            <div className="step-badge">3</div>
            <p className="dashboard-label">Fix</p>
            <h3>You fix it</h3>
            <p>Get a clearer answer, stronger wording, or cleaner method.</p>
            <span className="step-hint">See the better version</span>
          </article>
          <article className="step-card step-card-improve">
            <div className="step-badge">4</div>
            <p className="dashboard-label">Improve</p>
            <h3>You improve</h3>
            <p>Come back tomorrow and keep building one daily win at a time.</p>
            <span className="step-hint">Repeat with confidence</span>
          </article>
        </div>
        <article className="how-summary-card">
          <div className="how-summary-copy">
              <p className="dashboard-label">{isMalay ? "Apa yang satu misi beri kepada anda" : "What one mission gives you"}</p>
              <h3>{isMalay ? "Anda tamat setiap sesi dengan tahu tepat apa yang sudah bertambah baik." : "You leave every session knowing exactly what got better."}</h3>
              <p>
              {isMalay
                ? "SenangBah bukan sekadar menyuruh anda berlatih lagi. Ia menunjukkan kesilapan, memberi pembetulan, dan menghala anda ke langkah seterusnya."
                : "SenangBah does not just tell you to practise more. It shows the mistake, gives the fix, and points you to the next move."}
              </p>
          </div>
          <div className="how-summary-metrics">
            <div className="how-summary-metric">
                  <span className="dashboard-label">{isMalay ? "Tugasan" : "Task"}</span>
                  <strong>{isMalay ? "1 misi yang jelas" : "1 clear mission"}</strong>
            </div>
            <div className="how-summary-metric">
                  <span className="dashboard-label">{isMalay ? "Maklum balas" : "Feedback"}</span>
                  <strong>{isMalay ? "AI + jawapan lebih baik" : "AI + better answer"}</strong>
            </div>
            <div className="how-summary-metric">
                  <span className="dashboard-label">{isMalay ? "Hasil" : "Result"}</span>
                  <strong>{isMalay ? "Langkah seterusnya terbuka" : "Next step unlocked"}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="section" id="subjects">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Kuasa subjek" : "Subject power"}</p>
          <h2>{isMalay ? "Satu sistem. Semua subjek SPM anda." : "One system. All your SPM subjects."}</h2>
        </div>
        <article className="landing-map-card">
          <div className="landing-map-copy">
            <p className="dashboard-label">{isMalay ? "Peta AI pelbagai subjek" : "Multi-subject AI map"}</p>
            <h3>{isMalay ? "Satu hab pembelajaran menghubungkan semua enam laluan subjek." : "One learning hub connects all six subject lanes."}</h3>
            <p>
              {isMalay
                ? "Pelajar tidak memerlukan enam aplikasi berasingan. SenangBah mengekalkan subjek, bimbingan AI, dan kemajuan harian dalam satu sistem yang jelas."
                : "Students do not need six separate apps. SenangBah keeps subjects, AI guidance, and daily progress inside one clear system."}
            </p>
          </div>
          <img alt="Six-subject AI learning map" className="landing-map-image" src="/landing/subjects-map.svg" />
        </article>
        <div className="landing-card-grid landing-card-grid-3">
          {subjectCards.map((subject) => (
            <article className="landing-tool-card" key={subject.title}>
              <p className="dashboard-label">{isMalay ? "Laluan subjek AI" : "AI subject lane"}</p>
              <h3>{subject.title}</h3>
              <p>{subject.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Sistem harian" : "Daily system"}</p>
          <h2>{isMalay ? "Anda tidak perlukan berjam-jam. Hanya konsisten." : "You don't need hours. Just consistency."}</h2>
        </div>
        <div className="landing-photo-split">
          <article className="landing-glass-card daily-system-card">
            <div className="daily-system-points">
              <div className="daily-pill">{isMalay ? "1 misi sehari" : "1 mission per day"}</div>
              <div className="daily-pill">{isMalay ? "5-15 minit" : "5-15 minutes"}</div>
              <div className="daily-pill">{isMalay ? "Fokus pada 1 peningkatan" : "Focus on 1 improvement"}</div>
            </div>
            <p>
              {isMalay
                ? "SenangBah berfungsi paling baik apabila belajar terasa cukup ringan untuk dimulakan dan cukup jelas untuk diulang esok."
                : "SenangBah works best when studying feels light enough to start and clear enough to repeat tomorrow."}
            </p>
          </article>
          <article className="landing-photo-card">
            <img
              alt="Student studying with laptop and notebook at a desk"
              className="landing-photo-image"
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="landing-photo-overlay">
              <p className="dashboard-label">{isMalay ? "Aliran belajar harian yang ringkas" : "Short daily study flow"}</p>
              <strong>{isMalay ? "Dibina untuk sesi fokus selepas sekolah, bukan kelas panjang yang membosankan." : "Built for focused sessions after school, not long boring classes."}</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="ai-difference">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Perbezaan AI" : "AI difference"}</p>
          <h2>{isMalay ? "Ini bukan sekadar latihan." : "This is not just practice."}</h2>
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
          <p className="eyebrow">{isMalay ? "Sebelum / selepas" : "Before / after"}</p>
          <h2>{isMalay ? "Lihat perbezaannya." : "See the difference."}</h2>
        </div>
        <div className="before-after-list">
          {beforeAfterRows.map((row) => (
            <article className="before-after-card" key={row.subject}>
              <div>
                <p className="dashboard-label">{row.subject} {isMalay ? "sebelum" : "before"}</p>
                <p className="before-copy">{row.before}</p>
              </div>
              <div className="before-after-arrow">→</div>
              <div>
                <p className="dashboard-label">{row.subject} {isMalay ? "selepas" : "after"}</p>
                <p className="after-copy">{row.after}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="progress">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Kemajuan" : "Progress"}</p>
          <h2>{isMalay ? "Peningkatan sebenar yang boleh anda lihat." : "Real improvement you can see."}</h2>
        </div>
        <div className="progress-preview progress-preview-rich">
          <article className="landing-glass-card progress-card-large">
            <div className="progress-metric-grid">
              <div className="progress-metric">
                <span className="dashboard-label">{isMalay ? "Ketepatan tatabahasa" : "Grammar accuracy"}</span>
                <strong>58% → 74%</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">{isMalay ? "Kosa kata" : "Vocabulary"}</span>
                <strong>+21%</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">{isMalay ? "Anggaran band" : "Band estimate"}</span>
                <strong>3.8 → 4.6</strong>
              </div>
              <div className="progress-metric">
                <span className="dashboard-label">{isMalay ? "Kesilapan" : "Mistakes"}</span>
                <strong>{isMalay ? "Semakin berkurang" : "Going down"}</strong>
              </div>
            </div>
            <p className="landing-footnote">{isMalay ? "Bukan sekadar latihan. Kemajuan sebenar yang boleh difahami oleh pelajar dan ibu bapa." : "Not just practice. Real measurable progress that students and parents can both understand."}</p>
          </article>
          <article className="landing-progress-orb-card">
            <img alt="AI progress orb showing current study band" className="landing-progress-orb" src="/landing/progress-orb.svg" />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Suara pelajar" : "Student voices"}</p>
          <h2>{isMalay ? "Apa kata pelajar" : "What students say"}</h2>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {testimonials.map((item) => (
            <article className={`landing-quote-card landing-quote-card-${item.accent}`} key={item.name}>
              <div className="landing-stars" aria-hidden="true">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p>{item.quote}</p>
              <div className="landing-quote-person">
                <span className="landing-quote-avatar">{item.name.slice(0, 1)}</span>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading landing-heading">
          <p className="eyebrow">{isMalay ? "Kepercayaan ibu bapa" : "Parent trust"}</p>
          <h2>{isMalay ? "Dibina untuk menyokong peningkatan peperiksaan yang sebenar." : "Built to support real exam improvement."}</h2>
        </div>
        <div className="landing-parent-panel">
          <article className="landing-photo-card">
            <img
              alt="Parent and student reviewing school work together at a table"
              className="landing-photo-image"
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="landing-photo-overlay">
              <p className="dashboard-label">{isMalay ? "Cukup jelas untuk ibu bapa juga" : "Clear enough for parents too"}</p>
              <strong>{isMalay ? "Kemajuan, bahagian lemah, dan langkah seterusnya mudah difahami sepintas lalu." : "Progress, weak areas, and next steps are easy to understand at a glance."}</strong>
            </div>
          </article>
          <article className="landing-glass-card parent-summary-card">
            <p className="dashboard-label">{isMalay ? "Kenapa ibu bapa percaya" : "Why parents trust it"}</p>
            <h3>{isMalay ? "Pelajar dapat bimbingan. Ibu bapa nampak kemajuan." : "Students get guidance. Parents see progress."}</h3>
            <p>
              {isMalay
                ? "SenangBah memastikan kerja harian kekal ringkas, menunjukkan apa yang bertambah baik, dan menjadikan langkah seterusnya jelas tanpa membiarkan keluarga meneka."
                : "SenangBah keeps daily work short, shows what improved, and makes the next step clear instead of leaving families guessing."}
            </p>
          </article>
        </div>
        <div className="landing-card-grid landing-card-grid-3">
          {parentTrustPoints.map((point) => (
            <article className="landing-glass-card" key={point}>
              <h3>{point}</h3>
              <p>{isMalay ? "Struktur harian yang jelas dengan bimbingan AI yang menyokong kemajuan peperiksaan secara konsisten." : "Clear daily structure with AI guidance that supports steady exam progress."}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">{isMalay ? "Mula hari ini" : "Start today"}</p>
          <h2>{isMalay ? "Mula bertambah baik hari ini." : "Start improving today."}</h2>
          <p className="landing-lead">{isMalay ? "Tanpa tekanan. Hanya kemajuan kecil setiap hari dengan AI yang membantu anda tahu apa perlu dibuat seterusnya." : "No stress. Just small daily progress with AI helping you know what to do next."}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
            <a className="btn btn-secondary" href="/login">
              {isMalay ? "Log Masuk untuk Terus Belajar" : "Login to Continue Learning"}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
