"use client";

import { useState } from "react";
import { RewardBurst } from "./reward-burst";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";
import { vocabularyBuilderSet } from "../lib/practice-content";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export function VocabularyBuilderPractice({ locale }: { locale: AppLocale }) {
  const isMalay = locale === "ms";
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [status, setStatus] = useState(
    isMalay
      ? "Pelajari perkataan, pilih penggunaan terbaik, dan hantar satu set ber markah."
      : "Learn the words, choose the best usage, and submit one scored set."
  );
  const [result, setResult] = useState<{
    accuracyPercent: number;
    stars: number;
    correctCount: number;
    starPoints?: number;
    bonusPoints?: number;
    weeklyDropHeadline?: string | null;
    totalPoints?: number | null;
    unlockedAvatarItems?: { code: string; name: string; badgeCode: string | null }[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (Object.keys(answers).length !== vocabularyBuilderSet.questions.length) {
      setStatus(isMalay ? "Jawab semua soalan kosa kata sebelum menghantar." : "Answer all vocabulary questions before submitting.");
      return;
    }

    const correctCount = vocabularyBuilderSet.questions.reduce((sum, question) => {
      return sum + (answers[question.id] === question.correctIndex ? 1 : 0);
    }, 0);
    const accuracyPercent = Math.round((correctCount / vocabularyBuilderSet.questions.length) * 100);
    const stars = accuracyPercent >= 90 ? 3 : accuracyPercent >= 70 ? 2 : 1;

    setResult({
      accuracyPercent,
      stars,
      correctCount
    });

    if (!hasPublicSupabaseEnv()) {
      setStatus(
        isMalay
          ? `Set dinilai pada ${accuracyPercent}%. Tambah env Supabase untuk menyimpan keputusan kosa kata ini.`
          : `Set scored at ${accuracyPercent}%. Add Supabase env to save this vocabulary result.`
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
            ? `Set dinilai pada ${accuracyPercent}%. Log masuk untuk menyimpan keputusan kosa kata ini.`
            : `Set scored at ${accuracyPercent}%. Sign in to save this vocabulary result.`
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
          moduleSlug: "vocabulary-builder",
          eventType: "completed",
          accuracyPercent,
          score: correctCount,
          stars,
          metadata: {
            word_bank: vocabularyBuilderSet.words.map((word) => word.term),
            set_type: "vocabulary_usage"
          }
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "vocabulary_save_failed");
      }

      setResult({
        accuracyPercent,
        stars,
        correctCount,
        starPoints: Number(payload?.starPoints || 0),
        bonusPoints: Number(payload?.bonusPoints || 0),
        weeklyDropHeadline: payload?.weeklyDropHeadline || null,
        totalPoints: typeof payload?.totalPoints === "number" ? payload.totalPoints : null,
        unlockedAvatarItems: Array.isArray(payload?.unlockedAvatarItems) ? payload.unlockedAvatarItems : []
      });

      setStatus(
        isMalay
          ? `Disimpan ${correctCount}/${vocabularyBuilderSet.questions.length} betul. Vocabulary Builder menambah ${stars} bintang dan ${Number(payload?.starPoints || 0)} mata.`
          : `Saved ${correctCount}/${vocabularyBuilderSet.questions.length} correct. Vocabulary Builder added ${stars} star(s) and ${Number(payload?.starPoints || 0)} pts.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : isMalay ? "Tidak dapat menyimpan keputusan kosa kata ini." : "Unable to save this vocabulary result.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="writing-shell">
      <div className="practice-header">
        <div>
          <p className="eyebrow">{isMalay ? "Set kosa kata langsung" : "Live vocabulary set"}</p>
          <h2>{vocabularyBuilderSet.title}</h2>
        </div>
        <p className="dashboard-helper">{vocabularyBuilderSet.helper}</p>
      </div>

      <div className="writing-layout">
        <article className="feature-panel">
          <p className="eyebrow">{isMalay ? "Bank perkataan" : "Word bank"}</p>
          <h2>{isMalay ? "Gunakan perkataan ini dalam konteks." : "Use these words in context."}</h2>
          <div className="word-bank">
            {vocabularyBuilderSet.words.map((word) => (
              <div className="word-card" key={word.term}>
                <p className="dashboard-label">{word.term}</p>
                <strong>{word.meaning}</strong>
                <p className="dashboard-helper">{word.tip}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">{isMalay ? "Latihan pantas" : "Quick practice"}</p>
          <h2>{isMalay ? "Pilih perkataan yang paling kuat." : "Pick the strongest word choice."}</h2>
          <div className="practice-question-list">
            {vocabularyBuilderSet.questions.map((question, index) => (
              <article className="practice-card" key={question.id}>
                <p className="dashboard-label">{isMalay ? `Soalan ${index + 1}` : `Question ${index + 1}`}</p>
                <h3>{question.prompt}</h3>
                <p className="dashboard-helper">{question.sentence}</p>
                <div className="practice-option-list">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers[question.id] === optionIndex;
                    const isCorrect = result && optionIndex === question.correctIndex;
                    const isWrongSelection = result && isSelected && optionIndex !== question.correctIndex;

                    return (
                      <button
                        className={`practice-option${isSelected ? " is-selected" : ""}${isCorrect ? " is-correct" : ""}${isWrongSelection ? " is-wrong" : ""}`}
                        key={option}
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                        type="button"
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {result ? <p className="practice-explanation">{question.explanation}</p> : null}
              </article>
            ))}
          </div>
        </article>
      </div>

      <div className="practice-footer">
        <button className="btn btn-primary" disabled={isSubmitting} onClick={handleSubmit} type="button">
          {isSubmitting ? (isMalay ? "Menyimpan keputusan..." : "Saving result...") : isMalay ? "Hantar Set Kosa Kata" : "Submit Vocabulary Set"}
        </button>
        {result ? (
          <div className="practice-score">
            <span className="dashboard-label">{isMalay ? "Keputusan" : "Result"}</span>
            <strong>
              {result.correctCount}/{vocabularyBuilderSet.questions.length} {isMalay ? "betul" : "correct"} · {result.accuracyPercent}% · {result.stars} {isMalay ? "bintang" : "star(s)"}
            </strong>
          </div>
        ) : null}
      </div>

      <p className="auth-status">{status}</p>
      {result?.starPoints ? (
        <RewardBurst
          subjectSlug="english"
          moduleSlug="vocabulary-builder"
          accuracyPercent={result.accuracyPercent}
          moduleName={vocabularyBuilderSet.title}
          starPoints={result.starPoints}
          bonusPoints={result.bonusPoints}
          stars={result.stars}
          weeklyDropHeadline={result.weeklyDropHeadline}
          totalPoints={result.totalPoints}
          unlockedAvatarItems={result.unlockedAvatarItems}
          locale={locale}
        />
      ) : null}
    </section>
  );
}
