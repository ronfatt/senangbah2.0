export type Achievement = {
  code: string;
  title: string;
  icon: string;
  helper: string;
  unlocked: boolean;
  progressPercent: number;
};

export const achievementCatalog = [
  {
    code: "first_win",
    title: "First Win",
    icon: "★",
    helper: "Complete the first mission and start your star trail."
  },
  {
    code: "streak_starter",
    title: "Streak Starter",
    icon: "⚡",
    helper: "Learn for 3 days in a row to wake up your streak."
  },
  {
    code: "star_collector",
    title: "Star Collector",
    icon: "✦",
    helper: "Collect 12 stars across any subject pack."
  },
  {
    code: "weekly_climber",
    title: "Weekly Climber",
    icon: "⬆",
    helper: "Finish 5 missions in a single week."
  },
  {
    code: "sharp_shot",
    title: "Sharp Shot",
    icon: "◎",
    helper: "Reach 85% average accuracy to unlock precision mode."
  },
  {
    code: "subject_explorer",
    title: "Subject Explorer",
    icon: "▲",
    helper: "Open 4 learning lanes and build a wider rhythm."
  }
] as const;

export function getAchievementTitle(code: string | null | undefined) {
  return achievementCatalog.find((achievement) => achievement.code === code)?.title || null;
}

export function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getMonday(date: Date) {
  const result = new Date(date);
  const day = result.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setUTCDate(result.getUTCDate() + diff);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

export function computeStreak(activeDates: string[]) {
  const activeSet = new Set(activeDates);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let streak = 0;
  for (let cursor = new Date(today); ; cursor.setUTCDate(cursor.getUTCDate() - 1)) {
    const key = formatDateOnly(cursor);
    if (!activeSet.has(key)) break;
    streak += 1;
  }

  return streak;
}

export function buildAchievements({
  completedCount,
  totalStars,
  streakDays,
  weeklyCompletedCount,
  averageAccuracy,
  unlockedCount
}: {
  completedCount: number;
  totalStars: number;
  streakDays: number;
  weeklyCompletedCount: number;
  averageAccuracy: number;
  unlockedCount: number;
}): Achievement[] {
  const normalizePercent = (value: number, max: number) => Math.min(100, Math.round((value / max) * 100));

  return [
    {
      code: "first_win",
      title: "First Win",
      icon: "★",
      helper: "Complete the first mission and start your star trail.",
      unlocked: completedCount >= 1,
      progressPercent: normalizePercent(completedCount, 1)
    },
    {
      code: "streak_starter",
      title: "Streak Starter",
      icon: "⚡",
      helper: "Learn for 3 days in a row to wake up your streak.",
      unlocked: streakDays >= 3,
      progressPercent: normalizePercent(streakDays, 3)
    },
    {
      code: "star_collector",
      title: "Star Collector",
      icon: "✦",
      helper: "Collect 12 stars across any subject pack.",
      unlocked: totalStars >= 12,
      progressPercent: normalizePercent(totalStars, 12)
    },
    {
      code: "weekly_climber",
      title: "Weekly Climber",
      icon: "⬆",
      helper: "Finish 5 missions in a single week.",
      unlocked: weeklyCompletedCount >= 5,
      progressPercent: normalizePercent(weeklyCompletedCount, 5)
    },
    {
      code: "sharp_shot",
      title: "Sharp Shot",
      icon: "◎",
      helper: "Reach 85% average accuracy to unlock precision mode.",
      unlocked: averageAccuracy >= 85 && completedCount >= 3,
      progressPercent:
        completedCount >= 3 ? normalizePercent(averageAccuracy, 85) : normalizePercent(completedCount, 3)
    },
    {
      code: "subject_explorer",
      title: "Subject Explorer",
      icon: "▲",
      helper: "Open 4 learning lanes and build a wider rhythm.",
      unlocked: unlockedCount >= 4,
      progressPercent: normalizePercent(unlockedCount, 4)
    }
  ];
}
