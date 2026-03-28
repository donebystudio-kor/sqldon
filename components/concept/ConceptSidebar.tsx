'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ConceptItem {
  tag: string;
  title: string;
  ready: boolean; // false = 준비 중
}

interface ConceptGroup {
  group: string;
  items: ConceptItem[];
}

const CONCEPT_NAV: ConceptGroup[] = [
  {
    group: '기초 SQL',
    items: [
      { tag: 'select', title: 'SELECT 문', ready: true },
      { tag: 'where', title: 'WHERE 조건', ready: true },
      { tag: 'order-by', title: 'ORDER BY 정렬', ready: true },
      { tag: 'distinct', title: 'DISTINCT 중복 제거', ready: true },
      { tag: 'null-handling', title: 'NULL 처리', ready: true },
    ],
  },
  {
    group: 'JOIN',
    items: [
      { tag: 'join', title: 'JOIN 개념', ready: true },
      { tag: 'inner-join', title: 'INNER JOIN', ready: true },
      { tag: 'left-right-join', title: 'LEFT / RIGHT JOIN', ready: true },
    ],
  },
  {
    group: '집계',
    items: [
      { tag: 'group-by', title: 'GROUP BY', ready: true },
      { tag: 'having', title: 'HAVING', ready: true },
    ],
  },
  {
    group: '윈도우 함수',
    items: [
      { tag: 'window-function', title: '윈도우 함수', ready: true },
      { tag: 'partition-by', title: 'PARTITION BY', ready: true },
      { tag: 'rank-row-number', title: 'RANK / ROW_NUMBER', ready: true },
    ],
  },
  {
    group: '튜닝 / 실행계획',
    items: [
      { tag: 'full-table-scan', title: 'Full Table Scan', ready: true },
      { tag: 'index-range-scan', title: 'Index Range Scan', ready: true },
    ],
  },
  {
    group: '오라클 아키텍처',
    items: [
      { tag: 'sga', title: 'SGA 구조', ready: true },
      { tag: 'pga', title: 'PGA', ready: true },
      { tag: 'bg-processes', title: '백그라운드 프로세스', ready: true },
    ],
  },
];

interface Props {
  currentTag: string;
  mode: 'sidebar' | 'dropdown';
}

export default function ConceptSidebar({ currentTag, mode }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Find which group the current tag belongs to
  const currentGroup = CONCEPT_NAV.find(g => g.items.some(i => i.tag === currentTag))?.group;
  const currentTitle = CONCEPT_NAV.flatMap(g => g.items).find(i => i.tag === currentTag)?.title || '개념 선택';

  // Accordion: open groups (current group always open)
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(currentGroup ? [currentGroup] : []));

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const navContent = (
    <nav className="space-y-1">
      {CONCEPT_NAV.map(group => {
        const isOpen = openGroups.has(group.group);
        const hasActive = group.items.some(i => i.tag === currentTag);

        return (
          <div key={group.group}>
            <button
              onClick={() => toggleGroup(group.group)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                hasActive ? 'text-primary bg-primary-light' : 'text-text-sub hover:bg-bg'
              }`}
            >
              <span>{group.group}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <ul className="mt-1 ml-2 space-y-0.5 pb-2">
                {group.items.map(item => {
                  const isActive = item.tag === currentTag;

                  if (!item.ready) {
                    return (
                      <li key={item.tag}>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-text-muted cursor-default">
                          {item.title}
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-border text-text-muted font-medium">
                            준비 중
                          </span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={item.tag}>
                      <Link
                        href={`/concept/${item.tag}`}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-primary text-white font-semibold'
                            : 'text-text-sub hover:bg-primary-light hover:text-primary'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  if (mode === 'sidebar') {
    return (
      <div className="sticky top-20">
        <p className="text-sm font-bold mb-3">개념 목록</p>
        {navContent}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-border text-sm font-medium active:scale-[0.98] transition-all"
      >
        <span>📋 {currentTitle}</span>
        <span className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {mobileOpen && (
        <div className="mt-2 bg-white border border-border rounded-xl p-4 shadow-lg">
          {navContent}
        </div>
      )}
    </div>
  );
}
