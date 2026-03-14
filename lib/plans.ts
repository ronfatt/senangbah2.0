export type PlanDefinition = {
  code: string;
  name: string;
  priceLabel: string;
  priceCents: number;
  detail: string;
  points: string[];
};

export const planDefinitions: PlanDefinition[] = [
  {
    code: "trial_full_access",
    name: "7-Day Full Trial",
    priceLabel: "RM0",
    priceCents: 0,
    detail: "Every new user gets full access across all six subjects for seven days.",
    points: ["All subject hubs open", "Premium modules visible", "Guided trial journey"]
  },
  {
    code: "free",
    name: "Free",
    priceLabel: "RM0",
    priceCents: 0,
    detail: "Users return here after trial expiry, with a smaller but still useful experience.",
    points: ["Dashboard and progress", "Starter English and BM tasks", "Ongoing access without full lockout"]
  },
  {
    code: "language_pack",
    name: "Language Pack",
    priceLabel: "RM29",
    priceCents: 2900,
    detail: "English and Bahasa Melayu as the strongest everyday study bundle.",
    points: ["English modules", "Bahasa Melayu modules", "Richer language feedback"]
  },
  {
    code: "humanities_pack",
    name: "Humanities Pack",
    priceLabel: "RM19",
    priceCents: 1900,
    detail: "Exam-focused support for content-heavy revision subjects.",
    points: ["Sejarah modules", "Geografi modules", "Structured review and recall"]
  },
  {
    code: "math_pack",
    name: "Math Pack",
    priceLabel: "RM19",
    priceCents: 1900,
    detail: "Step-based support for Math and Add Math improvement.",
    points: ["Math modules", "Add Math modules", "Mistake-pattern practice"]
  },
  {
    code: "all_access",
    name: "All Access",
    priceLabel: "RM59",
    priceCents: 5900,
    detail: "The full SenangBah 2.0 experience across all current subject bundles.",
    points: ["All six subjects", "Best value for serious students", "Strongest premium path"]
  }
];
