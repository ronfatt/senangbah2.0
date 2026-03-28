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
      totalModules: subject.modules.length,
      completedCount: modulesForSubject.filter((module) => module.attemptsCount > 0).length,
      readyCount: subject.modules.filter((module) => module.status === "ready").length,
      masteryPercent: modulesForSubject.length ? averageMastery(modulesForSubject) : 0,
      nextLabel:
        bestNext?.name ||
        firstModule?.name ||
        (locale === "ms" ? "Buka subjek" : "Open subject"),
      nextHref: bestNext?.href || `/subjects/${subject.slug}/${firstModule?.slug || ""}`
    };
  });

  const journeyCards =
    sessionState.status === "signed_in" && sessionState.snapshot
      ? [
          {
            title: locale === "ms" ? "Kemajuan anda" : "Your progress",
            helper:
              locale === "ms"
                ? "Lihat penguasaan, bahagian lemah, dan langkah AI yang seterusnya."
                : "See mastery, weak areas, and your next AI-guided fixes.",
            href: "/progress",
            tone: "tone-progress",
            icon: "↗"
          },
          {
            title: locale === "ms" ? "Sasaran mingguan" : "Weekly goals",
            helper:
              locale === "ms"
                ? `${sessionState.snapshot.weeklyCompletedCount}/${sessionState.snapshot.weeklyTarget} misi selesai minggu ini.`
                : `${sessionState.snapshot.weeklyCompletedCount}/${sessionState.snapshot.weeklyTarget} missions completed this week.`,
            href: leadMission?.href || "/my-subjects",
            tone: "tone-goals",
            icon: "◫"
          },
          {
            title: locale === "ms" ? "Pencapaian" : "Achievements",
            helper:
              locale === "ms"
                ? `${sessionState.snapshot.unlockedAchievementCount} lencana dibuka dan almari ganjaran sedang berkembang.`
                : `${sessionState.snapshot.unlockedAchievementCount} badges unlocked and your reward closet is growing.`,
            href: "/avatar",
            tone: "tone-achievements",
            icon: "✦"
          },
          {
            title: locale === "ms" ? "Keahlian aktif" : "Upcoming live",
            helper:
              locale === "ms"
                ? `Pelan semasa: ${sessionState.snapshot.membershipLabel}.`
                : `Current plan: ${sessionState.snapshot.membershipLabel}.`,
            href: "/pricing",
            tone: "tone-live",
            icon: "◎"
          },
          {
            title: locale === "ms" ? "Pelan belajar" : "Study plan",
            helper:
              locale === "ms"
                ? `Fokus seterusnya: ${sessionState.snapshot.nextFocus}.`
                : `Next focus: ${sessionState.snapshot.nextFocus}.`,
            href: "/my-subjects",
            tone: "tone-plan",
            icon: "⚡"
          }
        ]
      : [];

  return (
    <>
      {sessionState.status !== "signed_in" || !sessionState.snapshot ? (
        <section className="dashboard-v3-signed-out">
          <div className="dashboard-v3-signed-out-card">
            <p className="eyebrow">{locale === "ms" ? "Dashboard pelajar" : "Student dashboard"}</p>
            <h1>{locale === "ms" ? "Log masuk untuk lihat misi, kemajuan, dan subjek anda." : "Log in to see your missions, progress, and subjects."}</h1>
            <p className="dashboard-helper">
              {sessionState.status === "env_missing"
                ? locale === "ms"
                  ? "Env Supabase tiada. UI auth sudah tersedia tetapi belum disambungkan."
                  : "Supabase env missing. Auth UI is scaffolded but not connected yet."
                : locale === "ms"
                  ? "Satu dashboard yang jelas: misi hari ini, laporan kemajuan, dan keenam-enam subjek anda."
                  : "One clear dashboard for today’s mission, your progress report, and all six subjects."}
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/login">
                {locale === "ms" ? "Log masuk" : "Login"}
              </a>
              <a className="btn btn-secondary" href="/register">
                {locale === "ms" ? "Mula percubaan percuma" : "Start free trial"}
              </a>
            </div>
          </div>
        </section>
      ) : (
        <div className="dashboard-v3">
          {showBillingSuccess ? (
            <section className="dashboard-v3-billing">
              <div className="dashboard-v3-billing-card">
                <div>
                  <p className="eyebrow">{locale === "ms" ? "Pembayaran berjaya" : "Payment success"}</p>
                  <h2>{locale === "ms" ? `${billingPlanDefinition?.name} kini aktif.` : `${billingPlanDefinition?.name} is now active.`}</h2>
                  <p className="dashboard-helper">
                    {locale === "ms"
                      ? "Akses baru anda sudah dibuka. Teruskan dari subjek anda atau lihat laporan kemajuan untuk semak peningkatan seterusnya."
                      : "Your new access is live. Continue from your subjects or open the report to see the next improvement path."}
                  </p>
                </div>
                <a className="btn btn-secondary" href={postPaymentHref}>
                  {locale === "ms" ? "Buka sekarang" : "Open now"}
                </a>
              </div>
            </section>
          ) : null}

          <section className="dashboard-v3-hero">
            <p className="dashboard-v3-welcome">{locale === "ms" ? "Selamat kembali!" : "Welcome back!"}</p>
            <h1>{locale === "ms" ? "Dashboard" : "Dashboard"} 🎯</h1>
            <p className="dashboard-v3-hero-copy">
              {sessionState.snapshot.displayName
                ? locale === "ms"
                  ? `${sessionState.snapshot.displayName}, hari ini anda boleh fokus pada satu misi, semak data anda, dan pilih subjek seterusnya dengan jelas.`
                  : `${sessionState.snapshot.displayName}, today you can focus on one mission, improve your data, and choose the next subject clearly.`
                : locale === "ms"
                  ? "Hari ini anda boleh fokus pada satu misi, semak data anda, dan pilih subjek seterusnya dengan jelas."
                  : "Today you can focus on one mission, improve your data, and choose the next subject clearly."}
            </p>
            <div className="dashboard-v3-hero-actions">
              <a className="btn btn-primary" href="/progress">
                {locale === "ms" ? "Buka Laporan Kemajuan" : "Open Progress Report"}
              </a>
              <a className="btn btn-secondary" href="/my-subjects">
                {locale === "ms" ? "Buka Subjek Saya" : "Open My Subjects"}
              </a>
            </div>
          </section>

          <section className="dashboard-v3-summary-grid">
            <article className="dashboard-v3-summary-card tone-blue">
              <div className="dashboard-v3-summary-head">
                <div>
                  <p className="dashboard-label">{locale === "ms" ? "Misi mingguan" : "Weekly missions"}</p>
                  <span className="dashboard-v3-status">{locale === "ms" ? "Sedia" : "Ready"}</span>
                </div>
                <span className="dashboard-v3-icon-box tone-blue">◎</span>
              </div>
              <h2>{sessionState.snapshot.weeklyTarget}</h2>
              <p className="dashboard-v3-summary-title">
                {locale === "ms" ? "misi minggu ini" : "weekly missions"}
              </p>
              <p className="dashboard-helper">
                {locale === "ms"
                  ? `${sessionState.snapshot.weeklyCompletedCount} selesai · ${sessionState.snapshot.todayStartedCount} sedang berjalan · fokus seterusnya ${sessionState.snapshot.nextFocus}`
                  : `${sessionState.snapshot.weeklyCompletedCount} done · ${sessionState.snapshot.todayStartedCount} in progress · next focus ${sessionState.snapshot.nextFocus}`}
              </p>
              <div className="dashboard-v3-action-row">
                {leadMission ? (
                  <a className="dashboard-v3-action-primary tone-blue" href={leadMission.href}>
                    {locale === "ms" ? "Buka Misi" : "Open Mission"}
                  </a>
                ) : null}
                <a className="dashboard-v3-action-secondary" href="/progress">
                  {locale === "ms" ? "Kekalkan Momentum" : "Keep Momentum"}
                </a>
              </div>
            </article>

            <article className="dashboard-v3-summary-card tone-pink">
              <div className="dashboard-v3-summary-head">
                <div>
                  <p className="dashboard-label">{locale === "ms" ? "Mata misi" : "Mission points"}</p>
                  <span className="dashboard-v3-status dashboard-v3-status-warm">{locale === "ms" ? "Baru" : "New"}</span>
                </div>
                <span className="dashboard-v3-icon-box tone-pink">✦</span>
              </div>
              <h2>{closetSummary?.availablePoints ?? sessionState.snapshot.totalStarPoints} pts</h2>
              <p className="dashboard-v3-summary-title">
                {locale === "ms" ? "sedia dibelanjakan" : "ready to spend"}
              </p>
              <p className="dashboard-helper">
                {locale === "ms"
                  ? `Peringkat ${sessionState.snapshot.rank} · ${sessionState.snapshot.unlockedAchievementCount} lencana dibuka · ${sessionState.snapshot.totalStars} bintang terkumpul`
                  : `${sessionState.snapshot.rank} rank · ${sessionState.snapshot.unlockedAchievementCount} badges unlocked · ${sessionState.snapshot.totalStars} stars collected`}
              </p>
              <div className="dashboard-v3-action-row">
                <a className="dashboard-v3-action-primary tone-pink" href="/avatar">
                  {locale === "ms" ? "Buka Ganjaran" : "Open Rewards"}
                </a>
                <a className="dashboard-v3-action-secondary" href="/pricing">
                  {locale === "ms" ? "Lihat Keahlian" : "More Membership"}
                </a>
              </div>
            </article>
          </section>

          <section className="dashboard-v3-journey">
            <div className="dashboard-v3-section-copy">
              <p className="eyebrow">{locale === "ms" ? "Jejaki perjalanan anda" : "Track your journey"}</p>
              <h2>{locale === "ms" ? "Pantau kemajuan, ganjaran, dan langkah seterusnya." : "Monitor your progress, achievements, and upcoming activities."}</h2>
            </div>

            <div className="dashboard-v3-journey-list">
              {journeyCards.map((card) => (
                <a className={`dashboard-v3-journey-card ${card.tone}`} href={card.href} key={card.title}>
                  <span className={`dashboard-v3-icon-box ${card.tone}`}>{card.icon}</span>
                  <div className="dashboard-v3-journey-copy">
                    <h3>{card.title}</h3>
                    <p>{card.helper}</p>
                  </div>
                  <span className="dashboard-v3-arrow">›</span>
                </a>
              ))}
            </div>
          </section>

          <section className="dashboard-v3-subjects">
            <div className="dashboard-v3-section-copy">
              <p className="eyebrow">{locale === "ms" ? "Subjek anda" : "Your subjects"}</p>
              <h2>{locale === "ms" ? "Pilih subjek dahulu, kemudian terus ke satu misi yang jelas." : "Choose a subject first, then jump into one clear mission."}</h2>
            </div>

            <div className="dashboard-v3-subject-grid">
              {subjectLanes.map((subject) => (
                <article className={`dashboard-v3-subject-card ${subject.tone}`} key={subject.code}>
                  <div className="dashboard-v3-subject-head">
                    <div>
                      <div className="dashboard-v3-subject-meta">
                        <span className="dashboard-label">{subject.bundle}</span>
                        <span className="dashboard-v3-status">{locale === "ms" ? (subject.unlocked ? "Sedia" : "Terkunci") : subject.unlocked ? "Ready" : "Locked"}</span>
                      </div>
                      <h3>{subject.name}</h3>
                    </div>
                    <span className={`dashboard-v3-icon-box ${subject.tone}`}>{subject.iconLabel}</span>
                  </div>

                  <p className="dashboard-helper">{subject.summary}</p>

                  <div className="dashboard-v3-metrics">
                    <div>
                      <span className="dashboard-label">{locale === "ms" ? "Jumlah modul" : "Total modules"}</span>
                      <strong>{subject.totalModules}</strong>
                    </div>
                    <div>
                      <span className="dashboard-label">{locale === "ms" ? "Selesai" : "Completed"}</span>
                      <strong>{subject.completedCount}</strong>
                    </div>
                    <div>
                      <span className="dashboard-label">{locale === "ms" ? "Penguasaan" : "Mastery"}</span>
                      <strong>{subject.masteryPercent}%</strong>
                    </div>
                  </div>

                  <div className="dashboard-v3-start-block">
                    <span className="dashboard-label">{locale === "ms" ? "Mula dari" : "Start from"}</span>
                    <strong>{subject.nextLabel}</strong>
                  </div>

                  <div className="dashboard-v3-action-row">
                    <a className={`dashboard-v3-action-primary ${subject.tone}`} href={subject.unlocked ? subject.nextHref : "/pricing"}>
                      {subject.unlocked
                        ? locale === "ms"
                          ? "Mula Pelajaran"
                          : "Start Lesson"
                        : locale === "ms"
                          ? "Lihat Keahlian"
                          : "View Memberships"}
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
      )}
    </>
  );
}
