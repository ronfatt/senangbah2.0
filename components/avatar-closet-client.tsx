"use client";

import { useEffect, useMemo, useState } from "react";
import { AvatarPreviewFigure } from "./avatar-preview-figure";
import { getCollectionMission } from "../lib/avatar-catalog";
import { hasPublicSupabaseEnv } from "../lib/env";
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

export function AvatarClosetClient() {
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

  if (status === "env_missing") {
    return <p className="dashboard-helper">Supabase env is still missing, so the closet can only stay in preview mode.</p>;
  }

  if (status === "signed_out") {
    return <p className="dashboard-helper">Sign in first to start collecting items and equipping your avatar.</p>;
  }

  if (status === "schema_missing") {
    return (
      <p className="dashboard-helper">
        The avatar schema is not live in Supabase yet. Once you rerun the updated schema, purchases and equip state will start working.
      </p>
    );
  }

  if (status === "loading") {
    return <p className="dashboard-helper">Loading your closet snapshot...</p>;
  }

  if (status === "error") {
    return <p className="dashboard-helper">The closet hit a temporary loading problem. The API skeleton is in place, but the current data load failed.</p>;
  }

  return (
    <div className="closet-live-grid">
      {celebration ? (
        <article className={`closet-celebration closet-celebration-${celebration.type}`}>
          <div className="closet-celebration-copy">
            <p className="dashboard-label">
              {celebration.type === "purchase" ? "Purchase success" : "Style updated"}
            </p>
            <h3>
              {celebration.type === "purchase"
                ? `${celebration.itemName} is now yours.`
                : `${celebration.itemName} is now equipped.`}
            </h3>
            <p className="dashboard-helper">
              {celebration.type === "purchase"
                ? `${celebration.collectionName || "Closet"} just got stronger${typeof celebration.pricePoints === "number" ? ` for ${celebration.pricePoints} pts` : ""}.`
                : "Your avatar preview has already updated, so the reward feels immediate."}
            </p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-primary closet-action" onClick={() => setCelebration(null)} type="button">
              Nice
            </button>
            <a className="btn btn-secondary" href="/dashboard">
              See dashboard
            </a>
          </div>
        </article>
      ) : null}

      <article className="feature-panel avatar-live-preview">
        <p className="eyebrow">Live preview</p>
        <h2>Your avatar updates from equipped items.</h2>
        <AvatarPreviewFigure equippedBySlot={equippedBySlot} />
        <p className="dashboard-helper">
          Buy and equip an item below, then this preview changes immediately. That makes the reward loop feel much more real.
        </p>
      </article>

      <article className="feature-panel">
        <p className="eyebrow">Live balance</p>
        <h2>{closet?.availablePoints || 0} pts ready to spend</h2>
        <div className="momentum-stack">
          <div className="momentum-item">
            <span className="dashboard-label">Earned</span>
            <strong>{closet?.totalPoints || 0} pts</strong>
          </div>
          <div className="momentum-item">
            <span className="dashboard-label">Spent</span>
            <strong>{closet?.spentPoints || 0} pts</strong>
          </div>
          <div className="momentum-item">
            <span className="dashboard-label">Rank</span>
            <strong>{getRankFromPoints(closet?.totalPoints || 0)}</strong>
          </div>
        </div>
      </article>

      <article className="feature-panel alt">
        <p className="eyebrow">Collection progress</p>
        <h2>See which style set is closest to completion.</h2>
        <div className="momentum-stack">
          {(closet?.collectionProgress || []).map((collection) => (
            <div className="momentum-item" key={collection.collectionName}>
              <div className="mastery-meta">
                <span className="dashboard-label">{collection.collectionName}</span>
                <strong>
                  {collection.ownedCount}/{collection.totalCount}
                </strong>
              </div>
              <div className="mastery-bar">
                <div className="mastery-bar-fill" style={{ width: `${collection.progressPercent}%` }} />
              </div>
              <p className="dashboard-helper">{collection.progressPercent}% complete</p>
              {getCollectionMission(collection.collectionName) ? (
                <a className="mini-link" href={getCollectionMission(collection.collectionName)?.href}>
                  {getCollectionMission(collection.collectionName)?.subject}: {getCollectionMission(collection.collectionName)?.title}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </article>

      <article className="feature-panel alt">
        <p className="eyebrow">Equipped now</p>
        <h2>Your current style setup</h2>
        <div className="momentum-stack">
          {["hair", "top", "bottom", "shoes", "accessory"].map((slot) => (
            <div className="momentum-item" key={slot}>
              <span className="dashboard-label">{slot}</span>
              <strong>{equippedBySlot.get(slot)?.itemName || "Nothing equipped yet"}</strong>
            </div>
          ))}
        </div>
      </article>

      <div className="achievement-grid closet-item-grid">
        <div className="closet-sort-note">
          <p className="dashboard-label">Shop order</p>
          <p className="dashboard-helper">Owned looks come first, then items you can afford right now, then the longer-term targets.</p>
        </div>
        {sortedItems.map((item) => (
          <article
            className={`achievement-card closet-shop-card ${item.owned ? "is-unlocked" : ""} ${
              item.unlockType === "achievement" && !item.badgeUnlocked ? "is-locked-item" : ""
            } ${item.unlockType === "shop" && !item.owned ? "is-shop-card" : ""}`}
            key={item.code}
          >
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
                {item.owned ? "Owned" : item.unlockType === "shop" ? "Shop drop" : "Badge unlock"}
              </span>
            </div>
            {item.unlockType === "achievement" ? (
              <p className="dashboard-helper">
                {item.badgeUnlocked
                  ? `${item.requiredBadgeTitle || "Achievement"} reached. This item can unlock automatically.`
                  : `Locked by ${item.requiredBadgeTitle || "an achievement"} right now.`}
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
                  {busyItemCode === item.code ? "Saving..." : "Wear this look"}
                </button>
              ) : item.unlockType === "shop" ? (
                <button
                  className="btn btn-primary closet-action closet-cta closet-buy-button"
                  disabled={busyItemCode === item.code}
                  onClick={() => runAction("purchase", item.code)}
                  type="button"
                >
                  {busyItemCode === item.code ? "Saving..." : `Buy now · ${item.pricePoints} pts`}
                </button>
              ) : item.unlockType === "achievement" ? (
                <span className={`status-pill ${item.badgeUnlocked ? "status-pill-ready" : "status-pill-locked"}`}>
                  {item.badgeUnlocked ? "Ready to auto-unlock" : `Need ${item.requiredBadgeTitle || "badge"}`}
                </span>
              ) : (
                <span className="dashboard-helper">Unlock through achievements</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
