'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { search as doSearch } from '@/lib/search';
import { storage } from '@/lib/local-storage';
import { ALL_PROBLEMS } from '@/data/problems';

const TOTAL_ACTIVE = ALL_PROBLEMS.filter(p => p.type !== 'write').length;

const NAV_ITEMS = [
  { href: '/quiz/sql-basic', label: '문제풀이' },
  { href: '/concept', label: '개념 학습' },
  { href: '/plan', label: '실행계획' },
  { href: '/diagram', label: '아키텍처' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [focused, setFocused] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  // Client-side progress badge
  useEffect(() => {
    const progress = storage.getProgress();
    setSolvedCount(Object.values(progress).filter(v => v === true).length);
  }, []);

  const results = useMemo(() => doSearch(query), [query]);
  const showResults = focused && query.length > 0 && results.length > 0;

  const searchInput = (className: string, autoFocus?: boolean) => (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder="키워드 검색 (JOIN, RANK...)"
        className="w-full pl-9 pr-3 py-2 text-sm bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-text-muted transition-all"
        autoFocus={autoFocus}
      />
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map(r => (
            <Link
              key={`${r.type}-${r.id}`}
              href={r.href}
              onClick={() => { setQuery(''); setFocused(false); setShowSearch(false); }}
              className="block px-4 py-3 hover:bg-bg border-b border-border/50 last:border-0 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  r.type === 'concept' ? 'bg-primary-light text-primary' : 'bg-amber-50 text-amber-700'
                }`}>
                  {r.type === 'concept' ? '개념' : '문제'}
                </span>
                <span className="text-sm font-medium">{r.title}</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5 truncate">{r.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">S</span>
            <span className="text-lg font-bold text-text">SQL던</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-text-sub hover:text-primary hover:bg-primary-light rounded-lg transition-all"
              >
                {item.label}
              </Link>
            ))}
            {/* Progress badge */}
            <Link
              href="/result"
              className="px-3 py-2 text-sm text-text-sub hover:text-primary hover:bg-primary-light rounded-lg transition-all flex items-center gap-1.5"
            >
              학습 현황
              <span className="text-[10px] font-bold bg-primary-light text-primary px-1.5 py-0.5 rounded-full">
                {solvedCount}/{TOTAL_ACTIVE}
              </span>
            </Link>
          </nav>

          <div className="hidden sm:flex items-center flex-1 max-w-xs">
            {searchInput('w-full')}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="sm:hidden p-2 text-text-sub hover:text-primary rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              className="p-2 text-text-sub hover:text-primary rounded-lg transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="메뉴"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="sm:hidden px-4 pb-3 border-t border-border bg-white">
          <div className="mt-3">{searchInput('w-full', true)}</div>
        </div>
      )}

      {open && (
        <nav className="lg:hidden border-t border-border bg-white">
          <div className="px-4 py-2">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-sm text-text-sub hover:text-primary border-b border-border/50 last:border-0 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/result"
              className="block py-3 text-sm text-text-sub hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              학습 현황 {solvedCount}/{TOTAL_ACTIVE}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
