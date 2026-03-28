import Link from 'next/link';
import type { Category } from '@/constants/categories';

interface Props {
  category: Category;
  problemCount: number;
  highlight?: boolean;
}

export default function CategoryCard({ category, problemCount, highlight }: Props) {
  return (
    <Link
      href={`/quiz/${category.id}`}
      className={`bg-surface border-2 rounded-lg p-5 hover:shadow-md active:scale-[0.98] transition-all group ${
        highlight
          ? 'border-primary/30 hover:border-primary'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{category.icon}</span>
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
          {category.name}
        </h3>
      </div>
      <p className="text-sm text-text-sub mb-3">{category.shortDescription}</p>
      <div className="flex items-center justify-between">
        <span
          className="px-2 py-0.5 rounded text-xs font-medium text-white"
          style={{ backgroundColor: category.color }}
        >
          {problemCount}문제
        </span>
        <span className="text-xs text-text-sub group-hover:text-primary transition-colors">
          풀어보기 →
        </span>
      </div>
    </Link>
  );
}
