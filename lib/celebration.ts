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

const LEARNING_FEEDBACK_MAP: Record<
  string,
  {
    strong: string;
    mid: string;
    starter: string;
  }
> = {
  "english/writing-coach": {
    strong: "Your writing sounded clearer and more controlled this round.",
    mid: "Your ideas are getting easier to follow. Keep tightening the sentence flow.",
    starter: "You started turning raw ideas into clearer written lines."
  },
  "english/grammar-lab": {
    strong: "Your grammar control looked steadier here, especially on sentence accuracy.",
    mid: "You are starting to spot weak grammar patterns faster.",
    starter: "You just trained one grammar pattern instead of guessing through it."
  },
  "english/reading-decoder": {
    strong: "Your reading choices showed stronger evidence control this round.",
    mid: "You are getting better at linking the answer back to the passage.",
    starter: "You started building a clearer reading habit instead of rushing the passage."
  },
  "english/vocabulary-builder": {
    strong: "Your word choice is starting to sound stronger and more usable.",
    mid: "You are moving beyond basic words and building better sentence power.",
    starter: "You added one more usable word to your active writing bank."
  },
  "bahasa-melayu/tatabahasa": {
    strong: "Tatabahasa control looked cleaner, with fewer shaky sentence choices.",
    mid: "Anda semakin cepat nampak pola kesalahan tatabahasa yang lemah.",
    starter: "Anda baru mula menguatkan satu pola tatabahasa penting."
  },
  "bahasa-melayu/pemahaman-drill": {
    strong: "Pemahaman anda nampak lebih tepat dan lebih dekat pada bukti petikan.",
    mid: "Anda semakin baik memilih jawapan berdasarkan isi petikan.",
    starter: "Anda mula bina cara jawab pemahaman dengan lebih teratur."
  },
  "bahasa-melayu/karangan-coach": {
    strong: "Karangan anda terasa lebih tersusun dan lebih yakin kali ini.",
    mid: "Aliran idea anda semakin jelas. Teruskan kemaskan sambungan ayat.",
    starter: "Anda mula tukar isi ringkas kepada karangan yang lebih jelas."
  },
  "sejarah/timeline-recall": {
    strong: "Your chronology recall looked more secure this round.",
    mid: "You are starting to lock events into the right sequence.",
    starter: "You began turning loose facts into a clearer timeline."
  },
  "sejarah/source-question-drill": {
    strong: "Your source reading looked sharper and more exam-ready.",
    mid: "You are getting better at pulling meaning out of short historical sources.",
    starter: "You started building confidence with source-based Sejarah questions."
  },
  "sejarah/topic-revision-set": {
    strong: "Your topic recall looked steadier and more structured here.",
    mid: "You are revising with more control instead of random guessing.",
    starter: "You gave this topic a first solid revision signal."
  },
  "geografi/map-and-data-drill": {
    strong: "Your data reading looked more accurate and more calm this round.",
    mid: "You are starting to read maps and figures with better discipline.",
    starter: "You began building confidence with Geografi data questions."
  },
  "geografi/concept-review": {
    strong: "Your concept understanding looked more stable here.",
    mid: "You are getting clearer on one weak Geografi idea at a time.",
    starter: "You started turning a weak concept into something more usable."
  },
  "geografi/short-answer-practice": {
    strong: "Your short answer looked more structured and easier to mark.",
    mid: "You are starting to organise points more clearly in your response.",
    starter: "You began shaping Geografi answers with better structure."
  },
  "math/topic-practice": {
    strong: "Your Math topic control looked cleaner and more accurate here.",
    mid: "You are starting to steady your method on this topic.",
    starter: "You began building one stronger Math topic lane."
  },
  "math/worked-solution-review": {
    strong: "You spotted method mistakes faster this round.",
    mid: "You are getting better at checking where the working first went wrong.",
    starter: "You started training yourself to notice method slips earlier."
  },
  "math/error-pattern-tracker": {
    strong: "Your revision thinking looked sharper because you caught the mistake pattern.",
    mid: "You are beginning to recognise repeat errors instead of repeating them blindly.",
    starter: "You took one useful step toward smarter Math revision."
  },
  "add-math/step-check-drill": {
    strong: "Your Add Math working looked more precise this round.",
    mid: "You are starting to protect the working steps before they break down.",
    starter: "You began tightening your step accuracy on harder questions."
  }
};

export function getLearningFeedback({
  subjectSlug,
  moduleSlug,
  stars,
  accuracyPercent
}: {
  subjectSlug: string;
  moduleSlug: string;
  stars: number;
  accuracyPercent: number;
}) {
  const feedback = LEARNING_FEEDBACK_MAP[`${subjectSlug}/${moduleSlug}`];
  const level = stars >= 3 || accuracyPercent >= 85 ? "strong" : stars === 2 || accuracyPercent >= 65 ? "mid" : "starter";

  const focus =
    accuracyPercent >= 80
      ? "Keep this pace and push one harder mission next."
      : accuracyPercent >= 60
        ? "One slower check before submit will turn this into a stronger result."
        : "Take the next mission calmly and focus on one weak detail at a time.";

  return {
    headline: feedback?.[level] || "You just turned one short mission into a real learning signal.",
    focus
  };
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
