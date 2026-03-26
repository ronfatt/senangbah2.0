"use client";

import { useState } from "react";
import { RewardBurst } from "./reward-burst";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export function ModuleActionPanel({
  subjectSlug,
  moduleSlug,
  locale
}: {
  subjectSlug: string;
  moduleSlug: string;
  locale: AppLocale;
}) {
  const isMalay = locale === "ms";
  const [status, setStatus] = useState(
    isMalay ? "Tandakan mula atau siap untuk mengemas kini dashboard." : "Mark a quick start or completion to feed the dashboard."
  );
  const [isWorking, setIsWorking] = useState(false);
  const [accuracyPercent, setAccuracyPercent] = useState("80");
  const [stars, setStars] = useState("2");
  const [reward, setReward] = useState<{
    moduleName: string;
    accuracyPercent: number;
    stars: number;
    starPoints: number;
    bonusPoints: number;
    weeklyDropHeadline: string | null;
    totalPoints: number | null;
    unlockedAvatarItems: { code: string; name: string; badgeCode: string | null }[];
  } | null>(null);

  async function logProgress(eventType: "started" | "completed") {
    if (!hasPublicSupabaseEnv()) {
      setStatus(isMalay ? "Env Supabase tiada. Tambah kunci awam sebelum menguji log kemajuan." : "Missing Supabase env. Add the public keys before testing progress logging.");
      return;
    }

    setIsWorking(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user?.id || !session.user.email) {
        setStatus(isMalay ? "Log masuk dahulu supaya modul ini boleh menulis ke sejarah pembelajaran anda." : "Sign in first so this module can write to your learning history.");
        return;
      }

      const response = await fetch("/api/progress/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email: session.user.email,
          subjectSlug,
          moduleSlug,
          eventType,
          accuracyPercent: eventType === "completed" ? Number(accuracyPercent) : undefined,
          score: eventType === "completed" ? Number(accuracyPercent) : undefined,
          stars: eventType === "completed" ? Number(stars) : undefined
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "progress_log_failed");
      }

      if (eventType === "completed") {
        setReward({
          moduleName: result.moduleName,
          accuracyPercent: Number(result.accuracyPercent || 0),
          stars: Number(result.stars || 0),
          starPoints: Number(result.starPoints || 0),
          bonusPoints: Number(result.bonusPoints || 0),
          weeklyDropHeadline: result.weeklyDropHeadline || null,
          totalPoints: typeof result.totalPoints === "number" ? result.totalPoints : null,
          unlockedAvatarItems: Array.isArray(result.unlockedAvatarItems) ? result.unlockedAvatarItems : []
        });
      } else {
        setReward(null);
      }

      setStatus(
        eventType === "completed"
          ? isMalay
            ? `${result.moduleName} ditandakan siap dengan ${result.stars} bintang, ketepatan ${result.accuracyPercent}%, dan ${Number(result.starPoints || 0)} mata.`
            : `${result.moduleName} marked complete with ${result.stars} star(s), ${result.accuracyPercent}% accuracy, and ${Number(result.starPoints || 0)} pts.`
          : isMalay
            ? `${result.moduleName} ditambah ke barisan pembelajaran aktif anda.`
            : `${result.moduleName} added to your active learning queue.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : isMalay ? "Sesuatu tidak berjalan dengan baik." : "Something went wrong.");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="module-action-panel">
      <p className="eyebrow">{isMalay ? "Isyarat pembelajaran" : "Learning signal"}</p>
      <h2>{isMalay ? "Tulis satu peristiwa dashboard yang sebenar." : "Write one real dashboard event."}</h2>
      <p className="dashboard-helper">
        {isMalay
          ? "Ini ialah jambatan 2.0 pertama daripada halaman modul kepada data percubaan dan snapshot kemajuan yang boleh diguna semula."
          : "This is the first 2.0 bridge from a module page into reusable attempt and progress snapshot data."}
      </p>
      <div className="module-signal-form">
        <label className="field">
          <span>{isMalay ? "Ketepatan siap (%)" : "Completion accuracy (%)"}</span>
          <input
            max={100}
            min={0}
            onChange={(event) => setAccuracyPercent(event.target.value)}
            type="number"
            value={accuracyPercent}
          />
        </label>
        <label className="field">
          <span>{isMalay ? "Bintang diperoleh" : "Stars earned"}</span>
          <select onChange={(event) => setStars(event.target.value)} value={stars}>
            <option value="1">{isMalay ? "1 bintang" : "1 star"}</option>
            <option value="2">{isMalay ? "2 bintang" : "2 stars"}</option>
            <option value="3">{isMalay ? "3 bintang" : "3 stars"}</option>
          </select>
        </label>
      </div>
      <div className="hero-actions">
        <button className="btn btn-secondary" disabled={isWorking} onClick={() => logProgress("started")} type="button">
          {isWorking ? (isMalay ? "Menyimpan..." : "Saving...") : isMalay ? "Tanda mula" : "Mark started"}
        </button>
        <button className="btn btn-primary" disabled={isWorking} onClick={() => logProgress("completed")} type="button">
          {isWorking ? (isMalay ? "Menyimpan..." : "Saving...") : isMalay ? "Tanda siap" : "Mark completed"}
        </button>
      </div>
      <p className="auth-status">{status}</p>
      {reward?.starPoints ? (
        <RewardBurst
          subjectSlug={subjectSlug}
          moduleSlug={moduleSlug}
          accuracyPercent={reward.accuracyPercent}
          moduleName={reward.moduleName}
          starPoints={reward.starPoints}
          bonusPoints={reward.bonusPoints}
          stars={reward.stars}
          weeklyDropHeadline={reward.weeklyDropHeadline}
          totalPoints={reward.totalPoints}
          unlockedAvatarItems={reward.unlockedAvatarItems}
          locale={locale}
        />
      ) : null}
    </div>
  );
}
