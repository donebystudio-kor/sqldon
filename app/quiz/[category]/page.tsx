import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '@/constants/categories';
import { getProblemsForCategory } from '@/lib/quiz-utils';
import type { CategoryId } from '@/types/problem';
import QuizShell from '@/components/quiz/QuizShell';

interface Props {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES = CATEGORIES.map(c => c.id);

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.id === category);
  if (!cat) return {};
  return {
    title: `${cat.name} 문제풀이`,
    description: cat.longDescription,
  };
}

export default async function QuizCategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as CategoryId)) {
    notFound();
  }

  const cat = CATEGORIES.find(c => c.id === category)!;
  const problems = getProblemsForCategory(category as CategoryId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <QuizShell
        problems={problems}
        category={category as CategoryId}
        categoryName={cat.name}
      />
    </div>
  );
}
