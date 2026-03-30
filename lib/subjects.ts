export type SubjectDefinition = {
  code: string;
  slug: string;
  name: string;
  group: string;
  access: string;
  summary: string;
  modules: {
    slug: string;
    name: string;
    summary: string;
    status: "ready" | "coming_soon" | "locked";
    lessonFormat: string;
    mission: string;
  }[];
  focusAreas: string[];
  weeklyFocus: {
    headline: string;
    headlineMs: string;
    why: string;
    whyMs: string;
    moduleSlug: string;
  };
  launchState: string;
  isCore: boolean;
  bundle: string;
};

export const subjectDefinitions: SubjectDefinition[] = [
  {
    code: "english",
    slug: "english",
    name: "English",
    group: "Core Language",
    access: "Included in Free trial and Language Pack",
    summary: "Writing, grammar, reading, and vocabulary for daily exam progress.",
    modules: [
      {
        slug: "writing-coach",
        name: "Writing Coach",
        summary: "Daily writing prompts, guided improvement, and clearer sentence-level coaching.",
        status: "ready",
        lessonFormat: "Prompt -> draft -> AI feedback -> revision",
        mission: "Write one short exam-style response and improve one weak sentence."
      },
      {
        slug: "grammar-lab",
        name: "Grammar Lab",
        summary: "Targeted grammar practice with mistake-focused feedback.",
        status: "ready",
        lessonFormat: "Targeted drill -> check -> explain -> retry",
        mission: "Clear one weak grammar pattern with fast repetition."
      },
      {
        slug: "reading-decoder",
        name: "Reading Decoder",
        summary: "Structured reading sets with skill-tagged feedback and review.",
        status: "ready",
        lessonFormat: "Short passage -> question set -> tactic feedback",
        mission: "Complete one short reading set and review the missed skill."
      },
      {
        slug: "vocabulary-builder",
        name: "Vocabulary Builder",
        summary: "Repeatable vocab growth with usage and recall support.",
        status: "ready",
        lessonFormat: "Word exposure -> usage -> recall -> sentence upgrade",
        mission: "Learn one usable word and apply it in one sentence."
      }
    ],
    focusAreas: ["Daily mission flow", "Skill-tagged feedback", "SPM-aligned revision"],
    weeklyFocus: {
      headline: "Sentence clarity",
      headlineMs: "Kejelasan ayat",
      why: "Clearer sentence flow helps essays sound stronger and more mature.",
      whyMs: "Aliran ayat yang lebih jelas membantu karangan berbunyi lebih kuat dan matang.",
      moduleSlug: "writing-coach"
    },
    launchState: "Core launch",
    isCore: true,
    bundle: "Language Pack"
  },
  {
    code: "bahasa_melayu",
    slug: "bahasa-melayu",
    name: "Bahasa Melayu",
    group: "Core Language",
    access: "Included in Free trial and Language Pack",
    summary: "Tatabahasa, pemahaman, and karangan coaching for stronger language mastery.",
    modules: [
      {
        slug: "tatabahasa",
        name: "Tatabahasa",
        summary: "Sentence correction, grammar confidence, and quick rule revision.",
        status: "ready",
        lessonFormat: "Error spotting -> correction -> quick rule review",
        mission: "Fix three sentence patterns and lock in one grammar rule."
      },
      {
        slug: "pemahaman-drill",
        name: "Pemahaman Drill",
        summary: "Reading and evidence-based answer practice for stronger comprehension.",
        status: "ready",
        lessonFormat: "Passage -> evidence finding -> answer review",
        mission: "Train evidence-based comprehension with short BM passages."
      },
      {
        slug: "karangan-coach",
        name: "Karangan Coach",
        summary: "Writing structure support with clearer idea development and flow.",
        status: "ready",
        lessonFormat: "Prompt -> outline -> write -> improve",
        mission: "Turn a simple karangan outline into a stronger full response."
      }
    ],
    focusAreas: ["Language confidence", "Revision rhythm", "Writing structure support"],
    weeklyFocus: {
      headline: "Ayat gramatis",
      headlineMs: "Ayat gramatis",
      why: "Stronger sentence structure supports both tatabahasa and karangan marks.",
      whyMs: "Struktur ayat yang lebih kuat membantu markah tatabahasa dan karangan.",
      moduleSlug: "tatabahasa"
    },
    launchState: "Core launch",
    isCore: true,
    bundle: "Language Pack"
  },
  {
    code: "sejarah",
    slug: "sejarah",
    name: "Sejarah",
    group: "Premium Humanities",
    access: "Included in Free trial and Humanities Pack",
    summary: "Fact recall, timelines, and source-based practice for exam confidence.",
    modules: [
      {
        slug: "timeline-recall",
        name: "Timeline Recall",
        summary: "Structured recall around events, sequences, and topic anchors.",
        status: "ready",
        lessonFormat: "Timeline view -> recall drill -> confidence check",
        mission: "Strengthen chronology recall before exam-style review."
      },
      {
        slug: "source-question-drill",
        name: "Source Question Drill",
        summary: "Practice reading and responding to source-based prompts.",
        status: "ready",
        lessonFormat: "Source reading -> answer plan -> response feedback",
        mission: "Build confidence with source-based exam questions."
      },
      {
        slug: "topic-revision-set",
        name: "Topic Revision Set",
        summary: "Focused revision packs across likely exam topics.",
        status: "ready",
        lessonFormat: "Topic recap -> targeted drill -> review summary",
        mission: "Revise one Sejarah topic with faster, more structured repetition."
      }
    ],
    focusAreas: ["Fact retention", "Chronology review", "Source-based answering"],
    weeklyFocus: {
      headline: "Fakta + huraian",
      headlineMs: "Fakta + huraian",
      why: "Students score better when facts are linked to a clearer explanation.",
      whyMs: "Pelajar skor lebih baik apabila fakta dihubungkan dengan huraian yang lebih jelas.",
      moduleSlug: "source-question-drill"
    },
    launchState: "Premium expansion",
    isCore: false,
    bundle: "Humanities Pack"
  },
  {
    code: "geografi",
    slug: "geografi",
    name: "Geografi",
    group: "Premium Humanities",
    access: "Included in Free trial and Humanities Pack",
    summary: "Map interpretation, data reading, and structured short-answer practice.",
    modules: [
      {
        slug: "map-and-data-drill",
        name: "Map and Data Drill",
        summary: "Interpretation practice using maps, charts, and data displays.",
        status: "ready",
        lessonFormat: "Visual data -> question set -> method review",
        mission: "Read maps and data more accurately under exam pressure."
      },
      {
        slug: "concept-review",
        name: "Concept Review",
        summary: "Topic breakdowns that sharpen understanding before revision sets.",
        status: "ready",
        lessonFormat: "Concept recap -> quick checks -> application",
        mission: "Solidify one weak Geografi concept before practice."
      },
      {
        slug: "short-answer-practice",
        name: "Short Answer Practice",
        summary: "Exam-style structured responses with clearer scaffolding.",
        status: "ready",
        lessonFormat: "Prompt -> structured response -> marking cues",
        mission: "Practice tighter short answers with clearer exam structure."
      }
    ],
    focusAreas: ["Map literacy", "Data interpretation", "Answer structure"],
    weeklyFocus: {
      headline: "Data reading",
      headlineMs: "Pembacaan data",
      why: "Reading maps and charts more clearly reduces vague Geografi answers.",
      whyMs: "Membaca peta dan carta dengan lebih jelas mengurangkan jawapan Geografi yang kabur.",
      moduleSlug: "map-and-data-drill"
    },
    launchState: "Premium expansion",
    isCore: false,
    bundle: "Humanities Pack"
  },
  {
    code: "math",
    slug: "math",
    name: "Math",
    group: "Premium Math",
    access: "Included in Free trial and Math Pack",
    summary: "Topic-based repetition with worked-solution guidance and error tracking.",
    modules: [
      {
        slug: "topic-practice",
        name: "Topic Practice",
        summary: "Focused drills by topic with clean revision loops.",
        status: "ready",
        lessonFormat: "Topic drill -> working check -> retry",
        mission: "Strengthen one Math topic through short repeated practice."
      },
      {
        slug: "worked-solution-review",
        name: "Worked Solution Review",
        summary: "Step-by-step breakdowns to reduce repeat mistakes.",
        status: "ready",
        lessonFormat: "Solution walkthrough -> error points -> recap",
        mission: "See where method mistakes happen and fix them early."
      },
      {
        slug: "error-pattern-tracker",
        name: "Error Pattern Tracker",
        summary: "Spot recurring errors and turn them into targeted revision.",
        status: "ready",
        lessonFormat: "Mistake log -> pattern summary -> suggested drills",
        mission: "Turn repeated errors into a smarter revision plan."
      }
    ],
    focusAreas: ["Topic mastery", "Mistake tracking", "Revision accuracy"],
    weeklyFocus: {
      headline: "Algebra steps",
      headlineMs: "Langkah algebra",
      why: "Cleaner algebra working reduces method mistakes across many topics.",
      whyMs: "Langkah algebra yang lebih kemas mengurangkan kesilapan kaedah dalam banyak topik.",
      moduleSlug: "topic-practice"
    },
    launchState: "Premium expansion",
    isCore: false,
    bundle: "Math Pack"
  },
  {
    code: "add_math",
    slug: "add-math",
    name: "Add Math",
    group: "Premium Math",
    access: "Included in Free trial and Math Pack",
    summary: "Higher-difficulty, step-checked practice for stronger analytical performance.",
    modules: [
      {
        slug: "step-check-drill",
        name: "Step Check Drill",
        summary: "Catch working mistakes before they become repeated habits.",
        status: "ready",
        lessonFormat: "Step review -> correctness check -> recap",
        mission: "Improve working precision on higher-difficulty questions."
      },
      {
        slug: "advanced-revision-set",
        name: "Advanced Revision Set",
        summary: "Higher-difficulty practice designed for stronger exam readiness.",
        status: "locked",
        lessonFormat: "Advanced set -> review -> retry",
        mission: "Build confidence with harder Add Math question types."
      },
      {
        slug: "function-and-algebra-practice",
        name: "Function and Algebra Practice",
        summary: "Repeated exposure to foundational advanced topics.",
        status: "locked",
        lessonFormat: "Topic focus -> drill -> explanation",
        mission: "Strengthen function and algebra fluency through repetition."
      }
    ],
    focusAreas: ["Step precision", "Advanced topics", "Higher difficulty confidence"],
    weeklyFocus: {
      headline: "Step precision",
      headlineMs: "Ketepatan langkah",
      why: "One clean step at a time builds confidence on harder Add Math questions.",
      whyMs: "Satu langkah yang tepat pada satu masa membina keyakinan untuk soalan Add Math yang lebih sukar.",
      moduleSlug: "step-check-drill"
    },
    launchState: "Premium expansion",
    isCore: false,
    bundle: "Math Pack"
  }
];

export function getSubjectBySlug(slug: string) {
  return subjectDefinitions.find((subject) => subject.slug === slug) || null;
}

export function getModuleBySlugs(subjectSlug: string, moduleSlug: string) {
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) return null;

  const module = subject.modules.find((item) => item.slug === moduleSlug) || null;
  if (!module) return null;

  return { subject, module };
}
