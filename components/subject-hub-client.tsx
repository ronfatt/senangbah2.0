"use client";

import { useEffect, useState } from "react";
import { hasPublicSupabaseEnv } from "../lib/env";
import { type AppLocale } from "../lib/locale";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import type { SubjectDefinition } from "../lib/subjects";

type ModulePerformance = {
  slug: string;
  name: string;
  href: string;
  attemptsCount: number;
  totalStars: number;
  averageAccuracy: number;
  masteryPercent: number;
  statusLabel: string;
};

type DashboardSnapshot = {
  englishModules: ModulePerformance[];
  bahasaMelayuModules: ModulePerformance[];
  humanitiesModules: ModulePerformance[];
  mathModules: ModulePerformance[];
  addMathModules: ModulePerformance[];
};

function useSubjectAccess(subject: SubjectDefinition, locale: AppLocale) {
  const [state, setState] = useState({
    loading: true,
    isUnlocked: subject.isCore,
    label: subject.isCore ? (locale === "ms" ? "Subjek teras" : "Core subject") : locale === "ms" ? "Terkunci" : "Locked",
    detail: subject.isCore
      ? locale === "ms"
        ? "Subjek teras kekal kelihatan dalam pengalaman permulaan."
        : "Core subject remains visible in the starter experience."
      : locale === "ms"
        ? `Buka kunci dengan ${subject.bundle}.`
        : `Unlock with ${subject.bundle}.`
  });

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) {
      setState({
          loading: false,
          isUnlocked: subject.isCore,
          label: subject.isCore ? (locale === "ms" ? "Akses permulaan" : "Starter access") : locale === "ms" ? "Terkunci" : "Locked",
          detail: subject.isCore
            ? locale === "ms"
              ? "Subjek teras kekal kelihatan dalam pengalaman permulaan."
              : "Core subject remains visible in the starter experience."
            : locale === "ms"
              ? `Buka kunci dengan ${subject.bundle}.`
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
          label: subject.isCore ? (locale === "ms" ? "Akses permulaan" : "Starter access") : locale === "ms" ? "Belum log masuk" : "Signed out",
          detail: subject.isCore
            ? locale === "ms"
              ? "Bahasa Inggeris dan Bahasa Melayu kekal kelihatan dalam pengalaman permulaan."
              : "English and BM can stay visible in the starter experience."
            : locale === "ms"
              ? `Log masuk atau mulakan percubaan untuk buka melalui ${subject.bundle}.`
              : `Sign in or start a trial to unlock via ${subject.bundle}.`
        });
        return;
      }

      try {
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
          label: isUnlocked
            ? trialActive
              ? locale === "ms"
                ? "Dibuka oleh percubaan"
                : "Trial unlocked"
              : locale === "ms"
                ? "Pakej aktif"
                : "Bundle active"
            : locale === "ms"
              ? "Terkunci"
              : "Locked",
          detail: isUnlocked
            ? trialActive
              ? locale === "ms"
                ? "Subjek ini terbuka semasa percubaan anda masih aktif."
                : "This subject is open during your active trial."
              : locale === "ms"
                ? "Pelan aktif anda kini membuka subjek ini."
                : "Your active plan currently unlocks this subject."
            : locale === "ms"
              ? `Subjek ini dibuka melalui ${subject.bundle}.`
              : `This subject unlocks through ${subject.bundle}.`
        });
      } catch {
        setState({
          loading: false,
          isUnlocked: subject.isCore,
          label: subject.isCore ? (locale === "ms" ? "Akses permulaan" : "Starter access") : locale === "ms" ? "Terkunci" : "Locked",
          detail: subject.isCore
            ? locale === "ms"
              ? "Subjek teras kekal kelihatan dalam pengalaman permulaan."
              : "Core subject remains visible in the starter experience."
            : locale === "ms"
              ? `Buka kunci dengan ${subject.bundle}.`
              : `Unlock with ${subject.bundle}.`
        });
      }
    });
  }, [locale, subject]);

  return state;
}

export function SubjectHubClient({ subject, locale }: { subject: SubjectDefinition; locale: AppLocale }) {
  const access = useSubjectAccess(subject, locale);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) return;

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session?.user?.id || !session.user.email) return;

      try {
        const response = await fetch("/api/dashboard-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authUserId: session.user.id,
            email: session.user.email
          })
        });

        const payload = await response.json().catch(() => ({}));
        setSnapshot(payload?.snapshot || null);
      } catch {
        setSnapshot(null);
      }
    });
  }, []);

  const performanceModules =
    subject.slug === "english"
      ? snapshot?.englishModules || []
      : subject.slug === "bahasa-melayu"
        ? snapshot?.bahasaMelayuModules || []
        : subject.slug === "sejarah"
          ? (snapshot?.humanitiesModules || []).filter((module) => module.href.includes("/subjects/sejarah/"))
          : subject.slug === "geografi"
            ? (snapshot?.humanitiesModules || []).filter((module) => module.href.includes("/subjects/geografi/"))
            : subject.slug === "math"
              ? snapshot?.mathModules || []
              : snapshot?.addMathModules || [];

  const modulePerformanceMap = new Map(performanceModules.map((module) => [module.slug, module]));
  const visibleModules = subject.modules.map((module) => {
    const performance = modulePerformanceMap.get(module.slug);
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

    return {
      ...module,
      attemptsCount: performance?.attemptsCount || 0,
      averageAccuracy: performance?.averageAccuracy || 0,
      totalStars: performance?.totalStars || 0,
      masteryPercent: performance?.masteryPercent || 0,
      href: `/subjects/${subject.slug}/${module.slug}`,
      visualState
    };
  });

  const readyModules = visibleModules.filter((module) => module.visualState === "ready");
  const startedModules = readyModules.filter((module) => module.attemptsCount > 0);
  const unstartedModules = readyModules.filter((module) => module.attemptsCount === 0);

  const startHereModule =
    unstartedModules[0] ||
    [...startedModules].sort((a, b) => a.attemptsCount - b.attemptsCount || a.masteryPercent - b.masteryPercent)[0] ||
    readyModules[0] ||
    visibleModules[0];

  const needsWorkModule =
    [...startedModules].sort(
      (a, b) =>
        a.averageAccuracy - b.averageAccuracy ||
        a.totalStars - b.totalStars ||
        a.masteryPercent - b.masteryPercent
    )[0] || null;

  const improvingNowModule =
    [...startedModules].sort(
      (a, b) =>
        b.averageAccuracy - a.averageAccuracy ||
        b.totalStars - a.totalStars ||
        b.masteryPercent - a.masteryPercent
    )[0] || null;

  const toneClass =
    subject.bundle === "Language Pack"
      ? "tone-language"
      : subject.bundle === "Humanities Pack"
        ? "tone-humanities"
        : "tone-math";

  return (
    <>
      <section className="session-banner subject-access-banner">
        <p className="eyebrow">{locale === "ms" ? "Akses subjek" : "Subject access"}</p>
        <h2>{access.loading ? (locale === "ms" ? "Sedang menyemak akses..." : "Checking access...") : access.label}</h2>
        <p className="dashboard-helper">{access.detail}</p>
      </section>

      <section className="section" id="subject-guide">
        <div className="table-head">
          <div>
            <p className="eyebrow">{locale === "ms" ? "Laluan terbaik dalam subjek ini" : "Best path in this subject"}</p>
            <h2>{locale === "ms" ? "Mulakan dengan satu modul yang jelas, kemudian buka yang lain hanya apabila perlu." : "Start with one clear module, then open the rest only when you need them."}</h2>
          </div>
        </div>

        <div className="subject-lane-grid">
          <article className={`subject-lane-card ${toneClass}`}>
            <p className="dashboard-label">{locale === "ms" ? "Mula di sini" : "Start here"}</p>
            <h3>{startHereModule?.name || (locale === "ms" ? "Buka modul pertama anda" : "Open your first module")}</h3>
            <p className="dashboard-helper">
              {startHereModule
                ? startHereModule.attemptsCount
                  ? locale === "ms"
                    ? "Inilah tempat paling mudah untuk mengekalkan momentum anda."
                    : "This is the easiest place to keep your momentum moving."
                  : locale === "ms"
                    ? "Mulakan dengan ini dahulu supaya subjek ini mula menjejak kemajuan sebenar."
                    : "Start with this first so the subject begins tracking real progress."
                : locale === "ms"
                  ? "Buka satu modul sedia dahulu supaya dashboard boleh mula membimbing anda."
                  : "Open one ready module first so the dashboard can start guiding you."}
            </p>
            <div className="momentum-stack">
              <div className="momentum-item">
                <span className="dashboard-label">{locale === "ms" ? "Misi" : "Mission"}</span>
                <strong>{startHereModule?.mission || (locale === "ms" ? "Pilih satu tugasan ringkas" : "Choose one short task")}</strong>
              </div>
            </div>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href={
                  startHereModule?.visualState === "ready" && access.isUnlocked
                    ? startHereModule.href
                    : subject.isCore && startHereModule?.visualState === "ready"
                      ? startHereModule.href
                      : "/pricing"
                }
              >
                {startHereModule?.visualState === "ready" && (access.isUnlocked || subject.isCore)
                  ? locale === "ms"
                    ? `Mula ${startHereModule.name}`
                    : `Start ${startHereModule.name}`
                  : locale === "ms"
                    ? "Lihat Keahlian"
                    : "View Memberships"}
              </a>
            </div>
          </article>

          <article className={`subject-lane-card ${toneClass}`}>
            <p className="dashboard-label">{locale === "ms" ? "Perlu dibaiki" : "Needs work"}</p>
            <h3>{needsWorkModule?.name || (locale === "ms" ? "Ini akan muncul selepas beberapa keputusan pertama anda" : "This will appear after your first few results")}</h3>
            <p className="dashboard-helper">
              {needsWorkModule
                ? locale === "ms"
                  ? `${needsWorkModule.averageAccuracy}% purata ketepatan setakat ini. Inilah tempat paling bijak untuk dikemaskan seterusnya.`
                  : `${needsWorkModule.averageAccuracy}% average accuracy so far. This is the smartest place to tighten next.`
                : locale === "ms"
                  ? "Selesaikan satu atau dua misi ringkas dahulu. Selepas itu kami boleh tunjuk bahagian paling lemah dengan jelas."
                  : "Finish one or two short missions first. Then we can show your weakest spot clearly."}
            </p>
            {needsWorkModule ? (
              <div className="hero-actions">
                <a className="btn btn-primary" href={needsWorkModule.href}>
                  {locale === "ms" ? `Baiki ${needsWorkModule.name}` : `Fix ${needsWorkModule.name}`}
                </a>
              </div>
            ) : null}
          </article>

          <article className={`subject-lane-card ${toneClass}`}>
            <p className="dashboard-label">{locale === "ms" ? "Sedang bertambah baik" : "Improving now"}</p>
            <h3>{improvingNowModule?.name || (locale === "ms" ? "Modul terbaik anda akan muncul di sini" : "Your best module will show here")}</h3>
            <p className="dashboard-helper">
              {improvingNowModule
                ? locale === "ms"
                  ? `${improvingNowModule.totalStars} bintang dan ${improvingNowModule.masteryPercent}% penguasaan. Inilah laluan terkuat anda dalam ${subject.name} sekarang.`
                  : `${improvingNowModule.totalStars} star(s) and ${improvingNowModule.masteryPercent}% mastery. This is your strongest lane in ${subject.name} right now.`
                : locale === "ms"
                  ? "Selepas anda menyiapkan beberapa misi, kad ini akan menunjukkan apa yang sedang menjadi lebih kuat."
                  : "Once you complete a few missions, this card will show what is getting stronger."}
            </p>
            {improvingNowModule ? (
              <div className="hero-actions">
                <a className="btn btn-secondary" href={improvingNowModule.href}>
                  {locale === "ms" ? `Ulang semula ${improvingNowModule.name}` : `Revisit ${improvingNowModule.name}`}
                </a>
              </div>
            ) : null}
          </article>
        </div>
      </section>

      <section className="section section-split">
        <article className="feature-panel alt">
          <p className="eyebrow">{locale === "ms" ? "Kenapa subjek ini penting" : "Why this subject matters"}</p>
          <h2>{locale === "ms" ? "Apa yang pelajar patut perbaiki dalam laluan ini" : "What students should improve in this lane"}</h2>
          <ul className="feature-list">
            {subject.focusAreas.map((focus) => (
              <li key={focus}>{focus}</li>
            ))}
          </ul>
          {!subject.isCore ? (
            <div className="upgrade-callout">
              <p className="eyebrow">{locale === "ms" ? "Laluan pakej" : "Bundle Path"}</p>
              <h3>{subject.bundle}</h3>
              <p className="subject-summary">
                {locale === "ms"
                  ? "Subjek ini kekal kelihatan semasa percubaan, kemudian dibuka melalui pakejnya selepas percubaan tamat."
                  : "This subject stays visible in trial, then unlocks through its bundle after trial expiry."}
              </p>
              <a className="btn btn-secondary" href="/pricing">
                {locale === "ms" ? "Bandingkan pelan" : "Compare plans"}
              </a>
            </div>
          ) : null}
        </article>

        <article className="feature-panel">
          <details className="dashboard-foldout" open>
            <summary className="dashboard-foldout-summary">
              <div>
                <p className="eyebrow">{locale === "ms" ? "Semua modul" : "All modules"}</p>
                <h2>{locale === "ms" ? "Buka setiap modul dalam subjek ini hanya apabila anda memerlukannya." : "Open every module in this subject only when you need it."}</h2>
              </div>
            </summary>

            <div className="module-card-grid dashboard-foldout-body">
              {visibleModules.map((module) => (
                <article className={`module-card is-${module.visualState}`} key={module.name}>
                  <div className="module-card-head">
                    <h3>{module.name}</h3>
                    <span className={`module-state state-${module.visualState}`}>
                      {module.visualState === "ready"
                        ? locale === "ms"
                          ? "Terbuka"
                          : "Open"
                        : module.visualState === "coming_soon"
                          ? locale === "ms"
                            ? "Akan datang"
                            : "Soon"
                          : locale === "ms"
                            ? "Terkunci"
                            : "Locked"}
                    </span>
                  </div>
                  <p>{module.summary}</p>
                  <div className="momentum-stack">
                    <div className="momentum-item">
                      <span className="dashboard-label">{locale === "ms" ? "Status" : "Status"}</span>
                      <strong>
                        {module.attemptsCount
                          ? locale === "ms"
                            ? `${module.attemptsCount} keputusan disimpan`
                            : `${module.attemptsCount} result(s) saved`
                          : module.visualState === "ready"
                            ? locale === "ms"
                              ? "Sedia untuk mula"
                              : "Ready to start"
                            : module.visualState === "coming_soon"
                              ? locale === "ms"
                                ? "Akan dibina seterusnya"
                                : "Build next"
                              : locale === "ms"
                                ? "Keahlian diperlukan"
                                : "Membership needed"}
                      </strong>
                    </div>
                  </div>
                  {module.visualState === "ready" ? (
                    <a className="mini-link" href={module.href}>
                      {locale === "ms" ? "Buka modul" : "Open module"}
                    </a>
                  ) : null}
                  {(module.visualState === "locked" || (module.status === "ready" && !access.isUnlocked && !subject.isCore)) ? (
                    <a className="mini-link" href="/pricing">
                      {locale === "ms" ? `Buka kunci dengan ${subject.bundle}` : `Unlock with ${subject.bundle}`}
                    </a>
                  ) : null}
                  {module.status === "locked" && access.isUnlocked ? (
                    <span className="mini-link">Bundle active, module build next</span>
                  ) : null}
                </article>
              ))}
            </div>
          </details>
        </article>
      </section>
    </>
  );
}
