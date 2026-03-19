import { AuthForm } from "../../components/auth-form";

export default function RegisterPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="auth-layout">
        <article className="auth-side-panel">
          <p className="eyebrow">7-day full access</p>
          <h1>Try SenangBah across all six subjects.</h1>
          <p className="landing-lead">
            Start with English if that is your main goal, but the full platform also includes Bahasa Melayu, Sejarah, Geografi, Math, and Add Math.
          </p>
          <div className="auth-benefit-list">
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>Writing, grammar, vocab, and daily missions</strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>Progress tracking, streaks, and AI-guided next steps</strong>
            </div>
            <div className="auth-benefit-item">
              <span className="auth-benefit-dot" />
              <strong>One clean place to improve subject by subject</strong>
            </div>
          </div>
        </article>

        <AuthForm mode="register" />
      </section>
    </main>
  );
}
