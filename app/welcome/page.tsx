import { OnboardingWelcomeClient } from "../../components/onboarding-welcome-client";
import { getServerLocale } from "../../lib/server-locale";

export default async function WelcomePage() {
  const locale = await getServerLocale();
  return (
    <main className="page-shell dashboard-shell dashboard-shell-v3 welcome-v3-shell">
      <section className="dashboard-v3-hero dashboard-v3-page-hero">
        <p className="dashboard-v3-welcome">{locale === "ms" ? "Selamat datang" : "Welcome"}</p>
        <h1>{locale === "ms" ? "Tetapkan fokus belajar pertama anda." : "Set your first study focus."}</h1>
        <p className="dashboard-v3-hero-copy">
          {locale === "ms"
            ? "Ini hanya mengambil beberapa saat. Kami akan gunakannya untuk menentukan subjek dan gaya misi yang patut datang dahulu dalam dashboard anda."
            : "This only takes a few seconds. We will use it to decide which subject and mission style should come first in your dashboard."}
        </p>
      </section>
      <OnboardingWelcomeClient locale={locale} />
    </main>
  );
}
