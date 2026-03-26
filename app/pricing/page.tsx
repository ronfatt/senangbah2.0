import { getPlanCatalog } from "../../lib/catalog";
import { getServerLocale } from "../../lib/server-locale";

export default async function PricingPage() {
  const locale = await getServerLocale();
  const plans = await getPlanCatalog();

  const freePlan = plans.find((plan) => plan.code === "free");
  const languagePack = plans.find((plan) => plan.code === "language_pack");
  const humanitiesPack = plans.find((plan) => plan.code === "humanities_pack");
  const mathPack = plans.find((plan) => plan.code === "math_pack");
  const allAccess = plans.find((plan) => plan.code === "all_access");

  const focusPacks = [languagePack, humanitiesPack, mathPack].filter(Boolean);

  return (
    <main className="page-shell pricing-shell">
      <section className="pricing-hero">
        <div className="pricing-hero-copy">
          <p className="eyebrow">{locale === "ms" ? "Pilih laluan naik taraf anda" : "Choose your upgrade path"}</p>
          <h1 className="dashboard-title">
            {locale === "ms" ? "Pilih laluan naik taraf anda. Mula maju dalam 7 hari." : "Pick your upgrade path. Start improving in 7 days."}
          </h1>
          <p className="landing-lead">
            {locale === "ms" ? "Tiada teka-teki. Hanya kemajuan yang jelas merentas subjek SPM anda." : "No guessing. Just clear progress across your SPM subjects."}
          </p>
          <div className="pricing-hero-badges">
            <span className="pricing-popular-badge">{locale === "ms" ? "Kebanyakan pelajar memilih Akses Penuh" : "Most students choose All Access"}</span>
            <span className="pricing-trial-pill">{locale === "ms" ? "Percubaan akses penuh 7 hari disertakan" : "7-day full access trial included"}</span>
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/upgrade?plan=all_access">
              {locale === "ms" ? "Mula akses penuh" : "Start full access"}
            </a>
            <a className="btn btn-secondary" href="/register">
              {locale === "ms" ? "Mula percubaan percuma" : "Start free trial"}
            </a>
          </div>
        </div>

        <article className="pricing-hero-panel">
          <p className="dashboard-label">{locale === "ms" ? "Kenapa pelajar memilih ini" : "Why students choose this"}</p>
          <h2>{locale === "ms" ? "Kebanyakan pelajar bermula dengan Akses Penuh kerana ia menghapuskan teka-teki." : "Most students start with All Access because it removes the guesswork."}</h2>
          <ul className="pricing-trigger-list">
            <li>{locale === "ms" ? "Mereka tidak mahu meneka apa yang perlu dipelajari" : "They don&apos;t want to guess what to study"}</li>
            <li>{locale === "ms" ? "Mereka mahu kemajuan lebih cepat merentas subjek" : "They want faster improvement across subjects"}</li>
            <li>{locale === "ms" ? "Mereka sedang bersedia secara serius untuk SPM" : "They are preparing seriously for SPM"}</li>
          </ul>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">{locale === "ms" ? "Pilihan pembelajaran anda" : "Your study options"}</p>
          <h2>{locale === "ms" ? "Pilih tahap yang sepadan dengan fokus persediaan anda." : "Choose the level that matches how focused you want your prep to be."}</h2>
        </div>

        <div className="pricing-tier-grid">
          <article className="pricing-tier-card pricing-tier-card-free">
            <p className="pricing-name">{locale === "ms" ? "Permulaan Percuma" : "Free Starter"}</p>
            <h2>{freePlan?.priceLabel || "RM0"}</h2>
            <p className="pricing-detail">{locale === "ms" ? "Misi asas harian, subjek terhad, dan maklum balas asas." : "Daily basic missions, limited subjects, and basic feedback."}</p>
            <ul className="feature-list">
              <li>{locale === "ms" ? "Misi asas harian" : "Daily basic missions"}</li>
              <li>{locale === "ms" ? "Subjek terhad" : "Limited subjects"}</li>
              <li>{locale === "ms" ? "Maklum balas asas" : "Basic feedback"}</li>
            </ul>
            <div className="hero-actions">
              <a className="btn btn-secondary" href="/register">
                {locale === "ms" ? "Cuba percuma" : "Try free"}
              </a>
            </div>
          </article>

          <article className="pricing-tier-card pricing-tier-card-pack">
            <p className="pricing-name">{locale === "ms" ? "Pakej Subjek" : "Subject Pack"}</p>
            <h2>RM19 / RM29</h2>
            <p className="pricing-detail">{locale === "ms" ? "Majukan subjek tertentu dengan maklum balas AI penuh dan misi harian." : "Improve specific subjects with full AI feedback and daily missions."}</p>
            <div className="pricing-pack-options">
              {focusPacks.map((plan) => (
                <div className="pricing-pack-option" key={plan!.code}>
                  <div>
                    <strong>{plan!.name}</strong>
                    <span>{plan!.priceLabel}</span>
                  </div>
                  <p>{plan!.detail}</p>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/upgrade?plan=language_pack">
                {locale === "ms" ? "Pilih subjek anda" : "Choose your subjects"}
              </a>
              <a className="btn btn-secondary" href="/login">
                {locale === "ms" ? "Log masuk untuk teruskan" : "Login to continue"}
              </a>
            </div>
          </article>

          <article className="pricing-tier-card pricing-tier-card-highlight">
            <div className="pricing-highlight-top">
              <span className="pricing-popular-badge">{locale === "ms" ? "Paling Popular" : "Most Popular"}</span>
            </div>
            <p className="pricing-name">{locale === "ms" ? "Akses Semua Subjek" : "All Subjects Access"}</p>
            <h2>{allAccess?.priceLabel || "RM59"}</h2>
            <p className="pricing-detail">{locale === "ms" ? "Semua yang anda perlukan untuk maju lebih cepat." : "Everything you need to improve faster."}</p>
            <ul className="feature-list">
              <li>{locale === "ms" ? "Semua 6 subjek dibuka" : "All 6 subjects unlocked"}</li>
              <li>{locale === "ms" ? "Sistem maklum balas AI penuh" : "Full AI feedback system"}</li>
              <li>{locale === "ms" ? "Penjejakan kemajuan yang lebih pantas" : "Faster improvement tracking"}</li>
              <li>{locale === "ms" ? "Nilai terbaik untuk persediaan peperiksaan" : "Best value for exam prep"}</li>
            </ul>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/upgrade?plan=all_access">
                {locale === "ms" ? "Mula akses penuh" : "Start full access"}
              </a>
              <a className="btn btn-secondary" href="/login">
                {locale === "ms" ? "Log masuk untuk teruskan" : "Login to continue"}
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">{locale === "ms" ? "Apa yang pelajar dapat" : "What students get"}</p>
          <h2>{locale === "ms" ? "Apa yang pelajar dapat selepas naik taraf" : "What students get after upgrading"}</h2>
        </div>

        <div className="pricing-results-grid">
          <article className="pricing-result-card">
            <span className="dashboard-label">{locale === "ms" ? "Bahasa Inggeris" : "English"}</span>
            <strong>{locale === "ms" ? "Ketepatan tatabahasa ↑" : "Grammar accuracy ↑"}</strong>
          </article>
          <article className="pricing-result-card">
            <span className="dashboard-label">{locale === "ms" ? "Pertumbuhan bahasa" : "Language growth"}</span>
            <strong>{locale === "ms" ? "Julat kosa kata ↑" : "Vocabulary range ↑"}</strong>
          </article>
          <article className="pricing-result-card">
            <span className="dashboard-label">{locale === "ms" ? "Prestasi keseluruhan" : "Overall performance"}</span>
            <strong>{locale === "ms" ? "Skor band ↑" : "Band score ↑"}</strong>
          </article>
        </div>
      </section>

      <section className="section">
        <article className="pricing-trigger-panel">
          <div>
            <p className="eyebrow">{locale === "ms" ? "Kenapa pelajar pilih Akses Penuh" : "Why students choose All Access"}</p>
            <h2>{locale === "ms" ? "Kebanyakan pelajar bermula dengan Akses Penuh kerana mereka mahu laluan paling cepat." : "Most students start with All Access because they want the fastest path."}</h2>
          </div>
          <ul className="pricing-trigger-list">
            <li>{locale === "ms" ? "Mereka tidak mahu meneka apa yang perlu dipelajari" : "They don&apos;t want to guess what to study"}</li>
            <li>{locale === "ms" ? "Mereka mahu peningkatan yang lebih cepat" : "They want faster improvement"}</li>
            <li>{locale === "ms" ? "Mereka sedang membuat persediaan SPM secara serius" : "They are preparing for SPM seriously"}</li>
          </ul>
        </article>
      </section>

      <section className="section landing-final-cta">
        <article className="landing-cta-card">
          <p className="eyebrow">{locale === "ms" ? "Mulakan akses penuh 7 hari anda sekarang" : "Start your 7-day full access now"}</p>
          <h2>{locale === "ms" ? "Mula bertambah baik hari ini." : "Start improving today."}</h2>
          <p className="landing-lead">{locale === "ms" ? "Tanpa tekanan. Hanya kemajuan kecil harian yang terkumpul." : "No stress. Just small daily progress that adds up."}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/register">
              {locale === "ms" ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
