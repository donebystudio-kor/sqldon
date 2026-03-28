'use client';

import { useState } from 'react';

interface Component {
  id: string;
  name: string;
  parent?: string;
  description: string;
}

const COMPONENTS: Component[] = [
  {
    id: 'sga',
    name: 'SGA (System Global Area)',
    description:
      '모든 서버 프로세스가 공유하는 메모리 영역입니다. 오라클 인스턴스 시작 시 할당되며, Database Buffer Cache, Shared Pool, Redo Log Buffer 등으로 구성됩니다.',
  },
  {
    id: 'buffer-cache',
    name: 'Database Buffer Cache',
    parent: 'sga',
    description:
      '데이터 파일에서 읽은 데이터 블록을 캐시합니다. 동일 블록에 대한 반복 디스크 I/O를 줄여 성능을 향상시킵니다.',
  },
  {
    id: 'shared-pool',
    name: 'Shared Pool',
    parent: 'sga',
    description:
      'SQL 파싱 결과(Library Cache)와 데이터 딕셔너리 정보(Dictionary Cache)를 캐시합니다. Hard Parse를 줄이는 핵심 영역입니다.',
  },
  {
    id: 'redo-log-buffer',
    name: 'Redo Log Buffer',
    parent: 'sga',
    description:
      '변경 사항(Redo Entry)을 임시 저장합니다. LGWR 프로세스가 주기적으로 Redo Log File에 기록합니다.',
  },
  {
    id: 'large-pool',
    name: 'Large Pool',
    parent: 'sga',
    description:
      'RMAN 백업, 병렬 쿼리, 세션 메모리 등 대용량 메모리 할당에 사용됩니다.',
  },
  {
    id: 'pga',
    name: 'PGA (Program Global Area)',
    description:
      '각 서버 프로세스 전용 메모리 영역입니다. SQL 정렬, 해시 조인 등의 작업 영역(Work Area)과 세션 정보를 포함합니다.',
  },
  {
    id: 'sort-area',
    name: 'Sort Area',
    parent: 'pga',
    description:
      'ORDER BY, GROUP BY, DISTINCT 등 정렬 작업에 사용되는 메모리 영역입니다. 부족하면 디스크 정렬이 발생합니다.',
  },
  {
    id: 'hash-area',
    name: 'Hash Area',
    parent: 'pga',
    description:
      'Hash Join 수행 시 해시 테이블을 구성하는 메모리 영역입니다.',
  },
  {
    id: 'bg-processes',
    name: '백그라운드 프로세스',
    description:
      'DBWn(Database Writer), LGWR(Log Writer), CKPT(Checkpoint), SMON(System Monitor), PMON(Process Monitor) 등 오라클 인스턴스를 관리하는 프로세스들입니다.',
  },
];

const SQL_FLOW = [
  'SQL 파싱 (Shared Pool - Library Cache)',
  '옵티마이저가 실행계획 생성',
  'Buffer Cache에서 데이터 블록 탐색',
  '없으면 데이터 파일에서 읽어 Buffer Cache에 적재',
  'PGA에서 정렬/해시 조인 수행',
  '변경 시 Redo Log Buffer에 기록',
  '결과 반환',
];

export default function DiagramClient() {
  const [selected, setSelected] = useState<Component | null>(null);

  const topLevel = COMPONENTS.filter(c => !c.parent);

  const renderBox = (comp: Component) => {
    const children = COMPONENTS.filter(c => c.parent === comp.id);
    const isSelected = selected?.id === comp.id;

    return (
      <div
        key={comp.id}
        onClick={e => {
          e.stopPropagation();
          setSelected(comp);
        }}
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
          isSelected ? 'border-primary bg-primary-light' : 'border-border hover:border-primary/50'
        }`}
      >
        <h3 className="font-semibold text-sm mb-2">{comp.name}</h3>
        {children.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {children.map(child => {
              const isChildSelected = selected?.id === child.id;
              return (
                <div
                  key={child.id}
                  onClick={e => {
                    e.stopPropagation();
                    setSelected(child);
                  }}
                  className={`border rounded-md p-2 text-xs cursor-pointer transition-all ${
                    isChildSelected
                      ? 'border-primary bg-white font-medium text-primary'
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  {child.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Diagram */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-center">Oracle Instance</h2>
          <div className="space-y-4">
            {topLevel.map(comp => renderBox(comp))}
          </div>
        </div>

        {/* SQL Flow */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">SQL 실행 흐름</h2>
          <ol className="space-y-2">
            {SQL_FLOW.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-text-sub">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-1">
        <div className="bg-surface border border-border rounded-lg p-6 sticky top-20">
          {selected ? (
            <>
              <h3 className="font-bold text-lg mb-3">{selected.name}</h3>
              <p className="text-text-sub text-sm leading-relaxed">{selected.description}</p>
            </>
          ) : (
            <p className="text-text-sub text-sm">
              왼쪽 다이어그램에서 구성 요소를 클릭하면 상세 설명이 여기에 표시됩니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
