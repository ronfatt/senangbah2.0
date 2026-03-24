import { notFound } from "next/navigation";
import { GeografiShortAnswerPractice } from "../../../../components/geografi-short-answer-practice";
import { KaranganCoachPractice } from "../../../../components/karangan-coach-practice";
import { ModuleActionPanel } from "../../../../components/module-action-panel";
import { ObjectivePractice } from "../../../../components/objective-practice";
import { SubjectModuleAccessGate } from "../../../../components/subject-module-access-gate";
import { VocabularyBuilderPractice } from "../../../../components/vocabulary-builder-practice";
import { WritingCoachPractice } from "../../../../components/writing-coach-practice";
import {
  addMathStepCheckQuestions,
  errorPatternTrackerQuestions,
  geografiConceptReviewQuestions,
  geografiMapDataQuestions,
  getObjectiveQuestionSet,
  grammarLabQuestions,
  mathTopicPracticeQuestions,
  pemahamanQuestions,
  readingDecoderQuestions,
  sejarahSourceQuestions,
  sejarahTopicRevisionQuestions,
  sejarahTimelineQuestions,
  tatabahasaQuestions,
  workedSolutionReviewQuestions
} from "../../../../lib/practice-content";
import { getModuleBySlugs, subjectDefinitions } from "../../../../lib/subjects";

export function generateStaticParams() {
  return subjectDefinitions.flatMap((subject) =>
    subject.modules
      .filter((module) => module.status === "ready")
      .map((module) => ({
        slug: subject.slug,
        moduleSlug: module.slug
      }))
  );
}

export default async function SubjectModulePage({
  params
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug, moduleSlug } = await params;
  const result = getModuleBySlugs(slug, moduleSlug);

  if (!result) {
    notFound();
  }

  const { subject, module } = result;
  const rotatingSet = getObjectiveQuestionSet(subject.code, module.slug);

  if (module.status !== "ready") {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="subject-hero">
        <div className="subject-hero-copy">
          <p className="eyebrow">{subject.name}</p>
          <h1 className="dashboard-title">{module.name}</h1>
          <p className="hero-text">{module.summary}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#practice-task">
              Start mission
            </a>
            <a className="btn btn-secondary" href={`/subjects/${subject.slug}`}>
              Back to {subject.name}
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <p className="panel-label">Today&apos;s task</p>
          <h2>{module.lessonFormat}</h2>
          <p className="hero-text">{module.mission}</p>
        </div>
      </section>

      <section className="section section-split practice-intro-grid">
        <article className="feature-panel">
          <p className="eyebrow">What to do</p>
          <h2>Finish one short mission and get instant feedback.</h2>
          <ul className="feature-list">
            <li>Read the task first</li>
            <li>Answer or write clearly</li>
            <li>Check the result and follow the next step</li>
          </ul>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">What you get</p>
          <h2>One mission updates your stars, points, and progress.</h2>
          <ul className="feature-list">
            <li>AI-style feedback</li>
            <li>Progress back to dashboard</li>
            <li>Clear next move after you finish</li>
          </ul>
        </article>
      </section>

      <SubjectModuleAccessGate
        bundle={subject.bundle}
        isCore={subject.isCore}
        subjectCode={subject.code}
        subjectName={subject.name}
      >
      <div id="practice-task">
      {subject.slug === "english" && module.slug === "writing-coach" ? (
        <section className="section">
          <WritingCoachPractice />
        </section>
      ) : subject.slug === "english" && module.slug === "grammar-lab" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Live practice"
            helper="3 questions. Fast checking. One dashboard update."
            moduleSlug="grammar-lab"
            questions={rotatingSet?.questions || grammarLabQuestions}
            setLabel={rotatingSet?.label}
            subjectSlug="english"
            submitLabel="Submit Grammar Set"
            title="Grammar Lab Quick Set"
          />
        </section>
      ) : subject.slug === "bahasa-melayu" && module.slug === "tatabahasa" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Latihan sebenar"
            helper="3 soalan tatabahasa. Semak pantas. Kemaskini terus ke dashboard."
            moduleSlug="tatabahasa"
            questions={rotatingSet?.questions || tatabahasaQuestions}
            setLabel={rotatingSet?.label}
            subjectSlug="bahasa-melayu"
            submitLabel="Hantar Set Tatabahasa"
            title="Tatabahasa Quick Set"
          />
        </section>
      ) : subject.slug === "bahasa-melayu" && module.slug === "pemahaman-drill" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Latihan pemahaman"
            helper="Petikan pendek, 3 soalan, dan satu keputusan pemahaman yang terus disimpan."
            moduleSlug="pemahaman-drill"
            questions={rotatingSet?.questions || pemahamanQuestions}
            setLabel={rotatingSet?.label}
            subjectSlug="bahasa-melayu"
            submitLabel="Hantar Set Pemahaman"
            title="Pemahaman Mini Passage"
          />
        </section>
      ) : subject.slug === "bahasa-melayu" && module.slug === "karangan-coach" ? (
        <section className="section">
          <KaranganCoachPractice />
        </section>
      ) : subject.slug === "sejarah" && module.slug === "timeline-recall" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Latihan sejarah"
            helper="3 soalan recall kronologi untuk membina keyakinan menjawab topik asas Sejarah."
            moduleSlug="timeline-recall"
            questions={sejarahTimelineQuestions}
            subjectSlug="sejarah"
            submitLabel="Hantar Set Timeline"
            title="Timeline Recall Mini Set"
          />
        </section>
      ) : subject.slug === "sejarah" && module.slug === "source-question-drill" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Latihan sumber sejarah"
            helper="Baca satu sumber ringkas, jawab 3 soalan, dan bina keyakinan untuk source-based response."
            moduleSlug="source-question-drill"
            questions={sejarahSourceQuestions}
            subjectSlug="sejarah"
            submitLabel="Hantar Set Sumber"
            title="Source Question Drill Mini Set"
          />
        </section>
      ) : subject.slug === "sejarah" && module.slug === "topic-revision-set" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Ulang kaji sejarah"
            helper="Baca recap ringkas satu topik, jawab 3 soalan, dan simpan satu signal revision ke dashboard."
            moduleSlug="topic-revision-set"
            questions={sejarahTopicRevisionQuestions}
            subjectSlug="sejarah"
            submitLabel="Hantar Set Ulang Kaji"
            title="Topic Revision Set Mini Drill"
          />
        </section>
      ) : subject.slug === "geografi" && module.slug === "map-and-data-drill" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Latihan geografi"
            helper="Baca data ringkas, tafsir maklumat, dan simpan satu keputusan premium ke dashboard."
            moduleSlug="map-and-data-drill"
            questions={geografiMapDataQuestions}
            subjectSlug="geografi"
            submitLabel="Hantar Set Data"
            title="Map and Data Drill Mini Set"
          />
        </section>
      ) : subject.slug === "geografi" && module.slug === "concept-review" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Konsep geografi"
            helper="Semak satu konsep utama, jawab 3 soalan, dan bina semula keyakinan topik asas."
            moduleSlug="concept-review"
            questions={geografiConceptReviewQuestions}
            subjectSlug="geografi"
            submitLabel="Hantar Set Konsep"
            title="Concept Review Mini Set"
          />
        </section>
      ) : subject.slug === "geografi" && module.slug === "short-answer-practice" ? (
        <section className="section">
          <GeografiShortAnswerPractice />
        </section>
      ) : subject.slug === "math" && module.slug === "topic-practice" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Math practice"
            helper="3 quick topic questions to start building Math Pack usage and progress data."
            moduleSlug="topic-practice"
            questions={mathTopicPracticeQuestions}
            subjectSlug="math"
            submitLabel="Submit Math Set"
            title="Topic Practice Mini Set"
          />
        </section>
      ) : subject.slug === "math" && module.slug === "worked-solution-review" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Worked solution review"
            helper="Spot the first mistake, correct the method, and save one cleaner Math result."
            moduleSlug="worked-solution-review"
            questions={workedSolutionReviewQuestions}
            subjectSlug="math"
            submitLabel="Submit Worked Solution Set"
            title="Worked Solution Review Mini Set"
          />
        </section>
      ) : subject.slug === "math" && module.slug === "error-pattern-tracker" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Error pattern review"
            helper="Read a short mistake log, identify the pattern, and turn it into a smarter Math next step."
            moduleSlug="error-pattern-tracker"
            questions={errorPatternTrackerQuestions}
            subjectSlug="math"
            submitLabel="Submit Error Pattern Set"
            title="Error Pattern Tracker Mini Set"
          />
        </section>
      ) : subject.slug === "add-math" && module.slug === "step-check-drill" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Add Math practice"
            helper="3 higher-difficulty checks to train cleaner working and stronger step accuracy."
            moduleSlug="step-check-drill"
            questions={addMathStepCheckQuestions}
            subjectSlug="add-math"
            submitLabel="Submit Add Math Set"
            title="Step Check Drill Mini Set"
          />
        </section>
      ) : subject.slug === "english" && module.slug === "reading-decoder" ? (
        <section className="section">
          <ObjectivePractice
            eyebrow="Live reading set"
            helper="Short passage, 3 questions, and one saved comprehension result."
            moduleSlug="reading-decoder"
            questions={rotatingSet?.questions || readingDecoderQuestions}
            setLabel={rotatingSet?.label}
            subjectSlug="english"
            submitLabel="Submit Reading Set"
            title="Reading Decoder Mini Passage"
          />
        </section>
      ) : subject.slug === "english" && module.slug === "vocabulary-builder" ? (
        <section className="section">
          <VocabularyBuilderPractice />
        </section>
      ) : (
        <section className="section">
          <ModuleActionPanel moduleSlug={module.slug} subjectSlug={subject.slug} />
        </section>
      )}
      </div>
      </SubjectModuleAccessGate>
    </main>
  );
}
