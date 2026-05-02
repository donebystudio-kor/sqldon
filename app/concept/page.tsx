import type { Metadata } from 'next';
import Link from 'next/link';
import { CONCEPTS } from '@/data/concepts';
import { CONCEPT_DOMAINS, CONCEPT_CATEGORIES, type ConceptDomain } from '@/types/concept';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: 'SQL/Oracle 개념 학습 — 색인',
  description: 'SELECT, JOIN, GROUP BY, 윈도우 함수, 인덱스, SGA, Execution Plan 등 SQL/Oracle 개념을 한눈에 정리한 색인 페이지.',
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
    hasPart: CONCEPTS.map(c => ({
      '@type': 'DefinedTerm',
      name: c.title,
      description: c.shortDefinition,
      url: `${SITE.url}/concept/${c.tag}`,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-text-sub mb-4">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span className="mx-1.5">/</span>
        <span className="text-text">개념 학습</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">SQL/Oracle 개념 학습</h1>
        <p className="text-text-sub">
          SQL 개념 · 함수 · Oracle 아키텍처. 항목을 클릭하면 정의 · 실무 포인트 · 예제 · 관련 문제로 이동합니다.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 mb-8 p-3 bg-surface border border-border rounded-lg text-sm">
        <span className="text-text-muted">바로가기:</span>
        {CONCEPT_DOMAINS.map(d => (
          <a
            key={d.id}
            href={`#${d.id}`}
            className="text-primary hover:underline"
          >
            {d.name}({CONCEPTS.filter(c => c.domain === d.id).length})
          </a>
        ))}
      </nav>

      {CONCEPT_DOMAINS.map(domain => (
        <DomainSection key={domain.id} domain={domain.id} name={domain.name} description={domain.description} />
      ))}
    </div>
  );
}

function DomainSection({
  domain,
  name,
  description,
}: {
  domain: ConceptDomain;
  name: string;
  description: string;
}) {
  const entries = CONCEPTS.filter(c => c.domain === domain);
  if (entries.length === 0) return null;

  const categoriesInDomain = CONCEPT_CATEGORIES.filter(c => c.domain === domain);

  return (
    <section id={domain} className="mb-16 scroll-mt-20">
      <div className="border-b-2 border-primary pb-2 mb-6">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-sm text-text-sub mt-1">{description}</p>
      </div>

      {categoriesInDomain.map(cat => {
        const catEntries = entries.filter(e => e.category === cat.id);
        if (catEntries.length === 0) return null;

        return (
          <div key={cat.id} className="mb-10">
            <h3 className="text-base font-bold text-text-sub uppercase tracking-wider mb-4 pb-1 border-b border-border">
              {cat.name}
            </h3>
            <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
              {catEntries.map(entry => (
                <li key={entry.tag}>
                  <Link
                    href={`/concept/${entry.tag}`}
                    className="flex items-baseline gap-2 flex-wrap px-4 py-3 hover:bg-surface transition-colors"
                  >
                    <span className="font-bold text-text hover:text-primary">{entry.title}</span>
                    {entry.oracleSpecific && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                        Oracle
                      </span>
                    )}
                    <span className="text-sm text-text-sub flex-1 min-w-0 truncate">— {entry.shortDefinition}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
