import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONCEPTS, getConceptByTag, getRelatedConcepts } from '@/data/concepts';
import { CONCEPT_CATEGORIES, CONCEPT_DOMAINS } from '@/types/concept';
import { CATEGORIES } from '@/constants/categories';
import { ALL_PROBLEMS } from '@/data/problems';
import { SITE } from '@/constants/site';
import SqlBlock from '@/components/shared/SqlBlock';
import ConceptSidebar from '@/components/concept/ConceptSidebar';
import RelatedProblems from '@/components/concept/RelatedProblems';

interface Props {
  params: Promise<{ tag: string }>;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
};

export async function generateStaticParams() {
  return CONCEPTS.map(c => ({ tag: c.tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const concept = getConceptByTag(tag);
  if (!concept) return {};

  const seoTitle = `${concept.title} — ${concept.shortDefinition}`;
  const description = `${concept.shortDefinition} ${concept.whyImportant.slice(0, 100)}`;
  const url = `${SITE.url}/concept/${tag}`;

  return {
    title: seoTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${concept.title} | ${SITE.name}`,
      description,
      url,
      type: 'article',
      siteName: SITE.name,
    },
  };
}

export default async function ConceptPage({ params }: Props) {
  const { tag } = await params;
  const concept = getConceptByTag(tag);

  if (!concept) notFound();

  const category = CONCEPT_CATEGORIES.find(c => c.id === concept.category);
  const domain = CONCEPT_DOMAINS.find(d => d.id === concept.domain);
  const related = getRelatedConcepts(concept);

  const relatedProblems = ALL_PROBLEMS.filter(
    p => p.relatedConceptTags?.includes(tag)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: concept.title,
    description: concept.shortDefinition,
    about: { '@type': 'Thing', name: concept.title },
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/concept/${tag}`,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mobile: concept dropdown */}
      <div className="lg:hidden mb-6">
        <ConceptSidebar currentTag={tag} mode="dropdown" />
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <ConceptSidebar currentTag={tag} mode="sidebar" />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="text-sm text-text-sub mb-6">
            <Link href="/" className="hover:text-primary">홈</Link>
            <span className="mx-1.5">/</span>
            <Link href="/concept" className="hover:text-primary">개념 학습</Link>
            {domain && (
              <>
                <span className="mx-1.5">/</span>
                <Link href={`/concept#${domain.id}`} className="hover:text-primary">{domain.name}</Link>
              </>
            )}
            <span className="mx-1.5">/</span>
            <span className="text-text">{concept.title}</span>
          </nav>

          {/* Header with badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {category && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-primary-light text-primary">
                {category.name}
              </span>
            )}
            {concept.difficulty && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-surface border border-border text-text-sub">
                {DIFFICULTY_LABEL[concept.difficulty]}
              </span>
            )}
            {concept.oracleSpecific && (
              <span className="text-xs font-bold px-2 py-1 rounded bg-amber-50 text-amber-700">
                Oracle 전용
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{concept.title}</h1>
          <p className="text-lg text-text-sub mb-8">{concept.shortDefinition}</p>

          {/* 정의 (긴 정의가 있을 때) */}
          {concept.definition && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">정의</h2>
              <div className="bg-surface border border-border rounded-lg p-5">
                <p className="text-text-sub leading-relaxed whitespace-pre-line">{concept.definition}</p>
              </div>
            </section>
          )}

          {/* Why Important */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">왜 중요한가?</h2>
            <div className="bg-primary-light/30 border border-primary/20 rounded-lg p-5">
              <p className="text-text-sub leading-relaxed whitespace-pre-line">{concept.whyImportant}</p>
            </div>
          </section>

          {/* Common Mistakes */}
          {concept.commonMistakes.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">틀리기 쉬운 포인트</h2>
              <ul className="space-y-2">
                {concept.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 bg-error/5 border border-error/20 rounded-lg p-4">
                    <span className="text-error font-bold shrink-0">!</span>
                    <p className="text-sm text-text-sub">{m}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Example */}
          {concept.example && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">예시</h2>
              <SqlBlock sql={concept.example} />
            </section>
          )}

          {/* Performance Note */}
          {concept.performanceNote && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">성능 포인트</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3">
                <span className="text-amber-700 font-bold shrink-0">!</span>
                <p className="text-text-sub leading-relaxed whitespace-pre-line">{concept.performanceNote}</p>
              </div>
            </section>
          )}

          {/* Related Concepts */}
          {related.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">관련 개념</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map(r => (
                  <Link
                    key={r.tag}
                    href={`/concept/${r.tag}`}
                    className="block p-3 bg-surface border border-border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="font-medium text-text">{r.title}</div>
                    <div className="text-xs text-text-muted mt-0.5 line-clamp-1">{r.shortDefinition}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Problems */}
          <RelatedProblems
            problems={relatedProblems.map(p => ({
              id: p.id,
              title: p.title,
              category: p.category,
              categoryName: CATEGORIES.find(c => c.id === p.category)?.name,
            }))}
          />

          {/* Related Categories */}
          <section>
            <h2 className="text-xl font-semibold mb-3">관련 카테고리</h2>
            <div className="flex flex-wrap gap-2">
              {concept.relatedCategories.map(catId => {
                const cat = CATEGORIES.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <Link
                    key={catId}
                    href={`/quiz/${catId}`}
                    className="px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat.icon} {cat.name} 문제 풀기
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
