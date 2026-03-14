"use client";

import { useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { vocabularyBuilderSet } from "../lib/practice-content";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export function VocabularyBuilderPractice() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("Learn the words, choose the best usage, and submit one scored set.");
  const [result, setResult] = useState<{
    accuracyPercent: number;
    stars: number;
    correctCount: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (Object.keys(answers).length !== vocabularyBuilderSet.questions.length) {
      setStatus("Answer all vocabulary questions before submitting.");
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
      setStatus(`Set scored at ${accuracyPercent}%. Add Supabase env to save this vocabulary result.`);
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
        setStatus(`Set scored at ${accuracyPercent}%. Sign in to save this vocabulary result.`);
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

      setStatus(
        `Saved ${correctCount}/${vocabularyBuilderSet.questions.length} correct. Vocabulary Builder added ${stars} star(s) to your dashboard signal.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save this vocabulary result.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="writing-shell">
      <div className="practice-header">
        <div>
          <p className="eyebrow">Live vocabulary set</p>
          <h2>{vocabularyBuilderSet.title}</h2>
        </div>
        <p className="dashboard-helper">{vocabularyBuilderSet.helper}</p>
      </div>

      <div className="writing-layout">
        <article className="feature-panel">
          <p className="eyebrow">Word bank</p>
          <h2>Use these words in context.</h2>
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
          <p className="eyebrow">Quick practice</p>
          <h2>Pick the strongest word choice.</h2>
          <div className="practice-question-list">
            {vocabularyBuilderSet.questions.map((question, index) => (
              <article className="practice-card" key={question.id}>
                <p className="dashboard-label">Question {index + 1}</p>
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
          {isSubmitting ? "Saving result..." : "Submit Vocabulary Set"}
        </button>
        {result ? (
          <div className="practice-score">
            <span className="dashboard-label">Result</span>
            <strong>
              {result.correctCount}/{vocabularyBuilderSet.questions.length} correct · {result.accuracyPercent}% · {result.stars} star(s)
            </strong>
          </div>
        ) : null}
      </div>

      <p className="auth-status">{status}</p>
    </section>
  );
}
