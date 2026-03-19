import { getSubjectCatalog } from "../../lib/catalog";
import { subjectDefinitions } from "../../lib/subjects";

export default async function SubjectsPage() {
  const catalog = await getSubjectCatalog();
  const coreSubjects = subjectDefinitions.filter((subject) => subject.isCore);
  const premiumSubjects = subjectDefinitions.filter((subject) => !subject.isCore);

  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">Subjects</p>
        <h1 className="dashboard-title">Six subjects. One AI learning platform.</h1>
        <p className="landing-lead">
          Start with the subject you want to improve most, then use short daily missions, AI feedback, and clearer next steps to keep moving.
        </p>
      </section>

      <section className="section section-split subjects-intro-grid">
        <article className="feature-panel">
          <p className="eyebrow">Core languages</p>
          <h2>English and Bahasa Melayu are built for daily improvement.</h2>
          <p className="dashboard-helper">
            Use these lanes for writing, grammar, comprehension, and vocabulary progress you can feel quickly.
          </p>
          <div className="subject-inline-list">
            {coreSubjects.map((subject) => (
              <a className="subject-chip" href={`/subjects/${subject.slug}`} key={subject.code}>
                <span>{subject.name}</span>
                <strong>{subject.bundle}</strong>
              </a>
            ))}
          </div>
        </article>

        <article className="feature-panel alt">
          <p className="eyebrow">Premium subjects</p>
          <h2>Sejarah, Geografi, Math, and Add Math are ready when you want more depth.</h2>
          <p className="dashboard-helper">
            These lanes add stronger revision structure, step-by-step practice, and premium-focused improvement paths.
          </p>
          <div className="subject-inline-list">
            {premiumSubjects.map((subject) => (
              <a className="subject-chip" href={`/subjects/${subject.slug}`} key={subject.code}>
                <span>{subject.name}</span>
                <strong>{subject.bundle}</strong>
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="subjects-grid">
        {subjectDefinitions.map((subject) => {
          const catalogRow = catalog.find((item) => item.code === subject.code);
          const readyCount = subject.modules.filter((module) => module.status === "ready").length;
          const leadModules = subject.modules.slice(0, 3);

          return (
            <article className="subject-detail-card" key={subject.code}>
              <p className="subject-status">{subject.group}</p>
              <div className="subject-card-head">
                <h2>{subject.name}</h2>
                <a className="mini-link" href={`/subjects/${subject.slug}`}>
                  Open subject
                </a>
              </div>
              <p className="subject-access">{subject.access}</p>
              <p className="subject-summary">{catalogRow?.description || subject.summary}</p>
              <div className="subject-quick-meta">
                <span className="status-pill status-pill-ready">{readyCount} ready module(s)</span>
                <span className="status-pill">{subject.bundle}</span>
              </div>
              <div className="subject-module-preview-list">
                {leadModules.map((module) => (
                  <div className="subject-module-preview" key={module.name}>
                    <div className="module-card-head">
                      <strong>{module.name}</strong>
                      <span className={`module-state state-${module.status}`}>{module.status.replace("_", " ")}</span>
                    </div>
                    <p className="dashboard-helper">{module.summary}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
