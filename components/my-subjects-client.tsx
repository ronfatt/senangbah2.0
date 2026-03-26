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
        readyCount: readyModules.length,
        nextLabel: firstModule?.name || (locale === "ms" ? "Buka subjek" : "Open subject"),
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
    <>
      <section className="section">
        <div className="dashboard-card-grid">
          <article className="dashboard-card">
            <p className="dashboard-label">How to use this page</p>
            <h2>{locale === "ms" ? "Buka satu subjek. Mula satu misi." : "Open one subject. Start one mission."}</h2>
            <p className="dashboard-helper">
              {locale === "ms"
                ? "Halaman ini untuk aliran belajar anda. Pilih subjek yang anda mahu perbaiki, kemudian terus masuk ke misi yang paling jelas."
                : "This page is for your study flow. Pick the subject you want to improve, then jump straight into the clearest mission."}
            </p>
          </article>

          <article className="dashboard-card">
            <p className="dashboard-label">{locale === "ms" ? "Akses anda" : "Your access"}</p>
            <h2>{state.status === "ready" ? state.snapshot.membershipLabel : locale === "ms" ? "Sedang menyemak akses anda..." : "Checking your access..."}</h2>
            <p className="dashboard-helper">
              {state.status === "ready"
                ? state.snapshot.nextFocus
                : locale === "ms"
                  ? "Kami sedang memuatkan subjek yang sudah dibuka dan langkah terbaik anda seterusnya."
                  : "We are loading your unlocked subjects and your next best move."}
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="my-subjects-priority-grid">
          <article className="dashboard-card my-subjects-priority-card">
            <p className="dashboard-label">{locale === "ms" ? "Mula di sini" : "Start here"}</p>
            <h2>{locale === "ms" ? "Buka subjek yang terasa paling mudah untuk dimulakan hari ini." : "Open the subject that feels easiest to start today."}</h2>
            <p className="dashboard-helper">
              {locale === "ms"
                ? "Bagi kebanyakan pelajar, satu misi ringkas lebih baik daripada cuba merancang seluruh minggu sekaligus."
                : "For most students, one short mission is better than trying to plan the whole week at once."}
            </p>
          </article>
          <article className="dashboard-card my-subjects-priority-card">
            <p className="dashboard-label">{locale === "ms" ? "Perlu dibaiki" : "Needs work"}</p>
            <h2>{locale === "ms" ? "Cari modul paling lemah dalam setiap kad subjek." : "Look for the weakest module inside each subject card."}</h2>
            <p className="dashboard-helper">
              {locale === "ms"
                ? "Itulah biasanya tempat paling jelas di mana AI boleh membantu anda bertambah baik dengan lebih cepat."
                : "That is usually the clearest place where AI can help you improve faster."}
            </p>
          </article>
          <article className="dashboard-card my-subjects-priority-card">
            <p className="dashboard-label">{locale === "ms" ? "Sedang bertambah baik" : "Improving now"}</p>
            <h2>{locale === "ms" ? "Kekalkan satu bahagian yang lebih kuat sambil membaiki satu titik lemah." : "Keep one stronger area moving while you fix one weak point."}</h2>
            <p className="dashboard-helper">
              {locale === "ms"
                ? "Ini menjadikan kemajuan lebih jelas dan mengelakkan semua subjek terasa sukar pada masa yang sama."
                : "This keeps progress visible instead of making every subject feel hard at the same time."}
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{locale === "ms" ? "Subjek saya" : "My subjects"}</p>
            <h2>{locale === "ms" ? "Inilah subjek yang ada dalam dashboard pelajar anda." : "These are the subjects inside your student dashboard."}</h2>
          </div>
        </div>

        <div className="subject-lane-grid">
          {subjectLanes.map((subject) => (
            <article className={`subject-lane-card ${subject.tone}`} key={subject.code}>
              <div className="module-card-head">
                <div>
                  <p className="dashboard-label">{subject.bundle}</p>
                  <h3>{subject.name}</h3>
                </div>
                <span className={`module-state ${subject.unlocked ? "state-ready" : "state-locked"}`}>
                  {subject.unlocked ? (locale === "ms" ? "Terbuka" : "Open") : locale === "ms" ? "Terkunci" : "Locked"}
                </span>
              </div>
              <p className="dashboard-helper">{subject.summary}</p>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Modul sedia" : "Ready modules"}</span>
                  <strong>{subject.readyCount}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Mula di sini" : "Start here"}</span>
                  <strong>{subject.nextLabel}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Perlu dibaiki" : "Needs work"}</span>
                  <strong>{subject.needsWork}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Sedang bertambah baik" : "Improving now"}</span>
                  <strong>{subject.improvingNow}</strong>
                </div>
              </div>
              <div className="my-subjects-start-row">
                <span className="my-subjects-start-chip">{locale === "ms" ? "Mula sekarang" : "Start now"}</span>
                <strong>{subject.nextLabel}</strong>
              </div>
              <div className="hero-actions">
                <a className="btn btn-primary" href={subject.unlocked ? subject.nextHref : "/pricing"}>
                  {subject.unlocked ? (locale === "ms" ? "Mula sekarang" : "Start now") : locale === "ms" ? "Buka kunci subjek" : "Unlock subject"}
                </a>
                <a className="btn btn-secondary" href={subject.href}>
                  {locale === "ms" ? "Buka butiran" : "Open details"}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
