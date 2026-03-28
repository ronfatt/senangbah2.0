import { AuthForm } from "../../components/auth-form";
import { getServerLocale } from "../../lib/server-locale";

export default async function RegisterPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell landing-v2-shell auth-shell auth-shell-v2">
      <section className="auth-hero-v2">
        <article className="auth-side-panel auth-side-panel-v2">
          <span className="landing-v2-badge">{locale === "ms" ? "AKSES PENUH 7 HARI" : "7-DAY FULL ACCESS"} ✨</span>
          <h1>{locale === "ms" ? "Mula percubaan anda untuk semua enam subjek." : "Start your trial across all six subjects."}</h1>
          <p className="landing-v2-lead auth-hero-lead">
            {locale === "ms"
              ? "Daftar sekali dan cuba Bahasa Inggeris, BM, Sejarah, Geografi, Matematik, dan Matematik Tambahan dengan bimbingan AI yang sama."
              : "Sign up once and explore English, BM, Sejarah, Geografi, Math, and Add Math with the same AI-guided learning system."}
          </p>

          <div className="auth-benefit-list auth-benefit-list-v2">
            <div className="auth-benefit-item auth-benefit-item-v2">
              <span className="auth-benefit-dot" />
              <div>
                <strong>{locale === "ms" ? "Semua subjek dibuka" : "All subjects unlocked"}</strong>
                <p>{locale === "ms" ? "Terus cuba keenam-enam laluan pembelajaran." : "Try all six learning paths right away."}</p>
              </div>
            </div>
            <div className="auth-benefit-item auth-benefit-item-v2">
              <span className="auth-benefit-dot" />
              <div>
                <strong>{locale === "ms" ? "Maklum balas AI yang jelas" : "Clear AI feedback"}</strong>
                <p>{locale === "ms" ? "Lihat kesilapan, pembaikan, dan langkah seterusnya." : "See the mistake, the fix, and the next step."}</p>
              </div>
            </div>
            <div className="auth-benefit-item auth-benefit-item-v2">
              <span className="auth-benefit-dot" />
              <div>
                <strong>{locale === "ms" ? "Kemajuan harian yang ringan" : "Light daily progress"}</strong>
                <p>{locale === "ms" ? "Belajar 10–15 minit sehari tanpa rasa terbeban." : "Study 10–15 minutes a day without feeling overwhelmed."}</p>
              </div>
            </div>
          </div>

          <div className="landing-v2-proof auth-proof">
            <div className="landing-v2-proof-dots" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <strong>{locale === "ms" ? "7 hari akses penuh" : "7 days full access"}</strong>
              <p>{locale === "ms" ? "Cuba semua enam subjek" : "Try all six subjects"} 🚀</p>
            </div>
          </div>
        </article>

        <AuthForm locale={locale} mode="register" />
      </section>
    </main>
  );
}
