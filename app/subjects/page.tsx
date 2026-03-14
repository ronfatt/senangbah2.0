import { getSubjectCatalog } from "../../lib/catalog";
import { subjectDefinitions } from "../../lib/subjects";

export default async function SubjectsPage() {
  const catalog = await getSubjectCatalog();

  return (
    <main className="page-shell">
      <section className="section-heading">
        <p className="eyebrow">Subjects</p>
        <h1 className="dashboard-title">One platform, six subject lanes, clearer bundle access.</h1>
      </section>

      <section className="subjects-grid">
        {subjectDefinitions.map((subject) => {
          const catalogRow = catalog.find((item) => item.code === subject.code);

          return (
            <article className="subject-detail-card" key={subject.code}>
            <p className="subject-status">{subject.group}</p>
            <div className="subject-card-head">
              <h2>{subject.name}</h2>
              <a className="mini-link" href={`/subjects/${subject.slug}`}>
                Open hub
              </a>
            </div>
            <p className="subject-access">{subject.access}</p>
            <p className="subject-summary">{catalogRow?.description || subject.summary}</p>
            <ul className="feature-list">
              {subject.modules.map((module) => (
                <li key={module.name}>{module.name}</li>
              ))}
            </ul>
          </article>
          );
        })}
      </section>
    </main>
  );
}
