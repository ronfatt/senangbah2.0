import { OnboardingWelcomeClient } from "../../components/onboarding-welcome-client";

export default function WelcomePage() {
  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">Welcome</p>
        <h1 className="dashboard-title">Set your first study focus before you enter the dashboard.</h1>
        <p className="landing-lead">
          This only takes a few seconds. We will use it to decide which subject and mission should come first.
        </p>
      </section>

      <OnboardingWelcomeClient />
    </main>
  );
}
