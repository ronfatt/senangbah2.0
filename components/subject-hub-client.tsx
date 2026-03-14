"use client";

import { useEffect, useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import type { SubjectDefinition } from "../lib/subjects";

function useSubjectAccess(subject: SubjectDefinition) {
  const [state, setState] = useState({
    loading: true,
    isUnlocked: subject.isCore,
    label: subject.isCore ? "Core subject" : "Locked",
    detail: subject.isCore
      ? "Core subject remains visible in the starter experience."
      : `Unlock with ${subject.bundle}.`
  });

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) {
      setState({
        loading: false,
        isUnlocked: subject.isCore,
        label: subject.isCore ? "Starter access" : "Locked",
        detail: subject.isCore
          ? "Core subject remains visible in the starter experience."
          : `Unlock with ${subject.bundle}.`
      });
      return;
    }

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;

      if (!session) {
        setState({
          loading: false,
          isUnlocked: subject.isCore,
          label: subject.isCore ? "Starter access" : "Signed out",
          detail: subject.isCore
            ? "English and BM can stay visible in the starter experience."
            : `Sign in or start a trial to unlock via ${subject.bundle}.`
        });
        return;
      }

      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email: session.user.email
        })
      });

      const snapshot = await response.json();
      const isUnlocked = subject.isCore || snapshot.unlockedSubjectCodes?.includes(subject.code);
      const trialActive = Boolean(snapshot.trialActive);

      setState({
        loading: false,
        isUnlocked,
        label: isUnlocked ? (trialActive ? "Trial unlocked" : "Bundle active") : "Locked",
        detail: isUnlocked
          ? trialActive
            ? "This subject is open during your active trial."
            : "Your active plan currently unlocks this subject."
          : `This subject unlocks through ${subject.bundle}.`
      });
    });
  }, [subject]);

  return state;
}

export function SubjectHubClient({ subject }: { subject: SubjectDefinition }) {
  const access = useSubjectAccess(subject);

  return (
    <>
      <section className="session-banner subject-access-banner">
        <p className="eyebrow">Live access state</p>
        <h2>{access.loading ? "Checking access..." : access.label}</h2>
        <p className="dashboard-helper">{access.detail}</p>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">Modules</p>
          <h2>{subject.isCore ? "Core module lineup" : "Premium module lineup"}</h2>
          <div className="module-card-grid">
            {subject.modules.map((module) => {
              const visualState =
                module.status === "ready"
                  ? subject.isCore || access.isUnlocked
                    ? "ready"
                    : "locked"
                  : module.status === "coming_soon"
                    ? "coming_soon"
                    : access.isUnlocked
                      ? "coming_soon"
                      : "locked";

              return (
                <article className={`module-card is-${visualState}`} key={module.name}>
                  <div className="module-card-head">
                    <h3>{module.name}</h3>
                    <span className={`module-state state-${visualState}`}>
                      {visualState === "ready" ? "Open" : visualState === "coming_soon" ? "Soon" : "Locked"}
                    </span>
                  </div>
                  <p>{module.summary}</p>
                  {module.status === "ready" && (subject.isCore || access.isUnlocked) ? (
                    <a className="mini-link" href={`/subjects/${subject.slug}/${module.slug}`}>
                      Open module
                    </a>
                  ) : null}
                  {((module.status === "locked") || (module.status === "ready" && !subject.isCore && !access.isUnlocked)) && !access.isUnlocked ? (
                    <a className="mini-link" href="/pricing">
                      Unlock with {subject.bundle}
                    </a>
                  ) : null}
                  {module.status === "locked" && access.isUnlocked ? (
                    <span className="mini-link">Bundle active, module build next</span>
                  ) : null}
                </article>
              );
            })}
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">Focus Areas</p>
          <h2>What this hub should help students improve</h2>
          <ul className="feature-list">
            {subject.focusAreas.map((focus) => (
              <li key={focus}>{focus}</li>
            ))}
          </ul>
          {!subject.isCore ? (
            <div className="upgrade-callout">
              <p className="eyebrow">Bundle Path</p>
              <h3>{subject.bundle}</h3>
              <p className="subject-summary">
                This subject stays visible in trial, then unlocks through its bundle after trial expiry.
              </p>
              <a className="btn btn-secondary" href="/pricing">
                Compare plans
              </a>
            </div>
          ) : null}
        </article>
      </section>
    </>
  );
}
