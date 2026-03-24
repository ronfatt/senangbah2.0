"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { hasPublicSupabaseEnv } from "../lib/env";

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

export function ProgressReportClient() {
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
        name: "English",
        modules: state.snapshot.englishModules
      },
      {
        name: "Bahasa Melayu",
        modules: state.snapshot.bahasaMelayuModules
      },
      {
        name: "Humanities",
        modules: state.snapshot.humanitiesModules
      },
      {
        name: "Math",
        modules: state.snapshot.mathModules
      },
      {
        name: "Add Math",
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
          started.sort((a, b) => b.masteryPercent - a.masteryPercent)[0]?.name || "Not started yet"
      };
    });
  }, [state.snapshot]);

  if (state.status === "env_missing") {
    return (
      <section className="feature-panel">
        <p className="eyebrow">Progress report</p>
        <h2>Supabase env is missing.</h2>
        <p className="dashboard-helper">Add your public Supabase keys first so the report can load.</p>
      </section>
    );
  }

  if (state.status === "signed_out") {
    return (
      <section className="feature-panel">
        <p className="eyebrow">Progress report</p>
        <h2>Login to see your report.</h2>
        <p className="dashboard-helper">Your strongest subject, weak spots, and AI next steps will show here after you sign in.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/login">
            Login to Continue Learning
          </a>
          <a className="btn btn-secondary" href="/register">
            Register as Member
          </a>
        </div>
      </section>
    );
  }

  if (state.status === "loading" || !state.snapshot) {
    return (
      <section className="feature-panel">
        <p className="eyebrow">Progress report</p>
        <h2>Loading your report...</h2>
      </section>
    );
  }

  const snapshot = state.snapshot;

  return (
    <>
      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">AI summary</p>
          <h1 className="dashboard-title">{snapshot.reportSummary?.headline || "Your study story is starting to form."}</h1>
          <p className="landing-lead">
            {snapshot.displayName}, this page shows what is improving, what still needs work, and the clearest next step to take now.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={snapshot.reportSummary?.nextActions?.[0]?.href || "/dashboard"}>
              {snapshot.reportSummary?.nextActions?.[0]?.label || "Back to Dashboard"}
            </a>
            <a className="btn btn-secondary" href="/dashboard">
              Open Dashboard
            </a>
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">Report snapshot</p>
          <div className="progress-metric-grid">
            <div className="progress-metric">
              <span className="dashboard-label">Membership</span>
              <strong>{snapshot.membershipLabel}</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">Weekly target</span>
              <strong>
                {snapshot.weeklyCompletedCount}/{snapshot.weeklyTarget}
              </strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">Average accuracy</span>
              <strong>{snapshot.averageAccuracy}%</strong>
            </div>
            <div className="progress-metric">
              <span className="dashboard-label">Star points</span>
              <strong>{snapshot.totalStarPoints} pts</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">What is improving</p>
          <h2>These are your stronger areas right now.</h2>
          <ul className="feature-list">
            {(snapshot.reportSummary?.strongestNow.length ? snapshot.reportSummary.strongestNow : ["Start a few missions so your stronger areas show up here."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">Needs work now</p>
          <h2>These are the most useful fixes to make next.</h2>
          <ul className="feature-list">
            {(snapshot.reportSummary?.needsWorkNow.length ? snapshot.reportSummary.needsWorkNow : ["Your next weak spot will appear here after a few saved attempts."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">AI next steps</p>
            <h2>Do these next if you want the fastest improvement.</h2>
          </div>
        </div>
        <div className="subject-lane-grid">
          {(snapshot.reportSummary?.nextActions || []).map((action) => (
            <article className="subject-lane-card tone-language" key={action.href}>
              <p className="dashboard-label">Next action</p>
              <h3>{action.label}</h3>
              <p className="dashboard-helper">{action.helper}</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href={action.href}>
                  Start Now
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Subject progress</p>
            <h2>See which subjects are moving and which still need a first push.</h2>
          </div>
        </div>
        <div className="subject-lane-grid">
          {subjectCards.map((subject) => (
            <article className="subject-lane-card tone-humanities" key={subject.name}>
              <p className="dashboard-label">{subject.startedCount} module(s) started</p>
              <h3>{subject.name}</h3>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">Mastery</span>
                  <strong>{subject.mastery}%</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Best module</span>
                  <strong>{subject.bestModule}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-split">
        <article className="feature-panel">
          <p className="eyebrow">Recent wins</p>
          <h2>What just improved in your latest sessions.</h2>
          <div className="momentum-stack">
            {snapshot.recentActivity.slice(0, 4).map((activity) => (
              <div className="momentum-item" key={`${activity.createdAt}-${activity.moduleName}`}>
                <span className="dashboard-label">
                  {activity.subjectName} · {activity.status}
                </span>
                <strong>{activity.moduleName}</strong>
                <p className="dashboard-helper">
                  {activity.accuracyPercent}% accuracy · {activity.stars} star(s)
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">AI advice</p>
          <h2>Simple advice you can act on today.</h2>
          <ul className="feature-list">
            {(snapshot.reportSummary?.aiAdvice?.length
              ? snapshot.reportSummary.aiAdvice
              : [
                  "Protect your streak with one short mission before you stop today.",
                  "Open your weakest module first when you want the fastest progress.",
                  "Push for 2 or 3 stars by slowing down and checking one more detail before submitting."
                ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
