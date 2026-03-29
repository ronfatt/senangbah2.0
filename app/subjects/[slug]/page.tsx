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
    <main className="page-shell dashboard-shell dashboard-shell-v3">
      <section className="dashboard-v3-hero dashboard-v3-page-hero">
        <p className="dashboard-v3-welcome">{subject.group}</p>
        <h1>{subject.name}</h1>
        <p className="dashboard-v3-hero-copy">
          {subject.summary}{" "}
          {locale === "ms"
            ? `Halaman ini menunjukkan laluan terbaik, bahagian yang perlu dibaiki, dan semua modul yang boleh anda buka dalam ${subject.name}.`
            : `This page shows the best path, what needs work, and every module you can open inside ${subject.name}.`}
        </p>
        <div className="dashboard-v3-hero-actions">
          <a className="btn btn-primary" href="#subject-guide">
            {locale === "ms" ? "Lihat Laluan Terbaik" : "See Best Path"}
          </a>
          <a className="btn btn-secondary" href="/my-subjects">
            {locale === "ms" ? "Kembali ke My Subjects" : "Back to My Subjects"}
          </a>
        </div>
      </section>

      <SubjectHubClient locale={locale} subject={subject} />
    </main>
  );
}
