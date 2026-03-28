import { getPlanCatalog } from "../../lib/catalog";
import { getServerLocale } from "../../lib/server-locale";

export default async function PricingPage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";
  const plans = await getPlanCatalog();

  const freePlan = plans.find((plan) => plan.code === "free");
  const allAccess = plans.find((plan) => plan.code === "all_access");
  const packs = plans.filter((plan) => ["language_pack", "humanities_pack", "math_pack"].includes(plan.code));

  return (
    <main className="page-shell landing-v2-shell public-detail-shell">
      <section className="public-detail-hero public-detail-hero-pricing">
        <div className="public-detail-copy">
          <span className="landing-v2-badge">{isMalay ? "HARGA & NAIK TARAF" : "PRICING & UPGRADES"} 💸</span>
          <h1>{isMalay ? "Pilih laluan naik taraf anda. Mula maju dalam 7 hari." : "Pick your upgrade path. Start improving in 7 days."}</h1>
          <p className="public-detail-lead">
            {isMalay
              ? "Tiada teka-teki. Hanya kemajuan yang jelas merentas subjek SPM anda."
              : "No guessing. Just clear progress across your SPM subjects."}
          </p>
          <div className="hero-actions">
            <a className="btn landing-v2-primary-btn" href="/upgrade?plan=all_access">
              {isMalay ? "Mula akses penuh" : "Start full access"}
            </a>
            <a className="btn landing-v2-secondary-btn" href="/register">
              {isMalay ? "Mula percubaan percuma" : "Start free trial"}
            </a>
          </div>
        </div>

        <article className="public-detail-preview">
          <div className="public-detail-preview-card">
            <span className="dashboard-label">{isMalay ? "Pilihan paling popular" : "Most popular choice"}</span>
            <h3>{isMalay ? "Kebanyakan pelajar memilih Akses Penuh" : "Most students choose All Access"}</h3>
            <div className="public-detail-preview-flow">
              <div><strong>{isMalay ? "Tiada teka-teki" : "No guessing"}</strong><span>{isMalay ? "Semua subjek dibuka" : "All subjects unlocked"}</span></div>
              <div><strong>{isMalay ? "Lebih cepat" : "Faster"}</strong><span>{isMalay ? "AI penuh + kemajuan" : "Full AI + progress tracking"}</span></div>
              <div><strong>{isMalay ? "SPM" : "SPM"}</strong><span>{isMalay ? "Sesuai untuk persediaan serius" : "Built for serious prep"}</span></div>
            </div>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-light">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "TINGKAT HARGA" : "PRICING TIERS"} 🔥</span>
          <h2>{isMalay ? "Tiga tahap yang jelas. Satu jalan untuk bermula." : "Three clear levels. One easy way to start."}</h2>
        </div>
        <div className="public-pricing-grid">
          <article className="public-price-card free">
            <small>{isMalay ? "PERCUMA" : "FREE"}</small>
            <h3>{isMalay ? "Permulaan Percuma" : "Free Starter"}</h3>
            <strong>{freePlan?.priceLabel || "RM0"}</strong>
            <p>{isMalay ? "Misi asas harian, subjek terhad, dan maklum balas asas." : "Daily basic missions, limited subjects, and basic feedback."}</p>
            <ul>
              <li>{isMalay ? "Misi asas harian" : "Daily basic missions"}</li>
              <li>{isMalay ? "Subjek terhad" : "Limited subjects"}</li>
              <li>{isMalay ? "Maklum balas asas" : "Basic feedback"}</li>
            </ul>
            <a className="btn btn-secondary" href="/register">{isMalay ? "Cuba percuma" : "Try free"}</a>
          </article>

          <article className="public-price-card pack">
            <small>{isMalay ? "PAKEJ SUBJEK" : "SUBJECT PACK"}</small>
            <h3>{isMalay ? "Pilih subjek fokus anda" : "Choose your focus subjects"}</h3>
            <strong>RM19 / RM29</strong>
            <p>{isMalay ? "Akses penuh untuk subjek pilihan anda dengan maklum balas AI dan misi harian." : "Full access for selected subjects with AI feedback and daily missions."}</p>
            <div className="public-pack-options">
              {packs.map((plan) => (
                <div key={plan.code}>
                  <b>{plan.name}</b>
                  <span>{plan.priceLabel}</span>
                </div>
              ))}
            </div>
            <a className="btn landing-v2-secondary-btn" href="/upgrade?plan=language_pack">{isMalay ? "Pilih subjek anda" : "Choose your subjects"}</a>
          </article>

          <article className="public-price-card highlight">
            <span className="public-price-badge">{isMalay ? "Paling Popular" : "Most Popular"}</span>
            <small>{isMalay ? "AKSES PENUH" : "ALL ACCESS"}</small>
            <h3>{isMalay ? "Akses Semua Subjek" : "All Subjects Access"}</h3>
            <strong>{allAccess?.priceLabel || "RM59"}</strong>
            <p>{isMalay ? "Semua yang anda perlukan untuk maju lebih cepat." : "Everything you need to improve faster."}</p>
            <ul>
              <li>{isMalay ? "Semua 6 subjek dibuka" : "All 6 subjects unlocked"}</li>
              <li>{isMalay ? "Sistem maklum balas AI penuh" : "Full AI feedback system"}</li>
              <li>{isMalay ? "Penjejakan kemajuan yang lebih pantas" : "Faster improvement tracking"}</li>
              <li>{isMalay ? "Nilai terbaik untuk persediaan peperiksaan" : "Best value for exam prep"}</li>
            </ul>
            <a className="btn landing-v2-primary-btn" href="/upgrade?plan=all_access">{isMalay ? "Mula akses penuh" : "Start full access"}</a>
          </article>
        </div>
      </section>

      <section className="landing-v2-section landing-v2-white">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "APA YANG PELAJAR DAPAT" : "WHAT STUDENTS GET"} 📈</span>
          <h2>{isMalay ? "Apa yang pelajar nampak selepas naik taraf" : "What students get after upgrading"}</h2>
        </div>
        <article className="landing-v2-stats-banner">
          <div className="landing-v2-stats-grid">
            <div><strong>{isMalay ? "Tatabahasa ↑" : "Grammar ↑"}</strong><span>{isMalay ? "Ketepatan jadi lebih kuat" : "Accuracy gets stronger"}</span></div>
            <div><strong>{isMalay ? "Kosa kata ↑" : "Vocabulary ↑"}</strong><span>{isMalay ? "Range bahasa bertambah" : "Language range grows"}</span></div>
            <div><strong>{isMalay ? "Band ↑" : "Band ↑"}</strong><span>{isMalay ? "Kemajuan lebih mudah dilihat" : "Progress becomes easier to see"}</span></div>
          </div>
        </article>
      </section>

      <section className="landing-v2-section landing-v2-cream">
        <div className="landing-v2-heading">
          <span className="landing-v2-pill">{isMalay ? "KENAPA PILIH AKSES PENUH" : "WHY CHOOSE ALL ACCESS"} 🧠</span>
          <h2>{isMalay ? "Kenapa kebanyakan pelajar bermula dengan Akses Penuh" : "Why most students start with All Access"}</h2>
        </div>
        <div className="landing-v2-card-triplet">
          <article className="public-soft-card">
            <h3>{isMalay ? "Tidak mahu meneka" : "They don't want to guess"}</h3>
            <p>{isMalay ? "Pelajar mahu sistem yang jelas tanpa perlu fikir subjek mana patut dimula dahulu." : "Students want one clear system without guessing which subject to start with."}</p>
          </article>
          <article className="public-soft-card">
            <h3>{isMalay ? "Mahu maju lebih cepat" : "They want faster improvement"}</h3>
            <p>{isMalay ? "Apabila semua subjek dibuka, AI boleh memandu langkah seterusnya dengan lebih tepat." : "When every subject is unlocked, AI can guide the next move more accurately."}</p>
          </article>
          <article className="public-soft-card">
            <h3>{isMalay ? "Sedang bersedia untuk SPM" : "They are preparing for SPM"}</h3>
            <p>{isMalay ? "Mereka perlukan nilai terbaik dan semua laluan subjek untuk ulang kaji yang serius." : "They need the best value and every subject path for serious exam prep."}</p>
          </article>
        </div>
      </section>

      <section className="landing-v2-section landing-v2-final">
        <div className="landing-v2-final-copy">
          <span className="landing-v2-badge">{isMalay ? "AKSES PENUH 7 HARI" : "7-DAY FULL ACCESS"} 🚀</span>
          <h2>{isMalay ? "Mula akses penuh anda sekarang." : "Start your 7-day full access now"}</h2>
          <p>{isMalay ? "Tanpa tekanan. Hanya kemajuan kecil yang jelas merentas subjek anda." : "No stress. Just clear progress across your subjects."}</p>
          <div className="hero-actions">
            <a className="btn landing-v2-white-btn" href="/register">
              {isMalay ? "Mula Belajar Dengan AI" : "Start My AI Learning"}
            </a>
          </div>
        </div>
        <article className="public-detail-side-card">
          <div className="public-detail-side-stat">
            <strong>RM0</strong>
            <span>{isMalay ? "percubaan 7 hari" : "7-day trial"}</span>
          </div>
          <div className="public-detail-side-stat">
            <strong>6</strong>
            <span>{isMalay ? "subjek dibuka" : "subjects unlocked"}</span>
          </div>
          <div className="public-detail-side-stat">
            <strong>AI</strong>
            <span>{isMalay ? "bimbingan penuh" : "full guidance"}</span>
          </div>
        </article>
      </section>
    </main>
  );
}
