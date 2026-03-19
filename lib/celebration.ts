export function getMasteryGain({
  stars,
  accuracyPercent
}: {
  stars: number;
  accuracyPercent: number;
}) {
  return Math.max(6, Math.min(18, Math.round(stars * 3 + accuracyPercent / 12)));
}

export function getBadgeNudge({
  stars,
  accuracyPercent
}: {
  stars: number;
  accuracyPercent: number;
}) {
  if (stars >= 3) {
    return "Big step toward Star Collector and Sharp Shot.";
  }

  if (accuracyPercent >= 70) {
    return "Steady progress toward Weekly Climber and stronger mastery.";
  }

  return "Every completed mission still pushes First Win and Streak Starter forward.";
}

export function getRewardTone(stars: number) {
  if (stars >= 3) return "epic";
  if (stars === 2) return "strong";
  return "starter";
}

export function getRewardHeadline(stars: number) {
  if (stars >= 3) return "Huge win. That one felt premium.";
  if (stars === 2) return "Strong result. Keep the rhythm going.";
  return "Solid step. Keep stacking small wins.";
}

const NEXT_STEP_MAP: Record<
  string,
  {
    href: string;
    label: string;
    helper: string;
  }
> = {
  "english/writing-coach": {
    href: "/subjects/english/grammar-lab",
    label: "Next: Grammar Lab",
    helper: "Lock in sentence control while this English momentum is still warm."
  },
  "english/grammar-lab": {
    href: "/subjects/english/reading-decoder",
    label: "Next: Reading Decoder",
    helper: "Carry this accuracy into a reading set right away."
  },
  "english/reading-decoder": {
    href: "/subjects/english/vocabulary-builder",
    label: "Next: Vocabulary Builder",
    helper: "Finish the English loop with one fast vocabulary set."
  },
  "english/vocabulary-builder": {
    href: "/dashboard",
    label: "Back to dashboard",
    helper: "Check your updated stars, points, and strongest English lane."
  },
  "bahasa-melayu/tatabahasa": {
    href: "/subjects/bahasa-melayu/pemahaman-drill",
    label: "Next: Pemahaman Drill",
    helper: "Move from rule memory into passage understanding."
  },
  "bahasa-melayu/pemahaman-drill": {
    href: "/subjects/bahasa-melayu/karangan-coach",
    label: "Next: Karangan Coach",
    helper: "Turn the reading flow into short written expression."
  },
  "bahasa-melayu/karangan-coach": {
    href: "/dashboard",
    label: "Back to dashboard",
    helper: "See how BM progress changed after this writing result."
  }
};

export function getNextStep({
  subjectSlug,
  moduleSlug
}: {
  subjectSlug: string;
  moduleSlug: string;
}) {
  return (
    NEXT_STEP_MAP[`${subjectSlug}/${moduleSlug}`] || {
      href: "/dashboard",
      label: "Back to dashboard",
      helper: "Your latest result is already feeding points, mastery, and streak progress."
    }
  );
}
