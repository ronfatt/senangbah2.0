"use client";

import { useMemo, useState } from "react";
import { RewardBurst } from "./reward-burst";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";
import { getRotatingWritingPrompt, writingCoachPrompt } from "../lib/practice-content";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const TRANSITION_WORDS = ["because", "however", "therefore", "although", "for example", "first", "finally"];

function scoreDraft(draft: string) {
  const trimmed = draft.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed
    ? trimmed
        .split(/[.!?]+/)
        .map((item) => item.trim())
        .filter(Boolean).length
    : 0;
  const transitionHits = TRANSITION_WORDS.filter((word) =>
    trimmed.toLowerCase().includes(word)
  ).length;

  let points = 0;
  if (words >= 60) points += 40;
  else if (words >= 40) points += 28;
  else if (words >= 25) points += 18;

  if (sentences >= 3) points += 30;
  else if (sentences >= 2) points += 18;

  if (transitionHits >= 2) points += 20;
  else if (transitionHits >= 1) points += 12;

  if (/[A-Z]/.test(trimmed) && /[.!?]$/.test(trimmed)) {
    points += 10;
  }

  const accuracyPercent = Math.max(0, Math.min(100, points));
  const stars = accuracyPercent >= 90 ? 3 : accuracyPercent >= 70 ? 2 : 1;

  return {
    words,
    sentences,
    transitionHits,
    accuracyPercent,
    stars
  };
}

export function WritingCoachPractice({ locale }: { locale: AppLocale }) {
  const isMalay = locale === "ms";
  const promptSet = getRotatingWritingPrompt("english", "writing-coach") || writingCoachPrompt;
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState(
    isMalay
      ? "Tulis respons ringkas, kemudian hantar untuk semakan pantas."
      : "Write a short response, then submit for quick coaching."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reward, setReward] = useState<{
    starPoints: number;
    bonusPoints: number;
    weeklyDropHeadline: string | null;
    totalPoints: number | null;
    unlockedAvatarItems: { code: string; name: string; badgeCode: string | null }[];
  } | null>(null);
  const feedback = useMemo(() => scoreDraft(draft), [draft]);

  async function handleSubmit() {
    if (feedback.words < 20) {
      setStatus(isMalay ? "Tulis sedikit lagi dahulu. Sasarkan sekurang-kurangnya 20 patah perkataan supaya maklum balas lebih berguna." : "Write a little more first. Aim for at least 20 words so the feedback is useful.");
      return;
    }

    setSubmitted(true);

    if (!hasPublicSupabaseEnv()) {
      setStatus(
        isMalay
          ? `Draf dinilai pada ${feedback.accuracyPercent}%. Tambah env Supabase untuk menyimpannya.`
          : `Draft scored at ${feedback.accuracyPercent}%. Add Supabase env to save it.`
      );
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user?.id || !session.user.email) {
        setStatus(
          isMalay
            ? `Draf dinilai pada ${feedback.accuracyPercent}%. Log masuk untuk menyimpan keputusan penulisan ini.`
            : `Draft scored at ${feedback.accuracyPercent}%. Sign in to save this writing result.`
        );
        return;
      }

      const response = await fetch("/api/progress/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email: session.user.email,
          subjectSlug: "english",
          moduleSlug: "writing-coach",
          eventType: "completed",
          accuracyPercent: feedback.accuracyPercent,
          score: feedback.words,
          stars: feedback.stars,
          metadata: {
            prompt_id: promptSet.id,
            prompt_label: promptSet.label,
            word_count: feedback.words,
            sentence_count: feedback.sentences,
            transition_hits: feedback.transitionHits
          }
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "writing_save_failed");
      }
      setReward({
        starPoints: Number(payload?.starPoints || 0),
        bonusPoints: Number(payload?.bonusPoints || 0),
        weeklyDropHeadline: payload?.weeklyDropHeadline || null,
        totalPoints: typeof payload?.totalPoints === "number" ? payload.totalPoints : null,
        unlockedAvatarItems: Array.isArray(payload?.unlockedAvatarItems) ? payload.unlockedAvatarItems : []
      });

      setStatus(
        isMalay
          ? `Keputusan penulisan disimpan: ${feedback.words} patah perkataan, signal kualiti ${feedback.accuracyPercent}%, ${feedback.stars} bintang, ${Number(payload?.starPoints || 0)} mata.`
          : `Saved writing result: ${feedback.words} words, ${feedback.accuracyPercent}% quality signal, ${feedback.stars} star(s), ${Number(payload?.starPoints || 0)} pts.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : isMalay ? "Tidak dapat menyimpan keputusan penulisan ini." : "Unable to save this writing result.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="writing-shell">
      <div className="practice-header">
        <div>
          <p className="eyebrow">{isMalay ? "Tugasan penulisan langsung" : "Live writing task"}</p>
          <h2>{promptSet.title}</h2>
        </div>
        <p className="dashboard-helper">
          {promptSet.helper} {isMalay ? `Set semasa: ${promptSet.label}.` : `Current rotation: ${promptSet.label}.`}
        </p>
      </div>

      <div className="writing-layout">
        <article className="practice-card">
          <p className="dashboard-label">Prompt</p>
          <h3>{promptSet.prompt}</h3>
          <p className="dashboard-helper">{promptSet.guidance}</p>
          <textarea
            className="writing-textarea"
            onChange={(event) => setDraft(event.target.value)}
            placeholder={isMalay ? "Tulis respons ringkas anda di sini..." : "Write your short response here..."}
            value={draft}
          />
          <div className="practice-footer">
            <button className="btn btn-primary" disabled={isSubmitting} onClick={handleSubmit} type="button">
              {isSubmitting ? (isMalay ? "Menyimpan keputusan..." : "Saving result...") : isMalay ? "Hantar Draf" : "Submit Draft"}
            </button>
            <div className="practice-score">
              <span className="dashboard-label">{isMalay ? "Semakan langsung" : "Live checks"}</span>
              <strong>
                {feedback.words} {isMalay ? "patah perkataan" : "words"} · {feedback.sentences} {isMalay ? "ayat" : "sentences"} · {feedback.transitionHits} {isMalay ? "petunjuk penghubung" : "linking cues"}
              </strong>
            </div>
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">{isMalay ? "Nota jurulatih" : "Coach notes"}</p>
          <h2>{isMalay ? "Maklum balas struktur ringkas" : "Quick structure feedback"}</h2>
          <div className="momentum-stack">
            <div className="momentum-item">
              <span className="dashboard-label">{isMalay ? "Panjang" : "Length"}</span>
              <strong>{feedback.words >= 60 ? (isMalay ? "Kukuh" : "Strong") : feedback.words >= 40 ? (isMalay ? "Di landasan betul" : "On track") : (isMalay ? "Tambah butiran lagi" : "Add more detail")}</strong>
            </div>
            <div className="momentum-item">
              <span className="dashboard-label">{isMalay ? "Aliran ayat" : "Sentence flow"}</span>
              <strong>{feedback.sentences >= 3 ? (isMalay ? "Variasi ayat mencukupi" : "Enough sentence variety") : (isMalay ? "Tambah satu ayat lengkap lagi" : "Add another complete sentence")}</strong>
            </div>
            <div className="momentum-item">
              <span className="dashboard-label">{isMalay ? "Perkataan penghubung" : "Connection words"}</span>
              <strong>
                {feedback.transitionHits >= 2
                  ? isMalay
                    ? "Penghubung baik"
                    : "Good linking"
                  : isMalay
                    ? "Cuba perkataan seperti because, however, atau for example"
                    : "Try words like because, however, or for example"}
              </strong>
            </div>
            {submitted ? (
              <div className="momentum-item">
                <span className="dashboard-label">{isMalay ? "Signal draf" : "Draft signal"}</span>
                <strong>
                  {feedback.accuracyPercent}% · {feedback.stars} {isMalay ? "bintang" : "star(s)"}
                </strong>
              </div>
            ) : null}
          </div>
        </article>
      </div>

      <p className="auth-status">{status}</p>
      {reward?.starPoints ? (
        <RewardBurst
          subjectSlug="english"
          moduleSlug="writing-coach"
          accuracyPercent={feedback.accuracyPercent}
          moduleName={promptSet.title}
          starPoints={reward.starPoints}
          bonusPoints={reward.bonusPoints}
          stars={feedback.stars}
          weeklyDropHeadline={reward.weeklyDropHeadline}
          totalPoints={reward.totalPoints}
          unlockedAvatarItems={reward.unlockedAvatarItems}
          locale={locale}
        />
      ) : null}
    </section>
  );
}
