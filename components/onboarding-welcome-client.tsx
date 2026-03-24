"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hasPublicSupabaseEnv } from "../lib/env";
import { subjectDefinitions } from "../lib/subjects";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const missionOptions = [
  { code: "writing", label: "Writing help", helper: "I want clearer sentences and better ideas." },
  { code: "grammar", label: "Grammar fixes", helper: "I want to stop repeating simple mistakes." },
  { code: "reading", label: "Reading and evidence", helper: "I want to answer passages more confidently." },
  { code: "revision", label: "Revision missions", helper: "I want short daily practice that tells me what to do next." }
];

export function OnboardingWelcomeClient() {
  const router = useRouter();
  const [focusSubjectCode, setFocusSubjectCode] = useState("english");
  const [missionPreference, setMissionPreference] = useState("writing");
  const [status, setStatus] = useState("Pick one subject and one mission style so we can shape your first dashboard.");
  const [isSaving, setIsSaving] = useState(false);

  async function handleContinue() {
    if (!hasPublicSupabaseEnv()) {
      setStatus("Missing Supabase public env. Add the public keys before onboarding can save.");
      return;
    }

    setIsSaving(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user?.id || !session.user.email) {
        setStatus("Sign in first so we can save your study focus.");
        return;
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          authUserId: session.user.id,
          email: session.user.email,
          focusSubjectCode,
          missionPreference
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "onboarding_save_failed");
      }

      router.push(`/dashboard?welcome=done&focus=${focusSubjectCode}`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save your study focus.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="section section-split">
      <article className="feature-panel">
        <p className="eyebrow">Pick your first subject</p>
        <h2>Start with the subject you want to improve first.</h2>
        <div className="onboarding-option-grid">
          {subjectDefinitions.map((subject) => (
            <button
              className={`onboarding-option${focusSubjectCode === subject.code ? " is-selected" : ""}`}
              key={subject.code}
              onClick={() => setFocusSubjectCode(subject.code)}
              type="button"
            >
              <span className="dashboard-label">{subject.bundle}</span>
              <strong>{subject.name}</strong>
              <p className="dashboard-helper">{subject.summary}</p>
            </button>
          ))}
        </div>
      </article>

      <article className="feature-panel alt">
        <p className="eyebrow">Pick your mission style</p>
        <h2>Choose the kind of help you want first.</h2>
        <div className="onboarding-option-grid">
          {missionOptions.map((option) => (
            <button
              className={`onboarding-option${missionPreference === option.code ? " is-selected" : ""}`}
              key={option.code}
              onClick={() => setMissionPreference(option.code)}
              type="button"
            >
              <span className="dashboard-label">Starter focus</span>
              <strong>{option.label}</strong>
              <p className="dashboard-helper">{option.helper}</p>
            </button>
          ))}
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" disabled={isSaving} onClick={handleContinue} type="button">
            {isSaving ? "Saving your focus..." : "Continue to My Dashboard"}
          </button>
        </div>
        <p className="auth-status">{status}</p>
      </article>
    </section>
  );
}
