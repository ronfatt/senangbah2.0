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
        modules: state.snapshot.englishModules,
        tone: "tone-language"
      },
      {
        name: getSubjectDisplayName("Bahasa Melayu", locale),
        modules: state.snapshot.bahasaMelayuModules,
        tone: "tone-language"
      },
      {
        name: getSubjectDisplayName("Humanities", locale),
        modules: state.snapshot.humanitiesModules,
        tone: "tone-humanities"
      },
      {
        name: getSubjectDisplayName("Math", locale),
        modules: state.snapshot.mathModules,
        tone: "tone-math"
      },
      {
        name: getSubjectDisplayName("Add Math", locale),
        modules: state.snapshot.addMathModules,
        tone: "tone-math"
      }
    ].map((subject) => {
      const started = subject.modules.filter((module) => module.attemptsCount > 0);
      const mastery =
        subject.modules.length > 0
          ? Math.round(subject.modules.reduce((sum, module) => sum + module.masteryPercent, 0) / subject.modules.length)
          : 0;

      return {
        name: subject.name,
        tone: subject.tone,
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
      <div className="dashboard-v3">
        <section className="dashboard-v3-signed-out">
          <div className="dashboard-v3-signed-out-card">
            <p className="eyebrow">Progress report</p>
            <h1>{locale === "ms" ? "Env Supabase tiada." : "Supabase env is missing."}</h1>
            <p className="dashboard-helper">
              {locale === "ms"
                ? "Tambah kunci awam Supabase dahulu supaya laporan boleh dimuatkan."
                : "Add your public Supabase keys first so the report can load."}
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (state.status === "signed_out") {
    return (
      <div className="dashboard-v3">
        <section className="dashboard-v3-signed-out">
          <div className="dashboard-v3-signed-out-card">
            <p className="eyebrow">{locale === "ms" ? "Laporan kemajuan" : "Progress report"}</p>
            <h1>{locale === "ms" ? "Log masuk untuk lihat laporan anda." : "Login to see your report."}</h1>
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
          </div>
        </section>
      </div>
    );
  }

  if (state.status === "loading" || !state.snapshot) {
    return (
      <div className="dashboard-v3">
        <section className="dashboard-v3-signed-out">
          <div className="dashboard-v3-signed-out-card">
            <p className="eyebrow">{locale === "ms" ? "Laporan kemajuan" : "Progress report"}</p>
            <h1>{locale === "ms" ? "Sedang memuatkan laporan anda..." : "Loading your report..."}</h1>
          </div>
        </section>
      </div>
    );
  }

  const snapshot = state.snapshot;

  return (
    <div className="dashboard-v3 progress-v3">
      <section className="dashboard-v3-hero dashboard-v3-page-hero">
        <p className="dashboard-v3-welcome">{locale === "ms" ? "Rumusan AI" : "AI summary"}</p>
        <h1>{locale === "ms" ? "Progress Report" : "Progress Report"} 📈</h1>
        <p className="dashboard-v3-hero-copy">
          {snapshot.reportSummary?.headline ||
            (locale === "ms"
              ? `${snapshot.displayName}, halaman ini menunjukkan apa yang bertambah baik, apa yang masih perlu dibaiki, dan langkah paling jelas yang patut anda ambil sekarang.`
              : `${snapshot.displayName}, this page shows what is improving, what still needs work, and the clearest next step to take now.`)}
        </p>
        <div className="dashboard-v3-hero-actions">
          <a className="btn btn-primary" href={snapshot.reportSummary?.nextActions?.[0]?.href || "/dashboard"}>
            {snapshot.reportSummary?.nextActions?.[0]?.label || (locale === "ms" ? "Kembali ke Dashboard" : "Back to Dashboard")}
          </a>
          <a className="btn btn-secondary" href="/dashboard">
            {locale === "ms" ? "Buka Dashboard" : "Open Dashboard"}
          </a>
        </div>
      </section>

      <section className="dashboard-v3-summary-grid progress-v3-metric-grid">
        <article className="dashboard-v3-summary-card tone-blue">
          <p className="dashboard-label">{locale === "ms" ? "Keahlian" : "Membership"}</p>
          <h2>{snapshot.membershipLabel}</h2>
        </article>
        <article className="dashboard-v3-summary-card tone-pink">
          <p className="dashboard-label">{locale === "ms" ? "Sasaran mingguan" : "Weekly target"}</p>
          <h2>{snapshot.weeklyCompletedCount}/{snapshot.weeklyTarget}</h2>
        </article>
        <article className="dashboard-v3-summary-card tone-blue">
          <p className="dashboard-label">{locale === "ms" ? "Purata ketepatan" : "Average accuracy"}</p>
          <h2>{snapshot.averageAccuracy}%</h2>
        </article>
        <article className="dashboard-v3-summary-card tone-pink">
          <p className="dashboard-label">{locale === "ms" ? "Mata bintang" : "Star points"}</p>
          <h2>{snapshot.totalStarPoints} pts</h2>
        </article>
      </section>

      <section className="dashboard-v3-summary-grid dashboard-v3-summary-grid-compact">
        <article className="dashboard-v3-summary-card tone-blue">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{locale === "ms" ? "Yang sedang bertambah baik" : "What is improving"}</p></div>
            <span className="dashboard-v3-icon-box tone-live">↑</span>
          </div>
          <ul className="feature-list progress-v3-list">
            {(snapshot.reportSummary?.strongestNow.length
              ? snapshot.reportSummary.strongestNow
              : [locale === "ms" ? "Mulakan beberapa misi supaya bahagian terkuat anda muncul di sini." : "Start a few missions so your stronger areas show up here."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="dashboard-v3-summary-card tone-pink">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{locale === "ms" ? "Perlu dibaiki sekarang" : "Needs work now"}</p></div>
            <span className="dashboard-v3-icon-box tone-achievements">!</span>
          </div>
          <ul className="feature-list progress-v3-list">
            {(snapshot.reportSummary?.needsWorkNow.length
              ? snapshot.reportSummary.needsWorkNow
              : [locale === "ms" ? "Bahagian lemah seterusnya akan muncul di sini selepas beberapa cubaan disimpan." : "Your next weak spot will appear here after a few saved attempts."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="dashboard-v3-journey">
        <div className="dashboard-v3-section-copy">
          <p className="eyebrow">{locale === "ms" ? "Langkah seterusnya oleh AI" : "AI next steps"}</p>
          <h2>{locale === "ms" ? "Buat ini seterusnya jika anda mahu peningkatan paling cepat." : "Do these next if you want the fastest improvement."}</h2>
        </div>
        <div className="dashboard-v3-journey-list">
          {(snapshot.reportSummary?.nextActions || []).map((action, index) => (
            <a className={`dashboard-v3-journey-card ${index % 2 === 0 ? "tone-progress" : "tone-goals"}`} href={action.href} key={action.href}>
              <span className={`dashboard-v3-icon-box ${index % 2 === 0 ? "tone-progress" : "tone-goals"}`}>{index + 1}</span>
              <div className="dashboard-v3-journey-copy">
                <h3>{action.label}</h3>
                <p>{action.helper}</p>
              </div>
              <span className="dashboard-v3-arrow">›</span>
            </a>
          ))}
        </div>
      </section>

      <section className="dashboard-v3-subjects">
        <div className="dashboard-v3-section-copy">
          <p className="eyebrow">{locale === "ms" ? "Kemajuan subjek" : "Subject progress"}</p>
          <h2>{locale === "ms" ? "Lihat subjek mana yang bergerak dan yang mana masih perlukan dorongan pertama." : "See which subjects are moving and which still need a first push."}</h2>
        </div>
        <div className="dashboard-v3-subject-grid">
          {subjectCards.map((subject) => (
            <article className={`dashboard-v3-subject-card ${subject.tone}`} key={subject.name}>
              <div className="dashboard-v3-subject-head">
                <div>
                  <p className="dashboard-label">{locale === "ms" ? `${subject.startedCount} modul dimulakan` : `${subject.startedCount} module(s) started`}</p>
                  <h3>{subject.name}</h3>
                </div>
                <span className={`dashboard-v3-icon-box ${subject.tone}`}>{subject.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="dashboard-v3-metrics">
                <div>
                  <span className="dashboard-label">{locale === "ms" ? "Penguasaan" : "Mastery"}</span>
                  <strong>{subject.mastery}%</strong>
                </div>
                <div>
                  <span className="dashboard-label">{locale === "ms" ? "Modul terbaik" : "Best module"}</span>
                  <strong>{subject.bestModule}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-v3-summary-grid dashboard-v3-summary-grid-compact">
        <article className="dashboard-v3-summary-card tone-blue">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{locale === "ms" ? "Kejayaan terkini" : "Recent wins"}</p></div>
            <span className="dashboard-v3-icon-box tone-blue">★</span>
          </div>
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

        <article className="dashboard-v3-summary-card tone-pink">
          <div className="dashboard-v3-summary-head">
            <div><p className="dashboard-label">{locale === "ms" ? "Nasihat AI" : "AI advice"}</p></div>
            <span className="dashboard-v3-icon-box tone-pink">AI</span>
          </div>
          <ul className="feature-list progress-v3-list">
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
    </div>
  );
}
