"use client";

import { useEffect, useMemo, useState } from "react";
import { getSubjectDisplayName, type AppLocale } from "../lib/locale";
import { subjectDefinitions } from "../lib/subjects";

type Snapshot = {
  trialActive: boolean;
  unlockedSubjectCodes: string[];
  nextFocus: string;
  membershipLabel: string;
  coachSignal?: {
    strongest?: { name?: string | null } | null;
    weakest?: { name?: string | null } | null;
  } | null;
  bahasaMelayuCoachSignal?: {
    strongest?: { name?: string | null } | null;
    weakest?: { name?: string | null } | null;
  } | null;
  humanitiesCoachSignal?: {
    strongest?: { name?: string | null } | null;
    weakest?: { name?: string | null } | null;
  } | null;
  mathCoachSignal?: {
    strongest?: { name?: string | null } | null;
    weakest?: { name?: string | null } | null;
  } | null;
  addMathCoachSignal?: {
    strongest?: { name?: string | null } | null;
    weakest?: { name?: string | null } | null;
  } | null;
};

type ApiState =
  | { status: "loading" }
  | { status: "ready"; snapshot: Snapshot }
  | { status: "error" };

export function MySubjectsClient({ locale }: { locale: AppLocale }) {
  const [state, setState] = useState<ApiState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard-snapshot", { credentials: "include" })
      .then((response) => response.json())
      .then((payload) => {
        if (!active) return;
        if (payload?.ok && payload?.snapshot) {
          setState({
            status: "ready",
            snapshot: {
              trialActive: Boolean(payload.snapshot.trialActive),
              unlockedSubjectCodes: Array.isArray(payload.snapshot.unlockedSubjectCodes)
                ? payload.snapshot.unlockedSubjectCodes
                : [],
              nextFocus:
                payload.snapshot.nextFocus ||
                (locale === "ms"
                  ? "Buka satu subjek dan mulakan misi yang paling jelas."
                  : "Open one subject and start the clearest mission."),
              membershipLabel:
                payload.snapshot.membershipLabel ||
                (locale === "ms" ? "Akses permulaan percuma" : "Free starter access"),
              coachSignal: payload.snapshot.coachSignal || null,
              bahasaMelayuCoachSignal: payload.snapshot.bahasaMelayuCoachSignal || null,
              humanitiesCoachSignal: payload.snapshot.humanitiesCoachSignal || null,
              mathCoachSignal: payload.snapshot.mathCoachSignal || null,
              addMathCoachSignal: payload.snapshot.addMathCoachSignal || null
            }
          });
          return;
        }

        setState({ status: "error" });
      })
      .catch(() => {
        if (!active) return;
        setState({ status: "error" });
      });

    return () => {
      active = false;
    };
  }, []);

  const subjectLanes = useMemo(() => {
    const unlockedCodes =
      state.status === "ready"
        ? new Set(state.snapshot.unlockedSubjectCodes)
        : new Set<string>(["english", "bahasa_melayu"]);

    return subjectDefinitions.map((subject) => {
      const unlocked =
        state.status === "ready"
          ? state.snapshot.trialActive || unlockedCodes.has(subject.code)
          : subject.isCore;

      const readyModules = subject.modules.filter((module) => module.status === "ready");
      const firstModule = readyModules[0] || subject.modules[0];
      const subjectCoach =
        state.status === "ready"
          ? subject.slug === "english"
            ? state.snapshot.coachSignal
            : subject.slug === "bahasa-melayu"
              ? state.snapshot.bahasaMelayuCoachSignal
              : subject.slug === "sejarah" || subject.slug === "geografi"
                ? state.snapshot.humanitiesCoachSignal
                : subject.slug === "math"
                  ? state.snapshot.mathCoachSignal
                  : subject.slug === "add-math"
                    ? state.snapshot.addMathCoachSignal
                    : null
          : null;

      return {
        code: subject.code,
        slug: subject.slug,
        name: getSubjectDisplayName(subject.name, locale),
        bundle:
          locale === "ms"
            ? subject.bundle === "Language Pack"
              ? "Pakej Bahasa"
              : subject.bundle === "Humanities Pack"
                ? "Pakej Kemanusiaan"
                : "Pakej Matematik"
            : subject.bundle,
        summary: subject.summary,
        unlocked,
        totalModules: subject.modules.length,
        readyCount: readyModules.length,
        nextLabel: firstModule?.name || (locale === "ms" ? "Buka subjek" : "Open subject"),
        weeklyFocusHeadline: locale === "ms" ? subject.weeklyFocus.headlineMs : subject.weeklyFocus.headline,
        weeklyFocusWhy: locale === "ms" ? subject.weeklyFocus.whyMs : subject.weeklyFocus.why,
        weeklyFocusHref: `/subjects/${subject.slug}/${subject.weeklyFocus.moduleSlug}`,
        needsWork:
          subjectCoach?.weakest?.name ||
          (unlocked
            ? locale === "ms"
              ? "Buka misi pertama"
              : "Open the first mission"
            : locale === "ms"
              ? "Buka kunci laluan ini"
              : "Unlock this lane"),
        improvingNow:
          subjectCoach?.strongest?.name ||
          (unlocked
            ? locale === "ms"
              ? "Bina keputusan kuat pertama anda"
              : "Build your first strong result"
            : locale === "ms"
              ? "Tersedia selepas dibuka kunci"
              : "Available after unlock"),
        nextHref: firstModule ? `/subjects/${subject.slug}/${firstModule.slug}` : `/subjects/${subject.slug}`,
        href: `/subjects/${subject.slug}`,
        iconLabel:
          subject.slug === "english"
            ? "EN"
            : subject.slug === "bahasa-melayu"
              ? "BM"
              : subject.slug === "sejarah"
                ? "SJ"
                : subject.slug === "geografi"
                  ? "GEO"
                  : subject.slug === "math"
                    ? "M"
                    : "AM",
        tone:
          subject.bundle === "Language Pack"
            ? "tone-language"
            : subject.bundle === "Humanities Pack"
              ? "tone-humanities"
              : "tone-math"
      };
    });
  }, [locale, state]);

  return (
    <div className="dashboard-v3 my-subjects-v3">
      <section className="dashboard-v3-hero dashboard-v3-page-hero">
        <p className="dashboard-v3-welcome">{locale === "ms" ? "Subjek dan laluan" : "Subjects and paths"}</p>
        <h1>{locale === "ms" ? "My Subjects" : "My Subjects"} 📚</h1>
        <p className="dashboard-v3-hero-copy">
          {state.status === "ready"
            ? locale === "ms"
              ? `Akses anda sekarang: ${state.snapshot.membershipLabel}. Buka satu subjek, mula satu misi, dan teruskan dengan AI yang menunjukkan apa yang perlu dibaiki seterusnya.`
              : `Your access is now ${state.snapshot.membershipLabel}. Open one subject, start one mission, and keep moving with AI showing what to fix next.`
            : locale === "ms"
              ? "Buka satu subjek, mula satu misi, dan bina rentak belajar yang jelas."
              : "Open one subject, start one mission, and build a clear study rhythm."}
        </p>
        <div className="dashboard-v3-hero-actions">
          <a className="btn btn-primary" href="/dashboard">
            {locale === "ms" ? "Kembali ke Dashboard" : "Back to Dashboard"}
          </a>
          <a className="btn btn-secondary" href="/progress">
            {locale === "ms" ? "Buka Laporan Kemajuan" : "Open Progress Report"}
          </a>
        </div>
      </section>

      <section className="dashboard-v3-summary-grid dashboard-v3-summary-grid-compact">
        <article className="dashboard-v3-summary-card tone-blue">
          <div className="dashboard-v3-summary-head">
            <div>
              <p className="dashboard-label">{locale === "ms" ? "Mula di sini" : "Start here"}</p>
            </div>
            <span className="dashboard-v3-icon-box tone-blue">→</span>
          </div>
          <p className="dashboard-v3-summary-title">
            {locale === "ms" ? "Buka subjek yang paling mudah untuk dimulakan hari ini." : "Open the subject that feels easiest to start today."}
          </p>
          <p className="dashboard-helper">
            {locale === "ms"
              ? "Satu misi ringkas lebih baik daripada cuba merancang semua subjek sekaligus."
              : "One short mission is better than trying to plan every subject at once."}
          </p>
        </article>

        <article className="dashboard-v3-summary-card tone-pink">
          <div className="dashboard-v3-summary-head">
            <div>
              <p className="dashboard-label">{locale === "ms" ? "Perlu dibaiki" : "Needs work"}</p>
            </div>
            <span className="dashboard-v3-icon-box tone-achievements">!</span>
          </div>
          <p className="dashboard-v3-summary-title">
            {locale === "ms" ? "Cari modul paling lemah dalam setiap kad subjek." : "Look for the weakest module inside each subject card."}
          </p>
          <p className="dashboard-helper">
            {locale === "ms"
              ? "Biasanya di situlah AI boleh memberi peningkatan paling cepat."
              : "That is usually where AI can create the fastest improvement."}
          </p>
        </article>

        <article className="dashboard-v3-summary-card tone-blue">
          <div className="dashboard-v3-summary-head">
            <div>
              <p className="dashboard-label">{locale === "ms" ? "Sedang bertambah baik" : "Improving now"}</p>
            </div>
            <span className="dashboard-v3-icon-box tone-live">↑</span>
          </div>
          <p className="dashboard-v3-summary-title">
            {locale === "ms" ? "Kekalkan satu bahagian kuat sambil membaiki satu titik lemah." : "Keep one stronger area moving while you fix one weak point."}
          </p>
          <p className="dashboard-helper">
            {locale === "ms"
              ? "Ini menjadikan kemajuan lebih jelas dari hari ke hari."
              : "This keeps progress easier to see from day to day."}
          </p>
        </article>
      </section>

      <section className="dashboard-v3-subjects">
        <div className="dashboard-v3-section-copy">
          <p className="eyebrow">{locale === "ms" ? "Subjek saya" : "My subjects"}</p>
          <h2>{locale === "ms" ? "Pilih satu subjek dan lompat terus ke misi yang paling jelas." : "Choose one subject and jump straight into the clearest mission."}</h2>
        </div>

        <div className="dashboard-v3-subject-grid">
          {subjectLanes.map((subject) => (
            <article className={`dashboard-v3-subject-card ${subject.tone}`} key={subject.code}>
              <div className="dashboard-v3-subject-head">
                <div>
                  <div className="dashboard-v3-subject-meta">
                    <span className="dashboard-label">{subject.bundle}</span>
                    <span className="dashboard-v3-status">
                      {subject.unlocked ? (locale === "ms" ? "Sedia" : "Ready") : locale === "ms" ? "Terkunci" : "Locked"}
                    </span>
                  </div>
                  <h3>{subject.name}</h3>
                </div>
                <span className={`dashboard-v3-icon-box ${subject.tone}`}>{subject.iconLabel}</span>
              </div>

              <p className="dashboard-helper">{subject.summary}</p>

              <div className="dashboard-v3-focus-block">
                <span className="dashboard-label">{locale === "ms" ? "Fokus minggu ini" : "Weekly focus"}</span>
                <strong>{subject.weeklyFocusHeadline}</strong>
                <p className="dashboard-helper">{subject.weeklyFocusWhy}</p>
                <a className="mini-link" href={subject.unlocked ? subject.weeklyFocusHref : "/pricing"}>
                  {subject.unlocked
                    ? locale === "ms"
                      ? "Buka fokus minggu ini"
                      : "Open this week's focus"
                    : locale === "ms"
                      ? "Buka kunci fokus ini"
                      : "Unlock this focus"}
                </a>
              </div>

              <div className="dashboard-v3-metrics">
                <div>
                  <span className="dashboard-label">{locale === "ms" ? "Jumlah modul" : "Total modules"}</span>
                  <strong>{subject.totalModules}</strong>
                </div>
                <div>
                  <span className="dashboard-label">{locale === "ms" ? "Modul sedia" : "Ready modules"}</span>
                  <strong>{subject.readyCount}</strong>
                </div>
                <div>
                  <span className="dashboard-label">{locale === "ms" ? "Perlu dibaiki" : "Needs work"}</span>
                  <strong>{subject.needsWork}</strong>
                </div>
              </div>

              <div className="dashboard-v3-start-block">
                <span className="dashboard-label">{locale === "ms" ? "Sedang bertambah baik" : "Improving now"}</span>
                <strong>{subject.improvingNow}</strong>
              </div>

              <div className="dashboard-v3-start-block">
                <span className="dashboard-label">{locale === "ms" ? "Mula dari" : "Start from"}</span>
                <strong>{subject.nextLabel}</strong>
              </div>

              <div className="dashboard-v3-action-row">
                <a className={`dashboard-v3-action-primary ${subject.tone}`} href={subject.unlocked ? subject.nextHref : "/pricing"}>
                  {subject.unlocked ? (locale === "ms" ? "Mula Pelajaran" : "Start Lesson") : locale === "ms" ? "Buka Kunci Subjek" : "Unlock Subject"}
                </a>
                <a className="dashboard-v3-action-secondary" href={subject.href}>
                  {locale === "ms" ? `Buka ${subject.name}` : `Open ${subject.name}`}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
