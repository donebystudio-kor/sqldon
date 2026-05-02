import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { getProblemsForCategory } from '@/lib/quiz-utils';
import { CONCEPTS } from '@/data/concepts';
import { SITE } from '@/constants/site';
import type { CategoryId } from '@/types/problem';
import QuizShell from '@/components/quiz/QuizShell';

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ difficulty?: string; type?: string; mode?: string }>;
}

const VALID_CATEGORIES = CATEGORIES.map(c => c.id);

// SEO-friendly titles per category
const CATEGORY_SEO: Record<string, { title: string; keywords: string }> = {
  'sql-basic': { title: '기초 SQL 문제 모음 | SELECT WHERE ORDER BY 연습', keywords: 'SQL 기초, SELECT 문, WHERE 조건, ORDER BY 정렬' },
  'sql-join': { title: 'SQL JOIN 문제 모음 | INNER LEFT RIGHT 조인 연습', keywords: 'SQL JOIN, INNER JOIN, LEFT JOIN, 테이블 결합' },
  'sql-aggregate': { title: 'SQL 집계 문제 모음 | GROUP BY HAVING 연습', keywords: 'GROUP BY, HAVING, COUNT, SUM, AVG 집계' },
  'sql-subquery': { title: 'SQL 서브쿼리 문제 모음 | 단일행 다중행 상관 쿼리', keywords: '서브쿼리, 단일행, 다중행, 상관 서브쿼리, IN, EXISTS' },
  'sql-window': { title: 'SQL 윈도우 함수 문제 | ROW_NUMBER RANK LAG 연습', keywords: '윈도우 함수, ROW_NUMBER, RANK, PARTITION BY' },
  'sql-advanced': { title: '고급 SQL 문제 | CONNECT BY CTE 계층형 쿼리 연습', keywords: 'CONNECT BY, CTE, WITH RECURSIVE, 계층형 쿼리, START WITH' },
  'sql-tuning': { title: 'SQL 튜닝 실행계획 문제 | 인덱스 Full Scan 분석', keywords: '실행계획, SQL 튜닝, 인덱스, Full Table Scan' },
  'oracle-arch': { title: '오라클 아키텍처 문제 | SGA PGA 구조 학습', keywords: 'SGA, PGA, Buffer Cache, Shared Pool, 오라클' },
};

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.id === category);
  if (!cat) return {};

  const seo = CATEGORY_SEO[category];
  const title = seo?.title || `${cat.name} 문제풀이`;
  const description = `${cat.longDescription} ${seo?.keywords || ''}`;
  const url = `${SITE.url}/quiz/${category}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      type: 'website',
      siteName: SITE.name,
    },
  };
}

export default async function QuizCategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { difficulty: filterDifficulty, type: filterType, mode } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as CategoryId)) {
    notFound();
  }

  const cat = CATEGORIES.find(c => c.id === category)!;
  const problems = getProblemsForCategory(category as CategoryId);

  // Related concepts for this category
  const relatedConcepts = CONCEPTS.filter(c =>
    c.relatedCategories.includes(category as CategoryId)
  );

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${cat.name} SQL 문제풀이`,
    description: cat.longDescription,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    numberOfCredits: problems.length,
    hasCourseInstance: problems.map(p => ({
      '@type': 'Quiz',
      name: p.title,
      url: `${SITE.url}/quiz/${category}/${p.id}`,
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Category intro (SEO content) */}
      <div className="mb-6">
        <nav className="text-sm text-text-sub mb-4">
          <Link href="/" className="hover:text-primary">홈</Link>
          <span className="mx-1.5">/</span>
          <span className="text-text">{cat.name}</span>
        </nav>
        <p className="text-sm text-text-sub mb-4">{cat.longDescription}</p>

        {/* Related concepts links */}
        {relatedConcepts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {relatedConcepts.map(c => (
              <Link
                key={c.tag}
                href={`/concept/${c.tag}`}
                className="px-2.5 py-1 rounded text-xs border border-primary/20 text-primary hover:bg-primary-light transition-colors"
              >
                {c.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      <QuizShell
        problems={problems}
        category={category as CategoryId}
        categoryName={cat.name}
        filterDifficulty={filterDifficulty}
        filterType={filterType}
        mode={(mode === 'unsolved' || mode === 'wrong') ? mode : 'all'}
      />

      {/* Problem list for SEO (crawlable, collapsed by default) */}
      <details className="mt-10 pt-6 border-t border-border group">
        <summary className="text-xs font-semibold text-text-muted cursor-pointer hover:text-text-sub transition-colors list-none flex items-center gap-1">
          <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {cat.name} 전체 문제 ({problems.length}개)
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {problems.map((p, i) => (
            <Link
              key={p.id}
              href={`/quiz/${category}/${p.id}`}
              className="text-sm px-3 py-2 rounded border border-border hover:border-primary hover:text-primary transition-colors"
            >
              {i + 1}. {p.title}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
