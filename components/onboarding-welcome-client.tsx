"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";
import { subjectDefinitions } from "../lib/subjects";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const missionOptions = [
  { code: "writing", label: "Writing help", helper: "I want clearer sentences and better ideas." },
  { code: "grammar", label: "Grammar fixes", helper: "I want to stop repeating simple mistakes." },
  { code: "reading", label: "Reading and evidence", helper: "I want to answer passages more confidently." },
  { code: "revision", label: "Revision missions", helper: "I want short daily practice that tells me what to do next." }
];

export function OnboardingWelcomeClient({ locale }: { locale: AppLocale }) {
  const router = useRouter();
  const [focusSubjectCode, setFocusSubjectCode] = useState("english");
  const [missionPreference, setMissionPreference] = useState("writing");
  const [status, setStatus] = useState(
    locale === "ms"
      ? "Pilih satu subjek dan satu gaya misi supaya kami boleh membentuk dashboard pertama anda."
      : "Pick one subject and one mission style so we can shape your first dashboard."
  );
  const [isSaving, setIsSaving] = useState(false);

  async function handleContinue() {
    if (!hasPublicSupabaseEnv()) {
      setStatus(
        locale === "ms"
          ? "Env awam Supabase tiada. Tambah kunci awam dahulu sebelum onboarding boleh disimpan."
          : "Missing Supabase public env. Add the public keys before onboarding can save."
      );
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
        setStatus(locale === "ms" ? "Log masuk dahulu supaya kami boleh simpan fokus belajar anda." : "Sign in first so we can save your study focus.");
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
      setStatus(
        error instanceof Error
          ? error.message
          : locale === "ms"
            ? "Tidak dapat menyimpan fokus belajar anda."
            : "Unable to save your study focus."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="dashboard-v3 welcome-v3-grid">
      <section className="dashboard-v3-summary-grid welcome-v3-choices">
        <article className="dashboard-v3-summary-card tone-blue">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{locale === "ms" ? "Langkah 1" : "Step 1"}</p></div>
            <span className="dashboard-v3-icon-box tone-progress">S</span>
          </div>
          <p className="dashboard-v3-summary-title">
            {locale === "ms" ? "Pilih subjek pertama anda" : "Pick your first subject"}
          </p>
          <p className="dashboard-helper">
            {locale === "ms" ? "Mulakan dengan subjek yang anda mahu perbaiki dahulu." : "Start with the subject you want to improve first."}
          </p>
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

        <article className="dashboard-v3-summary-card tone-pink">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{locale === "ms" ? "Langkah 2" : "Step 2"}</p></div>
            <span className="dashboard-v3-icon-box tone-achievements">AI</span>
          </div>
          <p className="dashboard-v3-summary-title">
            {locale === "ms" ? "Pilih gaya misi anda" : "Pick your mission style"}
          </p>
          <p className="dashboard-helper">
            {locale === "ms" ? "Pilih jenis bantuan yang anda mahu dahulu." : "Choose the kind of help you want first."}
          </p>
        <div className="onboarding-option-grid">
          {missionOptions.map((option) => (
            <button
              className={`onboarding-option${missionPreference === option.code ? " is-selected" : ""}`}
              key={option.code}
              onClick={() => setMissionPreference(option.code)}
              type="button"
            >
              <span className="dashboard-label">{locale === "ms" ? "Fokus permulaan" : "Starter focus"}</span>
              <strong>
                {locale === "ms"
                  ? option.code === "writing"
                    ? "Bantuan penulisan"
                    : option.code === "grammar"
                      ? "Baiki tatabahasa"
                      : option.code === "reading"
                        ? "Pembacaan dan bukti"
                        : "Misi ulang kaji"
                  : option.label}
              </strong>
              <p className="dashboard-helper">
                {locale === "ms"
                  ? option.code === "writing"
                    ? "Saya mahu ayat yang lebih jelas dan idea yang lebih baik."
                    : option.code === "grammar"
                      ? "Saya mahu berhenti mengulang kesilapan mudah."
                      : option.code === "reading"
                        ? "Saya mahu menjawab petikan dengan lebih yakin."
                        : "Saya mahu latihan harian yang ringkas dan jelas apa langkah seterusnya."
                  : option.helper}
              </p>
            </button>
          ))}
        </div>
        <div className="dashboard-v3-hero-actions welcome-v3-actions">
          <button className="btn btn-primary" disabled={isSaving} onClick={handleContinue} type="button">
            {isSaving
              ? locale === "ms"
                ? "Sedang simpan fokus anda..."
                : "Saving your focus..."
              : locale === "ms"
                ? "Terus ke Dashboard Saya"
                : "Continue to My Dashboard"}
          </button>
        </div>
        <p className="auth-status">{status}</p>
        </article>
      </section>
    </section>
  );
}
