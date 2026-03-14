"use client";

import { useEffect, useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { getRankFromPoints } from "../lib/rewards";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

type ClosetSnapshot = {
  totalPoints: number;
  spentPoints: number;
  availablePoints: number;
  items: {
    code: string;
    name: string;
    rarity: string;
    pricePoints: number;
    unlockType: string;
    collectionName: string;
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

export function AvatarClosetClient() {
  const [closet, setCloset] = useState<ClosetSnapshot | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "signed_out" | "env_missing" | "schema_missing" | "error">(
    hasPublicSupabaseEnv() ? "loading" : "env_missing"
  );
  const [busyItemCode, setBusyItemCode] = useState<string | null>(null);

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
  }

  const equippedBySlot = new Map((closet?.equipped || []).map((item) => [item.slot, item]));

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
        {(closet?.items || []).map((item) => (
          <article className={`achievement-card ${item.owned ? "is-unlocked" : ""}`} key={item.code}>
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
            <div className="hero-actions">
              {item.owned ? (
                <button
                  className="btn btn-primary closet-action"
                  disabled={busyItemCode === item.code}
                  onClick={() => runAction("equip", item.code)}
                  type="button"
                >
                  {busyItemCode === item.code ? "Saving..." : "Equip"}
                </button>
              ) : item.unlockType === "shop" ? (
                <button
                  className="btn btn-secondary closet-action"
                  disabled={busyItemCode === item.code}
                  onClick={() => runAction("purchase", item.code)}
                  type="button"
                >
                  {busyItemCode === item.code ? "Saving..." : `Buy for ${item.pricePoints}`}
                </button>
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
