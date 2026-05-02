import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_DICTIONARY } from '@/data/dictionary';
import { DICTIONARY_DOMAINS, DICTIONARY_CATEGORIES, type DictionaryDomain } from '@/types/dictionary';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: 'SQL/Oracle 개념 사전 — SQL 용어, 함수, 아키텍처 한 곳에',
  description: 'INNER JOIN, ROW_NUMBER, SGA, Execution Plan 등 실무자 기준의 SQL/Oracle 개념을 정리합니다. 성능 포인트와 예제 SQL 포함.',
  alternates: { canonical: `${SITE.url}/terms` },
  openGraph: {
    title: `SQL/Oracle 개념 사전 | ${SITE.name}`,
    description: 'SQL 용어, 함수, Oracle 아키텍처를 한 페이지에서 검색 가능한 사전.',
    url: `${SITE.url}/terms`,
    type: 'website',
    siteName: SITE.name,
  },
};

export default function TermsHubPage() {
  const groupedByDomain = DICTIONARY_DOMAINS.map(d => ({
    ...d,
    entries: ALL_DICTIONARY.filter(e => e.domain === d.id),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SQL/Oracle 개념 사전',
    description: 'SQL 용어, 함수, Oracle 아키텍처 개념 사전',
    url: `${SITE.url}/terms`,
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
    hasPart: ALL_DICTIONARY.map(e => ({
      '@type': 'DefinedTerm',
      name: e.title,
      description: e.shortDescription,
      url: `${SITE.url}/terms/${e.slug}`,
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-text-sub mb-4">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span className="mx-1.5">/</span>
        <span className="text-text">개념 사전</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SQL/Oracle 개념 사전</h1>
        <p className="text-text-sub">
          실무자 기준으로 정리한 SQL 용어, 함수, Oracle 아키텍처 사전. 각 항목에 성능 포인트와 예제 SQL을 포함합니다.
        </p>
      </header>

      {/* 도메인 탭 (anchor) */}
      <nav className="flex flex-wrap gap-2 mb-10 border-b border-border pb-3">
        {DICTIONARY_DOMAINS.map(d => (
          <a
            key={d.id}
            href={`#${d.id}`}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
          >
            {d.name}
            <span className="ml-1.5 text-xs text-text-muted">
              {ALL_DICTIONARY.filter(e => e.domain === d.id).length}
            </span>
          </a>
        ))}
      </nav>

      {groupedByDomain.map(domain => (
        <DomainSection key={domain.id} domain={domain} />
      ))}
    </div>
  );
}

function DomainSection({
  domain,
}: {
  domain: { id: DictionaryDomain; name: string; description: string; entries: typeof ALL_DICTIONARY };
}) {
  const categoriesInDomain = DICTIONARY_CATEGORIES.filter(c => c.domain === domain.id);

  return (
    <section id={domain.id} className="mb-12 scroll-mt-20">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">{domain.name}</h2>
        <p className="text-sm text-text-sub">{domain.description}</p>
      </div>

      {categoriesInDomain.map(cat => {
        const entries = domain.entries.filter(e => e.category === cat.id);
        if (entries.length === 0) return null;

        return (
          <div key={cat.id} className="mb-6">
            <h3 className="text-sm font-semibold text-text-sub mb-3 uppercase tracking-wide">
              {cat.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {entries.map(entry => (
                <Link
                  key={entry.slug}
                  href={`/terms/${entry.slug}`}
                  className="block p-4 bg-surface border border-border rounded-lg hover:border-primary transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-semibold text-text group-hover:text-primary transition-colors">
                      {entry.title}
                    </h4>
                    {entry.oracleSpecific && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 shrink-0">
                        Oracle
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-sub line-clamp-2">
                    {entry.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
