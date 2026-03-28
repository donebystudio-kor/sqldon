import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONCEPTS, getConceptByTag } from '@/data/concepts';
import { CATEGORIES } from '@/constants/categories';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return CONCEPTS.map(c => ({ tag: c.tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const concept = getConceptByTag(tag);
  if (!concept) return {};
  return {
    title: concept.title,
    description: concept.shortDefinition,
  };
}

export default async function ConceptPage({ params }: Props) {
  const { tag } = await params;
  const concept = getConceptByTag(tag);

  if (!concept) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{concept.title}</h1>
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
          <pre className="bg-code-bg text-code-text rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {concept.example}
          </pre>
        </section>
      )}

      {/* Related Categories */}
      <section className="mb-8">
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
                {cat.icon} {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Concepts Nav */}
      <section>
        <h2 className="text-xl font-semibold mb-3">다른 개념 보기</h2>
        <div className="flex flex-wrap gap-2">
          {CONCEPTS.filter(c => c.tag !== tag).map(c => (
            <Link
              key={c.tag}
              href={`/concept/${c.tag}`}
              className="px-3 py-1.5 rounded-lg bg-primary-light text-primary text-sm hover:bg-primary hover:text-white transition-colors"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
