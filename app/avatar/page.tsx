import { AvatarClosetClient } from "../../components/avatar-closet-client";
import { avatarCatalog, avatarClosetSlots } from "../../lib/avatar-catalog";

const collectionHighlights = [
  "Study Core",
  "Sporty Pop",
  "Galaxy Explorer",
  "Exam Ace",
  "Neo Math"
];

export default function AvatarPage() {
  return (
    <main className="page-shell">
      <section className="subject-hero">
        <div className="subject-hero-copy">
          <p className="eyebrow">Avatar Closet</p>
          <h1 className="dashboard-title">Turn study wins into a character that actually feels yours.</h1>
          <p className="hero-text">
            SenangBah 2.0 uses Star Points to unlock outfits, accessories, and style collections. The goal is simple:
            stronger learning should feel visible, personal, and fun to keep building.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/dashboard">
              Back to dashboard
            </a>
            <a className="btn btn-secondary" href="/subjects">
              Earn more Star Points
            </a>
          </div>
        </div>

        <aside className="feature-panel alt avatar-preview-card">
          <p className="eyebrow">MVP preview</p>
          <h2>First avatar loop</h2>
          <div className="avatar-figure">
            <div className="avatar-head" />
            <div className="avatar-top" />
            <div className="avatar-bottom" />
            <div className="avatar-shoes" />
            <div className="avatar-accessory" />
          </div>
          <p className="dashboard-helper">
            This is a placeholder preview for the first release. The next implementation step is to bind equipped items
            from inventory and render them slot by slot.
          </p>
        </aside>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>Study well, get stars, grow your closet.</h2>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <article className="dashboard-card">
            <p className="dashboard-label">Step 1</p>
            <h2>Earn stars</h2>
            <p className="dashboard-helper">AI still awards 1 to 3 stars based on how strong the work is.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-label">Step 2</p>
            <h2>Convert to points</h2>
            <p className="dashboard-helper">1 star = 80 pts, 2 stars = 140 pts, 3 stars = 220 pts.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-label">Step 3</p>
            <h2>Style your avatar</h2>
            <p className="dashboard-helper">Use points to unlock items that make the profile feel more personal.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Live closet</p>
            <h2>Preview mode is over. This page can now load balance, owned items, and equip actions.</h2>
          </div>
        </div>

        <AvatarClosetClient />
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Closet slots</p>
            <h2>Keep the first version simple and expressive.</h2>
          </div>
        </div>

        <div className="bundle-grid">
          {avatarClosetSlots.map((slot) => (
            <article className="bundle-card" key={slot.code}>
              <p className="dashboard-label">{slot.code}</p>
              <h3>{slot.name}</h3>
              <p className="dashboard-helper">Each slot can hold starter, shop, and achievement-based items.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Collections</p>
            <h2>Give students a reason to save, mix, and return.</h2>
          </div>
        </div>

        <div className="coach-signal-grid">
          {collectionHighlights.map((collection) => (
            <article className="english-module-card" key={collection}>
              <p className="dashboard-label">Style line</p>
              <h3>{collection}</h3>
              <p className="dashboard-helper">
                Each collection can later connect to subjects, badges, and limited drops without changing the core economy.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Starter shop</p>
            <h2>First release item mix</h2>
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
