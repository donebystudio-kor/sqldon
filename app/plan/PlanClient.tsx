'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PlanConcept {
  id: string;
  title: string;
  color: string;
  summary: string;
  when: string;
  problem: string;
  ok: string;
  planExample: string;
  highlightLines: number[];
  relatedCategory: string;
}

const CONCEPTS: PlanConcept[] = [
  {
    id: 'full-table-scan',
    title: 'Full Table Scan',
    color: '#EF4444',
    summary: '테이블의 모든 데이터를 처음부터 끝까지 순서대로 읽는 방식',
    when: 'WHERE 조건에 인덱스가 없거나, 테이블 대부분의 행을 읽어야 할 때 발생합니다. 인덱스가 있어도 옵티마이저가 Full Scan이 더 빠르다고 판단하면 선택됩니다.',
    problem: '대용량 테이블(수백만 행 이상)에서 소수의 행만 필요한데 Full Table Scan이 발생하면 불필요한 디스크 읽기가 대량 발생하여 쿼리가 매우 느려집니다.',
    ok: '테이블이 작거나(수천 행 이하), 전체 데이터의 대부분(10~20% 이상)을 읽어야 하는 경우에는 오히려 인덱스 스캔보다 효율적입니다.',
    planExample: `--------------------------------------------------------------
| Id  | Operation          | Name       | Rows  | Cost (%CPU)|
--------------------------------------------------------------
|   0 | SELECT STATEMENT   |            |  1000 |   450  (2)|
|*  1 |  TABLE ACCESS FULL | EMPLOYEES  |  1000 |   450  (2)|
--------------------------------------------------------------`,
    highlightLines: [3],
    relatedCategory: 'sql-tuning',
  },
  {
    id: 'index-range-scan',
    title: 'Index Range Scan',
    color: '#10B981',
    summary: '인덱스에서 조건에 맞는 범위만 골라 읽는 효율적인 방식',
    when: 'WHERE 조건에 인덱스가 걸린 컬럼이 사용될 때 발생합니다. 예를 들어 WHERE salary > 5000 같은 범위 조건에서 salary 인덱스가 있으면 사용됩니다.',
    problem: '인덱스 선두 컬럼이 조건에 없으면 발생하지 않습니다. 또한 인덱스를 타더라도 테이블에서 데이터를 다시 읽는(TABLE ACCESS BY INDEX ROWID) 비용이 추가됩니다.',
    ok: '소량의 데이터를 선택적으로 조회할 때 가장 효율적입니다. 적절한 인덱스 설계의 핵심입니다.',
    planExample: `--------------------------------------------------------------
| Id  | Operation                    | Name      | Rows | Cost|
--------------------------------------------------------------
|   0 | SELECT STATEMENT             |           |   50 |   5 |
|   1 |  TABLE ACCESS BY INDEX ROWID | EMPLOYEES |   50 |   5 |
|*  2 |   INDEX RANGE SCAN           | IDX_SAL   |   50 |   2 |
--------------------------------------------------------------`,
    highlightLines: [4],
    relatedCategory: 'sql-tuning',
  },
  {
    id: 'nested-loop',
    title: 'Nested Loop Join',
    color: '#3B82F6',
    summary: '바깥 테이블의 각 행마다 안쪽 테이블을 반복 탐색하는 조인 방식',
    when: '한쪽 테이블이 작고 다른 쪽에 인덱스가 있을 때 옵티마이저가 선택합니다. OLTP(온라인 트랜잭션) 환경에서 소량 조인에 자주 사용됩니다.',
    problem: '바깥 테이블의 행 수가 많으면 안쪽 테이블을 그만큼 반복 탐색해야 하므로 매우 느려질 수 있습니다. 대량 데이터 조인에는 부적합합니다.',
    ok: '바깥 테이블이 소량이고 안쪽 테이블에 효과적인 인덱스가 있으면 매우 빠릅니다. 온라인 화면 조회에서 가장 흔한 조인 방식입니다.',
    planExample: `--------------------------------------------------------------
| Id  | Operation                    | Name      | Rows | Cost|
--------------------------------------------------------------
|   0 | SELECT STATEMENT             |           |   10 |  15 |
|   1 |  NESTED LOOPS                |           |   10 |  15 |
|*  2 |   TABLE ACCESS FULL          | DEPT      |    5 |   3 |
|   3 |   TABLE ACCESS BY INDEX ROWID| EMP       |    2 |   2 |
|*  4 |    INDEX RANGE SCAN          | IDX_DEPT  |    2 |   1 |
--------------------------------------------------------------`,
    highlightLines: [3],
    relatedCategory: 'sql-tuning',
  },
  {
    id: 'hash-join',
    title: 'Hash Join',
    color: '#8B5CF6',
    summary: '작은 테이블로 검색표(해시 테이블)를 만들어 큰 테이블과 빠르게 매칭하는 조인',
    when: '양쪽 테이블 모두 대량이거나, 조인 컬럼에 인덱스가 없을 때 옵티마이저가 선택합니다. 배치 처리나 분석 쿼리에서 자주 사용됩니다.',
    problem: '작은 테이블을 메모리에 올려야 하므로, 메모리가 부족하면 디스크를 사용하게 되어 성능이 급격히 저하됩니다. 또한 등가 조인(=)에서만 사용 가능합니다.',
    ok: '대량 데이터 간의 등가 조인에서는 Nested Loop보다 훨씬 효율적입니다. 메모리가 충분하면 매우 빠른 조인 방식입니다.',
    planExample: `--------------------------------------------------------------
| Id  | Operation            | Name      | Rows  | Cost      |
--------------------------------------------------------------
|   0 | SELECT STATEMENT     |           |  5000 |   120     |
|*  1 |  HASH JOIN           |           |  5000 |   120     |
|   2 |   TABLE ACCESS FULL  | DEPT      |    50 |     3     |
|   3 |   TABLE ACCESS FULL  | EMP       | 10000 |   100     |
--------------------------------------------------------------`,
    highlightLines: [3],
    relatedCategory: 'sql-tuning',
  },
  {
    id: 'sort-operation',
    title: 'Sort Operation',
    color: '#F59E0B',
    summary: '데이터를 특정 순서로 정렬하는 작업',
    when: 'ORDER BY, GROUP BY, DISTINCT, UNION 등 정렬이 필요한 SQL에서 발생합니다. 윈도우 함수(ROW_NUMBER, RANK 등)에서도 내부적으로 정렬이 수행됩니다.',
    problem: '정렬할 데이터가 메모리(Sort Area)보다 크면 디스크 임시 공간을 사용하게 됩니다. 이때 성능이 크게 저하되며, 실행계획에 "SORT ORDER BY" 등이 나타납니다.',
    ok: '소량 데이터의 정렬은 메모리 안에서 빠르게 끝납니다. 인덱스를 활용하면 정렬을 아예 생략할 수도 있습니다.',
    planExample: `--------------------------------------------------------------
| Id  | Operation          | Name       | Rows  | Cost (%CPU)|
--------------------------------------------------------------
|   0 | SELECT STATEMENT   |            |  1000 |   460  (4)|
|   1 |  SORT ORDER BY     |            |  1000 |   460  (4)|
|*  2 |   TABLE ACCESS FULL| EMPLOYEES  |  1000 |   450  (2)|
--------------------------------------------------------------`,
    highlightLines: [3],
    relatedCategory: 'sql-tuning',
  },
  {
    id: 'cardinality',
    title: 'Cardinality',
    color: '#EC4899',
    summary: '옵티마이저가 "이 단계에서 몇 개의 행이 나올 것인가"를 예측한 숫자',
    when: '실행계획의 모든 단계에서 Rows 컬럼에 표시됩니다. 옵티마이저는 이 예측값을 기반으로 어떤 조인 방식, 어떤 접근 방식을 쓸지 결정합니다.',
    problem: '테이블 통계정보가 오래되었거나 부정확하면 Cardinality 예측이 크게 빗나갑니다. 실제 10만 행인데 100행으로 예측하면 Nested Loop을 선택해서 성능이 급격히 나빠질 수 있습니다.',
    ok: '통계정보를 주기적으로 갱신하고, 실행계획의 Rows 값과 실제 행 수를 비교하면 문제를 조기에 발견할 수 있습니다.',
    planExample: `--------------------------------------------------------------
| Id  | Operation          | Name       | Rows  | Cost (%CPU)|
--------------------------------------------------------------
|   0 | SELECT STATEMENT   |            |   100 |    15  (0)|
|*  1 |  TABLE ACCESS FULL | ORDERS     |   100 |    15  (0)|
--------------------------------------------------------------
-- 예측: 100행, 실제: 50,000행 → 통계 부정확!`,
    highlightLines: [3, 5],
    relatedCategory: 'sql-tuning',
  },
];

export default function PlanClient() {
  const [selectedId, setSelectedId] = useState(CONCEPTS[0].id);
  const selected = CONCEPTS.find(c => c.id === selectedId)!;

  return (
    <div>
      {/* Concept Cards */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">핵심 개념</h2>
        <p className="text-sm text-text-sub mb-4">카드를 클릭하면 아래에서 상세 설명과 실행계획 예시를 확인할 수 있습니다.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CONCEPTS.map(concept => {
            const isActive = concept.id === selectedId;
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedId(concept.id)}
                className={`text-left bg-surface border-2 rounded-lg p-4 transition-all active:scale-[0.98] ${
                  isActive
                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: concept.color }}
                  />
                  <h3 className={`font-semibold text-sm ${isActive ? 'text-primary' : ''}`}>
                    {concept.title}
                  </h3>
                </div>
                <p className="text-xs text-text-sub line-clamp-2">{concept.summary}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Detail Panel */}
      <section className="mb-12 bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: selected.color }}
          />
          <h3 className="text-xl font-bold">{selected.title}</h3>
        </div>
        <p className="text-sm text-primary font-medium mb-5">{selected.summary}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: explanation */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">언제 발생하나요?</p>
              <p className="text-sm text-text-sub leading-relaxed">{selected.when}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-error/80 mb-1.5 uppercase tracking-wider">언제 문제가 되나요?</p>
              <p className="text-sm text-text-sub leading-relaxed">{selected.problem}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-success/80 mb-1.5 uppercase tracking-wider">언제는 괜찮나요?</p>
              <p className="text-sm text-text-sub leading-relaxed">{selected.ok}</p>
            </div>

            <Link
              href={`/quiz/${selected.relatedCategory}`}
              className="inline-block text-sm px-4 py-2 rounded-lg border border-border hover:border-primary hover:text-primary active:scale-95 transition-all"
            >
              관련 문제 풀기 →
            </Link>
          </div>

          {/* Right: plan example */}
          <div>
            <p className="text-xs font-bold text-text-sub mb-2 uppercase tracking-wider">실행계획 예시</p>
            <PlanBlock text={selected.planExample} highlightLines={selected.highlightLines} />
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanBlock({ text, highlightLines }: { text: string; highlightLines?: number[] }) {
  const lines = text.split('\n');
  return (
    <pre className="bg-code-bg text-code-text rounded-lg p-4 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">
      {lines.map((line, i) => {
        const isHighlighted = highlightLines?.includes(i);
        return (
          <span
            key={i}
            className={isHighlighted ? 'bg-primary/20 text-primary font-bold block' : 'block'}
          >
            {line}
          </span>
        );
      })}
    </pre>
  );
}
