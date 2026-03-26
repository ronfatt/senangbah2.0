import { notFound } from "next/navigation";
import { SubjectHubClient } from "../../../components/subject-hub-client";
import { getServerLocale } from "../../../lib/server-locale";
import { getSubjectBySlug, subjectDefinitions } from "../../../lib/subjects";

export function generateStaticParams() {
  return subjectDefinitions.map((subject) => ({ slug: subject.slug }));
}

export default async function SubjectHubPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const subject = getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="subject-hero">
        <div className="subject-hero-copy">
          <p className="eyebrow">{subject.group}</p>
          <h1 className="dashboard-title">{subject.name}</h1>
          <p className="hero-text">{subject.summary}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#subject-guide">
              {locale === "ms" ? "Lihat laluan terbaik" : "See best path"}
            </a>
            <a className="btn btn-secondary" href="/progress">
              {locale === "ms" ? "Buka Laporan Kemajuan" : "Open Progress Report"}
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <p className="panel-label">{locale === "ms" ? "Paling sesuai untuk" : "Best for"}</p>
          <h2>{subject.bundle}</h2>
          <p className="hero-text">{subject.access}</p>
        </div>
      </section>

      <SubjectHubClient locale={locale} subject={subject} />
    </main>
  );
}
