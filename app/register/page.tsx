import { AuthForm } from "../../components/auth-form";
import { getServerLocale } from "../../lib/server-locale";

export default async function RegisterPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell auth-shell">
      <section className="auth-layout">
        <article className="auth-side-panel">
          <p className="eyebrow">{locale === "ms" ? "Akses penuh 7 hari" : "7-day full access"}</p>
          <h1>{locale === "ms" ? "Cuba SenangBah untuk semua enam subjek." : "Try SenangBah across all six subjects."}</h1>
          <p className="landing-lead">
            {locale === "ms"
              ? "Mulakan dengan Bahasa Inggeris jika itu matlamat utama anda, tetapi platform penuh juga merangkumi Bahasa Melayu, Sejarah, Geografi, Matematik, dan Matematik Tambahan."
              : "Start with English if that is your main goal, but the full platform also includes Bahasa Melayu, Sejarah, Geografi, Math, and Add Math."}
          </p>
          <div className="auth-benefit-list">
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>
                {locale === "ms"
                  ? "Penulisan, tatabahasa, kosa kata, dan misi harian"
                  : "Writing, grammar, vocab, and daily missions"}
              </strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>
                {locale === "ms"
                  ? "Penjejakan kemajuan, streak, dan langkah seterusnya yang dipandu AI"
                  : "Progress tracking, streaks, and AI-guided next steps"}
              </strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>
                {locale === "ms"
                  ? "Satu tempat yang kemas untuk maju subjek demi subjek"
                  : "One clean place to improve subject by subject"}
              </strong>
            </div>
          </div>
        </article>

        <AuthForm locale={locale} mode="register" />
      </section>
    </main>
  );
}
