import { AvatarClosetClient } from "../../components/avatar-closet-client";
import { getServerLocale } from "../../lib/server-locale";

export default async function AvatarPage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";

  return (
    <main className="page-shell dashboard-shell dashboard-shell-v3 avatar-v3-shell avatar-page-v4">
      <section className="dashboard-v3-hero dashboard-v3-page-hero avatar-page-v4-hero">
        <p className="dashboard-v3-welcome">{isMalay ? "Ganjaran dan gaya" : "Rewards and style"} ✨</p>
        <h1>{isMalay ? "Avatar anda berkembang setiap kali anda belajar." : "Your avatar grows every time you study."}</h1>
        <p className="dashboard-v3-hero-copy">
          {isMalay
            ? "Kumpul Mata Bintang, buka item baharu, dan lihat ganjaran anda berubah menjadi gaya yang benar-benar terasa milik anda."
            : "Collect Star Points, unlock new items, and watch your rewards turn into a style that genuinely feels like yours."}
        </p>
        <div className="dashboard-v3-hero-actions">
          <a className="btn btn-primary" href="/my-subjects">
            {isMalay ? "Mulakan misi seterusnya" : "Start Next Mission"}
          </a>
          <a className="btn btn-secondary" href="/progress">
            {isMalay ? "Buka laporan kemajuan" : "Open Progress Report"}
          </a>
        </div>
      </section>

      <AvatarClosetClient locale={locale} />
    </main>
  );
}
