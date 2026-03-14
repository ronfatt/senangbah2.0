"use client";

import { useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import type { ObjectiveQuestion } from "../lib/practice-content";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export function ObjectivePractice({
  eyebrow,
  title,
  helper,
  setLabel,
  subjectSlug,
  moduleSlug,
  submitLabel,
  questions
}: {
  eyebrow: string;
  title: string;
  helper: string;
  setLabel?: string;
  subjectSlug: string;
  moduleSlug: string;
  submitLabel: string;
  questions: ObjectiveQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    accuracyPercent: number;
    stars: number;
    correctCount: number;
  } | null>(null);
  const [status, setStatus] = useState("Complete the set, then submit once for a scored result.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setAnswer(questionId: string, optionIndex: number) {
    setAnswers((current) => ({
      ...current,
      [questionId]: optionIndex
    }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length !== questions.length) {
      setStatus("Answer all questions before submitting this set.");
      return;
    }

    const correctCount = questions.reduce((sum, question) => {
      return sum + (answers[question.id] === question.correctIndex ? 1 : 0);
    }, 0);

    const accuracyPercent = Math.round((correctCount / questions.length) * 100);
    const stars = accuracyPercent >= 90 ? 3 : accuracyPercent >= 70 ? 2 : 1;

    setResult({
      accuracyPercent,
      stars,
      correctCount
    });

    if (!hasPublicSupabaseEnv()) {
      setStatus(`Set scored at ${accuracyPercent}%. Add Supabase env to save it to the dashboard.`);
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
        setStatus(`Set scored at ${accuracyPercent}%. Sign in to save this result.`);
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
          eventType: "completed",
          accuracyPercent,
          score: correctCount,
          stars
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "practice_save_failed");
      }

      setStatus(`Saved ${correctCount}/${questions.length} correct. Dashboard updated with ${stars} star(s).`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save this practice result.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="practice-shell">
      <div className="practice-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p className="dashboard-helper">
          {helper}
          {setLabel ? ` Current rotation: ${setLabel}.` : ""}
        </p>
      </div>

      <div className="practice-question-list">
        {questions.map((question, questionIndex) => (
          <article className="practice-card" key={question.id}>
            <p className="dashboard-label">Question {questionIndex + 1}</p>
            <h3>{question.prompt}</h3>
            <p className="dashboard-helper">{question.sentence}</p>
            {question.passage ? <div className="practice-passage">{question.passage}</div> : null}
            <div className="practice-option-list">
              {question.options.map((option, optionIndex) => {
                const isSelected = answers[question.id] === optionIndex;
                const isCorrect = result && optionIndex === question.correctIndex;
                const isWrongSelection = result && isSelected && optionIndex !== question.correctIndex;

                return (
                  <button
                    className={`practice-option${isSelected ? " is-selected" : ""}${isCorrect ? " is-correct" : ""}${isWrongSelection ? " is-wrong" : ""}`}
                    key={option}
                    onClick={() => setAnswer(question.id, optionIndex)}
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

      <div className="practice-footer">
        <button className="btn btn-primary" disabled={isSubmitting} onClick={handleSubmit} type="button">
          {isSubmitting ? "Saving result..." : submitLabel}
        </button>
        {result ? (
          <div className="practice-score">
            <span className="dashboard-label">Result</span>
            <strong>
              {result.correctCount}/{questions.length} correct · {result.accuracyPercent}% · {result.stars} star(s)
            </strong>
          </div>
        ) : null}
      </div>

      <p className="auth-status">{status}</p>
    </section>
  );
}
