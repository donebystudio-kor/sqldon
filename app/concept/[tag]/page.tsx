import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONCEPTS, getConceptByTag } from '@/data/concepts';
import { CATEGORIES } from '@/constants/categories';
import { ALL_PROBLEMS } from '@/data/problems';
import { SITE } from '@/constants/site';
import SqlBlock from '@/components/shared/SqlBlock';
import ConceptSidebar from '@/components/concept/ConceptSidebar';
import RelatedProblems from '@/components/concept/RelatedProblems';

interface Props {
  params: Promise<{ tag: string }>;
}

const CONCEPT_SEO: Record<string, string> = {
  'select': 'SQL SELECT 문 완전 정리',
  'where': 'SQL WHERE 조건절 완전 정리 (비교, NULL, AND/OR)',
  'order-by': 'SQL ORDER BY 정렬 완전 정리 (ASC, DESC)',
  'distinct': 'SQL DISTINCT 중복 제거 완전 정리',
  'null-handling': 'SQL NULL 처리 완전 정리 (IS NULL, COALESCE)',
  'join': 'SQL JOIN 완전 정리 (INNER, LEFT, RIGHT)',
  'inner-join': 'SQL INNER JOIN 완전 정리',
  'left-right-join': 'SQL LEFT JOIN / RIGHT JOIN 완전 정리',
  'group-by': 'SQL GROUP BY 완전 정리 (HAVING, 집계 함수)',
  'having': 'SQL HAVING 절 완전 정리 (GROUP BY 필터링)',
  'window-function': 'SQL 윈도우 함수 완전 정리 (ROW_NUMBER, RANK)',
  'partition-by': 'SQL PARTITION BY 완전 정리 (윈도우 그룹 분할)',
  'rank-row-number': 'SQL RANK / ROW_NUMBER 완전 정리 (순위 함수)',
  'full-table-scan': 'Full Table Scan 완전 정리 (실행계획, 인덱스)',
  'index-range-scan': 'Index Range Scan 완전 정리 (인덱스 활용)',
  'sga': '오라클 SGA 구조 완전 정리 (Buffer Cache, Shared Pool)',
  'pga': '오라클 PGA 구조 완전 정리 (Sort Area, Hash Area)',
  'bg-processes': '오라클 백그라운드 프로세스 완전 정리 (DBWn, LGWR)',
};

const TAG_CATEGORY: Record<string, string> = {
  'select': '기초 SQL', 'where': '기초 SQL', 'order-by': '기초 SQL', 'distinct': '기초 SQL', 'null-handling': '기초 SQL',
  'join': 'JOIN', 'inner-join': 'JOIN', 'left-right-join': 'JOIN',
  'group-by': '집계', 'having': '집계',
  'window-function': '윈도우 함수', 'partition-by': '윈도우 함수', 'rank-row-number': '윈도우 함수',
  'full-table-scan': '튜닝 / 실행계획', 'index-range-scan': '튜닝 / 실행계획',
  'sga': '오라클 아키텍처', 'pga': '오라클 아키텍처', 'bg-processes': '오라클 아키텍처',
};

export async function generateStaticParams() {
  return CONCEPTS.map(c => ({ tag: c.tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const concept = getConceptByTag(tag);
  if (!concept) return {};

  const seoTitle = CONCEPT_SEO[tag] || concept.title;
  const description = `${concept.shortDefinition} ${concept.whyImportant.slice(0, 80)}`;
  const url = `${SITE.url}/concept/${tag}`;

  return {
    title: seoTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${seoTitle} | ${SITE.name}`,
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

  const seoTitle = CONCEPT_SEO[tag] || concept.title;
  const categoryName = TAG_CATEGORY[tag] || '개념';

  const relatedProblems = ALL_PROBLEMS.filter(
    p => p.relatedConceptTags?.includes(tag)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: seoTitle,
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
            <span>{categoryName}</span>
            <span className="mx-1.5">/</span>
            <span className="text-text">{concept.title}</span>
          </nav>

          <h1 className="text-3xl font-bold mb-2">{seoTitle}</h1>
          <p className="text-lg text-text-sub mb-8">{concept.shortDefinition}</p>

          {/* Why Important */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">왜 중요한가?</h2>
            <div className="bg-surface border border-border rounded-lg p-5">
              <p className="text-text-sub">{concept.whyImportant}</p>
            </div>
          </section>

          {/* Common Mistakes */}
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

          {/* Example */}
          {concept.example && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">예시</h2>
              <SqlBlock sql={concept.example} />
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
