'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProblemLink {
  id: string;
  title: string;
  category: string;
  categoryName?: string;
}

interface Props {
  problems: ProblemLink[];
}

const INITIAL_COUNT = 5;

export default function RelatedProblems({ problems }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (problems.length === 0) return null;

  const visible = expanded ? problems : problems.slice(0, INITIAL_COUNT);
  const remaining = problems.length - INITIAL_COUNT;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">관련 문제 풀어보기</h2>
      <div className="space-y-2">
        {visible.map(p => (
          <Link
            key={p.id}
            href={`/quiz/${p.category}/${p.id}`}
            className="flex items-center justify-between bg-white border border-border rounded-lg p-4 hover:border-primary transition-all"
          >
            <div>
              <span className="font-medium text-sm">{p.title}</span>
              {p.categoryName && (
                <span className="ml-2 text-xs text-text-muted">{p.categoryName}</span>
              )}
            </div>
            <span className="text-xs text-primary font-medium shrink-0">풀어보기 →</span>
          </Link>
        ))}
      </div>

      {remaining > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-primary hover:underline transition-colors"
        >
          {expanded ? '접기 ↑' : `문제 ${remaining}개 더 보기 ↓`}
        </button>
      )}
    </section>
  );
}
