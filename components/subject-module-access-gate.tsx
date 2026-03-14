"use client";

import { useEffect, useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export function SubjectModuleAccessGate({
  subjectCode,
  subjectName,
  bundle,
  isCore,
  children
}: {
  subjectCode: string;
  subjectName: string;
  bundle: string;
  isCore: boolean;
  children: React.ReactNode;
}) {
  const [state, setState] = useState({
    loading: !isCore,
    unlocked: isCore,
    detail: isCore ? "Core module ready." : `Unlock with ${bundle}.`
  });

  useEffect(() => {
    if (isCore) return;

    if (!hasPublicSupabaseEnv()) {
      setState({
        loading: false,
        unlocked: false,
        detail: `Sign in and unlock this module through ${bundle}.`
      });
      return;
    }

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;

      if (!session?.user?.id || !session.user.email) {
        setState({
          loading: false,
          unlocked: false,
          detail: `Sign in and unlock this module through ${bundle}.`
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

      const snapshot = await response.json().catch(() => ({}));
      const unlocked = Boolean(snapshot?.trialActive) || snapshot?.unlockedSubjectCodes?.includes(subjectCode);

      setState({
        loading: false,
        unlocked,
        detail: unlocked
          ? `${subjectName} is active in your trial or bundle.`
          : `This premium module unlocks through ${bundle}.`
      });
    });
  }, [bundle, isCore, subjectCode, subjectName]);

  if (state.loading) {
    return (
      <section className="session-banner">
        <p className="eyebrow">Access check</p>
        <h2>Checking premium access...</h2>
        <p className="dashboard-helper">We are verifying whether this module is open in your current plan.</p>
      </section>
    );
  }

  if (!state.unlocked) {
    return (
      <section className="feature-panel alt">
        <p className="eyebrow">Premium access</p>
        <h2>{subjectName} is currently locked.</h2>
        <p className="dashboard-helper">{state.detail}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/pricing">
            Compare plans
          </a>
          <a className="btn btn-secondary" href={`/subjects/${subjectCode.replace("_", "-")}`}>
            Back to subject
          </a>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
