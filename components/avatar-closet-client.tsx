"use client";

import { useEffect, useMemo, useState } from "react";
import { AvatarPreviewFigure } from "./avatar-preview-figure";
import { getCollectionMission, getWeeklyDrop, getWeeklyDropUrgency } from "../lib/avatar-catalog";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";
import { getRankFromPoints } from "../lib/rewards";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

type ClosetSnapshot = {
  totalPoints: number;
  spentPoints: number;
  availablePoints: number;
  collectionProgress: {
    collectionName: string;
    ownedCount: number;
    totalCount: number;
    progressPercent: number;
  }[];
  items: {
    code: string;
    name: string;
    rarity: string;
    pricePoints: number;
    unlockType: string;
    collectionName: string;
    requiredBadgeCode: string | null;
    requiredBadgeTitle: string | null;
    badgeUnlocked: boolean;
    slot: string;
    slotName: string;
    owned: boolean;
    imageSrc?: string;
    imageReady?: boolean;
    imagePrompt?: string;
  }[];
  equipped: {
    slot: string;
    slotName: string;
    itemCode: string;
    itemName: string;
  }[];
};

type ClosetCelebration = {
  type: "purchase" | "equip";
  itemName: string;
  collectionName?: string;
  pricePoints?: number;
};

export function AvatarClosetClient({ locale }: { locale: AppLocale }) {
  const isMalay = locale === "ms";
  const [closet, setCloset] = useState<ClosetSnapshot | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "signed_out" | "env_missing" | "schema_missing" | "error">(
    hasPublicSupabaseEnv() ? "loading" : "env_missing"
  );
  const [busyItemCode, setBusyItemCode] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<ClosetCelebration | null>(null);

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) return;

    const supabase = getSupabaseBrowserClient();

    async function loadSnapshot() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      const email = session?.user?.email || "";

      if (!session || !email) {
        setStatus("signed_out");
        setCloset(null);
        return;
      }

      const response = await fetch("/api/avatar/closet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email,
          action: "snapshot"
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(result?.error === "avatar_schema_missing" ? "schema_missing" : "error");
        return;
      }

      setCloset(result?.closet || null);
      setStatus("idle");
    }

    loadSnapshot();
  }, []);

  async function runAction(action: "purchase" | "equip", itemCode: string) {
    if (!hasPublicSupabaseEnv()) return;

    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    const email = session?.user?.email || "";

    if (!session || !email) {
      setStatus("signed_out");
      return;
    }

    setBusyItemCode(itemCode);
    const response = await fetch("/api/avatar/closet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authUserId: session.user.id,
        email,
        action,
        itemCode
      })
    });

    const result = await response.json().catch(() => ({}));
    setBusyItemCode(null);

    if (!response.ok) {
      setStatus(result?.error === "avatar_schema_missing" ? "schema_missing" : "error");
      return;
    }

    setCloset(result?.closet || null);
    setStatus("idle");

    const affectedItem = result?.closet?.items?.find?.((item: ClosetSnapshot["items"][number]) => item.code === itemCode);
    if (affectedItem) {
      setCelebration({
        type: action,
        itemName: affectedItem.name,
        collectionName: affectedItem.collectionName,
        pricePoints: affectedItem.pricePoints
      });
    }
  }

  const equippedBySlot = new Map((closet?.equipped || []).map((item) => [item.slot, item]));
  const weeklyDrop = getWeeklyDrop();
  const weeklyDropUrgency = weeklyDrop ? getWeeklyDropUrgency(weeklyDrop.endIso) : null;

  const sortedItems = useMemo(() => {
    const currentItems = closet?.items || [];
    const availablePoints = closet?.availablePoints || 0;

    return [...currentItems].sort((left, right) => {
      const leftPriority = left.owned
        ? 0
        : left.unlockType === "shop" && left.pricePoints <= availablePoints
          ? 1
          : left.unlockType === "shop"
            ? 2
            : 3;
      const rightPriority = right.owned
        ? 0
        : right.unlockType === "shop" && right.pricePoints <= availablePoints
          ? 1
          : right.unlockType === "shop"
            ? 2
            : 3;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      if (left.unlockType === "shop" && right.unlockType === "shop") {
        return left.pricePoints - right.pricePoints;
      }

      return left.name.localeCompare(right.name);
    });
  }, [closet?.availablePoints, closet?.items]);

  const ownedItemsCount = (closet?.items || []).filter((item) => item.owned).length;
  const achievementReadyCount = (closet?.items || []).filter(
    (item) => item.unlockType === "achievement" && item.badgeUnlocked && !item.owned
  ).length;
  const equippedCount = (closet?.equipped || []).length;
  const nextShopItem = sortedItems.find((item) => item.unlockType === "shop" && !item.owned);
  const readyToBuyItem = sortedItems.find(
    (item) => item.unlockType === "shop" && !item.owned && item.pricePoints <= (closet?.availablePoints || 0)
  );
  const topCollection = [...(closet?.collectionProgress || [])].sort((left, right) => right.progressPercent - left.progressPercent)[0];

  const setupRows = [
    { slot: isMalay ? "Rambut" : "Hair", value: equippedBySlot.get("hair")?.itemName || (isMalay ? "Tiada lagi" : "Nothing yet") },
    { slot: isMalay ? "Atas" : "Top", value: equippedBySlot.get("top")?.itemName || (isMalay ? "Tiada lagi" : "Nothing yet") },
    { slot: isMalay ? "Bawah" : "Bottom", value: equippedBySlot.get("bottom")?.itemName || (isMalay ? "Tiada lagi" : "Nothing yet") },
    { slot: isMalay ? "Kasut" : "Shoes", value: equippedBySlot.get("shoes")?.itemName || (isMalay ? "Tiada lagi" : "Nothing yet") },
    { slot: isMalay ? "Aksesori" : "Accessory", value: equippedBySlot.get("accessory")?.itemName || (isMalay ? "Tiada lagi" : "Nothing yet") }
  ];

  if (status === "env_missing") {
    return <p className="dashboard-helper">{isMalay ? "Env Supabase masih tiada, jadi almari hanya boleh kekal dalam mod pratonton." : "Supabase env is still missing, so the closet can only stay in preview mode."}</p>;
  }

  if (status === "signed_out") {
    return <p className="dashboard-helper">{isMalay ? "Log masuk dahulu untuk mula mengumpul item dan memakaikan avatar anda." : "Sign in first to start collecting items and equipping your avatar."}</p>;
  }

  if (status === "schema_missing") {
    return (
      <p className="dashboard-helper">
        {isMalay
          ? "Skema avatar masih belum aktif di Supabase. Selepas anda jalankan semula schema yang dikemas kini, pembelian dan status pakai akan mula berfungsi."
          : "The avatar schema is not live in Supabase yet. Once you rerun the updated schema, purchases and equip state will start working."}
      </p>
    );
  }

  if (status === "loading") {
    return <p className="dashboard-helper">{isMalay ? "Sedang memuat snapshot almari anda..." : "Loading your closet snapshot..."}</p>;
  }

  if (status === "error") {
    return <p className="dashboard-helper">{isMalay ? "Almari mengalami masalah pemuatan sementara. Rangka API sudah tersedia, tetapi pemuatan data semasa gagal." : "The closet hit a temporary loading problem. The API skeleton is in place, but the current data load failed."}</p>;
  }

  return (
    <div className="avatar-page-v4-body">
      {celebration ? (
        <article className={`closet-celebration closet-celebration-${celebration.type}`}>
          <div className="closet-celebration-copy">
            <p className="dashboard-label">
              {celebration.type === "purchase"
                ? isMalay
                  ? "Pembelian berjaya"
                  : "Purchase success"
                : isMalay
                  ? "Gaya dikemas kini"
                  : "Style updated"}
            </p>
            <h3>
              {celebration.type === "purchase"
                ? isMalay
                  ? `${celebration.itemName} kini milik anda.`
                  : `${celebration.itemName} is now yours.`
                : isMalay
                  ? `${celebration.itemName} kini sedang dipakai.`
                  : `${celebration.itemName} is now equipped.`}
            </h3>
            <p className="dashboard-helper">
              {celebration.type === "purchase"
                ? isMalay
                  ? `${celebration.collectionName || "Almari"} baru sahaja menjadi lebih kuat${typeof celebration.pricePoints === "number" ? ` dengan ${celebration.pricePoints} mata` : ""}.`
                  : `${celebration.collectionName || "Closet"} just got stronger${typeof celebration.pricePoints === "number" ? ` for ${celebration.pricePoints} pts` : ""}.`
                : isMalay
                  ? "Pratonton avatar anda sudah dikemas kini, jadi ganjaran terasa serta-merta."
                  : "Your avatar preview has already updated, so the reward feels immediate."}
            </p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-primary closet-action" onClick={() => setCelebration(null)} type="button">
              {isMalay ? "Baik" : "Nice"}
            </button>
            <a className="btn btn-secondary" href="/dashboard">
              {isMalay ? "Lihat dashboard" : "See dashboard"}
            </a>
          </div>
        </article>
      ) : null}

      <section className="avatar-v4-top-grid">
        <article className="avatar-v4-balance-card">
          <div className="avatar-v4-card-head">
            <div>
              <p className="dashboard-label">{isMalay ? "Baki semasa" : "Current balance"}</p>
              <h2>{closet?.availablePoints || 0} pts</h2>
            </div>
            <span className="dashboard-v3-status">{isMalay ? "Sedia" : "Ready"}</span>
          </div>
          <p className="dashboard-helper">
            {isMalay ? "Mata ini boleh terus digunakan untuk membeli item, membuka gaya baharu, atau mengejar koleksi seterusnya." : "These points are ready for new items, fresh looks, or the next collection push."}
          </p>
          <div className="avatar-v4-balance-stats">
            <div className="avatar-v4-mini-stat">
              <span className="dashboard-label">{isMalay ? "Jumlah mata" : "Total points"}</span>
              <strong>{closet?.totalPoints || 0}</strong>
            </div>
            <div className="avatar-v4-mini-stat">
              <span className="dashboard-label">{isMalay ? "Dibelanja" : "Spent"}</span>
              <strong>{closet?.spentPoints || 0}</strong>
            </div>
            <div className="avatar-v4-mini-stat">
              <span className="dashboard-label">{isMalay ? "Peringkat" : "Rank"}</span>
              <strong>{getRankFromPoints(closet?.totalPoints || 0)}</strong>
            </div>
          </div>
          <div className="dashboard-v3-action-row">
            <a className="btn btn-primary" href="/my-subjects">
              {isMalay ? "Dapatkan lebih banyak mata" : "Earn more points"}
            </a>
            <a className="btn btn-secondary" href="/progress">
              {isMalay ? "Lihat kemajuan" : "View progress"}
            </a>
          </div>
        </article>

        <article className="avatar-v4-drop-card">
          <div className="avatar-v4-card-head">
            <div>
              <p className="dashboard-label">{isMalay ? "Drop minggu ini" : "This week's drop"}</p>
              <h2>{weeklyDrop?.name || (isMalay ? "Tiada drop" : "No drop")}</h2>
            </div>
            {weeklyDropUrgency ? <span className="dashboard-v3-status dashboard-v3-status-warm">{weeklyDropUrgency.label}</span> : null}
          </div>
          <p className="dashboard-helper">{weeklyDrop?.helper || (isMalay ? "Drop mingguan akan muncul di sini." : "Weekly featured drops will appear here.")}</p>
          <div className="avatar-v4-drop-list">
            <div className="avatar-v4-drop-row">
              <span className="dashboard-label">{isMalay ? "Harga" : "Price"}</span>
              <strong>{weeklyDrop?.pricePoints || 0} pts</strong>
            </div>
            <div className="avatar-v4-drop-row">
              <span className="dashboard-label">{isMalay ? "Koleksi" : "Collection"}</span>
              <strong>{weeklyDrop?.collectionName || "-"}</strong>
            </div>
            <div className="avatar-v4-drop-row">
              <span className="dashboard-label">{isMalay ? "Misi terbaik" : "Best mission"}</span>
              <strong>{weeklyDrop?.mission?.title || "-"}</strong>
            </div>
          </div>
          <div className="dashboard-v3-action-row">
            {weeklyDrop?.mission ? (
              <a className="btn btn-primary" href={weeklyDrop.mission.href}>
                {isMalay ? "Buka misi drop" : "Open drop mission"}
              </a>
            ) : null}
            <a className="btn btn-secondary" href="/dashboard">
              {isMalay ? "Kembali ke dashboard" : "Back to dashboard"}
            </a>
          </div>
        </article>
      </section>

      <section className="avatar-v4-overview-grid">
        <article className="avatar-v4-preview-card">
          <div className="avatar-v4-section-head">
            <div>
              <p className="dashboard-label">{isMalay ? "Pratonton ganjaran" : "Preview rewards in action"}</p>
              <h3>{isMalay ? "Avatar anda" : "Your avatar"}</h3>
            </div>
            <span className="closet-stock-pill closet-stock-pill-owned">{isMalay ? "Aktif" : "Live"}</span>
          </div>
          <div className="avatar-v4-preview-panel">
            <AvatarPreviewFigure equippedBySlot={equippedBySlot} />
          </div>
          <p className="dashboard-helper">
            {isMalay ? "Beli dan pakai item untuk melihat rupa anda berubah serta-merta." : "Buy and equip items to see your look change instantly."}
          </p>
        </article>

        <div className="avatar-v4-overview-stack">
          <article className="avatar-v4-small-card tone-blue">
            <p className="dashboard-label">{isMalay ? "Sedia dibeli" : "Ready to buy"}</p>
            <h3>{readyToBuyItem ? readyToBuyItem.name : isMalay ? "Terus kumpul mata" : "Keep earning points"}</h3>
            <p className="dashboard-helper">
              {readyToBuyItem
                ? isMalay
                  ? `${readyToBuyItem.pricePoints} mata untuk buka item seterusnya sekarang.`
                  : `${readyToBuyItem.pricePoints} points unlocks your next item right now.`
                : nextShopItem
                  ? isMalay
                    ? `Lagi ${Math.max(nextShopItem.pricePoints - (closet?.availablePoints || 0), 0)} mata untuk ${nextShopItem.name}.`
                    : `${Math.max(nextShopItem.pricePoints - (closet?.availablePoints || 0), 0)} more points for ${nextShopItem.name}.`
                  : isMalay
                    ? "Semua item kedai sudah dimiliki."
                    : "All shop items are already owned."}
            </p>
          </article>

          <article className="avatar-v4-small-card tone-mint">
            <p className="dashboard-label">{isMalay ? "Item dimiliki" : "Owned items"}</p>
            <h3>{ownedItemsCount}</h3>
            <p className="dashboard-helper">
              {isMalay ? "Campur item starter, pembelian, dan ganjaran lencana untuk gaya yang lebih unik." : "Mix starter items, purchases, and badge rewards into a more personal look."}
            </p>
          </article>

          <article className="avatar-v4-small-card tone-peach">
            <p className="dashboard-label">{isMalay ? "Unlock pencapaian" : "Achievement unlocks"}</p>
            <h3>{achievementReadyCount}</h3>
            <p className="dashboard-helper">
              {isMalay ? "Item achievement akan muncul apabila badge berkaitan sudah cukup." : "Achievement items become available as soon as the matching badge is ready."}
            </p>
          </article>

          <article className="avatar-v4-small-card tone-lilac">
            <p className="dashboard-label">{isMalay ? "Slot aktif" : "Equipped slots"}</p>
            <h3>{equippedCount}/5</h3>
            <p className="dashboard-helper">
              {isMalay ? "Lima slot utama memberi ruang untuk bina gaya yang jelas." : "The five main slots are enough to give each student a clear style."}
            </p>
          </article>
        </div>
      </section>

      <section className="avatar-v4-section">
        <div className="avatar-v4-section-head">
          <div>
            <p className="dashboard-label">{isMalay ? "Koleksi anda" : "Your collection progress"}</p>
            <h3>{isMalay ? "Gaya dibuka dengan konsistensi" : "Style unlocks through consistency"}</h3>
          </div>
        </div>
        <div className="avatar-v4-progress-list">
          {(closet?.collectionProgress || []).map((collection) => (
            <article className="avatar-v4-progress-row" key={collection.collectionName}>
              <div className="avatar-v4-progress-copy">
                <strong>{collection.collectionName}</strong>
                <span>{collection.ownedCount}/{collection.totalCount}</span>
              </div>
              <div className="mastery-bar">
                <div className="mastery-bar-fill" style={{ width: `${collection.progressPercent}%` }} />
              </div>
              <div className="avatar-v4-progress-meta">
                <span className="dashboard-helper">{collection.progressPercent}% {isMalay ? "siap" : "complete"}</span>
                {getCollectionMission(collection.collectionName) ? (
                  <a className="mini-link" href={getCollectionMission(collection.collectionName)?.href}>
                    {getCollectionMission(collection.collectionName)?.subject}: {getCollectionMission(collection.collectionName)?.title}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="avatar-v4-section">
        <div className="avatar-v4-section-head">
          <div>
            <p className="dashboard-label">{isMalay ? "Gaya semasa" : "Current setup"}</p>
            <h3>{isMalay ? "Apa yang sedang dipakai sekarang" : "What your avatar is wearing now"}</h3>
          </div>
        </div>
        <div className="avatar-v4-setup-list">
          {setupRows.map((row) => (
            <article className="avatar-v4-setup-row" key={row.slot}>
              <span className="dashboard-label">{row.slot}</span>
              <strong>{row.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="avatar-v4-section">
        <div className="avatar-v4-section-head">
          <div>
            <p className="dashboard-label">{isMalay ? "Item avatar" : "Avatar items"}</p>
            <h3>{isMalay ? "Beli, pakai, dan buka lagi" : "Buy, equip, and unlock more"}</h3>
          </div>
        </div>
        <div className="avatar-v4-shop-grid">
          {sortedItems.map((item) => (
            <article
              className={`achievement-card closet-shop-card avatar-v4-shop-card ${item.owned ? "is-unlocked" : ""} ${
                item.unlockType === "achievement" && !item.badgeUnlocked ? "is-locked-item" : ""
              } ${item.unlockType === "shop" && !item.owned ? "is-shop-card" : ""}`}
              key={item.code}
            >
              <div className="avatar-v4-item-visual">
                {item.imageReady ? (
                  <img
                    alt={item.name}
                    className="avatar-v4-item-image"
                    loading="lazy"
                    src={item.imageSrc}
                  />
                ) : (
                  <div className="avatar-v4-item-image-placeholder">
                    <span className="dashboard-label">{item.slotName}</span>
                    <strong>{isMalay ? "Slot grafik AI sedia" : "AI art slot ready"}</strong>
                    <p className="dashboard-helper">
                      {isMalay ? "Letakkan fail ini untuk aktifkan imej:" : "Drop this file in to activate the image:"}
                    </p>
                    <code>{item.imageSrc}</code>
                  </div>
                )}
              </div>
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
                {item.slotName} · {item.unlockType === "shop" ? `${item.pricePoints} pts` : item.unlockType}
              </p>
              <div className="closet-meta-row">
                <span className="closet-slot-pill">{item.slotName}</span>
                <span className={`closet-stock-pill closet-stock-pill-${item.owned ? "owned" : item.unlockType}`}>
                  {item.owned
                    ? isMalay
                      ? "Dimiliki"
                      : "Owned"
                    : item.unlockType === "shop"
                      ? isMalay
                        ? "Kedai"
                        : "Shop drop"
                      : isMalay
                        ? "Lencana"
                        : "Badge unlock"}
                </span>
              </div>
              {item.unlockType === "achievement" ? (
                <p className="dashboard-helper">
                  {item.badgeUnlocked
                    ? isMalay
                      ? `${item.requiredBadgeTitle || "Achievement"} sudah sedia. Item ini boleh dibuka automatik.`
                      : `${item.requiredBadgeTitle || "Achievement"} reached. This item can unlock automatically.`
                    : isMalay
                      ? `Masih perlukan ${item.requiredBadgeTitle || "badge"}.`
                      : `Still needs ${item.requiredBadgeTitle || "badge"}.`}
                </p>
              ) : null}
              <div className="hero-actions">
                {item.owned ? (
                  <button
                    className="btn btn-primary closet-action closet-cta"
                    disabled={busyItemCode === item.code}
                    onClick={() => runAction("equip", item.code)}
                    type="button"
                  >
                    {busyItemCode === item.code
                      ? isMalay
                        ? "Menyimpan..."
                        : "Saving..."
                      : isMalay
                        ? "Pakai sekarang"
                        : "Wear this look"}
                  </button>
                ) : item.unlockType === "shop" ? (
                  <button
                    className="btn btn-primary closet-action closet-cta closet-buy-button"
                    disabled={busyItemCode === item.code}
                    onClick={() => runAction("purchase", item.code)}
                    type="button"
                  >
                    {busyItemCode === item.code
                      ? isMalay
                        ? "Menyimpan..."
                        : "Saving..."
                      : isMalay
                        ? `Beli · ${item.pricePoints} mata`
                        : `Buy now · ${item.pricePoints} pts`}
                  </button>
                ) : item.unlockType === "achievement" ? (
                  <span className={`status-pill ${item.badgeUnlocked ? "status-pill-ready" : "status-pill-locked"}`}>
                    {item.badgeUnlocked
                      ? isMalay
                        ? "Sedia dibuka"
                        : "Ready to auto-unlock"
                      : isMalay
                        ? `Perlu ${item.requiredBadgeTitle || "badge"}`
                        : `Need ${item.requiredBadgeTitle || "badge"}`}
                  </span>
                ) : (
                  <span className="dashboard-helper">
                    {isMalay ? "Buka melalui pencapaian" : "Unlock through achievements"}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="avatar-v4-reward-strip">
        <div className="avatar-v4-section-head">
          <div>
            <p className="dashboard-label">{isMalay ? "Belajar untuk gaya" : "Study wins = style rewards"}</p>
            <h3>{isMalay ? "Setiap hari belajar bantu anda maju lebih jauh" : "Every study day moves your style further"}</h3>
          </div>
        </div>
        <div className="avatar-v4-tip-grid">
          <article className="avatar-v4-tip-card">
            <strong>{isMalay ? "Misi harian" : "Daily missions"}</strong>
            <p className="dashboard-helper">
              {isMalay ? "Cara paling cepat untuk tambah mata dan mengekalkan rhythm." : "The fastest way to add points and keep momentum."}
            </p>
          </article>
          <article className="avatar-v4-tip-card">
            <strong>{isMalay ? "Misi drop" : "Drop mission"}</strong>
            <p className="dashboard-helper">
              {isMalay ? "Misi featured bantu anda buru item minggu ini." : "Featured missions help you chase the weekly drop."}
            </p>
          </article>
          <article className="avatar-v4-tip-card">
            <strong>{isMalay ? "Koleksi hampir siap" : "Closest collection"}</strong>
            <p className="dashboard-helper">
              {topCollection
                ? isMalay
                  ? `${topCollection.collectionName} kini paling hampir siap.`
                  : `${topCollection.collectionName} is the closest to completion right now.`
                : isMalay
                  ? "Kemajuan koleksi akan muncul di sini."
                  : "Collection progress will show here."}
            </p>
          </article>
          <article className="avatar-v4-tip-card">
            <strong>{isMalay ? "Buka rank" : "Rank up"}</strong>
            <p className="dashboard-helper">
              {isMalay ? "Lebih banyak jumlah mata membuka rank yang lebih kuat dan rasa kemajuan yang jelas." : "Higher total points unlock stronger ranks and a clearer sense of progress."}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
