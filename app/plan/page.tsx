import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_PROBLEMS } from '@/data/problems';
import PlanClient from './PlanClient';

export const metadata: Metadata = {
  title: '실행계획 학습 | SQL 실행계획 읽는법',
  description: 'Full Table Scan, Index Range Scan, Hash Join 등 SQL 실행계획의 핵심 개념을 인터랙티브하게 학습합니다.',
};

export default function PlanPage() {
  const planProblems = ALL_PROBLEMS.filter(p => p.type === 'plan');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">실행계획 학습</h1>
      <p className="text-text-sub mb-8">
        실행계획의 핵심 개념을 클릭해서 알아보고, 실전 문제를 풀어보세요.
      </p>

      <PlanClient />

      {/* Plan Problems */}
      <section>
        <h2 className="text-2xl font-bold mb-4">실행계획 문제 ({planProblems.length}문제)</h2>
        {planProblems.length === 0 ? (
          <p className="text-text-sub">아직 실행계획 문제가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {planProblems.map((p, i) => (
              <Link
                key={p.id}
                href={`/quiz/${p.category}/${p.id}`}
                className="block bg-surface border border-border rounded-lg p-4 hover:border-primary active:scale-[0.99] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-text-sub mr-2">#{i + 1}</span>
                    <span className="font-medium">{p.title}</span>
                  </div>
                  <span className="text-xs text-primary font-medium">풀어보기 →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
