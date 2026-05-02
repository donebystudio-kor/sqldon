import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_DICTIONARY, getDictionaryBySlug, getRelatedEntries, getReverseRelated } from '@/data/dictionary';
import { DICTIONARY_DOMAINS, DICTIONARY_CATEGORIES } from '@/types/dictionary';
import { CATEGORIES } from '@/constants/categories';
import { ALL_PROBLEMS } from '@/data/problems';
import { CONCEPTS } from '@/data/concepts';
import { SITE } from '@/constants/site';
import SqlBlock from '@/components/shared/SqlBlock';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_DICTIONARY.map(e => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDictionaryBySlug(slug);
  if (!entry) return {};

  const url = `${SITE.url}/terms/${slug}`;
  const title = `${entry.title} — ${entry.shortDescription}`;
  const description = `${entry.shortDescription} ${entry.whyImportant.slice(0, 100)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${entry.title} | ${SITE.name}`,
      description,
      url,
      type: 'article',
      siteName: SITE.name,
    },
  };
}

export default async function DictionaryEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getDictionaryBySlug(slug);

  if (!entry) notFound();

  const domain = DICTIONARY_DOMAINS.find(d => d.id === entry.domain);
  const category = DICTIONARY_CATEGORIES.find(c => c.id === entry.category);
  const related = getRelatedEntries(entry);
  const reverseRelated = getReverseRelated(entry.slug);
  const allRelated = [...related, ...reverseRelated.filter(r => !related.some(x => x.slug === r.slug))];

  const quizCategory = CATEGORIES.find(c => c.id === entry.relatedQuizCategory);

  // 관련 문제 추천 (tag 매칭)
  const relatedProblems = ALL_PROBLEMS
    .filter(p => p.category === entry.relatedQuizCategory)
    .filter(p => p.tags.some(t =>
      entry.tags.some(et => et.toLowerCase() === t.toLowerCase())
    ))
    .slice(0, 5);

  // 관련 학습 가이드(/concept/[tag]) 추천
  const relatedConceptGuides = CONCEPTS
    .filter(c => c.relatedCategories.includes(entry.relatedQuizCategory))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.title,
    description: entry.shortDescription,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'SQL/Oracle 개념 사전',
      url: `${SITE.url}/terms`,
    },
    url: `${SITE.url}/terms/${entry.slug}`,
  };

  const difficultyLabel = {
    beginner: '입문',
    intermediate: '중급',
    advanced: '고급',
  }[entry.difficulty];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-text-sub mb-4">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span className="mx-1.5">/</span>
        <Link href="/terms" className="hover:text-primary">개념 사전</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/terms#${entry.domain}`} className="hover:text-primary">
          {domain?.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-text">{entry.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {category && (
            <span className="text-xs font-medium px-2 py-1 rounded bg-primary-light text-primary">
              {category.name}
            </span>
          )}
          <span className="text-xs font-medium px-2 py-1 rounded bg-surface border border-border text-text-sub">
            {difficultyLabel}
          </span>
          {entry.oracleSpecific && (
            <span className="text-xs font-bold px-2 py-1 rounded bg-amber-50 text-amber-700">
              Oracle 전용
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{entry.title}</h1>
        <p className="text-lg text-text-sub">{entry.shortDescription}</p>
      </header>

      {/* 정의 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">정의</h2>
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="text-text-sub leading-relaxed whitespace-pre-line">{entry.definition}</p>
        </div>
      </section>

      {/* 왜 중요한가 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">실무에서 왜 중요한가?</h2>
        <div className="bg-primary-light/30 border border-primary/20 rounded-lg p-5">
          <p className="text-text-sub leading-relaxed whitespace-pre-line">{entry.whyImportant}</p>
        </div>
      </section>

      {/* 예제 SQL */}
      {entry.exampleSql && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">예제 SQL</h2>
          <SqlBlock sql={entry.exampleSql} />
        </section>
      )}

      {/* 성능 포인트 */}
      {entry.performanceNote && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">성능 포인트</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3">
            <span className="text-amber-700 font-bold shrink-0">!</span>
            <p className="text-text-sub leading-relaxed whitespace-pre-line">{entry.performanceNote}</p>
          </div>
        </section>
      )}

      {/* 관련 개념 */}
      {allRelated.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">관련 개념</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allRelated.map(r => (
              <Link
                key={r.slug}
                href={`/terms/${r.slug}`}
                className="block p-3 bg-surface border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="font-medium text-text">{r.title}</div>
                <div className="text-xs text-text-muted mt-0.5 line-clamp-1">{r.shortDescription}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 관련 문제 */}
      {relatedProblems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">이 개념으로 풀어보는 문제</h2>
          <div className="space-y-2">
            {relatedProblems.map(p => (
              <Link
                key={p.id}
                href={`/quiz/${p.category}/${p.id}`}
                className="block p-3 bg-surface border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="text-sm font-medium text-text">{p.title}</div>
                <div className="text-xs text-text-muted mt-0.5">
                  {CATEGORIES.find(c => c.id === p.category)?.name} · {p.difficulty}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 학습 가이드 */}
      {relatedConceptGuides.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">관련 학습 가이드</h2>
          <div className="flex flex-wrap gap-2">
            {relatedConceptGuides.map(c => (
              <Link
                key={c.tag}
                href={`/concept/${c.tag}`}
                className="px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 카테고리 문제풀이 CTA */}
      {quizCategory && (
        <section>
          <Link
            href={`/quiz/${quizCategory.id}`}
            className="inline-flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {quizCategory.icon} {quizCategory.name} 문제 풀어보기
            <span aria-hidden>→</span>
          </Link>
        </section>
      )}
    </div>
  );
}
