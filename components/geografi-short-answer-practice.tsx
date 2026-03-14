"use client";

import { useMemo, useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { geografiShortAnswerPrompt, getRotatingWritingPrompt } from "../lib/practice-content";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const GEO_CONNECTORS = ["selain itu", "oleh itu", "contohnya", "di samping itu", "akhirnya"];
const GEO_KEYWORDS = ["hakisan", "banjir", "suhu", "habitat", "hutan", "pemuliharaan", "penanaman semula"];

function scoreResponse(draft: string) {
  const trimmed = draft.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed
    ? trimmed
        .split(/[.!?]+/)
        .map((item) => item.trim())
        .filter(Boolean).length
    : 0;
  const connectorHits = GEO_CONNECTORS.filter((phrase) => trimmed.toLowerCase().includes(phrase)).length;
  const keywordHits = GEO_KEYWORDS.filter((word) => trimmed.toLowerCase().includes(word)).length;

  let points = 0;
  if (words >= 55) points += 35;
  else if (words >= 35) points += 24;
  else if (words >= 20) points += 14;

  if (sentences >= 3) points += 25;
  else if (sentences >= 2) points += 16;

  if (connectorHits >= 2) points += 20;
  else if (connectorHits >= 1) points += 12;

  if (keywordHits >= 3) points += 20;
  else if (keywordHits >= 2) points += 12;

  const accuracyPercent = Math.max(0, Math.min(100, points));
  const stars = accuracyPercent >= 90 ? 3 : accuracyPercent >= 70 ? 2 : 1;

  return {
    words,
    sentences,
    connectorHits,
    keywordHits,
    accuracyPercent,
    stars
  };
}

export function GeografiShortAnswerPractice() {
  const promptSet = getRotatingWritingPrompt("geografi", "short-answer-practice") || geografiShortAnswerPrompt;
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Tulis satu jawapan ringkas, kemudian hantar untuk semakan pantas.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const feedback = useMemo(() => scoreResponse(draft), [draft]);

  async function handleSubmit() {
    if (feedback.words < 20) {
      setStatus("Tambah sedikit isi dahulu. Sasarkan sekurang-kurangnya 20 patah perkataan.");
      return;
    }

    setSubmitted(true);

    if (!hasPublicSupabaseEnv()) {
      setStatus(`Jawapan dinilai pada ${feedback.accuracyPercent}%. Tambah env Supabase untuk menyimpannya.`);
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
        setStatus(`Jawapan dinilai pada ${feedback.accuracyPercent}%. Log masuk untuk simpan keputusan ini.`);
        return;
      }

      const response = await fetch("/api/progress/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email: session.user.email,
          subjectSlug: "geografi",
          moduleSlug: "short-answer-practice",
          eventType: "completed",
          accuracyPercent: feedback.accuracyPercent,
          score: feedback.words,
          stars: feedback.stars,
          metadata: {
            prompt_id: promptSet.id,
            prompt_label: promptSet.label,
            word_count: feedback.words,
            sentence_count: feedback.sentences,
            connector_hits: feedback.connectorHits,
            keyword_hits: feedback.keywordHits
          }
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "geografi_short_answer_save_failed");
      }

      setStatus(
        `Jawapan disimpan: ${feedback.words} patah perkataan, ${feedback.accuracyPercent}% signal, ${feedback.stars} bintang.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Tidak dapat menyimpan jawapan Geografi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="writing-shell">
      <div className="practice-header">
        <div>
          <p className="eyebrow">Jawapan struktur geografi</p>
          <h2>{promptSet.title}</h2>
        </div>
        <p className="dashboard-helper">
          {promptSet.helper} Set semasa: {promptSet.label}.
        </p>
      </div>

      <div className="writing-layout">
        <article className="practice-card">
          <p className="dashboard-label">Tugasan</p>
          <h3>{promptSet.prompt}</h3>
          <p className="dashboard-helper">{promptSet.guidance}</p>
          <textarea
            className="writing-textarea"
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Tulis jawapan ringkas Geografi anda di sini..."
            value={draft}
          />
          <div className="practice-footer">
            <button className="btn btn-primary" disabled={isSubmitting} onClick={handleSubmit} type="button">
              {isSubmitting ? "Menyimpan..." : "Hantar Jawapan"}
            </button>
            <div className="practice-score">
              <span className="dashboard-label">Semakan langsung</span>
              <strong>
                {feedback.words} patah perkataan · {feedback.sentences} ayat · {feedback.keywordHits} kata kunci
              </strong>
            </div>
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">Panduan semakan</p>
          <h2>Signal jawapan ringkas</h2>
          <div className="momentum-stack">
            <div className="momentum-item">
              <span className="dashboard-label">Isi</span>
              <strong>{feedback.words >= 55 ? "Kukuh" : feedback.words >= 35 ? "Memadai" : "Tambah isi lagi"}</strong>
            </div>
            <div className="momentum-item">
              <span className="dashboard-label">Struktur ayat</span>
              <strong>{feedback.sentences >= 3 ? "Susunan jelas" : "Tambah satu ayat lengkap lagi"}</strong>
            </div>
            <div className="momentum-item">
              <span className="dashboard-label">Kata kunci geografi</span>
              <strong>
                {feedback.keywordHits >= 3 ? "Penggunaan konsep baik" : "Tambah istilah seperti hakisan, habitat, atau pemuliharaan"}
              </strong>
            </div>
            {submitted ? (
              <div className="momentum-item">
                <span className="dashboard-label">Signal jawapan</span>
                <strong>
                  {feedback.accuracyPercent}% · {feedback.stars} bintang
                </strong>
              </div>
            ) : null}
          </div>
        </article>
      </div>

      <p className="auth-status">{status}</p>
    </section>
  );
}
