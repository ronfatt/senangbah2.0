import { OnboardingWelcomeClient } from "../../components/onboarding-welcome-client";
import { getServerLocale } from "../../lib/server-locale";

export default async function WelcomePage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">{locale === "ms" ? "Selamat datang" : "Welcome"}</p>
        <h1 className="dashboard-title">
          {locale === "ms"
            ? "Tetapkan fokus belajar pertama anda sebelum masuk ke dashboard."
            : "Set your first study focus before you enter the dashboard."}
        </h1>
        <p className="landing-lead">
          {locale === "ms"
            ? "Ini hanya mengambil beberapa saat. Kami akan gunakannya untuk menentukan subjek dan misi yang patut datang dahulu."
            : "This only takes a few seconds. We will use it to decide which subject and mission should come first."}
        </p>
      </section>

      <OnboardingWelcomeClient locale={locale} />
    </main>
  );
}
