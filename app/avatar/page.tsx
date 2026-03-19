import { AvatarClosetClient } from "../../components/avatar-closet-client";
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

export default function AvatarPage() {
  const weeklyDrop = getWeeklyDrop();
  const weeklyDropUrgency = weeklyDrop ? getWeeklyDropUrgency(weeklyDrop.endIso) : null;

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
          <p className="eyebrow">Closet goal</p>
          <h2>Make progress visible on the character, not only on charts.</h2>
          <p className="dashboard-helper">
            The live preview below now changes from equipped items. This top block stays focused on the product idea:
            students should feel that stronger study results make their avatar more interesting.
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
            <p className="eyebrow">Weekly drop</p>
            <h2>This week&apos;s featured item gives students one more reason to come back.</h2>
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
                  <span className="dashboard-label">Urgency</span>
                  <strong>{weeklyDropUrgency?.label}</strong>
                  <p className="dashboard-helper">{weeklyDropUrgency?.helper}</p>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Collection</span>
                  <strong>{weeklyDrop.collectionName}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Price</span>
                  <strong>{weeklyDrop.pricePoints} pts</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Ends this week</span>
                  <strong>{new Date(weeklyDrop.endIso).toLocaleDateString("en-MY")}</strong>
                </div>
              </div>
            </article>

            <article className="feature-panel alt">
              <p className="eyebrow">Best mission for this drop</p>
              <h2>{weeklyDrop.mission?.title || "Open a focused mission"}</h2>
              <p className="dashboard-helper">
                {weeklyDrop.mission?.helper || "Use this week&apos;s featured item to pull students into a specific subject lane."}
              </p>
              <p className="dashboard-helper">
                {weeklyDropUrgency?.label === "Ends today"
                  ? "This is a good place to add end-of-week urgency without feeling too aggressive."
                  : "The featured mission gives students a simple answer to what they should do next."}
              </p>
              {weeklyDrop.mission ? (
                <div className="hero-actions">
                  <a className="btn btn-primary" href={weeklyDrop.mission.href}>
                    {weeklyDrop.mission.subject}: {weeklyDrop.mission.title}
                  </a>
                  <a className="btn btn-secondary" href="/subjects">
                    Browse all subjects
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
