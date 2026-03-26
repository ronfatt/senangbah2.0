import { AuthForm } from "../../components/auth-form";
import { getServerLocale } from "../../lib/server-locale";

export default async function LoginPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell auth-shell">
      <section className="auth-layout">
        <article className="auth-side-panel">
          <p className="eyebrow">{locale === "ms" ? "Platform pembelajaran AI" : "AI learning platform"}</p>
          <h1>{locale === "ms" ? "Log masuk dan teruskan kemajuan anda." : "Login and keep your progress moving."}</h1>
          <p className="landing-lead">
            {locale === "ms"
              ? "Streak, misi, Mata Bintang, dan kemajuan subjek anda kekal di satu tempat merentas Bahasa Inggeris, Bahasa Melayu, Sejarah, Geografi, Matematik, dan Matematik Tambahan."
              : "Your streak, missions, Star Points, and subject progress stay in one place across English, BM, Sejarah, Geografi, Math, and Add Math."}
          </p>
          <div className="auth-benefit-list">
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>{locale === "ms" ? "Misi harian yang ringkas" : "Short daily missions"}</strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>
                {locale === "ms" ? "Maklum balas AI yang menerangkan kelemahan anda" : "AI feedback that explains your weak points"}
              </strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>{locale === "ms" ? "Satu dashboard untuk semua enam subjek" : "One dashboard for all six subjects"}</strong>
            </div>
          </div>
        </article>

        <AuthForm locale={locale} mode="login" />
      </section>
    </main>
  );
}
