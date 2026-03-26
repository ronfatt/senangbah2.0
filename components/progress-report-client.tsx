"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { hasPublicSupabaseEnv } from "../lib/env";
import { getSubjectDisplayName, type AppLocale } from "../lib/locale";

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
  displayName: string;
  trialActive: boolean;
  membershipLabel: string;
  streakDays: number;
  weeklyCompletedCount: number;
  weeklyTarget: number;
  weeklyStars: number;
  averageAccuracy: number;
  totalStars: number;
  totalStarPoints: number;
  nextFocus: string;
  completedCount: number;
  recentActivity: {
    status: string;
    stars: number;
    accuracyPercent: number;
    createdAt: string;
    subjectName: string;
    moduleName: string;
  }[];
  trialSummary: {
    strongestSubject: string | null;
    weakestModuleName: string | null;
    weakestModuleHref: string | null;
    recommendedUpgradePlanCode: string;
    recommendedUpgradeLabel: string;
    recommendedUpgradeHelper: string;
  };
  reportSummary?: {
    headline: string;
    strongestNow: string[];
    needsWorkNow: string[];
    aiAdvice: string[];
    nextActions: {
      label: string;
      helper: string;
      href: string;
    }[];
  };
  englishModules: ModulePerformance[];
  bahasaMelayuModules: ModulePerformance[];
  humanitiesModules: ModulePerformance[];
  mathModules: ModulePerformance[];
  addMathModules: ModulePerformance[];
};

export function ProgressReportClient({ locale }: { locale: AppLocale }) {
  const [state, setState] = useState<{
    status: "loading" | "signed_out" | "ready" | "env_missing";
    snapshot: DashboardSnapshot | null;
  }>({
    status: hasPublicSupabaseEnv() ? "loading" : "env_missing",
    snapshot: null
  });

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) return;

    const supabase = getSupabaseBrowserClient();

    async function load() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user?.id || !session.user.email) {
        setState({
          status: "signed_out",
          snapshot: null
        });
        return;
      }

      const response = await fetch("/api/dashboard-snapshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          authUserId: session.user.id,
          email: session.user.email
        })
      });

      const payload = await response.json().catch(() => ({}));
      setState({
        status: "ready",
        snapshot: payload?.snapshot || null
      });
    }

    load();
  }, []);

  const subjectCards = useMemo(() => {
    if (!state.snapshot) return [];

    return [
      {
        name: getSubjectDisplayName("English", locale),
        modules: state.snapshot.englishModules
      },
      {
        name: getSubjectDisplayName("Bahasa Melayu", locale),
        modules: state.snapshot.bahasaMelayuModules
      },
      {
        name: getSubjectDisplayName("Humanities", locale),
        modules: state.snapshot.humanitiesModules
      },
      {
        name: getSubjectDisplayName("Math", locale),
        modules: state.snapshot.mathModules
      },
      {
        name: getSubjectDisplayName("Add Math", locale),
        modules: state.snapshot.addMathModules
      }
    ].map((subject) => {
      const started = subject.modules.filter((module) => module.attemptsCount > 0);
      const mastery =
        subject.modules.length > 0
          ? Math.round(subject.modules.reduce((sum, module) => sum + module.masteryPercent, 0) / subject.modules.length)
          : 0;

      return {
        name: subject.name,
        mastery,
        startedCount: started.length,
        bestModule:
          started.sort((a, b) => b.masteryPercent - a.masteryPercent)[0]?.name ||
          (locale === "ms" ? "Belum bermula" : "Not started yet")
      };
    });
  }, [locale, state.snapshot]);

  if (state.status === "env_missing") {
    return (
      <section className="feature-panel">
        <p className="eyebrow">Progress report</p>
        <h2>{locale === "ms" ? "Env Supabase tiada." : "Supabase env is missing."}</h2>
        <p className="dashboard-helper">
          {locale === "ms"
            ? "Tambah kunci awam Supabase dahulu supaya laporan boleh dimuatkan."
            : "Add your public Supabase keys first so the report can load."}
        </p>
      </section>
    );
  }

  if (state.status === "signed_out") {
    return (
      <section className="feature-panel">
        <p className="eyebrow">{locale === "ms" ? "Laporan kemajuan" : "Progress report"}</p>
        <h2>{locale === "ms" ? "Log masuk untuk lihat laporan anda." : "Login to see your report."}</h2>
        <p className="dashboard-helper">
          {locale === "ms"
            ? "Subjek terkuat anda, bahagian yang lemah, dan langkah seterusnya daripada AI akan muncul di sini selepas anda log masuk."
            : "Your strongest subject, weak spots, and AI next steps will show here after you sign in."}
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/login">
            {locale === "ms" ? "Log Masuk untuk Terus Belajar" : "Login to Continue Learning"}
          </a>
          <a className="btn btn-secondary" href="/register">
            {locale === "ms" ? "Daftar sebagai Ahli" : "Register as Member"}
          </a>
        </div>
      </section>
    );
  }

  if (state.status === "loading" || !state.snapshot) {
    return (
      <section className="feature-panel">
        <p className="eyebrow">{locale === "ms" ? "Laporan kemajuan" : "Progress report"}</p>
        <h2>{locale === "ms" ? "Sedang memuatkan laporan anda..." : "Loading your report..."}</h2>
      </section>
    );
  }

  const snapshot = state.snapshot;

  return (
    <>
      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">{locale === "ms" ? "Rumusan AI" : "AI summary"}</p>
          <h1 className="dashboard-title">{snapshot.reportSummary?.headline || "Your study story is starting to form."}</h1>
          <p className="landing-lead">
            {locale === "ms"
              ? `${snapshot.displayName}, halaman ini menunjukkan apa yang sedang bertambah baik, apa yang masih perlu dibaiki, dan langkah paling jelas yang patut anda ambil sekarang.`
              : `${snapshot.displayName}, this page shows what is improving, what still needs work, and the clearest next step to take now.`}
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={snapshot.reportSummary?.nextActions?.[0]?.href || "/dashboard"}>
              {snapshot.reportSummary?.nextActions?.[0]?.label ||
                (locale === "ms" ? "Kembali ke Dashboard" : "Back to Dashboard")}
            </a>
            <a className="btn btn-secondary" href="/dashboard">
              {locale === "ms" ? "Buka Dashboard" : "Open Dashboard"}
            </a>
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">{locale === "ms" ? "Ringkasan laporan" : "Report snapshot"}</p>
          <div className="progress-metric-grid">
            <div className="progress-metric">
              <span className="dashboard-label">{locale === "ms" ? "Keahlian" : "Membership"}</span>
              <strong>{snapshot.membershipLabel}</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">{locale === "ms" ? "Sasaran mingguan" : "Weekly target"}</span>
              <strong>
                {snapshot.weeklyCompletedCount}/{snapshot.weeklyTarget}
              </strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">{locale === "ms" ? "Purata ketepatan" : "Average accuracy"}</span>
              <strong>{snapshot.averageAccuracy}%</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">{locale === "ms" ? "Mata bintang" : "Star points"}</span>
              <strong>{snapshot.totalStarPoints} pts</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">{locale === "ms" ? "Yang sedang bertambah baik" : "What is improving"}</p>
          <h2>{locale === "ms" ? "Inilah bahagian anda yang lebih kuat sekarang." : "These are your stronger areas right now."}</h2>
          <ul className="feature-list">
            {(snapshot.reportSummary?.strongestNow.length
              ? snapshot.reportSummary.strongestNow
              : [locale === "ms" ? "Mulakan beberapa misi supaya bahagian terkuat anda muncul di sini." : "Start a few missions so your stronger areas show up here."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">{locale === "ms" ? "Perlu dibaiki sekarang" : "Needs work now"}</p>
          <h2>{locale === "ms" ? "Inilah pembaikan yang paling berguna untuk dibuat seterusnya." : "These are the most useful fixes to make next."}</h2>
          <ul className="feature-list">
            {(snapshot.reportSummary?.needsWorkNow.length
              ? snapshot.reportSummary.needsWorkNow
              : [locale === "ms" ? "Bahagian lemah seterusnya akan muncul di sini selepas beberapa cubaan disimpan." : "Your next weak spot will appear here after a few saved attempts."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{locale === "ms" ? "Langkah seterusnya oleh AI" : "AI next steps"}</p>
            <h2>{locale === "ms" ? "Buat ini seterusnya jika anda mahu peningkatan paling cepat." : "Do these next if you want the fastest improvement."}</h2>
          </div>
        </div>
        <div className="subject-lane-grid">
          {(snapshot.reportSummary?.nextActions || []).map((action) => (
            <article className="subject-lane-card tone-language" key={action.href}>
              <p className="dashboard-label">{locale === "ms" ? "Tindakan seterusnya" : "Next action"}</p>
              <h3>{action.label}</h3>
              <p className="dashboard-helper">{action.helper}</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href={action.href}>
                  {locale === "ms" ? "Mula sekarang" : "Start Now"}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{locale === "ms" ? "Kemajuan subjek" : "Subject progress"}</p>
            <h2>{locale === "ms" ? "Lihat subjek mana yang bergerak dan yang mana masih perlukan dorongan pertama." : "See which subjects are moving and which still need a first push."}</h2>
          </div>
        </div>
        <div className="subject-lane-grid">
          {subjectCards.map((subject) => (
            <article className="subject-lane-card tone-humanities" key={subject.name}>
              <p className="dashboard-label">
                {locale === "ms" ? `${subject.startedCount} modul dimulakan` : `${subject.startedCount} module(s) started`}
              </p>
              <h3>{subject.name}</h3>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Penguasaan" : "Mastery"}</span>
                  <strong>{subject.mastery}%</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Modul terbaik" : "Best module"}</span>
                  <strong>{subject.bestModule}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">{locale === "ms" ? "Kejayaan terkini" : "Recent wins"}</p>
          <h2>{locale === "ms" ? "Apa yang baru bertambah baik dalam sesi terbaru anda." : "What just improved in your latest sessions."}</h2>
          <div className="momentum-stack">
            {snapshot.recentActivity.slice(0, 4).map((activity) => (
              <div className="momentum-item" key={`${activity.createdAt}-${activity.moduleName}`}>
                <span className="dashboard-label">
                  {activity.subjectName} · {activity.status}
                </span>
                <strong>{activity.moduleName}</strong>
                <p className="dashboard-helper">
                  {locale === "ms"
                    ? `${activity.accuracyPercent}% ketepatan · ${activity.stars} bintang`
                    : `${activity.accuracyPercent}% accuracy · ${activity.stars} star(s)`}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">{locale === "ms" ? "Nasihat AI" : "AI advice"}</p>
          <h2>{locale === "ms" ? "Nasihat ringkas yang boleh anda guna hari ini." : "Simple advice you can act on today."}</h2>
          <ul className="feature-list">
            {(snapshot.reportSummary?.aiAdvice?.length
              ? snapshot.reportSummary.aiAdvice
              : [
                  locale === "ms"
                    ? "Lindungi streak anda dengan satu misi ringkas sebelum berhenti hari ini."
                    : "Protect your streak with one short mission before you stop today.",
                  locale === "ms"
                    ? "Buka modul paling lemah dahulu jika anda mahu kemajuan paling cepat."
                    : "Open your weakest module first when you want the fastest progress.",
                  locale === "ms"
                    ? "Sasar 2 atau 3 bintang dengan memperlahankan sedikit dan menyemak satu butiran lagi sebelum hantar."
                    : "Push for 2 or 3 stars by slowing down and checking one more detail before submitting."
                ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
