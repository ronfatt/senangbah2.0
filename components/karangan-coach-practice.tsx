"use client";

import { useMemo, useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { getRotatingWritingPrompt, karanganCoachPrompt } from "../lib/practice-content";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const BM_CONNECTORS = ["selain itu", "walau bagaimanapun", "oleh itu", "contohnya", "tambahan pula", "akhir sekali"];

function scoreKarangan(draft: string) {
  const trimmed = draft.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed
    ? trimmed
        .split(/[.!?]+/)
        .map((item) => item.trim())
        .filter(Boolean).length
    : 0;
  const connectorHits = BM_CONNECTORS.filter((phrase) => trimmed.toLowerCase().includes(phrase)).length;

  let points = 0;
  if (words >= 70) points += 40;
  else if (words >= 45) points += 28;
  else if (words >= 25) points += 18;

  if (sentences >= 3) points += 30;
  else if (sentences >= 2) points += 18;

  if (connectorHits >= 2) points += 20;
  else if (connectorHits >= 1) points += 12;

  if (/[A-Z]/.test(trimmed) && /[.!?]$/.test(trimmed)) {
    points += 10;
  }

  const accuracyPercent = Math.max(0, Math.min(100, points));
  const stars = accuracyPercent >= 90 ? 3 : accuracyPercent >= 70 ? 2 : 1;

  return {
    words,
    sentences,
    connectorHits,
    accuracyPercent,
    stars
  };
}

export function KaranganCoachPractice() {
  const promptSet = getRotatingWritingPrompt("bahasa_melayu", "karangan-coach") || karanganCoachPrompt;
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Tulis satu perenggan ringkas, kemudian hantar untuk semakan pantas.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const feedback = useMemo(() => scoreKarangan(draft), [draft]);

  async function handleSubmit() {
    if (feedback.words < 20) {
      setStatus("Tambah sedikit isi dahulu. Sasarkan sekurang-kurangnya 20 patah perkataan.");
      return;
    }

    setSubmitted(true);

    if (!hasPublicSupabaseEnv()) {
      setStatus(`Karangan dinilai pada ${feedback.accuracyPercent}%. Tambah env Supabase untuk menyimpannya.`);
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
        setStatus(`Karangan dinilai pada ${feedback.accuracyPercent}%. Log masuk untuk simpan keputusan ini.`);
        return;
      }

      const response = await fetch("/api/progress/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email: session.user.email,
          subjectSlug: "bahasa-melayu",
          moduleSlug: "karangan-coach",
          eventType: "completed",
          accuracyPercent: feedback.accuracyPercent,
          score: feedback.words,
          stars: feedback.stars,
          metadata: {
            prompt_id: promptSet.id,
            prompt_label: promptSet.label,
            word_count: feedback.words,
            sentence_count: feedback.sentences,
            connector_hits: feedback.connectorHits
          }
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "karangan_save_failed");
      }

      setStatus(
        `Keputusan karangan disimpan: ${feedback.words} patah perkataan, ${feedback.accuracyPercent}% signal, ${feedback.stars} bintang.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Tidak dapat menyimpan keputusan karangan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="writing-shell">
      <div className="practice-header">
        <div>
          <p className="eyebrow">Latihan karangan</p>
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
            placeholder="Tulis karangan ringkas anda di sini..."
            value={draft}
          />
          <div className="practice-footer">
            <button className="btn btn-primary" disabled={isSubmitting} onClick={handleSubmit} type="button">
              {isSubmitting ? "Menyimpan..." : "Hantar Karangan"}
            </button>
            <div className="practice-score">
              <span className="dashboard-label">Semakan langsung</span>
              <strong>
                {feedback.words} patah perkataan · {feedback.sentences} ayat · {feedback.connectorHits} penanda wacana
              </strong>
            </div>
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">Maklum balas</p>
          <h2>Semakan struktur ringkas</h2>
          <div className="momentum-stack">
            <div className="momentum-item">
              <span className="dashboard-label">Panjang isi</span>
              <strong>{feedback.words >= 70 ? "Kukuh" : feedback.words >= 45 ? "Memadai" : "Tambah isi lagi"}</strong>
            </div>
            <div className="momentum-item">
              <span className="dashboard-label">Aliran ayat</span>
              <strong>{feedback.sentences >= 3 ? "Variasi ayat mencukupi" : "Tambah satu ayat lengkap lagi"}</strong>
            </div>
            <div className="momentum-item">
              <span className="dashboard-label">Penanda wacana</span>
              <strong>
                {feedback.connectorHits >= 2 ? "Penghubung baik" : "Cuba gunakan frasa seperti 'oleh itu' atau 'contohnya'"}
              </strong>
            </div>
            {submitted ? (
              <div className="momentum-item">
                <span className="dashboard-label">Signal karangan</span>
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
