'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CONCEPTS } from '@/data/concepts';
import { CONCEPT_CATEGORIES } from '@/types/concept';

interface Props {
  currentTag: string;
  mode: 'sidebar' | 'dropdown';
}

const NAV_GROUPS = CONCEPT_CATEGORIES
  .map(cat => ({
    group: cat.name,
    catId: cat.id,
    items: CONCEPTS
      .filter(c => c.category === cat.id)
      .map(c => ({ tag: c.tag, title: c.title })),
  }))
  .filter(g => g.items.length > 0);

export default function ConceptSidebar({ currentTag, mode }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentGroup = NAV_GROUPS.find(g => g.items.some(i => i.tag === currentTag))?.group;
  const currentTitle = NAV_GROUPS.flatMap(g => g.items).find(i => i.tag === currentTag)?.title || '개념 선택';

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
      {NAV_GROUPS.map(group => {
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
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold">개념 목록</p>
          <Link href="/concept" className="text-xs text-primary hover:underline">
            전체 보기
          </Link>
        </div>
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
