"use client";

import { useEffect, useState } from "react";
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

type SessionState = {
  email: string;
  status: "signed_in" | "signed_out" | "env_missing";
  snapshot: DashboardSnapshot | null;
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
        return;
      }

      const response = await fetch("/api/dashboard-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email
        })
      });

      const result = await response.json().catch(() => ({}));

      setSessionState({
        email,
        status: "signed_in",
        snapshot: result?.snapshot || null
      });
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
        return;
      }

      fetch("/api/dashboard-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: session.user.id,
          email
        })
      })
        .then((response) => response.json())
        .then((result) => {
          setSessionState({
            email,
            status: "signed_in",
            snapshot: result?.snapshot || null
          });
        })
        .catch(() => {
          setSessionState({
            email,
            status: "signed_in",
            snapshot: null
          });
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
                Open unlocked subjects
              </a>
              <a className="btn btn-secondary" href="/pricing">
                View plans
              </a>
            </div>
          </div>
        </section>
      ) : null}

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
          <div className="table-head">
            <div>
              <p className="eyebrow">Achievements</p>
              <h2>Make progress feel collectible, not invisible.</h2>
            </div>
          </div>

          <div className="achievement-grid">
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
        </section>
      ) : null}

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Avatar Closet</p>
            <h2>Use learning wins to build a style that feels personal.</h2>
          </div>
        </div>

        <div className="dashboard-mission-grid">
          <article className="feature-panel">
            <p className="eyebrow">Style economy</p>
            <h2>
              {sessionState.snapshot
                ? `${sessionState.snapshot.totalStarPoints} Star Points ready to shape your look.`
                : "A study-powered closet makes points feel worth collecting."}
            </h2>
            <div className="momentum-stack">
              <div className="momentum-item">
                <span className="dashboard-label">Current rank</span>
                <strong>{sessionState.snapshot?.rank || "Launch Pad"}</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">Starter slots</span>
                <strong>Hair, Top, Bottom, Shoes, Accessory</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">First purchase target</span>
                <strong>Daily Runner shoes · 280 pts</strong>
                <p className="dashboard-helper">Make the first unlock easy so the reward loop feels real early.</p>
              </div>
            </div>
          </article>

          <article className="feature-panel alt">
            <p className="eyebrow">What students unlock</p>
            <h2>Not just more studying. More identity.</h2>
            <p className="dashboard-helper">
              The closet is where badges, Star Points, and subject progress start to feel collectible. Stronger work
              should unlock better-looking choices, not just another chart.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/avatar">
                Open Avatar Closet
              </a>
              <a className="btn btn-secondary" href="/subjects">
                Earn more points
              </a>
            </div>
          </article>
        </div>
      </section>

      {sessionState.status === "signed_in" && sessionState.snapshot ? (
        <section className="section">
          <div className="table-head">
            <div>
              <p className="eyebrow">Mission rhythm</p>
              <h2>Make today count, then keep the week moving.</h2>
            </div>
          </div>

          <div className="dashboard-mission-grid">
            <article className="feature-panel">
              <p className="eyebrow">Today</p>
              <h2>
                {sessionState.snapshot.todayCompletedCount
                  ? `${sessionState.snapshot.todayCompletedCount} mission(s) completed today`
                  : "Today still needs one clear win"}
              </h2>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">Completed today</span>
                  <strong>{sessionState.snapshot.todayCompletedCount}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Started today</span>
                  <strong>{sessionState.snapshot.todayStartedCount}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">Stars today</span>
                  <strong>{sessionState.snapshot.todayStars}</strong>
                  <p className="dashboard-helper">
                    Big star points grow fastest when AI gives 2-3 stars for stronger work.
                  </p>
                </div>
              </div>
            </article>

            <article className="feature-panel alt">
              <p className="eyebrow">Weekly target</p>
              <h2>
                {sessionState.snapshot.weeklyCompletedCount >= sessionState.snapshot.weeklyTarget
                  ? "This week's mission target is already hit."
                  : `${sessionState.snapshot.weeklyTarget - sessionState.snapshot.weeklyCompletedCount} more mission(s) to hit this week.`}
              </h2>
              <div className="target-progress">
                <div
                  className="target-progress-bar"
                  style={{ width: `${sessionState.snapshot.weeklyProgressPercent}%` }}
                />
              </div>
              <p className="dashboard-helper">
                {sessionState.snapshot.weeklyCompletedCount}/{sessionState.snapshot.weeklyTarget} completed this week
                · {sessionState.snapshot.weeklyStars} star(s) earned
              </p>
              <p className="dashboard-helper">
                {sessionState.snapshot.onboardingCompleted
                  ? `Next recommended lane: ${sessionState.snapshot.nextFocus}`
                  : "Finish onboarding to personalize this target more tightly."}
              </p>
            </article>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Bundle access</p>
            <h2>See your packs the way the product is actually sold.</h2>
          </div>
        </div>

        <div className="bundle-grid">
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
      </section>

      <section className="session-banner">
        <p className="eyebrow">Session status</p>
        {sessionState.status === "env_missing" ? (
          <h2>Supabase env missing. Auth UI is scaffolded but not connected yet.</h2>
        ) : sessionState.status === "signed_in" ? (
          <>
            <h2>
              {sessionState.snapshot?.displayName || "Student"} is signed in as {sessionState.email}
            </h2>
            <p className="dashboard-helper">
              {sessionState.snapshot?.trialActive
                ? "Your 7-day full access window is active."
                : sessionState.snapshot?.activePlanCodes.length
                  ? `Active plans: ${sessionState.snapshot.activePlanCodes.join(", ")}`
                  : "You are on the free starter track."}
            </p>
          </>
        ) : (
          <h2>Signed out. You can test the flow from Login or Register.</h2>
        )}
      </section>

      <section className="dashboard-mission-grid">
        <article className="feature-panel">
          <p className="eyebrow">Today&apos;s queue</p>
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
                <span className="mini-link">Open</span>
              </a>
            ))}
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">Momentum</p>
          <h2>Keep the learning rhythm visible.</h2>
          {sessionState.status === "signed_in" && sessionState.snapshot ? (
            <div className="momentum-stack">
              <div className="momentum-item">
                <span className="dashboard-label">Trial window</span>
                <strong>
                  {sessionState.snapshot.trialActive
                    ? `${sessionState.snapshot.trialDaysRemaining} day(s) remaining`
                    : "Starter access active"}
                </strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">Unlocked path</span>
                <strong>{sessionState.snapshot.unlockedSubjectNames.slice(0, 3).join(", ")}</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">Next recommended lane</span>
                <strong>{sessionState.snapshot.nextFocus}</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">Weekly progress</span>
                <strong>
                  {sessionState.snapshot.weeklyCompletedCount}/{sessionState.snapshot.weeklyTarget} missions
                </strong>
                <p className="dashboard-helper">{sessionState.snapshot.weeklyStars} star(s) earned this week</p>
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
      </section>

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
                  Compare all plans
                </a>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">English performance</p>
            <h2>See which core modules are moving.</h2>
          </div>
        </div>

        {sessionState.snapshot?.coachSignal ? (
          <div className="coach-signal-grid">
            {sessionState.snapshot.coachSignal.strongest ? (
              <a className="english-module-card tone-primary" href={sessionState.snapshot.coachSignal.strongest.href}>
                <p className="dashboard-label">Strongest module</p>
                <h3>{sessionState.snapshot.coachSignal.strongest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.coachSignal.strongest.insight}</p>
              </a>
            ) : null}
            {sessionState.snapshot.coachSignal.weakest ? (
              <a className="english-module-card tone-accent" href={sessionState.snapshot.coachSignal.weakest.href}>
                <p className="dashboard-label">Best next fix</p>
                <h3>{sessionState.snapshot.coachSignal.weakest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.coachSignal.weakest.insight}</p>
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="english-module-grid">
          {(sessionState.snapshot?.englishModules.length
            ? sessionState.snapshot.englishModules
            : [
                {
                  slug: "writing-coach",
                  name: "Writing Coach",
                  href: "/subjects/english/writing-coach",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "grammar-lab",
                  name: "Grammar Lab",
                  href: "/subjects/english/grammar-lab",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "reading-decoder",
                  name: "Reading Decoder",
                  href: "/subjects/english/reading-decoder",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "vocabulary-builder",
                  name: "Vocabulary Builder",
                  href: "/subjects/english/vocabulary-builder",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                }
              ]
          ).map((module) => renderModulePerformanceCard(module, module.slug))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Bahasa Melayu performance</p>
            <h2>Track the BM core lane the same way.</h2>
          </div>
        </div>

        {sessionState.snapshot?.bahasaMelayuCoachSignal ? (
          <div className="coach-signal-grid">
            {sessionState.snapshot.bahasaMelayuCoachSignal.strongest ? (
              <a
                className="english-module-card tone-primary"
                href={sessionState.snapshot.bahasaMelayuCoachSignal.strongest.href}
              >
                <p className="dashboard-label">Strongest module</p>
                <h3>{sessionState.snapshot.bahasaMelayuCoachSignal.strongest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.bahasaMelayuCoachSignal.strongest.insight}</p>
              </a>
            ) : null}
            {sessionState.snapshot.bahasaMelayuCoachSignal.weakest ? (
              <a
                className="english-module-card tone-accent"
                href={sessionState.snapshot.bahasaMelayuCoachSignal.weakest.href}
              >
                <p className="dashboard-label">Best next fix</p>
                <h3>{sessionState.snapshot.bahasaMelayuCoachSignal.weakest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.bahasaMelayuCoachSignal.weakest.insight}</p>
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="english-module-grid">
          {(sessionState.snapshot?.bahasaMelayuModules.length
            ? sessionState.snapshot.bahasaMelayuModules
            : [
                {
                  slug: "tatabahasa",
                  name: "Tatabahasa",
                  href: "/subjects/bahasa-melayu/tatabahasa",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "pemahaman-drill",
                  name: "Pemahaman Drill",
                  href: "/subjects/bahasa-melayu/pemahaman-drill",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "karangan-coach",
                  name: "Karangan Coach",
                  href: "/subjects/bahasa-melayu/karangan-coach",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                }
              ]
          ).map((module) => renderModulePerformanceCard(module, `bm-${module.slug}`))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Humanities performance</p>
            <h2>Watch Sejarah and Geografi usage in one pack view.</h2>
          </div>
        </div>

        {sessionState.snapshot?.humanitiesCoachSignal ? (
          <div className="coach-signal-grid">
            {sessionState.snapshot.humanitiesCoachSignal.strongest ? (
              <a
                className="english-module-card tone-primary"
                href={sessionState.snapshot.humanitiesCoachSignal.strongest.href}
              >
                <p className="dashboard-label">Strongest module</p>
                <h3>{sessionState.snapshot.humanitiesCoachSignal.strongest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.humanitiesCoachSignal.strongest.insight}</p>
              </a>
            ) : null}
            {sessionState.snapshot.humanitiesCoachSignal.weakest ? (
              <a
                className="english-module-card tone-accent"
                href={sessionState.snapshot.humanitiesCoachSignal.weakest.href}
              >
                <p className="dashboard-label">Best next fix</p>
                <h3>{sessionState.snapshot.humanitiesCoachSignal.weakest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.humanitiesCoachSignal.weakest.insight}</p>
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="english-module-grid">
          {(sessionState.snapshot?.humanitiesModules.length
            ? sessionState.snapshot.humanitiesModules
            : [
                {
                  slug: "timeline-recall",
                  name: "Timeline Recall",
                  href: "/subjects/sejarah/timeline-recall",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "source-question-drill",
                  name: "Source Question Drill",
                  href: "/subjects/sejarah/source-question-drill",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "topic-revision-set",
                  name: "Topic Revision Set",
                  href: "/subjects/sejarah/topic-revision-set",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "map-and-data-drill",
                  name: "Map and Data Drill",
                  href: "/subjects/geografi/map-and-data-drill",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "concept-review",
                  name: "Concept Review",
                  href: "/subjects/geografi/concept-review",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "short-answer-practice",
                  name: "Short Answer Practice",
                  href: "/subjects/geografi/short-answer-practice",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                }
              ]
          ).map((module) => renderModulePerformanceCard(module, `hum-${module.slug}`))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Math performance</p>
            <h2>Start the Math Pack with one visible progress lane.</h2>
          </div>
        </div>

        {sessionState.snapshot?.mathCoachSignal ? (
          <div className="coach-signal-grid">
            {sessionState.snapshot.mathCoachSignal.strongest ? (
              <a className="english-module-card tone-primary" href={sessionState.snapshot.mathCoachSignal.strongest.href}>
                <p className="dashboard-label">Strongest module</p>
                <h3>{sessionState.snapshot.mathCoachSignal.strongest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.mathCoachSignal.strongest.insight}</p>
              </a>
            ) : null}
            {sessionState.snapshot.mathCoachSignal.weakest ? (
              <a className="english-module-card tone-accent" href={sessionState.snapshot.mathCoachSignal.weakest.href}>
                <p className="dashboard-label">Best next fix</p>
                <h3>{sessionState.snapshot.mathCoachSignal.weakest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.mathCoachSignal.weakest.insight}</p>
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="english-module-grid">
          {(sessionState.snapshot?.mathModules.length
            ? sessionState.snapshot.mathModules
            : [
                {
                  slug: "topic-practice",
                  name: "Topic Practice",
                  href: "/subjects/math/topic-practice",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "worked-solution-review",
                  name: "Worked Solution Review",
                  href: "/subjects/math/worked-solution-review",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                },
                {
                  slug: "error-pattern-tracker",
                  name: "Error Pattern Tracker",
                  href: "/subjects/math/error-pattern-tracker",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                }
              ]
          ).map((module) => renderModulePerformanceCard(module, `math-${module.slug}`))}
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">Add Math performance</p>
            <h2>Track higher-difficulty working, not just final answers.</h2>
          </div>
        </div>

        {sessionState.snapshot?.addMathCoachSignal ? (
          <div className="coach-signal-grid">
            {sessionState.snapshot.addMathCoachSignal.strongest ? (
              <a
                className="english-module-card tone-primary"
                href={sessionState.snapshot.addMathCoachSignal.strongest.href}
              >
                <p className="dashboard-label">Strongest module</p>
                <h3>{sessionState.snapshot.addMathCoachSignal.strongest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.addMathCoachSignal.strongest.insight}</p>
              </a>
            ) : null}
            {sessionState.snapshot.addMathCoachSignal.weakest ? (
              <a
                className="english-module-card tone-accent"
                href={sessionState.snapshot.addMathCoachSignal.weakest.href}
              >
                <p className="dashboard-label">Best next fix</p>
                <h3>{sessionState.snapshot.addMathCoachSignal.weakest.name}</h3>
                <p className="dashboard-helper">{sessionState.snapshot.addMathCoachSignal.weakest.insight}</p>
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="english-module-grid">
          {(sessionState.snapshot?.addMathModules.length
            ? sessionState.snapshot.addMathModules
            : [
                {
                  slug: "step-check-drill",
                  name: "Step Check Drill",
                  href: "/subjects/add-math/step-check-drill",
                  attemptsCount: 0,
                  totalStars: 0,
                  averageAccuracy: 0,
                  masteryPercent: 0,
                  statusLabel: "Not started"
                }
              ]
          ).map((module) => renderModulePerformanceCard(module, `add-math-${module.slug}`))}
        </div>
      </section>
    </>
  );
}
