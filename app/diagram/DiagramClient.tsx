'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Component {
  id: string;
  name: string;
  parent?: string;
  summary: string;
  when: string;
  why: string;
  how: string;
  flowSteps?: number[];
  keywords: string[];
  relatedConceptTags?: string[];
  relatedCategories?: string[];
}

const COMPONENTS: Component[] = [
  {
    id: 'sga',
    name: 'SGA (System Global Area)',
    summary: '오라클에서 모든 사용자가 함께 쓰는 공용 메모리 공간',
    when: '오라클 데이터베이스가 시작(startup)될 때 운영체제에서 큰 메모리 덩어리를 한 번에 할당받습니다. 이후 모든 사용자의 SQL 요청이 이 공간을 공유합니다.',
    why: '사용자마다 따로 메모리를 할당하면 같은 데이터를 여러 번 읽게 되어 낭비가 심합니다. 공용 메모리에 한 번 올려두면 모든 사용자가 재활용할 수 있어 속도가 크게 빨라집니다.',
    how: 'SGA 안에는 역할별로 나뉜 여러 영역이 있습니다. 데이터를 캐시하는 Buffer Cache, SQL 분석 결과를 저장하는 Shared Pool, 변경 기록을 임시 보관하는 Redo Log Buffer 등이 대표적입니다. 각 영역을 클릭해서 자세히 알아보세요.',
    flowSteps: [1, 2, 3, 4, 6],
    keywords: ['공유 메모리', '인스턴스', 'SGA_TARGET'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch'],
  },
  {
    id: 'buffer-cache',
    name: 'Database Buffer Cache',
    parent: 'sga',
    summary: '자주 쓰는 데이터를 메모리에 올려두는 캐시 공간',
    when: 'SELECT로 데이터를 조회하거나, UPDATE/INSERT로 데이터를 변경할 때 항상 거치는 곳입니다. 모든 데이터 읽기/쓰기의 중간 거점이라고 보면 됩니다.',
    why: '디스크에서 데이터를 읽는 건 메모리보다 수백~수천 배 느립니다. 한 번 읽은 데이터를 메모리에 보관해두면, 다음에 같은 데이터가 필요할 때 디스크를 다시 읽지 않아도 됩니다. 이것만으로도 성능이 극적으로 개선됩니다.',
    how: '데이터 파일에서 읽은 데이터 조각(블록)을 메모리에 복사해 둡니다. 새로운 데이터가 필요하면 먼저 이 캐시에 있는지 확인하고, 없을 때만 디스크에서 읽어옵니다. 오래 쓰지 않은 데이터는 자동으로 밀려나고 새 데이터가 그 자리를 차지합니다.',
    flowSteps: [3, 4],
    keywords: ['데이터 블록', '캐시', '디스크 I/O'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch', 'sql-tuning'],
  },
  {
    id: 'shared-pool',
    name: 'Shared Pool',
    parent: 'sga',
    summary: 'SQL 분석 결과를 저장해서 같은 SQL을 다시 분석하지 않게 해주는 공간',
    when: '사용자가 SQL을 실행하면 가장 먼저 이곳을 확인합니다. "이 SQL 전에 누가 실행한 적 있나?" 를 체크하는 곳입니다.',
    why: 'SQL을 실행하려면 문법 검사, 권한 확인, 최적의 실행 방법 결정 등 복잡한 분석 과정을 거칩니다. 이걸 매번 처음부터 하면 시간이 오래 걸립니다. 이전에 분석한 결과를 저장해두면 같은 SQL이 올 때 바로 실행할 수 있습니다.',
    how: '내부에 Library Cache(SQL 분석 결과 저장소)와 Dictionary Cache(테이블/컬럼 정보 저장소)가 있습니다. 같은 SQL이 다시 오면 저장된 실행계획을 재사용합니다. 이걸 "Soft Parse"라고 부르며, 처음부터 분석하는 "Hard Parse"보다 훨씬 빠릅니다.',
    flowSteps: [1, 2],
    keywords: ['SQL 파싱', '실행계획 캐시', 'Soft Parse'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch', 'sql-tuning'],
  },
  {
    id: 'redo-log-buffer',
    name: 'Redo Log Buffer',
    parent: 'sga',
    summary: '데이터 변경 내역을 임시로 기록하는 메모장 같은 공간',
    when: 'INSERT, UPDATE, DELETE 같은 데이터 변경 작업이 일어날 때마다 "무엇이 바뀌었는지"를 기록합니다.',
    why: '만약 서버가 갑자기 꺼지면 메모리에 있던 변경 내용이 사라집니다. 하지만 변경 기록이 파일에 남아 있으면, 서버를 다시 켤 때 그 기록을 보고 데이터를 복구할 수 있습니다. 즉, 데이터 안전을 위한 보험 역할입니다.',
    how: '변경이 발생하면 먼저 이 버퍼에 기록하고, 주기적으로(또는 커밋할 때) 디스크의 Redo Log 파일에 저장합니다. 디스크 쓰기를 모아서 한 번에 하기 때문에 매번 디스크에 쓰는 것보다 빠릅니다.',
    flowSteps: [6],
    keywords: ['변경 기록', '복구', '커밋'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch'],
  },
  {
    id: 'large-pool',
    name: 'Large Pool',
    parent: 'sga',
    summary: '특수한 대용량 작업을 위해 따로 마련된 메모리 공간',
    when: '백업(RMAN), 여러 CPU가 동시에 처리하는 병렬 쿼리, 또는 많은 사용자가 동시 접속하는 환경에서 사용됩니다.',
    why: 'Shared Pool은 SQL 분석용으로 중요한 공간인데, 백업이나 병렬 처리 같은 큰 작업이 그 공간을 차지하면 정작 SQL 처리가 느려집니다. 그래서 큰 작업은 따로 분리된 공간을 사용합니다.',
    how: '오라클이 백업을 수행하거나 병렬 쿼리를 실행할 때 자동으로 이 영역을 사용합니다. 일반적인 SQL 실행에서는 직접 접하지 않는 영역이지만, 대규모 운영 환경에서는 중요합니다.',
    keywords: ['백업', '병렬 처리', '대용량'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch'],
  },
  {
    id: 'pga',
    name: 'PGA (Program Global Area)',
    summary: '각 사용자(세션)가 혼자만 쓰는 개인 작업 공간',
    when: '사용자가 오라클에 접속하면 그 사용자 전용으로 할당됩니다. SQL에서 정렬이나 조인이 필요할 때 이 공간에서 작업합니다.',
    why: 'SGA는 모두가 공유하는 공간이라 개인적인 중간 계산을 하기에 적합하지 않습니다. ORDER BY로 정렬하거나 두 테이블을 조인할 때는 임시로 데이터를 쌓아놓고 처리해야 하는데, 이런 작업은 개인 전용 공간이 필요합니다.',
    how: '접속한 사용자마다 하나의 PGA가 만들어집니다. SQL이 정렬이 필요하면 PGA 안의 Sort Area에서 처리하고, 해시 조인이 필요하면 Hash Area에서 처리합니다. 작업이 끝나면 공간이 반환됩니다.',
    flowSteps: [5],
    keywords: ['개인 메모리', '정렬', '조인 처리'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch', 'sql-tuning'],
  },
  {
    id: 'sort-area',
    name: 'Sort Area',
    parent: 'pga',
    summary: 'ORDER BY, GROUP BY 등 정렬이 필요할 때 쓰는 작업 공간',
    when: 'SQL에 ORDER BY, GROUP BY, DISTINCT, UNION이 포함되어 있으면 데이터를 정렬해야 합니다. 이때 Sort Area가 사용됩니다.',
    why: '정렬은 데이터를 비교하고 순서를 바꾸는 작업이라 임시 공간이 필요합니다. 이 공간이 충분하면 메모리 안에서 빠르게 끝나지만, 부족하면 디스크를 사용해야 해서 속도가 크게 떨어집니다.',
    how: '정렬할 데이터를 Sort Area에 올려놓고 메모리 안에서 정렬합니다. 데이터가 Sort Area보다 크면 일부를 디스크 임시 공간에 저장했다가 다시 합치는 방식으로 처리합니다. 실행계획에서 "SORT ORDER BY" 같은 항목이 보이면 이 영역이 사용된 것입니다.',
    flowSteps: [5],
    keywords: ['메모리 정렬', '디스크 정렬', 'ORDER BY'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch', 'sql-tuning'],
  },
  {
    id: 'hash-area',
    name: 'Hash Area',
    parent: 'pga',
    summary: '두 테이블을 빠르게 조인하기 위한 작업 공간',
    when: '옵티마이저가 Hash Join을 선택했을 때 사용됩니다. 보통 한쪽 테이블이 작고 다른 쪽이 클 때 이 방식이 선택됩니다.',
    why: '두 테이블을 조인할 때 모든 조합을 하나씩 비교하면 너무 느립니다. 작은 테이블로 먼저 해시 테이블(검색표)을 만들어두면, 큰 테이블의 각 행을 해시값으로 빠르게 매칭할 수 있습니다.',
    how: '작은 테이블의 데이터를 Hash Area에 올려 해시 테이블을 만듭니다. 그 다음 큰 테이블을 한 행씩 읽으면서 해시 테이블에서 일치하는 값을 찾습니다. 메모리가 부족하면 디스크를 사용하게 되어 느려집니다.',
    flowSteps: [5],
    keywords: ['Hash Join', '해시 테이블', '조인 성능'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch', 'sql-tuning'],
  },
  {
    id: 'bg-processes',
    name: '백그라운드 프로세스',
    summary: '사용자 몰래 뒤에서 오라클을 관리하는 자동 프로그램들',
    when: '오라클이 실행되는 동안 항상 돌아가고 있습니다. 사용자가 직접 제어하지 않지만, 데이터를 저장하고 복구하고 정리하는 핵심 역할을 합니다.',
    why: '사용자가 데이터를 변경할 때마다 바로 디스크에 쓰면 너무 느립니다. 대신 메모리에서 작업하고, 백그라운드 프로세스가 적절한 시점에 디스크에 기록합니다. 또한 서버 장애 시 자동 복구, 비정상 종료된 세션 정리 등도 담당합니다.',
    how: 'DBWn은 Buffer Cache의 변경된 데이터를 디스크에 기록합니다. LGWR은 Redo Log Buffer를 Redo Log 파일에 저장합니다. SMON은 서버 재시작 시 자동 복구를 수행하고, PMON은 비정상 종료된 사용자 세션을 정리합니다.',
    flowSteps: [4, 6],
    keywords: ['DBWn', 'LGWR', 'SMON', 'PMON'],
    relatedConceptTags: ['sga'],
    relatedCategories: ['oracle-arch'],
  },
];

const SQL_FLOW = [
  { step: 'SQL 파싱 (Shared Pool)', detail: '문법 검사, 권한 확인, 이전에 실행된 적 있는 SQL인지 확인' },
  { step: '실행계획 생성', detail: '옵티마이저가 가장 빠른 실행 방법을 결정' },
  { step: 'Buffer Cache에서 데이터 찾기', detail: '필요한 데이터가 메모리에 있는지 확인' },
  { step: '없으면 디스크에서 읽어오기', detail: '메모리에 없는 데이터는 디스크에서 가져와 Buffer Cache에 저장' },
  { step: 'PGA에서 정렬/조인 처리', detail: 'ORDER BY, JOIN 등 중간 계산이 필요하면 개인 작업 공간에서 수행' },
  { step: '변경 내역 기록 (Redo Log Buffer)', detail: 'INSERT/UPDATE/DELETE가 있으면 복구용 기록 저장' },
  { step: '결과 반환', detail: '처리된 결과를 사용자에게 전달' },
];

export default function DiagramClient() {
  const [selected, setSelected] = useState<Component>(
    COMPONENTS.find(c => c.id === 'buffer-cache')!
  );

  const topLevel = COMPONENTS.filter(c => !c.parent);

  const renderBox = (comp: Component) => {
    const children = COMPONENTS.filter(c => c.parent === comp.id);
    const isSelected = selected.id === comp.id;

    return (
      <div
        key={comp.id}
        onClick={e => {
          e.stopPropagation();
          setSelected(comp);
        }}
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
          isSelected
            ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <h3 className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}>
            {comp.name}
          </h3>
          {isSelected && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
              선택됨
            </span>
          )}
        </div>
        {children.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {children.map(child => {
              const isChildSelected = selected.id === child.id;
              return (
                <div
                  key={child.id}
                  onClick={e => {
                    e.stopPropagation();
                    setSelected(child);
                  }}
                  className={`border rounded-md p-2 text-xs cursor-pointer transition-all ${
                    isChildSelected
                      ? 'border-primary bg-primary/10 font-bold text-primary ring-1 ring-primary/30 shadow-sm'
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {child.name}
                    {isChildSelected && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderDetailPanel = () => (
    <div className="bg-surface border border-border rounded-lg p-6 lg:sticky lg:top-20">
      <h3 className="font-bold text-lg mb-1">{selected.name}</h3>
      <p className="text-sm text-primary font-medium mb-4">{selected.summary}</p>

      {/* When */}
      <div className="mb-4">
        <p className="text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">언제 사용되나요?</p>
        <p className="text-sm text-text-sub leading-relaxed">{selected.when}</p>
      </div>

      {/* Why */}
      <div className="mb-4">
        <p className="text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">왜 필요한가요?</p>
        <p className="text-sm text-text-sub leading-relaxed">{selected.why}</p>
      </div>

      {/* How */}
      <div className="mb-4">
        <p className="text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">어떻게 동작하나요?</p>
        <p className="text-sm text-text-sub leading-relaxed">{selected.how}</p>
      </div>

      {/* Flow step reference */}
      {selected.flowSteps && selected.flowSteps.length > 0 && (
        <div className="mb-4 p-3 bg-primary-light/50 rounded-lg">
          <p className="text-xs font-semibold text-primary mb-1">SQL 실행 흐름에서의 위치</p>
          <p className="text-xs text-text-sub">
            아래 실행 흐름의 <span className="font-bold text-primary">{selected.flowSteps.join(', ')}단계</span>에서 사용됩니다.
          </p>
        </div>
      )}

      {/* Keywords */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-text-sub mb-2">관련 키워드</p>
        <div className="flex flex-wrap gap-1.5">
          {selected.keywords.map(kw => (
            <span
              key={kw}
              className="px-2 py-0.5 rounded-full text-xs bg-primary-light text-primary font-medium"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Related links */}
      {selected.relatedCategories && selected.relatedCategories.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-1.5">
            {selected.relatedCategories.map(cat => (
              <Link
                key={cat}
                href={`/quiz/${cat}`}
                className="text-xs px-2 py-1 rounded border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {cat} 문제 풀기 →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Desktop: 2-column (diagram + detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Diagram */}
        <div className="lg:col-span-3">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-center">Oracle Instance</h2>
            <div className="space-y-4">
              {topLevel.map(comp => renderBox(comp))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {renderDetailPanel()}
        </div>
      </div>

      {/* SQL Flow */}
      <div className="mt-6 bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold mb-2">SQL 실행 흐름</h2>
        <p className="text-sm text-text-sub mb-4">SQL을 실행하면 오라클 내부에서 이런 순서로 처리됩니다.</p>
        <ol className="space-y-3">
          {SQL_FLOW.map((item, i) => {
            const isRelated = selected.flowSteps?.includes(i + 1);
            return (
              <li
                key={i}
                className={`flex gap-3 items-start p-2 rounded-lg transition-colors ${
                  isRelated ? 'bg-primary/5' : ''
                }`}
              >
                <span className={`shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  isRelated ? 'bg-primary text-white' : 'bg-border text-text-sub'
                }`}>
                  {i + 1}
                </span>
                <div>
                  <p className={`text-sm font-medium ${isRelated ? 'text-primary' : ''}`}>{item.step}</p>
                  <p className="text-xs text-text-sub mt-0.5">{item.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
