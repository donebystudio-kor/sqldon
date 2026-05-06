import type { Metadata } from 'next';
import Link from 'next/link';
import { CONCEPTS } from '@/data/concepts';
import { CATEGORIES } from '@/constants/categories';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: 'SQL/Oracle 개념 학습 — 카테고리별',
  description: 'SQL 개념, 함수, Oracle 아키텍처를 카테고리별로 정리한 학습 색인. 기초 SQL, JOIN, 집계, 윈도우 함수, 튜닝, 오라클 아키텍처.',
  alternates: { canonical: `${SITE.url}/concept` },
  openGraph: {
    title: `SQL/Oracle 개념 학습 | ${SITE.name}`,
    description: 'SQL 개념, 함수, Oracle 아키텍처를 카테고리별로 정리한 학습 색인.',
    url: `${SITE.url}/concept`,
    type: 'website',
    siteName: SITE.name,
  },
};

export default function ConceptIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SQL/Oracle 개념 학습',
    description: 'SQL 개념, 함수, Oracle 아키텍처 학습 색인',
    url: `${SITE.url}/concept`,
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-text-sub mb-4">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span className="mx-1.5">/</span>
        <span className="text-text">개념 학습</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SQL/Oracle 개념 학습</h1>
        <p className="text-text-sub">
          카테고리를 선택하면 해당 영역의 개념·함수·구조를 한눈에 볼 수 있습니다.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => {
          const inCategory = CONCEPTS.filter(c => c.relatedCategories.includes(cat.id));
          const first = inCategory[0];
          if (!first) return null;
          return (
            <Link
              key={cat.id}
              href={`/concept/${first.tag}`}
              className="block p-5 bg-white border border-border rounded-xl hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-text-muted">{inCategory.length}개</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{cat.shortDescription}</p>
                </div>
              </div>
              <p className="text-sm text-text-sub line-clamp-2">{cat.longDescription}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
