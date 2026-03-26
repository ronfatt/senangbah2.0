"use client";

import { useEffect, useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export function SubjectModuleAccessGate({
  subjectCode,
  subjectName,
  bundle,
  isCore,
  locale,
  children
}: {
  subjectCode: string;
  subjectName: string;
  bundle: string;
  isCore: boolean;
  locale: AppLocale;
  children: React.ReactNode;
}) {
  const [state, setState] = useState({
    loading: !isCore,
    unlocked: isCore,
    detail: isCore
      ? locale === "ms"
        ? "Modul teras sudah sedia."
        : "Core module ready."
      : locale === "ms"
        ? `Buka kunci dengan ${bundle}.`
        : `Unlock with ${bundle}.`
  });

  useEffect(() => {
    if (isCore) return;

    if (!hasPublicSupabaseEnv()) {
      setState({
        loading: false,
        unlocked: false,
        detail:
          locale === "ms"
            ? `Log masuk dan buka kunci modul ini melalui ${bundle}.`
            : `Sign in and unlock this module through ${bundle}.`
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
          detail:
            locale === "ms"
              ? `Log masuk dan buka kunci modul ini melalui ${bundle}.`
              : `Sign in and unlock this module through ${bundle}.`
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
          ? locale === "ms"
            ? `${subjectName} aktif dalam percubaan atau pakej anda.`
            : `${subjectName} is active in your trial or bundle.`
          : locale === "ms"
            ? `Modul premium ini dibuka melalui ${bundle}.`
            : `This premium module unlocks through ${bundle}.`
      });
    });
  }, [bundle, isCore, locale, subjectCode, subjectName]);

  if (state.loading) {
    return (
        <section className="session-banner">
        <p className="eyebrow">{locale === "ms" ? "Semakan akses" : "Access check"}</p>
        <h2>{locale === "ms" ? "Sedang menyemak akses premium..." : "Checking premium access..."}</h2>
        <p className="dashboard-helper">
          {locale === "ms"
            ? "Kami sedang mengesahkan sama ada modul ini terbuka dalam pelan semasa anda."
            : "We are verifying whether this module is open in your current plan."}
        </p>
      </section>
    );
  }

  if (!state.unlocked) {
    return (
      <section className="feature-panel alt">
        <p className="eyebrow">{locale === "ms" ? "Akses premium" : "Premium access"}</p>
        <h2>{locale === "ms" ? `${subjectName} kini terkunci.` : `${subjectName} is currently locked.`}</h2>
        <p className="dashboard-helper">{state.detail}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/pricing">
            {locale === "ms" ? "Bandingkan pelan" : "Compare plans"}
          </a>
          <a className="btn btn-secondary" href={`/subjects/${subjectCode.replace("_", "-")}`}>
            {locale === "ms" ? "Kembali ke subjek" : "Back to subject"}
          </a>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
