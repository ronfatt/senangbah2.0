import { AuthForm } from "../../components/auth-form";
import { getServerLocale } from "../../lib/server-locale";

export default async function LoginPage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell landing-v2-shell auth-shell auth-shell-v2">
      <section className="auth-hero-v2">
        <article className="auth-side-panel auth-side-panel-v2">
          <span className="landing-v2-badge">{locale === "ms" ? "SELAMAT KEMBALI" : "WELCOME BACK"} ✨</span>
          <h1>{locale === "ms" ? "Teruskan semula perjalanan pembelajaran AI anda." : "Continue your AI learning journey."}</h1>
          <p className="landing-v2-lead auth-hero-lead">
            {locale === "ms"
              ? "Log masuk semula untuk melihat misi, streak, Mata Bintang, dan kemajuan anda merentas Bahasa Inggeris, BM, Sejarah, Geografi, Matematik, dan Matematik Tambahan."
              : "Log back in to see your missions, streak, Star Points, and progress across English, BM, Sejarah, Geografi, Math, and Add Math."}
          </p>

          <div className="auth-benefit-list auth-benefit-list-v2">
            <div className="auth-benefit-item auth-benefit-item-v2">
              <span className="auth-benefit-dot" />
              <div>
                <strong>{locale === "ms" ? "Misi harian yang ringkas" : "Short daily missions"}</strong>
                <p>{locale === "ms" ? "Sambung terus dari tempat anda berhenti." : "Pick up right where you left off."}</p>
              </div>
            </div>
            <div className="auth-benefit-item auth-benefit-item-v2">
              <span className="auth-benefit-dot" />
              <div>
                <strong>
                  {locale === "ms" ? "AI tunjuk apa yang perlu dibaiki" : "AI shows what to fix next"}
                </strong>
                <p>{locale === "ms" ? "Jawapan yang lebih baik masih menunggu anda." : "Your better answers are waiting for you."}</p>
              </div>
            </div>
            <div className="auth-benefit-item auth-benefit-item-v2">
              <span className="auth-benefit-dot" />
              <div>
                <strong>{locale === "ms" ? "Satu dashboard untuk semua subjek" : "One dashboard for all subjects"}</strong>
                <p>{locale === "ms" ? "Lihat semua kemajuan anda di satu tempat." : "See all your progress in one place."}</p>
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
              <strong>{locale === "ms" ? "1,200+ pelajar" : "1,200+ students"}</strong>
              <p>{locale === "ms" ? "Belajar setiap minggu" : "Learning every week"} ⭐</p>
            </div>
          </div>
        </article>

        <AuthForm locale={locale} mode="login" />
      </section>
    </main>
  );
}
