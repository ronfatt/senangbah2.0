"use client";

import { useEffect, useState } from "react";
import { AvatarPreviewFigure } from "./avatar-preview-figure";
import {
  getCollectionMission,
  getWeeklyDrop,
  getWeeklyDropUrgency
} from "../lib/avatar-catalog";
import { subjectDefinitions } from "../lib/subjects";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { hasPublicSupabaseEnv } from "../lib/env";
import { planDefinitions } from "../lib/plans";

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
  email: string;
  displayName: string;
  onboardingCompleted: boolean;
  trialActive: boolean;
  activePlanCodes: string[];
  unlockedSubjectCodes: string[];
  unlockedSubjectNames: string[];
  unlockedCount: number;
  nextFocus: string;
  membershipLabel: string;
  streakDays: number;
  weeklyTarget: number;
  weeklyCompletedCount: number;
  weeklyStars: number;
  weeklyProgressPercent: number;
  todayCompletedCount: number;
  todayStartedCount: number;
  todayStars: number;
  showTrialSummary: boolean;
  trialSummary: {
    strongestSubject: string | null;
    weakestModuleName: string | null;
    weakestModuleHref: string | null;
    recommendedUpgradePlanCode: string;
    recommendedUpgradeLabel: string;
    recommendedUpgradeHelper: string;
  };
  totalStars: number;
  totalStarPoints: number;
  rank: string;
  unlockedAchievementCount: number;
  achievements: {
    code: string;
    title: string;
    icon: string;
    helper: string;
    unlocked: boolean;
    progressPercent: number;
  }[];
  completedCount: number;
  averageAccuracy: number;
  trialEndsAt: string | null;
  trialDaysRemaining: number;
  recommendedMissions: {
    subject: string;
    title: string;
    helper: string;
    href: string;
  }[];
  recentActivity: {
    status: string;
    stars: number;
    accuracyPercent: number;
    createdAt: string;
    subjectName: string;
    moduleName: string;
  }[];
  englishModules: ModulePerformance[];
  coachSignal: {
    strongest: {
      name: string;
      href: string;
      insight: string;
    } | null;
    weakest: {
      name: string;
      href: string;
      insight: string;
    } | null;
  } | null;
  bahasaMelayuModules: ModulePerformance[];
  bahasaMelayuCoachSignal: {
    strongest: {
      name: string;
      href: string;
      insight: string;
    } | null;
    weakest: {
      name: string;
      href: string;
      insight: string;
    } | null;
  } | null;
  humanitiesModules: ModulePerformance[];
  humanitiesCoachSignal: {
    strongest: {
      name: string;
      href: string;
      insight: string;
    } | null;
    weakest: {
      name: string;
      href: string;
      insight: string;
    } | null;
  } | null;
  mathModules: ModulePerformance[];
  mathCoachSignal: {
    strongest: {
      name: string;
      href: string;
      insight: string;
    } | null;
    weakest: {
      name: string;
      href: string;
      insight: string;
    } | null;
  } | null;
  addMathModules: ModulePerformance[];
  addMathCoachSignal: {
    strongest: {
      name: string;
      href: string;
      insight: string;
    } | null;
    weakest: {
      name: string;
      href: string;
      insight: string;
    } | null;
  } | null;
};

function renderModulePerformanceCard(module: ModulePerformance, key: string) {
  return (
    <a className="english-module-card" href={module.href} key={key}>
      <div className="module-card-head">
        <h3>{module.name}</h3>
        <span className={`module-state ${module.attemptsCount ? "state-ready" : "state-coming_soon"}`}>
          {module.statusLabel}
        </span>
      </div>
      <p className="dashboard-helper">
        {module.attemptsCount
          ? `${module.attemptsCount} completion(s) · ${module.totalStars} star(s) · ${module.averageAccuracy}% average accuracy`
          : "No saved attempts yet. Open the module and log a first result."}
      </p>
      <div className="mastery-stack">
        <div className="mastery-meta">
          <span className="dashboard-label">Mastery</span>
          <strong>{module.masteryPercent}%</strong>
        </div>
        <div className="mastery-bar">
          <div className="mastery-bar-fill" style={{ width: `${module.masteryPercent}%` }} />
        </div>
      </div>
    </a>
  );
}

function averageMastery(modules: ModulePerformance[]) {
  if (!modules.length) return 0;
  return Math.round(modules.reduce((sum, module) => sum + module.masteryPercent, 0) / modules.length);
}

type SessionState = {
  email: string;
  status: "signed_in" | "signed_out" | "env_missing";
  snapshot: DashboardSnapshot | null;
};

type ClosetSummary = {
  totalPoints: number;
  spentPoints: number;
  availablePoints: number;
  collectionProgress: {
    collectionName: string;
    ownedCount: number;
    totalCount: number;
    progressPercent: number;
  }[];
  equipped: {
    slot: string;
    slotName: string;
    itemCode: string;
    itemName: string;
  }[];
};

export function DashboardOverview({
  billingPlan,
  billingStatus
}: {
  billingPlan: string | null;
  billingStatus: string | null;
}) {
  const [sessionState, setSessionState] = useState<SessionState>({
    email: "",
    status: hasPublicSupabaseEnv() ? "signed_out" : "env_missing",
    snapshot: null
  });
  const [closetSummary, setClosetSummary] = useState<ClosetSummary | null>(null);

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) return;

    const supabase = getSupabaseBrowserClient();

    async function syncState() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      const email = session?.user?.email || "";

      if (!session || !email) {
        setSessionState({
          email: "",
          status: "signed_out",
          snapshot: null
        });
        setClosetSummary(null);
        return;
      }

      const [dashboardResponse, closetResponse] = await Promise.all([
        fetch("/api/dashboard-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authUserId: session.user.id,
            email
          })
        }),
        fetch("/api/avatar/closet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authUserId: session.user.id,
            email,
            action: "snapshot"
          })
        })
      ]);

      const result = await dashboardResponse.json().catch(() => ({}));
      const closetResult = await closetResponse.json().catch(() => ({}));

      setSessionState({
        email,
        status: "signed_in",
        snapshot: result?.snapshot || null
      });
      setClosetSummary(closetResult?.closet || null);
    }

    syncState();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email || "";

      if (!email || !session) {
        setSessionState({
          email: "",
          status: "signed_out",
          snapshot: null
        });
        setClosetSummary(null);
        return;
      }

      Promise.all([
        fetch("/api/dashboard-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authUserId: session.user.id,
            email
          })
        }).then((response) => response.json()),
        fetch("/api/avatar/closet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authUserId: session.user.id,
            email,
            action: "snapshot"
          })
        }).then((response) => response.json())
      ])
        .then(([result, closetResult]) => {
          setSessionState({
            email,
            status: "signed_in",
            snapshot: result?.snapshot || null
          });
          setClosetSummary(closetResult?.closet || null);
        })
        .catch(() => {
          setSessionState({
            email,
            status: "signed_in",
            snapshot: null
          });
          setClosetSummary(null);
        });
    });

    return () => subscription.unsubscribe();
  }, []);

  const cards =
    sessionState.status === "signed_in" && sessionState.snapshot
      ? [
          {
            label: "Account",
            value: sessionState.snapshot.membershipLabel,
            helper: sessionState.snapshot.trialActive
              ? `${sessionState.snapshot.trialDaysRemaining} day(s) left in full access.`
              : "Bundle access is now in effect."
          },
          {
            label: "Star Points",
            value: `${sessionState.snapshot.totalStarPoints} pts`,
            helper: sessionState.snapshot.completedCount
              ? `1-star = 80 pts · 2-star = 140 pts · 3-star = 220 pts`
              : "Finish a mission and start collecting big star points."
          },
          {
            label: "Streak",
            value: `${sessionState.snapshot.streakDays} day${sessionState.snapshot.streakDays === 1 ? "" : "s"}`,
            helper:
              sessionState.snapshot.streakDays > 0
                ? "You have learning momentum. Keep it alive today."
                : "Start one mission today to begin your streak."
          },
          {
            label: "Badges",
            value: `${sessionState.snapshot.unlockedAchievementCount}/${sessionState.snapshot.achievements.length}`,
            helper:
              sessionState.snapshot.unlockedAchievementCount > 0
                ? `${sessionState.snapshot.rank} rank is active now.`
                : "Unlock your first badge by completing one mission."
          },
          {
            label: "Weekly target",
            value: `${sessionState.snapshot.weeklyCompletedCount}/${sessionState.snapshot.weeklyTarget}`,
            helper: `${sessionState.snapshot.weeklyStars} star(s) earned this week.`
          }
        ]
      : [
          { label: "Today", value: "1 mission ready", helper: "English focus queue" },
          { label: "Streak", value: "7 days", helper: "Momentum matters" },
          { label: "Unlocks", value: "6 subjects", helper: "English, BM, Sejarah, Geografi, Math, Add Math" }
        ];

  const bundleCards =
    sessionState.status === "signed_in" && sessionState.snapshot
      ? [
          {
            code: "language_pack",
            name: "Language Pack",
            priceLabel: planDefinitions.find((plan) => plan.code === "language_pack")?.priceLabel || "RM29",
            detail: "English + Bahasa Melayu core access",
            status: sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("language_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
              ? "Active"
              : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("language_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? "Core language modules are open."
                : "Unlock English and Bahasa Melayu in one bundle.",
            href: "/upgrade?plan=language_pack"
          },
          {
            code: "humanities_pack",
            name: "Humanities Pack",
            priceLabel: planDefinitions.find((plan) => plan.code === "humanities_pack")?.priceLabel || "RM19",
            detail: "Sejarah + Geografi revision bundle",
            status: sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("humanities_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
              ? "Active"
              : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("humanities_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? "Humanities modules are open."
                : "Unlock premium recall, concept, and short-answer practice.",
            href: "/upgrade?plan=humanities_pack"
          },
          {
            code: "math_pack",
            name: "Math Pack",
            priceLabel: planDefinitions.find((plan) => plan.code === "math_pack")?.priceLabel || "RM19",
            detail: "Math + Add Math step-based practice",
            status: sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("math_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
              ? "Active"
              : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("math_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? "Math and Add Math modules are open."
                : "Unlock Math drills, worked solutions, and Add Math step checks.",
            href: "/upgrade?plan=math_pack"
          },
          {
            code: "all_access",
            name: "All Access",
            priceLabel: planDefinitions.find((plan) => plan.code === "all_access")?.priceLabel || "RM59",
            detail: "All six subjects in one upgrade path",
            status:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? "Active"
                : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? "Every current bundle is open."
                : "Best fit for students who want one clean plan across all subjects.",
            href: "/upgrade?plan=all_access"
          }
        ]
      : [
          {
            code: "language_pack",
            name: "Language Pack",
            priceLabel: "RM29",
            detail: "English + Bahasa Melayu core access",
            status: "Preview",
            helper: "Starter pack for daily language study.",
            href: "/upgrade?plan=language_pack"
          },
          {
            code: "humanities_pack",
            name: "Humanities Pack",
            priceLabel: "RM19",
            detail: "Sejarah + Geografi revision bundle",
            status: "Preview",
            helper: "Content-heavy revision support in one bundle.",
            href: "/upgrade?plan=humanities_pack"
          },
          {
            code: "math_pack",
            name: "Math Pack",
            priceLabel: "RM19",
            detail: "Math + Add Math step-based practice",
            status: "Preview",
            helper: "Method checks and error-pattern revision.",
            href: "/upgrade?plan=math_pack"
          },
          {
            code: "all_access",
            name: "All Access",
            priceLabel: "RM59",
            detail: "All six subjects in one upgrade path",
            status: "Preview",
            helper: "One plan for the full SenangBah 2.0 experience.",
            href: "/upgrade?plan=all_access"
          }
        ];

  const missions =
    sessionState.status === "signed_in" && sessionState.snapshot?.recommendedMissions.length
      ? sessionState.snapshot.recommendedMissions
      : [
          {
            subject: "English",
            title: "Writing Coach",
            helper: "Draft one short response and improve a weak sentence.",
            href: "/subjects/english/writing-coach"
          },
          {
            subject: "Bahasa Melayu",
            title: "Tatabahasa",
            helper: "Fix three sentence patterns and lock in one grammar rule.",
            href: "/subjects/bahasa-melayu/tatabahasa"
          }
        ];

  const billingPlanDefinition = billingPlan
    ? planDefinitions.find((plan) => plan.code === billingPlan) || null
    : null;
  const showBillingSuccess =
    billingStatus === "success" &&
    Boolean(
      billingPlanDefinition &&
        (sessionState.snapshot?.trialActive ||
          sessionState.snapshot?.activePlanCodes.includes(billingPlanDefinition.code) ||
          sessionState.snapshot?.activePlanCodes.includes("all_access"))
    );
  const postPaymentHref =
    billingPlan === "language_pack"
      ? "/subjects/english"
      : billingPlan === "humanities_pack"
        ? "/subjects/sejarah"
        : billingPlan === "math_pack"
      ? "/subjects/math"
      : "/subjects";
  const topCollection = closetSummary?.collectionProgress?.[0] || null;
  const topCollectionMission = topCollection ? getCollectionMission(topCollection.collectionName) : null;
  const weeklyDrop = getWeeklyDrop();
  const weeklyDropUrgency = weeklyDrop ? getWeeklyDropUrgency(weeklyDrop.endIso) : null;
  const leadMission = missions[0] || null;
  const unlockedLabel =
    sessionState.status === "signed_in" && sessionState.snapshot
      ? sessionState.snapshot.unlockedSubjectNames.slice(0, 3).join(", ")
      : "English, Bahasa Melayu, Sejarah";
  const signedInSnapshot = sessionState.status === "signed_in" ? sessionState.snapshot : null;
  const sejarahModules = signedInSnapshot?.humanitiesModules.filter((module) => module.href.includes("/subjects/sejarah/")) || [];
  const geografiModules = signedInSnapshot?.humanitiesModules.filter((module) => module.href.includes("/subjects/geografi/")) || [];
  const subjectLanes = subjectDefinitions.map((subject) => {
    const modulesForSubject =
      subject.slug === "english"
        ? signedInSnapshot?.englishModules || []
        : subject.slug === "bahasa-melayu"
          ? signedInSnapshot?.bahasaMelayuModules || []
          : subject.slug === "sejarah"
            ? sejarahModules
            : subject.slug === "geografi"
              ? geografiModules
              : subject.slug === "math"
                ? signedInSnapshot?.mathModules || []
                : signedInSnapshot?.addMathModules || [];

    const bestNext =
      subject.slug === "english"
        ? signedInSnapshot?.coachSignal?.weakest
        : subject.slug === "bahasa-melayu"
          ? signedInSnapshot?.bahasaMelayuCoachSignal?.weakest
          : subject.slug === "math"
            ? signedInSnapshot?.mathCoachSignal?.weakest
            : subject.slug === "add-math"
              ? signedInSnapshot?.addMathCoachSignal?.weakest
              : null;

    const unlocked = signedInSnapshot
      ? signedInSnapshot.trialActive || signedInSnapshot.unlockedSubjectCodes.includes(subject.code)
      : subject.isCore;

    const firstModule = subject.modules.find((module) => module.status === "ready") || subject.modules[0];

    return {
      code: subject.code,
      slug: subject.slug,
      name: subject.name,
      href: `/subjects/${subject.slug}`,
      tone:
        subject.bundle === "Language Pack"
          ? "tone-language"
          : subject.bundle === "Humanities Pack"
            ? "tone-humanities"
            : "tone-math",
      bundle: subject.bundle,
      summary: subject.summary,
      unlocked,
      readyCount: subject.modules.filter((module) => module.status === "ready").length,
      masteryPercent: modulesForSubject.length ? averageMastery(modulesForSubject) : 0,
      nextLabel: bestNext?.name || firstModule?.name || "Open subject",
      nextHref: bestNext?.href || `/subjects/${subject.slug}/${firstModule?.slug || ""}`
    };
  });

  return (
    <>
      {showBillingSuccess ? (
        <section className="section">
          <div className="billing-success-banner">
            <div>
              <p className="eyebrow">Payment success</p>
              <h2>{billingPlanDefinition?.name} is now active.</h2>
              <p className="dashboard-helper">
                Your dashboard will now prioritize the modules included in this bundle. Open the newly unlocked lane and start the next mission straight away.
              </p>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href={postPaymentHref}>
                Open Your Unlocked Subjects
              </a>
              <a className="btn btn-secondary" href="/pricing">
                View Memberships
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section dashboard-command-section">
        <div className="dashboard-command-grid">
          <article className="dashboard-command-card dashboard-command-card-primary">
            <div className="dashboard-command-copy">
              <p className="eyebrow">Today&apos;s focus</p>
              <h2>
                {leadMission
                  ? `${leadMission.subject}: ${leadMission.title}`
                  : "One clear mission beats a messy dashboard."}
              </h2>
              <p className="dashboard-helper">
                {leadMission?.helper ||
                  "The top card should always answer one question for students: what should I do first?"}
              </p>
            </div>
            <div className="dashboard-command-stats">
              <div className="dashboard-chip">
                <span className="dashboard-label">Streak</span>
                <strong>
                  {sessionState.snapshot
                    ? `${sessionState.snapshot.streakDays} day${sessionState.snapshot.streakDays === 1 ? "" : "s"}`
                    : "Start today"}
                </strong>
              </div>
              <div className="dashboard-chip">
                <span className="dashboard-label">Today</span>
                <strong>
                  {sessionState.snapshot
                    ? `${sessionState.snapshot.todayCompletedCount} done · ${sessionState.snapshot.todayStars} stars`
                    : "1 win ready"}
                </strong>
              </div>
            </div>
            <div className="hero-actions">
              {leadMission ? (
                <a className="btn btn-primary" href={leadMission.href}>
                  Start this mission
                </a>
              ) : null}
              <a className="btn btn-secondary" href="/subjects">
                Browse Subjects
              </a>
            </div>
          </article>

          <div className="dashboard-command-stack">
            <article className="dashboard-command-card dashboard-command-card-accent">
              <p className="eyebrow">Progress pulse</p>
              <h3>
                {sessionState.snapshot
                  ? `${sessionState.snapshot.weeklyCompletedCount}/${sessionState.snapshot.weeklyTarget} weekly missions`
                  : "Your weekly target lives here"}
              </h3>
              <div className="target-progress">
                <div
                  className="target-progress-bar"
                  style={{ width: `${sessionState.snapshot?.weeklyProgressPercent || 0}%` }}
                />
              </div>
              <p className="dashboard-helper">
                {sessionState.snapshot
                  ? `Next lane: ${sessionState.snapshot.nextFocus}.`
                  : "Your weekly target will show here."}
              </p>
            </article>

            <article className="dashboard-command-card dashboard-command-card-soft">
              <p className="eyebrow">Avatar + packs</p>
              <h3>
                {sessionState.snapshot
                  ? `${closetSummary?.availablePoints ?? sessionState.snapshot.totalStarPoints} pts ready to spend`
                  : "Closet rewards make study points feel real"}
              </h3>
              <p className="dashboard-helper">
                {sessionState.snapshot
                  ? `Open now: ${unlockedLabel || "Starter track"}`
                  : "Points, closet, and memberships stay here."}
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="/avatar">
                  Open Avatar Closet
                </a>
                <a className="btn btn-secondary" href="/pricing">
                  View Memberships
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Your subjects</p>
            <h2>Choose a subject first, then jump into one clear mission.</h2>
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
                  {subject.unlocked ? "Open" : "Locked"}
                </span>
              </div>
              <p className="dashboard-helper">{subject.summary}</p>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">Ready modules</span>
                  <strong>{subject.readyCount}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Mastery</span>
                  <strong>{subject.masteryPercent}%</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Start here</span>
                  <strong>{subject.nextLabel}</strong>
                </div>
              </div>
              <div className="hero-actions">
                <a className="btn btn-primary" href={subject.unlocked ? subject.nextHref : "/pricing"}>
                  {subject.unlocked ? `Start ${subject.name}` : "View Memberships"}
                </a>
                <a className="btn btn-secondary" href={subject.href}>
                  Open {subject.name}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {sessionState.status === "signed_in" && sessionState.snapshot ? (
        <section className="section">
          <details className="dashboard-foldout">
            <summary className="dashboard-foldout-summary">
              <div>
                <p className="eyebrow">Your avatar</p>
                <h2>See your style, points, and closet progress.</h2>
              </div>
            </summary>

            <div className="dashboard-mission-grid dashboard-foldout-body">
              <article className="feature-panel avatar-live-preview">
                <p className="eyebrow">Live identity</p>
                <h2>{sessionState.snapshot.rank}</h2>
                <AvatarPreviewFigure
                  compact
                  equippedBySlot={new Map((closetSummary?.equipped || []).map((item) => [item.slot, item]))}
                />
                <p className="dashboard-helper">
                  Your avatar now lives in the same place as your streak, badges, and Star Points.
                </p>
              </article>

              <article className="feature-panel alt">
                <p className="eyebrow">Closet summary</p>
                <h2>{closetSummary?.availablePoints ?? sessionState.snapshot.totalStarPoints} pts ready to style</h2>
                <div className="momentum-stack">
                  <div className="momentum-item">
                    <span className="dashboard-label">Equipped slots</span>
                    <strong>{(closetSummary?.equipped || []).length}/5 active</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">Starter target</span>
                    <strong>Daily Runner shoes · 280 pts</strong>
                  </div>
                  {topCollection ? (
                    <div className="momentum-item">
                      <span className="dashboard-label">Closest collection</span>
                      <strong>
                        {topCollection.collectionName} · {topCollection.ownedCount}/{topCollection.totalCount}
                      </strong>
                      <p className="dashboard-helper">{topCollection.progressPercent}% complete</p>
                      {topCollectionMission ? (
                        <a className="mini-link" href={topCollectionMission.href}>
                          {topCollectionMission.subject}: {topCollectionMission.title}
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="momentum-item">
                    <span className="dashboard-label">Next move</span>
                    <strong>Open the closet and turn today&apos;s points into style.</strong>
                  </div>
                </div>
                <div className="hero-actions">
                  <a className="btn btn-primary" href="/avatar">
                    Open Avatar Closet
                  </a>
                </div>
              </article>
            </div>
          </details>
        </section>
      ) : null}

      <section className="section">
        <details className="dashboard-foldout">
          <summary className="dashboard-foldout-summary">
            <div>
              <p className="eyebrow">Weekly drop</p>
              <h2>See this week&apos;s featured reward.</h2>
            </div>
          </summary>

          <div className="dashboard-mission-grid dashboard-foldout-body">
            <article className="feature-panel">
            <p className="eyebrow">{weeklyDrop?.headline || "Weekly drop"}</p>
            <h2>{weeklyDrop?.name || "Featured closet item"}</h2>
            <p className="dashboard-helper">
              {weeklyDrop?.helper || "A rotating item helps students feel that this week has its own target."}
            </p>
            <div className="momentum-stack">
              <div className="momentum-item">
                <span className="dashboard-label">Urgency</span>
                <strong>{weeklyDropUrgency?.label || "This week only"}</strong>
                <p className="dashboard-helper">
                  {weeklyDropUrgency?.helper || "A featured drop works best when it clearly tells students not to wait."}
                </p>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">Collection</span>
                <strong>{weeklyDrop?.collectionName || "Rotation"}</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">Price</span>
                <strong>{weeklyDrop ? `${weeklyDrop.pricePoints} pts` : "TBD"}</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">Ends</span>
                <strong>{weeklyDrop ? new Date(weeklyDrop.endIso).toLocaleDateString("en-MY") : "This week"}</strong>
              </div>
            </div>
            </article>

            <article className="feature-panel alt">
            <p className="eyebrow">Mission tie-in</p>
            <h2>{weeklyDrop?.mission?.title || "Open a linked mission"}</h2>
            <p className="dashboard-helper">
              {weeklyDrop?.mission?.helper ||
                "The weekly drop works best when it points students back into a focused subject lane."}
            </p>
            <div className="hero-actions">
              {weeklyDrop?.mission ? (
                <a className="btn btn-primary" href={weeklyDrop.mission.href}>
                  Start {weeklyDrop.mission.subject}: {weeklyDrop.mission.title}
                </a>
              ) : null}
              <a className="btn btn-secondary" href="/avatar">
                View Weekly Drops
              </a>
            </div>
            </article>
          </div>
        </details>
      </section>

      <section className="dashboard-card-grid">
        {cards.map((card) => (
          <article className="dashboard-card" key={card.label}>
            <p className="dashboard-label">{card.label}</p>
            <h2>{card.value}</h2>
            <p className="dashboard-helper">{card.helper}</p>
          </article>
        ))}
      </section>

      {sessionState.status === "signed_in" && sessionState.snapshot ? (
        <section className="section">
          <details className="dashboard-foldout">
            <summary className="dashboard-foldout-summary">
              <div>
                <p className="eyebrow">Achievements</p>
                <h2>See badges and reward progress.</h2>
              </div>
            </summary>

            <div className="achievement-grid dashboard-foldout-body">
              {sessionState.snapshot.achievements.map((achievement) => (
                <article
                  className={`achievement-card ${achievement.unlocked ? "is-unlocked" : ""}`}
                  key={achievement.code}
                >
                  <div className="achievement-head">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div>
                      <p className="dashboard-label">{achievement.unlocked ? "Unlocked" : "In progress"}</p>
                      <h3>{achievement.title}</h3>
                    </div>
                  </div>
                  <p className="dashboard-helper">{achievement.helper}</p>
                  <div className="mastery-stack">
                    <div className="mastery-meta">
                      <span className="dashboard-label">Badge progress</span>
                      <strong>{achievement.progressPercent}%</strong>
                    </div>
                    <div className="mastery-bar">
                      <div className="mastery-bar-fill" style={{ width: `${achievement.progressPercent}%` }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </details>
        </section>
      ) : null}

      <section className="section">
        <details className="dashboard-foldout">
          <summary className="dashboard-foldout-summary">
            <div>
              <p className="eyebrow">Memberships</p>
              <h2>See your active plans only when you need them.</h2>
            </div>
          </summary>

          <div className="bundle-grid dashboard-foldout-body">
            {bundleCards.map((bundle) => (
              <a className="bundle-card" href={bundle.href} key={bundle.code}>
                <div className="module-card-head">
                  <div>
                    <p className="dashboard-label">{bundle.priceLabel}</p>
                    <h3>{bundle.name}</h3>
                  </div>
                  <span
                    className={`module-state ${
                      bundle.status === "Active" ? "state-ready" : bundle.status === "Preview" ? "state-coming_soon" : "state-locked"
                    }`}
                  >
                    {bundle.status}
                  </span>
                </div>
                <p className="dashboard-helper">{bundle.detail}</p>
                <p className="dashboard-helper">{bundle.helper}</p>
              </a>
            ))}
          </div>
        </details>
      </section>

      <section className="section">
        <details className="dashboard-foldout">
          <summary className="dashboard-foldout-summary">
            <div>
              <p className="eyebrow">Study flow</p>
              <h2>See today&apos;s missions and this week&apos;s progress.</h2>
            </div>
          </summary>

          <div className="dashboard-mission-grid dashboard-foldout-body">
            <article className="feature-panel">
              <p className="eyebrow">Start now</p>
              <h2>Start with one focused mission.</h2>
              {sessionState.status === "signed_in" && sessionState.snapshot ? (
                <p className="dashboard-helper">
                  {sessionState.snapshot.todayCompletedCount
                    ? `You already banked ${sessionState.snapshot.todayCompletedCount} mission(s) today. One more will strengthen the streak.`
                    : "The first mission today is the easiest way to protect your streak."}
                </p>
              ) : null}
              <div className="mission-list">
                {missions.map((mission) => (
                  <a className="mission-card" href={mission.href} key={`${mission.subject}-${mission.title}`}>
                    <div className="mission-copy">
                      <p className="dashboard-label">{mission.subject}</p>
                      <h3>{mission.title}</h3>
                      <p className="dashboard-helper">{mission.helper}</p>
                    </div>
                    <span className="mini-link">Start</span>
                  </a>
                ))}
              </div>
            </article>

            <article className="feature-panel alt">
              <p className="eyebrow">Your progress</p>
              <h2>Keep one clear view of today and this week.</h2>
              {sessionState.status === "signed_in" && sessionState.snapshot ? (
                <div className="momentum-stack">
                  <div className="momentum-item">
                    <span className="dashboard-label">Today</span>
                    <strong>
                      {sessionState.snapshot.todayCompletedCount
                        ? `${sessionState.snapshot.todayCompletedCount} mission(s) done`
                        : "Still waiting for first win"}
                    </strong>
                    <p className="dashboard-helper">{sessionState.snapshot.todayStars} star(s) earned today</p>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">Weekly target</span>
                    <strong>
                      {sessionState.snapshot.weeklyCompletedCount}/{sessionState.snapshot.weeklyTarget} missions
                    </strong>
                    <div className="target-progress compact">
                      <div
                        className="target-progress-bar"
                        style={{ width: `${sessionState.snapshot.weeklyProgressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">Next recommended lane</span>
                    <strong>{sessionState.snapshot.nextFocus}</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">Unlocked now</span>
                    <strong>{sessionState.snapshot.unlockedSubjectNames.slice(0, 3).join(", ")}</strong>
                    <p className="dashboard-helper">
                      {sessionState.snapshot.trialActive
                        ? `${sessionState.snapshot.trialDaysRemaining} day(s) left in full access`
                        : "Starter or paid access is active"}
                    </p>
                  </div>
                  {sessionState.snapshot.recentActivity.slice(0, 2).map((activity) => (
                    <div className="momentum-item" key={`${activity.createdAt}-${activity.moduleName}`}>
                      <span className="dashboard-label">
                        {activity.subjectName} · {activity.status}
                      </span>
                      <strong>{activity.moduleName}</strong>
                      {activity.status === "completed" ? (
                        <p className="dashboard-helper">
                          {activity.stars} star(s) · {activity.accuracyPercent}% accuracy
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="momentum-stack">
                  <div className="momentum-item">
                    <span className="dashboard-label">Starter path</span>
                    <strong>English and Bahasa Melayu</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">Premium preview</span>
                    <strong>Sejarah, Geografi, Math, Add Math</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">Best next step</span>
                    <strong>Create an account to activate your 7-day full trial.</strong>
                  </div>
                </div>
              )}
            </article>
          </div>
        </details>
      </section>

      {sessionState.status !== "signed_in" ? (
        <section className="session-banner">
          <p className="eyebrow">Session status</p>
          {sessionState.status === "env_missing" ? (
            <h2>Supabase env missing. Auth UI is scaffolded but not connected yet.</h2>
          ) : (
            <h2>Signed out. Login or register to continue learning.</h2>
          )}
        </section>
      ) : null}

      {sessionState.status === "signed_in" && sessionState.snapshot?.showTrialSummary ? (
        <section className="section">
          <div className="table-head">
            <div>
              <p className="eyebrow">Trial summary</p>
              <h2>Your 7-day access is almost over. Keep the strongest momentum alive.</h2>
            </div>
          </div>

          <div className="dashboard-mission-grid">
            <article className="feature-panel">
              <p className="eyebrow">What you built</p>
              <h2>
                {sessionState.snapshot.trialSummary.strongestSubject
                  ? `${sessionState.snapshot.trialSummary.strongestSubject} is your strongest lane so far.`
                  : "You already have enough activity to turn this trial into a real study rhythm."}
              </h2>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">Completed during trial</span>
                  <strong>{sessionState.snapshot.completedCount} mission(s)</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Stars earned</span>
                  <strong>{sessionState.snapshot.totalStars} star(s)</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Weekly rhythm</span>
                  <strong>{sessionState.snapshot.weeklyCompletedCount}/{sessionState.snapshot.weeklyTarget}</strong>
                </div>
              </div>
            </article>

            <article className="feature-panel alt">
              <p className="eyebrow">Best next plan</p>
              <h2>{sessionState.snapshot.trialSummary.recommendedUpgradeLabel}</h2>
              <p className="dashboard-helper">{sessionState.snapshot.trialSummary.recommendedUpgradeHelper}</p>
              {sessionState.snapshot.trialSummary.weakestModuleName ? (
                <p className="dashboard-helper">
                  Best next fix: {sessionState.snapshot.trialSummary.weakestModuleName}
                </p>
              ) : null}
              <div className="hero-actions">
                <a
                  className="btn btn-primary"
                  href={`/upgrade?plan=${sessionState.snapshot.trialSummary.recommendedUpgradePlanCode}`}
                >
                  Continue with {sessionState.snapshot.trialSummary.recommendedUpgradeLabel}
                </a>
                <a className="btn btn-secondary" href="/pricing">
                  View Memberships
                </a>
              </div>
            </article>
          </div>
        </section>
      ) : null}

    </>
  );
}
