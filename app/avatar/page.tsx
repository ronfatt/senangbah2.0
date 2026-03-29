import { AvatarClosetClient } from "../../components/avatar-closet-client";
import { getServerLocale } from "../../lib/server-locale";
import {
  avatarCatalog,
  avatarClosetSlots,
  getCollectionMission,
  getWeeklyDrop,
  getWeeklyDropUrgency
} from "../../lib/avatar-catalog";

const collectionHighlights = [
  "Study Core",
  "Sporty Pop",
  "Galaxy Explorer",
  "Exam Ace",
  "Neo Math"
];

export default async function AvatarPage() {
  const locale = await getServerLocale();
  const isMalay = locale === "ms";
  const weeklyDrop = getWeeklyDrop();
  const weeklyDropUrgency = weeklyDrop ? getWeeklyDropUrgency(weeklyDrop.endIso) : null;

  return (
    <main className="page-shell dashboard-shell dashboard-shell-v3 avatar-v3-shell">
      <section className="dashboard-v3-hero dashboard-v3-page-hero">
        <p className="dashboard-v3-welcome">{isMalay ? "Gaya dan ganjaran" : "Style and rewards"}</p>
        <h1>{isMalay ? "Avatar Closet" : "Avatar Closet"} ✨</h1>
        <p className="dashboard-v3-hero-copy">
          {isMalay
            ? "Tukar kemenangan belajar menjadi gaya yang terasa milik anda. Kumpul Mata Bintang, buka item baru, dan pastikan kemajuan anda benar-benar kelihatan."
            : "Turn study wins into a style that feels like yours. Collect Star Points, unlock new items, and make your progress feel visible."}
        </p>
        <div className="dashboard-v3-hero-actions">
          <a className="btn btn-primary" href="/dashboard">
            {isMalay ? "Kembali ke Dashboard" : "Back to Dashboard"}
          </a>
          <a className="btn btn-secondary" href="/my-subjects">
            {isMalay ? "Dapatkan lebih banyak Mata Bintang" : "Earn More Star Points"}
          </a>
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{isMalay ? "Cara ia berfungsi" : "How it works"}</p>
            <h2>{isMalay ? "Belajar dengan baik, dapatkan bintang, dan besarkan almari anda." : "Study well, get stars, grow your closet."}</h2>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <article className="dashboard-card">
            <p className="dashboard-label">{isMalay ? "Langkah 1" : "Step 1"}</p>
            <h2>{isMalay ? "Dapatkan bintang" : "Earn stars"}</h2>
            <p className="dashboard-helper">{isMalay ? "AI masih memberi 1 hingga 3 bintang berdasarkan kekuatan hasil kerja." : "AI still awards 1 to 3 stars based on how strong the work is."}</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-label">{isMalay ? "Langkah 2" : "Step 2"}</p>
            <h2>{isMalay ? "Tukar kepada mata" : "Convert to points"}</h2>
            <p className="dashboard-helper">{isMalay ? "1 bintang = 80 mata, 2 bintang = 140 mata, 3 bintang = 220 mata." : "1 star = 80 pts, 2 stars = 140 pts, 3 stars = 220 pts."}</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-label">{isMalay ? "Langkah 3" : "Step 3"}</p>
            <h2>{isMalay ? "Gayakan avatar anda" : "Style your avatar"}</h2>
            <p className="dashboard-helper">{isMalay ? "Gunakan mata untuk membuka item yang menjadikan profil terasa lebih peribadi." : "Use points to unlock items that make the profile feel more personal."}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{isMalay ? "Drop mingguan" : "Weekly drop"}</p>
            <h2>{isMalay ? "Item pilihan minggu ini memberi pelajar satu lagi sebab untuk kembali." : "This week&apos;s featured item gives students one more reason to come back."}</h2>
          </div>
        </div>

        {weeklyDrop ? (
          <div className="dashboard-mission-grid">
            <article className="feature-panel">
              <p className="eyebrow">{weeklyDrop.headline}</p>
              <h2>{weeklyDrop.name}</h2>
              <p className="dashboard-helper">{weeklyDrop.helper}</p>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">{isMalay ? "Keutamaan" : "Urgency"}</span>
                  <strong>{weeklyDropUrgency?.label}</strong>
                  <p className="dashboard-helper">{weeklyDropUrgency?.helper}</p>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{isMalay ? "Koleksi" : "Collection"}</span>
                  <strong>{weeklyDrop.collectionName}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{isMalay ? "Harga" : "Price"}</span>
                  <strong>{weeklyDrop.pricePoints} pts</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{isMalay ? "Tamat minggu ini" : "Ends this week"}</span>
                  <strong>{new Date(weeklyDrop.endIso).toLocaleDateString("en-MY")}</strong>
                </div>
              </div>
            </article>

            <article className="feature-panel alt">
              <p className="eyebrow">{isMalay ? "Misi terbaik untuk drop ini" : "Best mission for this drop"}</p>
              <h2>{weeklyDrop.mission?.title || (isMalay ? "Buka misi yang fokus" : "Open a focused mission")}</h2>
              <p className="dashboard-helper">
                {weeklyDrop.mission?.helper || (isMalay ? "Gunakan item pilihan minggu ini untuk menarik pelajar ke laluan subjek tertentu." : "Use this week&apos;s featured item to pull students into a specific subject lane.")}
              </p>
              <p className="dashboard-helper">
                {weeklyDropUrgency?.label === "Ends today"
                  ? isMalay
                    ? "Ini tempat yang sesuai untuk menambah rasa mendesak hujung minggu tanpa terasa terlalu agresif."
                    : "This is a good place to add end-of-week urgency without feeling too aggressive."
                  : isMalay
                    ? "Misi pilihan memberi pelajar jawapan yang mudah tentang apa yang patut dibuat seterusnya."
                    : "The featured mission gives students a simple answer to what they should do next."}
              </p>
              {weeklyDrop.mission ? (
                <div className="hero-actions">
                  <a className="btn btn-primary" href={weeklyDrop.mission.href}>
                    {weeklyDrop.mission.subject}: {weeklyDrop.mission.title}
                  </a>
                  <a className="btn btn-secondary" href="/my-subjects">
                    {isMalay ? "Buka Subjek Saya" : "Open My Subjects"}
                  </a>
                </div>
              ) : null}
            </article>
          </div>
        ) : null}
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{isMalay ? "Almari langsung" : "Live closet"}</p>
            <h2>{isMalay ? "Mod pratonton sudah tamat. Halaman ini kini boleh memuat baki, item dimiliki, dan tindakan pakai." : "Preview mode is over. This page can now load balance, owned items, and equip actions."}</h2>
          </div>
        </div>

        <AvatarClosetClient locale={locale} />
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{isMalay ? "Slot almari" : "Closet slots"}</p>
            <h2>{isMalay ? "Pastikan versi pertama ringkas dan ekspresif." : "Keep the first version simple and expressive."}</h2>
          </div>
        </div>

        <div className="bundle-grid">
          {avatarClosetSlots.map((slot) => (
            <article className="bundle-card" key={slot.code}>
              <p className="dashboard-label">{slot.code}</p>
              <h3>{slot.name}</h3>
              <p className="dashboard-helper">{isMalay ? "Setiap slot boleh memegang item permulaan, kedai, dan item berdasarkan pencapaian." : "Each slot can hold starter, shop, and achievement-based items."}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{isMalay ? "Koleksi" : "Collections"}</p>
            <h2>{isMalay ? "Berikan pelajar sebab untuk menyimpan, menggabung, dan kembali." : "Give students a reason to save, mix, and return."}</h2>
          </div>
        </div>

        <div className="coach-signal-grid">
          {collectionHighlights.map((collection) => (
            <article className="english-module-card" key={collection}>
              <p className="dashboard-label">{isMalay ? "Garis gaya" : "Style line"}</p>
              <h3>{collection}</h3>
              <p className="dashboard-helper">
                {isMalay
                  ? "Setiap koleksi boleh disambungkan kemudian kepada subjek, lencana, dan drop terhad tanpa mengubah ekonomi teras."
                  : "Each collection can later connect to subjects, badges, and limited drops without changing the core economy."}
              </p>
              {getCollectionMission(collection) ? (
                <a className="mini-link" href={getCollectionMission(collection)?.href}>
                  {getCollectionMission(collection)?.subject}: {getCollectionMission(collection)?.title}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{isMalay ? "Kedai permulaan" : "Starter shop"}</p>
            <h2>{isMalay ? "Campuran item keluaran pertama" : "First release item mix"}</h2>
          </div>
        </div>

        <div className="achievement-grid">
          {avatarCatalog.map((item) => (
            <article className="achievement-card" key={item.code}>
              <div className="module-card-head">
                <div>
                  <p className="dashboard-label">{item.collectionName}</p>
                  <h3>{item.name}</h3>
                </div>
                <span className={`module-state ${item.rarity === "epic" ? "state-locked" : item.rarity === "rare" ? "state-ready" : "state-coming_soon"}`}>
                  {item.rarity}
                </span>
              </div>
              <p className="dashboard-helper">
                {item.slot} · {item.unlockType === "shop" ? `${item.pricePoints} pts` : item.unlockType}
              </p>
              <p className="dashboard-helper">{item.helper}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
