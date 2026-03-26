"use client";

import { useEffect, useState } from "react";
import { AvatarPreviewFigure } from "./avatar-preview-figure";
import {
  getCollectionMission,
  getWeeklyDrop,
  getWeeklyDropUrgency
} from "../lib/avatar-catalog";
import { getSubjectDisplayName, type AppLocale } from "../lib/locale";
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

function renderModulePerformanceCard(module: ModulePerformance, key: string, locale: AppLocale) {
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
          ? locale === "ms"
            ? `${module.attemptsCount} kali selesai · ${module.totalStars} bintang · purata ketepatan ${module.averageAccuracy}%`
            : `${module.attemptsCount} completion(s) · ${module.totalStars} star(s) · ${module.averageAccuracy}% average accuracy`
          : locale === "ms"
            ? "Belum ada percubaan disimpan. Buka modul dan simpan keputusan pertama."
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
  billingStatus,
  locale
}: {
  billingPlan: string | null;
  billingStatus: string | null;
  locale: AppLocale;
}) {
  const [sessionState, setSessionState] = useState<SessionState>({
    email: "",
    status: hasPublicSupabaseEnv() ? "signed_out" : "env_missing",
    snapshot: null
  });
  const [closetSummary, setClosetSummary] = useState<ClosetSummary | null>(null);
  const bundleNameMap =
    locale === "ms"
      ? {
          "Language Pack": "Pakej Bahasa",
          "Humanities Pack": "Pakej Kemanusiaan",
          "Math Pack": "Pakej Matematik",
          "All Access": "Akses Penuh"
        }
      : {
          "Language Pack": "Language Pack",
          "Humanities Pack": "Humanities Pack",
          "Math Pack": "Math Pack",
          "All Access": "All Access"
        };

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
            label: locale === "ms" ? "Akaun" : "Account",
            value: sessionState.snapshot.membershipLabel,
            helper: sessionState.snapshot.trialActive
              ? locale === "ms"
                ? `${sessionState.snapshot.trialDaysRemaining} hari lagi dalam akses penuh.`
                : `${sessionState.snapshot.trialDaysRemaining} day(s) left in full access.`
              : locale === "ms"
                ? "Akses pakej kini aktif."
                : "Bundle access is now in effect."
          },
          {
            label: locale === "ms" ? "Mata Bintang" : "Star Points",
            value: `${sessionState.snapshot.totalStarPoints} pts`,
            helper: sessionState.snapshot.completedCount
              ? locale === "ms"
                ? `1 bintang = 80 mata · 2 bintang = 140 mata · 3 bintang = 220 mata`
                : `1-star = 80 pts · 2-star = 140 pts · 3-star = 220 pts`
              : locale === "ms"
                ? "Selesaikan satu misi dan mula kumpul mata bintang."
                : "Finish a mission and start collecting big star points."
          },
          {
            label: locale === "ms" ? "Streak" : "Streak",
            value:
              locale === "ms"
                ? `${sessionState.snapshot.streakDays} hari`
                : `${sessionState.snapshot.streakDays} day${sessionState.snapshot.streakDays === 1 ? "" : "s"}`,
            helper:
              sessionState.snapshot.streakDays > 0
                ? locale === "ms"
                  ? "Anda sudah ada momentum belajar. Kekalkan hari ini."
                  : "You have learning momentum. Keep it alive today."
                : locale === "ms"
                  ? "Mulakan satu misi hari ini untuk memulakan streak anda."
                  : "Start one mission today to begin your streak."
          },
          {
            label: locale === "ms" ? "Lencana" : "Badges",
            value: `${sessionState.snapshot.unlockedAchievementCount}/${sessionState.snapshot.achievements.length}`,
            helper:
              sessionState.snapshot.unlockedAchievementCount > 0
                ? locale === "ms"
                  ? `Peringkat ${sessionState.snapshot.rank} sedang aktif sekarang.`
                  : `${sessionState.snapshot.rank} rank is active now.`
                : locale === "ms"
                  ? "Buka lencana pertama anda dengan melengkapkan satu misi."
                  : "Unlock your first badge by completing one mission."
          },
          {
            label: locale === "ms" ? "Sasaran mingguan" : "Weekly target",
            value: `${sessionState.snapshot.weeklyCompletedCount}/${sessionState.snapshot.weeklyTarget}`,
            helper:
              locale === "ms"
                ? `${sessionState.snapshot.weeklyStars} bintang diperoleh minggu ini.`
                : `${sessionState.snapshot.weeklyStars} star(s) earned this week.`
          }
        ]
      : [
          { label: locale === "ms" ? "Hari ini" : "Today", value: locale === "ms" ? "1 misi sedia" : "1 mission ready", helper: locale === "ms" ? "Giliran fokus Bahasa Inggeris" : "English focus queue" },
          { label: locale === "ms" ? "Streak" : "Streak", value: locale === "ms" ? "7 hari" : "7 days", helper: locale === "ms" ? "Momentum itu penting" : "Momentum matters" },
          { label: locale === "ms" ? "Bukaan" : "Unlocks", value: locale === "ms" ? "6 subjek" : "6 subjects", helper: locale === "ms" ? "Bahasa Inggeris, BM, Sejarah, Geografi, Matematik, Matematik Tambahan" : "English, BM, Sejarah, Geografi, Math, Add Math" }
        ];

  const bundleCards =
    sessionState.status === "signed_in" && sessionState.snapshot
      ? [
          {
            code: "language_pack",
            name: bundleNameMap["Language Pack"],
            priceLabel: planDefinitions.find((plan) => plan.code === "language_pack")?.priceLabel || "RM29",
            detail: locale === "ms" ? "Akses teras Bahasa Inggeris + Bahasa Melayu" : "English + Bahasa Melayu core access",
            status: sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("language_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
              ? locale === "ms" ? "Aktif" : "Active"
              : locale === "ms" ? "Naik taraf" : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("language_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? locale === "ms"
                  ? "Modul bahasa teras sudah dibuka."
                  : "Core language modules are open."
                : locale === "ms"
                  ? "Buka Bahasa Inggeris dan Bahasa Melayu dalam satu pakej."
                  : "Unlock English and Bahasa Melayu in one bundle.",
            href: "/upgrade?plan=language_pack"
          },
          {
            code: "humanities_pack",
            name: bundleNameMap["Humanities Pack"],
            priceLabel: planDefinitions.find((plan) => plan.code === "humanities_pack")?.priceLabel || "RM19",
            detail: locale === "ms" ? "Pakej ulang kaji Sejarah + Geografi" : "Sejarah + Geografi revision bundle",
            status: sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("humanities_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
              ? locale === "ms" ? "Aktif" : "Active"
              : locale === "ms" ? "Naik taraf" : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("humanities_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? locale === "ms"
                  ? "Modul kemanusiaan sudah dibuka."
                  : "Humanities modules are open."
                : locale === "ms"
                  ? "Buka latihan recall, konsep, dan jawapan ringkas premium."
                  : "Unlock premium recall, concept, and short-answer practice.",
            href: "/upgrade?plan=humanities_pack"
          },
          {
            code: "math_pack",
            name: bundleNameMap["Math Pack"],
            priceLabel: planDefinitions.find((plan) => plan.code === "math_pack")?.priceLabel || "RM19",
            detail: locale === "ms" ? "Latihan berasaskan langkah Matematik + Matematik Tambahan" : "Math + Add Math step-based practice",
            status: sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("math_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
              ? locale === "ms" ? "Aktif" : "Active"
              : locale === "ms" ? "Naik taraf" : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("math_pack") || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? locale === "ms"
                  ? "Modul Matematik dan Matematik Tambahan sudah dibuka."
                  : "Math and Add Math modules are open."
                : locale === "ms"
                  ? "Buka latihan Matematik, worked solution, dan semakan langkah Matematik Tambahan."
                  : "Unlock Math drills, worked solutions, and Add Math step checks.",
            href: "/upgrade?plan=math_pack"
          },
          {
            code: "all_access",
            name: bundleNameMap["All Access"],
            priceLabel: planDefinitions.find((plan) => plan.code === "all_access")?.priceLabel || "RM59",
            detail: locale === "ms" ? "Keenam-enam subjek dalam satu laluan naik taraf" : "All six subjects in one upgrade path",
            status:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? locale === "ms" ? "Aktif" : "Active"
                : locale === "ms" ? "Naik taraf" : "Upgrade",
            helper:
              sessionState.snapshot.trialActive || sessionState.snapshot.activePlanCodes.includes("all_access")
                ? locale === "ms"
                  ? "Semua pakej semasa sudah dibuka."
                  : "Every current bundle is open."
                : locale === "ms"
                  ? "Paling sesuai untuk pelajar yang mahukan satu pelan jelas merentas semua subjek."
                  : "Best fit for students who want one clean plan across all subjects.",
            href: "/upgrade?plan=all_access"
          }
        ]
      : [
          {
            code: "language_pack",
            name: bundleNameMap["Language Pack"],
            priceLabel: "RM29",
            detail: locale === "ms" ? "Akses teras Bahasa Inggeris + Bahasa Melayu" : "English + Bahasa Melayu core access",
            status: locale === "ms" ? "Pratonton" : "Preview",
            helper: locale === "ms" ? "Pakej permulaan untuk belajar bahasa setiap hari." : "Starter pack for daily language study.",
            href: "/upgrade?plan=language_pack"
          },
          {
            code: "humanities_pack",
            name: bundleNameMap["Humanities Pack"],
            priceLabel: "RM19",
            detail: locale === "ms" ? "Pakej ulang kaji Sejarah + Geografi" : "Sejarah + Geografi revision bundle",
            status: locale === "ms" ? "Pratonton" : "Preview",
            helper: locale === "ms" ? "Sokongan ulang kaji kandungan berat dalam satu pakej." : "Content-heavy revision support in one bundle.",
            href: "/upgrade?plan=humanities_pack"
          },
          {
            code: "math_pack",
            name: bundleNameMap["Math Pack"],
            priceLabel: "RM19",
            detail: locale === "ms" ? "Latihan berasaskan langkah Matematik + Matematik Tambahan" : "Math + Add Math step-based practice",
            status: locale === "ms" ? "Pratonton" : "Preview",
            helper: locale === "ms" ? "Semakan kaedah dan ulang kaji corak kesilapan." : "Method checks and error-pattern revision.",
            href: "/upgrade?plan=math_pack"
          },
          {
            code: "all_access",
            name: bundleNameMap["All Access"],
            priceLabel: "RM59",
            detail: locale === "ms" ? "Keenam-enam subjek dalam satu laluan naik taraf" : "All six subjects in one upgrade path",
            status: locale === "ms" ? "Pratonton" : "Preview",
            helper: locale === "ms" ? "Satu pelan untuk pengalaman SenangBah 2.0 penuh." : "One plan for the full SenangBah 2.0 experience.",
            href: "/upgrade?plan=all_access"
          }
        ];

  const missions =
    sessionState.status === "signed_in" && sessionState.snapshot?.recommendedMissions.length
      ? sessionState.snapshot.recommendedMissions
      : [
          {
            subject: getSubjectDisplayName("English", locale),
            title: "Writing Coach",
            helper: "Draft one short response and improve a weak sentence.",
            href: "/subjects/english/writing-coach"
          },
          {
            subject: getSubjectDisplayName("Bahasa Melayu", locale),
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
      : locale === "ms"
        ? "Bahasa Inggeris, Bahasa Melayu, Sejarah"
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
      name: getSubjectDisplayName(subject.name, locale),
      href: `/subjects/${subject.slug}`,
      tone:
        subject.bundle === "Language Pack"
          ? "tone-language"
          : subject.bundle === "Humanities Pack"
            ? "tone-humanities"
            : "tone-math",
      bundle:
        locale === "ms"
          ? subject.bundle === "Language Pack"
            ? "Pakej Bahasa"
            : subject.bundle === "Humanities Pack"
              ? "Pakej Kemanusiaan"
              : "Pakej Matematik"
          : subject.bundle,
      summary:
        locale === "ms"
          ? subject.slug === "english"
            ? "Penulisan, tatabahasa, bacaan, dan kosa kata untuk kemajuan peperiksaan harian."
            : subject.slug === "bahasa-melayu"
              ? "Tatabahasa, pemahaman, dan karangan untuk penguasaan bahasa yang lebih kuat."
              : subject.slug === "sejarah"
                ? "Recall fakta, garis masa, dan latihan sumber untuk keyakinan peperiksaan."
                : subject.slug === "geografi"
                  ? "Konsep, data, dan jawapan ringkas untuk ketepatan yang lebih baik."
                  : subject.slug === "math"
                    ? "Kaedah, langkah kerja, dan semakan corak kesilapan untuk asas yang lebih kukuh."
                    : "Langkah lanjutan dan penyelesaian yang lebih kemas untuk topik sukar."
          : subject.summary,
      unlocked,
      readyCount: subject.modules.filter((module) => module.status === "ready").length,
      masteryPercent: modulesForSubject.length ? averageMastery(modulesForSubject) : 0,
      nextLabel:
        bestNext?.name ||
        firstModule?.name ||
        (locale === "ms" ? "Buka subjek" : "Open subject"),
      nextHref: bestNext?.href || `/subjects/${subject.slug}/${firstModule?.slug || ""}`
    };
  });

  return (
    <>
      {showBillingSuccess ? (
        <section className="section">
          <div className="billing-success-banner">
            <div>
              <p className="eyebrow">{locale === "ms" ? "Pembayaran berjaya" : "Payment success"}</p>
              <h2>{locale === "ms" ? `${billingPlanDefinition?.name} kini aktif.` : `${billingPlanDefinition?.name} is now active.`}</h2>
              <p className="dashboard-helper">
                {locale === "ms"
                  ? "Dashboard anda kini akan mengutamakan modul yang termasuk dalam pakej ini. Buka laluan yang baru dibuka dan mulakan misi seterusnya terus."
                  : "Your dashboard will now prioritize the modules included in this bundle. Open the newly unlocked lane and start the next mission straight away."}
              </p>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href={postPaymentHref}>
                {locale === "ms" ? "Buka Subjek Saya" : "Open My Subjects"}
              </a>
              <a className="btn btn-secondary" href="/pricing">
                {locale === "ms" ? "Lihat Keahlian" : "View Memberships"}
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section dashboard-command-section">
        <div className="dashboard-command-grid">
          <article className="dashboard-command-card dashboard-command-card-primary">
            <div className="dashboard-command-copy">
              <p className="eyebrow">{locale === "ms" ? "Fokus hari ini" : "Today&apos;s focus"}</p>
              <h2>
                {leadMission
                  ? `${leadMission.subject}: ${leadMission.title}`
                  : locale === "ms"
                    ? "Satu misi yang jelas lebih baik daripada dashboard yang berserabut."
                    : "One clear mission beats a messy dashboard."}
              </h2>
              <p className="dashboard-helper">
                {leadMission?.helper ||
                  (locale === "ms"
                    ? "Kad teratas sepatutnya sentiasa menjawab satu soalan untuk pelajar: apa yang patut saya buat dahulu?"
                    : "The top card should always answer one question for students: what should I do first?")}
              </p>
            </div>
            <div className="dashboard-command-stats">
              <div className="dashboard-chip">
                <span className="dashboard-label">{locale === "ms" ? "Streak" : "Streak"}</span>
                <strong>
                  {sessionState.snapshot
                    ? `${sessionState.snapshot.streakDays} day${sessionState.snapshot.streakDays === 1 ? "" : "s"}`
                    : locale === "ms"
                      ? "Mula hari ini"
                      : "Start today"}
                </strong>
              </div>
              <div className="dashboard-chip">
                <span className="dashboard-label">{locale === "ms" ? "Hari ini" : "Today"}</span>
                <strong>
                  {sessionState.snapshot
                    ? `${sessionState.snapshot.todayCompletedCount} done · ${sessionState.snapshot.todayStars} stars`
                    : locale === "ms"
                      ? "1 kemenangan sedia"
                      : "1 win ready"}
                </strong>
              </div>
            </div>
            <div className="hero-actions">
              {leadMission ? (
                <a className="btn btn-primary" href={leadMission.href}>
                  {locale === "ms" ? "Mulakan misi ini" : "Start this mission"}
                </a>
              ) : null}
              <a className="btn btn-secondary" href="/my-subjects">
                {locale === "ms" ? "Buka Subjek Saya" : "Open My Subjects"}
              </a>
            </div>
          </article>

          <div className="dashboard-command-stack">
            <article className="dashboard-command-card dashboard-command-card-accent">
              <p className="eyebrow">{locale === "ms" ? "Nadi kemajuan" : "Progress pulse"}</p>
              <h3>
                {sessionState.snapshot
                  ? `${sessionState.snapshot.weeklyCompletedCount}/${sessionState.snapshot.weeklyTarget} weekly missions`
                  : locale === "ms"
                    ? "Sasaran mingguan anda akan muncul di sini"
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
                  ? locale === "ms"
                    ? `Laluan seterusnya: ${sessionState.snapshot.nextFocus}.`
                    : `Next lane: ${sessionState.snapshot.nextFocus}.`
                  : locale === "ms"
                    ? "Sasaran mingguan anda akan ditunjukkan di sini."
                    : "Your weekly target will show here."}
              </p>
            </article>

            <article className="dashboard-command-card dashboard-command-card-soft">
              <p className="eyebrow">{locale === "ms" ? "Avatar + pakej" : "Avatar + packs"}</p>
              <h3>
                {sessionState.snapshot
                  ? `${closetSummary?.availablePoints ?? sessionState.snapshot.totalStarPoints} pts ready to spend`
                  : locale === "ms"
                    ? "Ganjaran almari menjadikan mata belajar terasa nyata"
                    : "Closet rewards make study points feel real"}
              </h3>
              <p className="dashboard-helper">
                {sessionState.snapshot
                  ? locale === "ms"
                    ? `Terbuka sekarang: ${unlockedLabel || "Laluan permulaan"}`
                    : `Open now: ${unlockedLabel || "Starter track"}`
                  : locale === "ms"
                    ? "Mata, almari, dan keahlian berada di sini."
                    : "Points, closet, and memberships stay here."}
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="/avatar">
                  {locale === "ms" ? "Buka Almari Avatar" : "Open Avatar Closet"}
                </a>
                <a className="btn btn-secondary" href="/pricing">
                  {locale === "ms" ? "Lihat Keahlian" : "View Memberships"}
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="table-head">
          <div>
            <p className="eyebrow">{locale === "ms" ? "Subjek anda" : "Your subjects"}</p>
            <h2>{locale === "ms" ? "Pilih subjek dahulu, kemudian terus ke satu misi yang jelas." : "Choose a subject first, then jump into one clear mission."}</h2>
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
                  <span className="dashboard-label">{locale === "ms" ? "Penguasaan" : "Mastery"}</span>
                  <strong>{subject.masteryPercent}%</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Mula di sini" : "Start here"}</span>
                  <strong>{subject.nextLabel}</strong>
                </div>
              </div>
              <div className="hero-actions">
                <a className="btn btn-primary" href={subject.unlocked ? subject.nextHref : "/pricing"}>
                  {subject.unlocked
                    ? locale === "ms"
                      ? `Mula ${getSubjectDisplayName(subject.name, locale)}`
                      : `Start ${subject.name}`
                    : locale === "ms"
                      ? "Lihat Keahlian"
                      : "View Memberships"}
                </a>
                <a className="btn btn-secondary" href={subject.href}>
                  {locale === "ms" ? `Buka ${getSubjectDisplayName(subject.name, locale)}` : `Open ${subject.name}`}
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
              <p className="eyebrow">{locale === "ms" ? "Avatar anda" : "Your avatar"}</p>
              <h2>{locale === "ms" ? "Lihat gaya, mata, dan kemajuan almari anda." : "See your style, points, and closet progress."}</h2>
              </div>
            </summary>

            <div className="dashboard-mission-grid dashboard-foldout-body">
              <article className="feature-panel avatar-live-preview">
                <p className="eyebrow">{locale === "ms" ? "Identiti langsung" : "Live identity"}</p>
                <h2>{sessionState.snapshot.rank}</h2>
                <AvatarPreviewFigure
                  compact
                  equippedBySlot={new Map((closetSummary?.equipped || []).map((item) => [item.slot, item]))}
                />
                <p className="dashboard-helper">
                  {locale === "ms"
                    ? "Avatar anda kini berada di tempat yang sama dengan streak, lencana, dan Mata Bintang anda."
                    : "Your avatar now lives in the same place as your streak, badges, and Star Points."}
                </p>
              </article>

              <article className="feature-panel alt">
                <p className="eyebrow">{locale === "ms" ? "Ringkasan almari" : "Closet summary"}</p>
                <h2>
                  {closetSummary?.availablePoints ?? sessionState.snapshot.totalStarPoints}{" "}
                  {locale === "ms" ? "mata sedia digayakan" : "pts ready to style"}
                </h2>
                <div className="momentum-stack">
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Slot dipakai" : "Equipped slots"}</span>
                    <strong>{(closetSummary?.equipped || []).length}/5 {locale === "ms" ? "aktif" : "active"}</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Sasaran permulaan" : "Starter target"}</span>
                    <strong>Daily Runner shoes · 280 {locale === "ms" ? "mata" : "pts"}</strong>
                  </div>
                  {topCollection ? (
                    <div className="momentum-item">
                      <span className="dashboard-label">{locale === "ms" ? "Koleksi paling hampir" : "Closest collection"}</span>
                      <strong>
                        {topCollection.collectionName} · {topCollection.ownedCount}/{topCollection.totalCount}
                      </strong>
                      <p className="dashboard-helper">{topCollection.progressPercent}% {locale === "ms" ? "siap" : "complete"}</p>
                      {topCollectionMission ? (
                        <a className="mini-link" href={topCollectionMission.href}>
                          {topCollectionMission.subject}: {topCollectionMission.title}
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Langkah seterusnya" : "Next move"}</span>
                    <strong>
                      {locale === "ms"
                        ? "Buka almari dan tukarkan mata hari ini kepada gaya."
                        : "Open the closet and turn today&apos;s points into style."}
                    </strong>
                  </div>
                </div>
                <div className="hero-actions">
                  <a className="btn btn-primary" href="/avatar">
                    {locale === "ms" ? "Buka Almari Avatar" : "Open Avatar Closet"}
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
              <p className="eyebrow">{locale === "ms" ? "Drop mingguan" : "Weekly drop"}</p>
              <h2>{locale === "ms" ? "Lihat ganjaran pilihan minggu ini." : "See this week&apos;s featured reward."}</h2>
            </div>
          </summary>

          <div className="dashboard-mission-grid dashboard-foldout-body">
            <article className="feature-panel">
            <p className="eyebrow">{weeklyDrop?.headline || (locale === "ms" ? "Drop mingguan" : "Weekly drop")}</p>
            <h2>{weeklyDrop?.name || (locale === "ms" ? "Item pilihan almari" : "Featured closet item")}</h2>
            <p className="dashboard-helper">
              {weeklyDrop?.helper ||
                (locale === "ms"
                  ? "Item berputar membantu pelajar merasakan minggu ini mempunyai sasaran tersendiri."
                  : "A rotating item helps students feel that this week has its own target.")}
            </p>
            <div className="momentum-stack">
              <div className="momentum-item">
                <span className="dashboard-label">{locale === "ms" ? "Keutamaan" : "Urgency"}</span>
                <strong>{weeklyDropUrgency?.label || (locale === "ms" ? "Minggu ini sahaja" : "This week only")}</strong>
                <p className="dashboard-helper">
                  {weeklyDropUrgency?.helper ||
                    (locale === "ms"
                      ? "Drop pilihan berfungsi paling baik apabila ia jelas memberitahu pelajar supaya tidak menunggu."
                      : "A featured drop works best when it clearly tells students not to wait.")}
                </p>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">{locale === "ms" ? "Koleksi" : "Collection"}</span>
                <strong>{weeklyDrop?.collectionName || "Rotation"}</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">{locale === "ms" ? "Harga" : "Price"}</span>
                <strong>{weeklyDrop ? `${weeklyDrop.pricePoints} ${locale === "ms" ? "mata" : "pts"}` : "TBD"}</strong>
              </div>
              <div className="momentum-item">
                <span className="dashboard-label">{locale === "ms" ? "Tamat" : "Ends"}</span>
                <strong>{weeklyDrop ? new Date(weeklyDrop.endIso).toLocaleDateString("en-MY") : locale === "ms" ? "Minggu ini" : "This week"}</strong>
              </div>
            </div>
            </article>

            <article className="feature-panel alt">
            <p className="eyebrow">{locale === "ms" ? "Misi berkaitan" : "Mission tie-in"}</p>
            <h2>{weeklyDrop?.mission?.title || (locale === "ms" ? "Buka misi yang berkaitan" : "Open a linked mission")}</h2>
            <p className="dashboard-helper">
              {weeklyDrop?.mission?.helper ||
                (locale === "ms"
                  ? "Drop mingguan berfungsi paling baik apabila ia membawa pelajar kembali ke laluan subjek yang fokus."
                  : "The weekly drop works best when it points students back into a focused subject lane.")}
            </p>
            <div className="hero-actions">
              {weeklyDrop?.mission ? (
                <a className="btn btn-primary" href={weeklyDrop.mission.href}>
                  {locale === "ms" ? "Mula" : "Start"} {weeklyDrop.mission.subject}: {weeklyDrop.mission.title}
                </a>
              ) : null}
              <a className="btn btn-secondary" href="/avatar">
                {locale === "ms" ? "Lihat Drop Mingguan" : "View Weekly Drops"}
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
              <p className="eyebrow">{locale === "ms" ? "Pencapaian" : "Achievements"}</p>
              <h2>{locale === "ms" ? "Lihat lencana dan kemajuan ganjaran." : "See badges and reward progress."}</h2>
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
                      <p className="dashboard-label">
                        {achievement.unlocked
                          ? locale === "ms"
                            ? "Dibuka"
                            : "Unlocked"
                          : locale === "ms"
                            ? "Sedang berjalan"
                            : "In progress"}
                      </p>
                      <h3>{achievement.title}</h3>
                    </div>
                  </div>
                  <p className="dashboard-helper">{achievement.helper}</p>
                  <div className="mastery-stack">
                    <div className="mastery-meta">
                      <span className="dashboard-label">{locale === "ms" ? "Kemajuan lencana" : "Badge progress"}</span>
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
              <p className="eyebrow">{locale === "ms" ? "Keahlian" : "Memberships"}</p>
              <h2>{locale === "ms" ? "Lihat pelan aktif anda hanya apabila diperlukan." : "See your active plans only when you need them."}</h2>
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
              <p className="eyebrow">{locale === "ms" ? "Aliran belajar" : "Study flow"}</p>
              <h2>{locale === "ms" ? "Lihat misi hari ini dan kemajuan minggu ini." : "See today&apos;s missions and this week&apos;s progress."}</h2>
            </div>
          </summary>

          <div className="dashboard-mission-grid dashboard-foldout-body">
            <article className="feature-panel">
              <p className="eyebrow">{locale === "ms" ? "Mula sekarang" : "Start now"}</p>
              <h2>{locale === "ms" ? "Mulakan dengan satu misi yang fokus." : "Start with one focused mission."}</h2>
              {sessionState.status === "signed_in" && sessionState.snapshot ? (
                <p className="dashboard-helper">
                  {sessionState.snapshot.todayCompletedCount
                    ? locale === "ms"
                      ? `Anda sudah menyiapkan ${sessionState.snapshot.todayCompletedCount} misi hari ini. Satu lagi akan menguatkan streak.`
                      : `You already banked ${sessionState.snapshot.todayCompletedCount} mission(s) today. One more will strengthen the streak.`
                    : locale === "ms"
                      ? "Misi pertama hari ini ialah cara paling mudah untuk melindungi streak anda."
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
                    <span className="mini-link">{locale === "ms" ? "Mula" : "Start"}</span>
                  </a>
                ))}
              </div>
            </article>

            <article className="feature-panel alt">
              <p className="eyebrow">{locale === "ms" ? "Kemajuan anda" : "Your progress"}</p>
              <h2>{locale === "ms" ? "Kekalkan satu pandangan yang jelas untuk hari ini dan minggu ini." : "Keep one clear view of today and this week."}</h2>
              {sessionState.status === "signed_in" && sessionState.snapshot ? (
                <div className="momentum-stack">
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Hari ini" : "Today"}</span>
                    <strong>
                      {sessionState.snapshot.todayCompletedCount
                        ? locale === "ms"
                          ? `${sessionState.snapshot.todayCompletedCount} misi selesai`
                          : `${sessionState.snapshot.todayCompletedCount} mission(s) done`
                        : locale === "ms"
                          ? "Masih menunggu kemenangan pertama"
                          : "Still waiting for first win"}
                    </strong>
                    <p className="dashboard-helper">
                      {sessionState.snapshot.todayStars} {locale === "ms" ? "bintang diperoleh hari ini" : "star(s) earned today"}
                    </p>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Sasaran mingguan" : "Weekly target"}</span>
                    <strong>
                      {sessionState.snapshot.weeklyCompletedCount}/{sessionState.snapshot.weeklyTarget} {locale === "ms" ? "misi" : "missions"}
                    </strong>
                    <div className="target-progress compact">
                      <div
                        className="target-progress-bar"
                        style={{ width: `${sessionState.snapshot.weeklyProgressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Laluan seterusnya disyorkan" : "Next recommended lane"}</span>
                    <strong>{sessionState.snapshot.nextFocus}</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Terbuka sekarang" : "Unlocked now"}</span>
                    <strong>{sessionState.snapshot.unlockedSubjectNames.slice(0, 3).join(", ")}</strong>
                    <p className="dashboard-helper">
                      {sessionState.snapshot.trialActive
                        ? locale === "ms"
                          ? `${sessionState.snapshot.trialDaysRemaining} hari lagi dalam akses penuh`
                          : `${sessionState.snapshot.trialDaysRemaining} day(s) left in full access`
                        : locale === "ms"
                          ? "Akses permulaan atau berbayar sedang aktif"
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
                    <span className="dashboard-label">{locale === "ms" ? "Laluan permulaan" : "Starter path"}</span>
                    <strong>{locale === "ms" ? "Bahasa Inggeris dan Bahasa Melayu" : "English and Bahasa Melayu"}</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Pratonton premium" : "Premium preview"}</span>
                    <strong>{locale === "ms" ? "Sejarah, Geografi, Matematik, Matematik Tambahan" : "Sejarah, Geografi, Math, Add Math"}</strong>
                  </div>
                  <div className="momentum-item">
                    <span className="dashboard-label">{locale === "ms" ? "Langkah terbaik seterusnya" : "Best next step"}</span>
                    <strong>{locale === "ms" ? "Cipta akaun untuk mengaktifkan percubaan penuh 7 hari anda." : "Create an account to activate your 7-day full trial."}</strong>
                  </div>
                </div>
              )}
            </article>
          </div>
        </details>
      </section>

      {sessionState.status !== "signed_in" ? (
        <section className="session-banner">
          <p className="eyebrow">{locale === "ms" ? "Status sesi" : "Session status"}</p>
          {sessionState.status === "env_missing" ? (
            <h2>{locale === "ms" ? "Env Supabase tiada. UI auth sudah tersedia tetapi belum disambungkan." : "Supabase env missing. Auth UI is scaffolded but not connected yet."}</h2>
          ) : (
            <h2>{locale === "ms" ? "Anda telah log keluar. Log masuk atau daftar untuk terus belajar." : "Signed out. Login or register to continue learning."}</h2>
          )}
        </section>
      ) : null}

      {sessionState.status === "signed_in" && sessionState.snapshot?.showTrialSummary ? (
        <section className="section">
          <div className="table-head">
            <div>
              <p className="eyebrow">{locale === "ms" ? "Ringkasan percubaan" : "Trial summary"}</p>
              <h2>{locale === "ms" ? "Akses 7 hari anda hampir tamat. Kekalkan momentum terbaik ini." : "Your 7-day access is almost over. Keep the strongest momentum alive."}</h2>
            </div>
          </div>

          <div className="dashboard-mission-grid">
            <article className="feature-panel">
              <p className="eyebrow">{locale === "ms" ? "Apa yang anda bina" : "What you built"}</p>
              <h2>
                {sessionState.snapshot.trialSummary.strongestSubject
                  ? locale === "ms"
                    ? `${sessionState.snapshot.trialSummary.strongestSubject} ialah laluan paling kuat anda setakat ini.`
                    : `${sessionState.snapshot.trialSummary.strongestSubject} is your strongest lane so far.`
                  : locale === "ms"
                    ? "Anda sudah mempunyai aktiviti yang cukup untuk menukar percubaan ini menjadi rentak belajar sebenar."
                    : "You already have enough activity to turn this trial into a real study rhythm."}
              </h2>
              <div className="momentum-stack">
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Diselesaikan semasa percubaan" : "Completed during trial"}</span>
                  <strong>{sessionState.snapshot.completedCount} {locale === "ms" ? "misi" : "mission(s)"}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Bintang diperoleh" : "Stars earned"}</span>
                  <strong>{sessionState.snapshot.totalStars} {locale === "ms" ? "bintang" : "star(s)"}</strong>
                </div>
                <div className="momentum-item">
                  <span className="dashboard-label">{locale === "ms" ? "Rentak mingguan" : "Weekly rhythm"}</span>
                  <strong>{sessionState.snapshot.weeklyCompletedCount}/{sessionState.snapshot.weeklyTarget}</strong>
                </div>
              </div>
            </article>

            <article className="feature-panel alt">
              <p className="eyebrow">{locale === "ms" ? "Pelan terbaik seterusnya" : "Best next plan"}</p>
              <h2>{sessionState.snapshot.trialSummary.recommendedUpgradeLabel}</h2>
              <p className="dashboard-helper">{sessionState.snapshot.trialSummary.recommendedUpgradeHelper}</p>
              {sessionState.snapshot.trialSummary.weakestModuleName ? (
                <p className="dashboard-helper">
                  {locale === "ms" ? "Pembaikan seterusnya yang terbaik" : "Best next fix"}: {sessionState.snapshot.trialSummary.weakestModuleName}
                </p>
              ) : null}
              <div className="hero-actions">
                <a
                  className="btn btn-primary"
                  href={`/upgrade?plan=${sessionState.snapshot.trialSummary.recommendedUpgradePlanCode}`}
                >
                  {locale === "ms" ? "Teruskan dengan" : "Continue with"} {sessionState.snapshot.trialSummary.recommendedUpgradeLabel}
                </a>
                <a className="btn btn-secondary" href="/pricing">
                  {locale === "ms" ? "Lihat Keahlian" : "View Memberships"}
                </a>
              </div>
            </article>
          </div>
        </section>
      ) : null}

    </>
  );
}
