import { NextResponse } from "next/server";
import {
  buildAchievements,
  computeStreak,
  formatDateOnly,
  getMonday
} from "../../../lib/achievements";
import { hasPublicSupabaseEnv } from "../../../lib/env";
import { resolveAccessSnapshot } from "../../../lib/access";
import { subjectDefinitions } from "../../../lib/subjects";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

const SUBJECT_NAME_MAP: Record<string, string> = {
  english: "English",
  bahasa_melayu: "Bahasa Melayu",
  sejarah: "Sejarah",
  geografi: "Geografi",
  math: "Math",
  add_math: "Add Math"
};

function buildReportSummary({
  strongestSubject,
  weakestTarget,
  recommendedMissions,
  averageAccuracy,
  weeklyCompletedCount,
  streakDays
}: {
  strongestSubject: { code: string; label: string; score: number } | null;
  weakestTarget: {
    name: string;
    href: string;
    insight: string;
  } | null;
  recommendedMissions: {
    subject: string;
    title: string;
    helper: string;
    href: string;
  }[];
  averageAccuracy: number;
  weeklyCompletedCount: number;
  streakDays: number;
}) {
  const headline = strongestSubject && weakestTarget
    ? `${strongestSubject.label} is moving well. ${weakestTarget.name} needs the next push.`
    : strongestSubject
      ? `${strongestSubject.label} is currently your strongest lane. Keep the next mission focused.`
      : recommendedMissions[0]
        ? `Your first wins will show up fast once you finish ${recommendedMissions[0].title}.`
        : "Your study report will sharpen as soon as a few short missions are saved.";

  const strongestNow = [
    strongestSubject ? `${strongestSubject.label} is leading your current progress.` : null,
    weeklyCompletedCount > 0 ? `You already finished ${weeklyCompletedCount} mission(s) this week.` : null,
    averageAccuracy >= 70 ? `Your average accuracy is ${averageAccuracy}%, which shows cleaner checking before submit.` : null,
    streakDays >= 2 ? `Your ${streakDays}-day streak is helping you build consistency.` : null
  ].filter(Boolean) as string[];

  const needsWorkNow = [
    weakestTarget ? `${weakestTarget.name} is the clearest place to improve next.` : null,
    weakestTarget?.insight || null,
    averageAccuracy > 0 && averageAccuracy < 70
      ? `Slow down for one extra check. Your average accuracy is ${averageAccuracy}%, so small corrections will lift results fast.`
      : null,
    recommendedMissions[0]
      ? `Open ${recommendedMissions[0].title} next if you want the fastest improvement signal today.`
      : null
  ].filter(Boolean) as string[];

  return {
    headline,
    strongestNow,
    needsWorkNow,
    aiAdvice: [
      weakestTarget
        ? `Open ${weakestTarget.name} first. That is your clearest improvement lane right now.`
        : recommendedMissions[0]
          ? `Start with ${recommendedMissions[0].title}. The fastest progress comes from taking the next ready mission, not waiting for a perfect plan.`
          : "Start one short mission first so the report can begin giving sharper advice.",
      strongestSubject
        ? `Keep one mission a day in ${strongestSubject.label}. It is your strongest subject now, so small wins there will keep confidence high.`
        : "Once one subject starts moving, keep returning to it for a few days so your progress feels real.",
      averageAccuracy >= 80
        ? "Your checking habit is working. Push one slightly harder mission next."
        : averageAccuracy >= 60
          ? "Before you submit, slow down for one extra check. That is the easiest way to turn 2-star work into 3-star work."
          : "Do not rush the next mission. Focus on one weak detail, fix it, then move on."
    ],
    nextActions: recommendedMissions.map((mission) => ({
      label: `Start ${mission.subject}: ${mission.title}`,
      helper: mission.helper,
      href: mission.href
    }))
  };
}

function buildSubjectPerformance({
  subjectCode,
  completedAttempts
}: {
  subjectCode: string;
  completedAttempts: {
    status: string;
    stars: number | null;
    accuracy_percent: number | null;
    created_at: string;
    summary: unknown;
  }[];
}) {
  const subjectDefinition = subjectDefinitions.find((subject) => subject.code === subjectCode);
  const subjectModules =
    subjectDefinition?.modules
      .filter((module) => module.status === "ready")
      .map((module) => {
        const moduleAttempts = completedAttempts.filter((attempt) => {
          const summary: Record<string, unknown> =
            attempt.summary && typeof attempt.summary === "object" && !Array.isArray(attempt.summary)
              ? (attempt.summary as Record<string, unknown>)
              : {};

          return summary.module_slug === module.slug;
        });

        const totalModuleStars = moduleAttempts.reduce((sum, attempt) => sum + Number(attempt.stars || 0), 0);
        const averageModuleAccuracy = moduleAttempts.length
          ? Math.round(
              moduleAttempts.reduce((sum, attempt) => sum + Number(attempt.accuracy_percent || 0), 0) /
                moduleAttempts.length
            )
          : 0;

        return {
          slug: module.slug,
          name: module.name,
          href: `/subjects/${subjectDefinition.slug}/${module.slug}`,
          attemptsCount: moduleAttempts.length,
          totalStars: totalModuleStars,
          averageAccuracy: averageModuleAccuracy,
          masteryPercent: Math.min(
            100,
            Math.round(moduleAttempts.length * 18 + averageModuleAccuracy * 0.55 + totalModuleStars * 4)
          ),
          statusLabel: moduleAttempts.length ? "Active" : "Not started"
        };
      }) || [];

  const attemptedModules = subjectModules.filter((module) => module.attemptsCount > 0);
  const strongest = attemptedModules.length
    ? attemptedModules.reduce((best, current) => {
        const bestScore = best.averageAccuracy * 10 + best.totalStars;
        const currentScore = current.averageAccuracy * 10 + current.totalStars;
        return currentScore > bestScore ? current : best;
      })
    : null;
  const weakest = attemptedModules.length
    ? attemptedModules.reduce((lowest, current) => {
        const lowestScore = lowest.averageAccuracy * 10 + lowest.totalStars;
        const currentScore = current.averageAccuracy * 10 + current.totalStars;
        return currentScore < lowestScore ? current : lowest;
      })
    : subjectModules.find((module) => module.attemptsCount === 0) || null;

  return {
    modules: subjectModules,
    coachSignal:
      strongest || weakest
        ? {
            strongest: strongest
              ? {
                  name: strongest.name,
                  href: strongest.href,
                  insight: `${strongest.averageAccuracy}% average accuracy with ${strongest.totalStars} star(s).`
                }
              : null,
            weakest: weakest
              ? {
                  name: weakest.name,
                  href: weakest.href,
                  insight: weakest.attemptsCount
                    ? `${weakest.averageAccuracy}% average accuracy so far. This is the best place to reinforce next.`
                    : `Not started yet. Opening ${weakest.name} is the fastest way to expand your ${subjectDefinition?.name || "subject"} coverage.`
                }
              : null
          }
        : null
  };
}

function getBestUpgradePlan({
  englishPerformance,
  bahasaMelayuPerformance,
  sejarahPerformance,
  geografiPerformance,
  mathPerformance,
  addMathPerformance
}: {
  englishPerformance: ReturnType<typeof buildSubjectPerformance>;
  bahasaMelayuPerformance: ReturnType<typeof buildSubjectPerformance>;
  sejarahPerformance: ReturnType<typeof buildSubjectPerformance>;
  geografiPerformance: ReturnType<typeof buildSubjectPerformance>;
  mathPerformance: ReturnType<typeof buildSubjectPerformance>;
  addMathPerformance: ReturnType<typeof buildSubjectPerformance>;
}) {
  const languageScore =
    englishPerformance.modules.reduce((sum, item) => sum + item.attemptsCount, 0) +
    bahasaMelayuPerformance.modules.reduce((sum, item) => sum + item.attemptsCount, 0);
  const humanitiesScore =
    sejarahPerformance.modules.reduce((sum, item) => sum + item.attemptsCount, 0) +
    geografiPerformance.modules.reduce((sum, item) => sum + item.attemptsCount, 0);
  const mathScore =
    mathPerformance.modules.reduce((sum, item) => sum + item.attemptsCount, 0) +
    addMathPerformance.modules.reduce((sum, item) => sum + item.attemptsCount, 0);

  const ranking = [
    {
      planCode: "language_pack",
      label: "Language Pack",
      helper: "You are already building momentum in English and Bahasa Melayu.",
      score: languageScore
    },
    {
      planCode: "humanities_pack",
      label: "Humanities Pack",
      helper: "Your Sejarah and Geografi usage suggests the Humanities bundle is a strong fit.",
      score: humanitiesScore
    },
    {
      planCode: "math_pack",
      label: "Math Pack",
      helper: "Your Math and Add Math progress points toward step-based premium support next.",
      score: mathScore
    }
  ].sort((a, b) => b.score - a.score);

  return ranking[0];
}

export async function POST(request: Request) {
  if (!hasPublicSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: "supabase_env_missing" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const authUserId = String(body?.authUserId || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!authUserId && !email) {
    return NextResponse.json({ ok: false, error: "missing_identity" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("users")
      .select("id, email, profiles(display_name, full_name, onboarding_completed, preferences)")
      .limit(1);

    if (authUserId) {
      query = query.eq("auth_user_id", authUserId);
    } else {
      query = query.eq("email", email);
    }

    const { data: userRows, error: userError } = await query;
    if (userError) throw userError;

    const user = userRows?.[0];
    if (!user) {
      return NextResponse.json({ ok: true, snapshot: null });
    }

    const profile = Array.isArray(user.profiles) ? user.profiles[0] : user.profiles;
    const access = await resolveAccessSnapshot({ authUserId, email: user.email });
    const unlockedCodes = access.unlockedSubjectCodes.length
      ? access.unlockedSubjectCodes
      : ["english", "bahasa_melayu"];
    const unlockedNames = unlockedCodes.map((code) => SUBJECT_NAME_MAP[code] || code);
    const { data: trials } = await supabase
      .from("trial_windows")
      .select("ends_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("ends_at", { ascending: false })
      .limit(1);

    const trialEndsAt = trials?.[0]?.ends_at || null;
    const trialDaysRemaining = trialEndsAt
      ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0;
    const { data: recentAttempts } = await supabase
      .from("attempts")
      .select("status, stars, accuracy_percent, created_at, summary")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setUTCDate(fourteenDaysAgo.getUTCDate() - 13);
    const { data: progressRows } = await supabase
      .from("progress_snapshots")
      .select("snapshot_date, metrics")
      .eq("user_id", user.id)
      .eq("snapshot_type", "daily_rollup")
      .gte("snapshot_date", formatDateOnly(fourteenDaysAgo))
      .order("snapshot_date", { ascending: false });
    const completedAttempts = (recentAttempts || []).filter((attempt) => attempt.status === "completed");
    const totalStars = completedAttempts.reduce((sum, attempt) => sum + Number(attempt.stars || 0), 0);
    const averageAccuracy = completedAttempts.length
      ? Math.round(
          completedAttempts.reduce((sum, attempt) => sum + Number(attempt.accuracy_percent || 0), 0) /
            completedAttempts.length
        )
      : 0;
    const recentActivity =
      recentAttempts?.map((attempt) => {
        const summary =
          attempt.summary && typeof attempt.summary === "object" && !Array.isArray(attempt.summary)
            ? attempt.summary
            : {};

        return {
          status: attempt.status,
          stars: attempt.stars || 0,
          accuracyPercent: Number(attempt.accuracy_percent || 0),
          createdAt: attempt.created_at,
          subjectName:
            typeof summary.subject_name === "string" ? summary.subject_name : "Learning mission",
          moduleName:
            typeof summary.module_name === "string" ? summary.module_name : "Module progress"
        };
      }) || [];
    const todayKey = formatDateOnly(new Date());
    const monday = getMonday(new Date());
    const weekKeys = new Set(
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday);
        date.setUTCDate(monday.getUTCDate() + index);
        return formatDateOnly(date);
      })
    );
    const activeDates = (progressRows || [])
      .filter((row) => {
        const metrics =
          row.metrics && typeof row.metrics === "object" && !Array.isArray(row.metrics)
            ? (row.metrics as Record<string, unknown>)
            : {};
        return Number(metrics.completed_today || 0) > 0 || Number(metrics.started_today || 0) > 0;
      })
      .map((row) => row.snapshot_date);
    const streakDays = computeStreak(activeDates);
    const weeklyCompletedCount = (progressRows || []).reduce((sum, row) => {
      if (!weekKeys.has(row.snapshot_date)) return sum;
      const metrics =
        row.metrics && typeof row.metrics === "object" && !Array.isArray(row.metrics)
          ? (row.metrics as Record<string, unknown>)
          : {};
      return sum + Number(metrics.completed_today || 0);
    }, 0);
    const weeklyStars = (progressRows || []).reduce((sum, row) => {
      if (!weekKeys.has(row.snapshot_date)) return sum;
      const metrics =
        row.metrics && typeof row.metrics === "object" && !Array.isArray(row.metrics)
          ? (row.metrics as Record<string, unknown>)
          : {};
      return sum + Number(metrics.stars_today || 0);
    }, 0);
    const weeklyTarget = 5;
    const weeklyProgressPercent = Math.min(100, Math.round((weeklyCompletedCount / weeklyTarget) * 100));
    const todaySnapshotMetrics = (progressRows || [])
      .filter((row) => row.snapshot_date === todayKey)
      .reduce(
        (totals, row) => {
          const metrics =
            row.metrics && typeof row.metrics === "object" && !Array.isArray(row.metrics)
              ? (row.metrics as Record<string, unknown>)
              : {};
          return {
            completed: totals.completed + Number(metrics.completed_today || 0),
            started: totals.started + Number(metrics.started_today || 0),
            stars: totals.stars + Number(metrics.stars_today || 0)
          };
        },
        { completed: 0, started: 0, stars: 0 }
      );
    const englishPerformance = buildSubjectPerformance({
      subjectCode: "english",
      completedAttempts
    });
    const bahasaMelayuPerformance = buildSubjectPerformance({
      subjectCode: "bahasa_melayu",
      completedAttempts
    });
    const sejarahPerformance = buildSubjectPerformance({
      subjectCode: "sejarah",
      completedAttempts
    });
    const geografiPerformance = buildSubjectPerformance({
      subjectCode: "geografi",
      completedAttempts
    });
    const mathPerformance = buildSubjectPerformance({
      subjectCode: "math",
      completedAttempts
    });
    const addMathPerformance = buildSubjectPerformance({
      subjectCode: "add_math",
      completedAttempts
    });
    const priorityMissionHrefs = [
      englishPerformance.coachSignal?.weakest?.href,
      bahasaMelayuPerformance.coachSignal?.weakest?.href,
      sejarahPerformance.coachSignal?.weakest?.href,
      geografiPerformance.coachSignal?.weakest?.href,
      mathPerformance.coachSignal?.weakest?.href,
      addMathPerformance.coachSignal?.weakest?.href
    ].filter(Boolean) as string[];
    const recommendedMissionPool = subjectDefinitions
      .filter((subject) => unlockedCodes.includes(subject.code))
      .flatMap((subject) =>
        subject.modules
          .filter((module) => module.status === "ready")
          .map((module) => ({
            subject: subject.name,
            title: module.name,
            helper: module.mission,
            href: `/subjects/${subject.slug}/${module.slug}`
          }))
      );
    const recommendedMissions = [
      ...priorityMissionHrefs
        .map((href) => recommendedMissionPool.find((mission) => mission.href === href))
        .filter(Boolean),
      ...recommendedMissionPool.filter((mission) => !priorityMissionHrefs.includes(mission.href))
    ].slice(0, 3) as {
      subject: string;
      title: string;
      helper: string;
      href: string;
    }[];
    const strongestSubject =
      [
        { code: "english", label: "English", score: englishPerformance.modules.reduce((sum, item) => sum + item.totalStars, 0) },
        { code: "bahasa_melayu", label: "Bahasa Melayu", score: bahasaMelayuPerformance.modules.reduce((sum, item) => sum + item.totalStars, 0) },
        { code: "sejarah", label: "Sejarah", score: sejarahPerformance.modules.reduce((sum, item) => sum + item.totalStars, 0) },
        { code: "geografi", label: "Geografi", score: geografiPerformance.modules.reduce((sum, item) => sum + item.totalStars, 0) },
        { code: "math", label: "Math", score: mathPerformance.modules.reduce((sum, item) => sum + item.totalStars, 0) },
        { code: "add_math", label: "Add Math", score: addMathPerformance.modules.reduce((sum, item) => sum + item.totalStars, 0) }
      ]
        .sort((a, b) => b.score - a.score)
        .find((item) => item.score > 0) || null;
    const weakestTarget =
      englishPerformance.coachSignal?.weakest ||
      bahasaMelayuPerformance.coachSignal?.weakest ||
      sejarahPerformance.coachSignal?.weakest ||
      geografiPerformance.coachSignal?.weakest ||
      mathPerformance.coachSignal?.weakest ||
      addMathPerformance.coachSignal?.weakest ||
      null;
    const recommendedUpgrade = getBestUpgradePlan({
      englishPerformance,
      bahasaMelayuPerformance,
      sejarahPerformance,
      geografiPerformance,
      mathPerformance,
      addMathPerformance
    });
    const showTrialSummary = access.trialActive && trialDaysRemaining <= 2;
    const totalStarPoints = completedAttempts.reduce((sum, attempt) => {
      const stars = Number(attempt.stars || 0);
      if (stars >= 3) return sum + 220;
      if (stars === 2) return sum + 140;
      if (stars === 1) return sum + 80;
      return sum;
    }, 0);
    const achievements = buildAchievements({
      completedCount: completedAttempts.length,
      totalStars,
      streakDays,
      weeklyCompletedCount,
      averageAccuracy,
      unlockedCount: unlockedCodes.length
    });
    const unlockedAchievementCount = achievements.filter((achievement) => achievement.unlocked).length;
    const rank =
      totalStarPoints >= 1800
        ? "Galaxy Captain"
        : totalStarPoints >= 1200
          ? "Rocket Leader"
          : totalStarPoints >= 700
            ? "Comet Chaser"
            : totalStarPoints >= 250
          ? "Star Starter"
              : "Launch Pad";
    const reportSummary = buildReportSummary({
      strongestSubject,
      weakestTarget,
      recommendedMissions,
      averageAccuracy,
      weeklyCompletedCount,
      streakDays
    });
    const nextFocus = weakestTarget?.name
      ? `${weakestTarget.name} is your clearest next fix.`
      : recommendedMissions[0]
        ? `${recommendedMissions[0].subject}: ${recommendedMissions[0].title}`
        : "English and Bahasa Melayu starter missions";

    return NextResponse.json({
      ok: true,
      snapshot: {
        email: user.email,
        displayName: profile?.display_name || profile?.full_name || user.email?.split("@")[0] || "Student",
        onboardingCompleted: Boolean(profile?.onboarding_completed),
        trialActive: access.trialActive,
        activePlanCodes: access.activePlanCodes,
        unlockedSubjectCodes: unlockedCodes,
        unlockedSubjectNames: unlockedNames,
        unlockedCount: unlockedCodes.length,
        nextFocus,
        membershipLabel: access.trialActive
          ? "7-day full access trial"
          : access.activePlanCodes.length
            ? access.activePlanCodes.join(", ")
            : "Free starter access",
        streakDays,
        weeklyTarget,
        weeklyCompletedCount,
        weeklyStars,
        weeklyProgressPercent,
        todayCompletedCount: todaySnapshotMetrics.completed,
        todayStartedCount: todaySnapshotMetrics.started,
        todayStars: todaySnapshotMetrics.stars,
        showTrialSummary,
        trialSummary: {
          strongestSubject: strongestSubject?.label || null,
          weakestModuleName: weakestTarget?.name || null,
          weakestModuleHref: weakestTarget?.href || null,
          recommendedUpgradePlanCode: recommendedUpgrade.planCode,
          recommendedUpgradeLabel: recommendedUpgrade.label,
          recommendedUpgradeHelper: recommendedUpgrade.helper
        },
        totalStars,
        totalStarPoints,
        rank,
        unlockedAchievementCount,
        achievements,
        completedCount: completedAttempts.length,
        averageAccuracy,
        reportSummary,
        trialEndsAt,
        trialDaysRemaining,
        recommendedMissions,
        recentActivity,
        englishModules: englishPerformance.modules,
        coachSignal: englishPerformance.coachSignal,
        bahasaMelayuModules: bahasaMelayuPerformance.modules,
        bahasaMelayuCoachSignal: bahasaMelayuPerformance.coachSignal,
        humanitiesModules: [...sejarahPerformance.modules, ...geografiPerformance.modules],
        humanitiesCoachSignal:
          sejarahPerformance.coachSignal || geografiPerformance.coachSignal
            ? {
                strongest:
                  sejarahPerformance.coachSignal?.strongest || geografiPerformance.coachSignal?.strongest || null,
                weakest:
                  sejarahPerformance.coachSignal?.weakest || geografiPerformance.coachSignal?.weakest || null
              }
            : null,
        mathModules: mathPerformance.modules,
        mathCoachSignal: mathPerformance.coachSignal,
        addMathModules: addMathPerformance.modules,
        addMathCoachSignal: addMathPerformance.coachSignal
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "dashboard_snapshot_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
