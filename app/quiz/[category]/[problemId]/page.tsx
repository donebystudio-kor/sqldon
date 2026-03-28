import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { ALL_PROBLEMS, getProblemById } from '@/data/problems';
import { SITE } from '@/constants/site';
import { CONCEPTS } from '@/data/concepts';
import type { CategoryId } from '@/types/problem';
import QuizShell from '@/components/quiz/QuizShell';

interface Props {
  params: Promise<{ category: string; problemId: string }>;
}

export async function generateStaticParams() {
  return ALL_PROBLEMS.map(p => ({
    category: p.category,
    problemId: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, problemId } = await params;
  const problem = getProblemById(problemId);
  const cat = CATEGORIES.find(c => c.id === category);

  if (!problem || !cat) return {};

  const title = `${problem.title} | ${cat.name} SQL 문제풀이`;
  const description = `${problem.question.slice(0, 100)}... 학습 포인트: ${problem.learningPoint}`;
  const url = `${SITE.url}/quiz/${category}/${problemId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: SITE.name,
    },
  };
}

export default async function ProblemPage({ params }: Props) {
  const { category, problemId } = await params;
  const problem = getProblemById(problemId);
  const cat = CATEGORIES.find(c => c.id === category);

  if (!problem || !cat || problem.category !== category) {
    notFound();
  }

  const categoryProblems = ALL_PROBLEMS.filter(p => p.category === category);
  const currentIndex = categoryProblems.findIndex(p => p.id === problemId);

  // Related concepts
  const relatedConcepts = (problem.relatedConceptTags || [])
    .map(tag => CONCEPTS.find(c => c.tag === tag))
    .filter(Boolean);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: problem.title,
    description: problem.question,
    educationalLevel: problem.difficulty === 'basic' ? 'Beginner' : problem.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
    about: {
      '@type': 'Thing',
      name: cat.name,
    },
    isPartOf: {
      '@type': 'Course',
      name: `${cat.name} | ${SITE.name}`,
      url: `${SITE.url}/quiz/${category}`,
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-text-sub mb-6">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/quiz/${category}`} className="hover:text-primary">{cat.name}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-text">{problem.title}</span>
      </nav>

      <QuizShell
        problems={categoryProblems}
        category={category as CategoryId}
        categoryName={cat.name}
      />

      {/* Related Concepts (internal links) */}
      {relatedConcepts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-text-sub mb-3">관련 개념</h3>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map(c => c && (
              <Link
                key={c.tag}
                href={`/concept/${c.tag}`}
                className="px-3 py-1.5 rounded-lg border border-border text-sm hover:border-primary hover:text-primary transition-colors"
              >
                {c.title} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Other problems in category (internal links) */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-text-sub mb-3">같은 카테고리 문제</h3>
        <div className="flex flex-wrap gap-2">
          {categoryProblems.map((p, i) => (
            <Link
              key={p.id}
              href={`/quiz/${category}/${p.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                p.id === problemId
                  ? 'bg-primary text-white'
                  : 'border border-border hover:border-primary hover:text-primary'
              }`}
            >
              {i + 1}. {p.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
