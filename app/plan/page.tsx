import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_PROBLEMS } from '@/data/problems';

export const metadata: Metadata = {
  title: '실행계획 학습',
  description: 'SQL 실행계획을 읽고 분석하는 훈련을 합니다.',
};

const PLAN_CONCEPTS = [
  {
    title: 'Full Table Scan',
    desc: '테이블 전체를 순차적으로 읽습니다. 소량 데이터에서는 효율적이지만 대용량에서는 병목 원인.',
    color: '#EF4444',
  },
  {
    title: 'Index Range Scan',
    desc: '인덱스의 특정 범위만 읽습니다. WHERE 조건에 인덱스 컬럼이 있을 때 발생.',
    color: '#10B981',
  },
  {
    title: 'Nested Loop Join',
    desc: '외부 테이블의 각 행에 대해 내부 테이블을 반복 탐색합니다. 소량-대량 조합에 효율적.',
    color: '#3B82F6',
  },
  {
    title: 'Hash Join',
    desc: '작은 테이블로 해시 테이블을 만들고 큰 테이블을 탐색합니다. 대량-대량 조인에 효율적.',
    color: '#8B5CF6',
  },
  {
    title: 'Sort Operation',
    desc: 'ORDER BY, GROUP BY, DISTINCT 등에서 발생합니다. 메모리 부족 시 디스크 정렬로 성능 저하.',
    color: '#F59E0B',
  },
  {
    title: 'Cardinality',
    desc: '옵티마이저가 예측하는 행 수. 통계정보가 부정확하면 잘못된 실행계획을 생성합니다.',
    color: '#EC4899',
  },
];

export default function PlanPage() {
  const planProblems = ALL_PROBLEMS.filter(p => p.type === 'plan');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">실행계획 학습</h1>
      <p className="text-text-sub mb-8">
        SQL 실행계획을 읽고 병목 지점을 분석하는 능력을 키웁니다.
      </p>

      {/* Concepts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">핵심 개념</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLAN_CONCEPTS.map(concept => (
            <div
              key={concept.title}
              className="bg-surface border border-border rounded-lg p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: concept.color }}
                />
                <h3 className="font-semibold text-sm">{concept.title}</h3>
              </div>
              <p className="text-xs text-text-sub">{concept.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
                href={`/quiz/${p.category}`}
                className="block bg-surface border border-border rounded-lg p-4 hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-text-sub mr-2">#{i + 1}</span>
                    <span className="font-medium">{p.title}</span>
                  </div>
                  <span className="text-xs text-text-sub">{p.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
