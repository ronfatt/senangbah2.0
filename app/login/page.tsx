import { AuthForm } from "../../components/auth-form";

export default function LoginPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="auth-layout">
        <article className="auth-side-panel">
          <p className="eyebrow">AI learning platform</p>
          <h1>Login and keep your progress moving.</h1>
          <p className="landing-lead">
            Your streak, missions, Star Points, and subject progress stay in one place across English, BM, Sejarah, Geografi, Math, and Add Math.
          </p>
          <div className="auth-benefit-list">
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>Short daily missions</strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>AI feedback that explains your weak points</strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>One dashboard for all six subjects</strong>
            </div>
          </div>
        </article>

        <AuthForm mode="login" />
      </section>
    </main>
  );
}
