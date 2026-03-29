'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/constants/categories';
import { ALL_PROBLEMS } from '@/data/problems';
import type { Difficulty, CategoryId } from '@/types/problem';

const DIFFICULTY_OPTIONS: { value: Difficulty | 'all'; label: string; desc: string }[] = [
  { value: 'all', label: '전체', desc: '모든 난이도' },
  { value: 'basic', label: '기초', desc: 'WHERE, ORDER BY, 단순 조인' },
  { value: 'intermediate', label: '중급', desc: 'BETWEEN, LIKE, LEFT JOIN, GROUP BY' },
  { value: 'advanced', label: '고급', desc: 'SELF JOIN, 다중 조인, 서브쿼리' },
];

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'fill', label: '빈칸 채우기' },
  { value: 'ox', label: 'O/X' },
  { value: 'plan', label: '실행계획' },
];

export default function QuizSetup() {
  const router = useRouter();
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [type, setType] = useState('all');

  const toggleCategory = (id: string) => {
    setSelectedCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedCats.size === CATEGORIES.length) {
      setSelectedCats(new Set());
    } else {
      setSelectedCats(new Set(CATEGORIES.map(c => c.id)));
    }
  };

  // Count matching problems
  const matchCount = useMemo(() => {
    const cats = selectedCats.size > 0 ? [...selectedCats] : CATEGORIES.map(c => c.id);
    return ALL_PROBLEMS.filter(p => {
      if (p.type === 'write') return false;
      if (!cats.includes(p.category)) return false;
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      if (type !== 'all' && p.type !== type) return false;
      return true;
    }).length;
  }, [selectedCats, difficulty, type]);

  const handleStart = () => {
    // If single category selected, go directly to that category
    if (selectedCats.size === 1) {
      const cat = [...selectedCats][0];
      const params = new URLSearchParams();
      if (difficulty !== 'all') params.set('difficulty', difficulty);
      if (type !== 'all') params.set('type', type);
      const qs = params.toString();
      router.push(`/quiz/${cat}${qs ? `?${qs}` : ''}`);
      return;
    }

    // Multiple categories: go to first selected (or sql-basic) with filters
    const cats = selectedCats.size > 0 ? [...selectedCats] : CATEGORIES.map(c => c.id);
    const params = new URLSearchParams();
    if (selectedCats.size > 1) params.set('categories', cats.join(','));
    if (difficulty !== 'all') params.set('difficulty', difficulty);
    if (type !== 'all') params.set('type', type);
    const qs = params.toString();
    router.push(`/quiz/${cats[0]}${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="space-y-8">
      {/* Category Selection */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">카테고리 선택</h2>
          <button
            onClick={selectAll}
            className="text-sm text-primary hover:underline"
          >
            {selectedCats.size === CATEGORIES.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCats.has(cat.id);
            const count = ALL_PROBLEMS.filter(p => p.category === cat.id && p.type !== 'write').length;
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'border-primary bg-primary-light'
                    : 'border-border bg-white hover:border-border-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}>
                        {cat.name}
                      </span>
                      <span className="text-xs text-text-muted">{count}문제</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{cat.shortDescription}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {selectedCats.size === 0 && (
          <p className="text-xs text-text-muted mt-2">선택하지 않으면 전체 카테고리에서 출제됩니다</p>
        )}
      </section>

      {/* Difficulty */}
      <section>
        <h2 className="text-lg font-bold mb-4">난이도</h2>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all active:scale-95 ${
                difficulty === opt.value
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-text-sub hover:border-border-hover'
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-xs ml-1 opacity-70">{opt.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Problem Type */}
      <section>
        <h2 className="text-lg font-bold mb-4">문제 유형</h2>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all active:scale-95 ${
                type === opt.value
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-text-sub hover:border-border-hover'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Start Button */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-sub">
            {matchCount > 0 ? (
              <>선택 조건에 맞는 문제 <span className="font-bold text-primary">{matchCount}개</span></>
            ) : (
              <span className="text-error">조건에 맞는 문제가 없습니다</span>
            )}
          </p>
          <button
            onClick={handleStart}
            disabled={matchCount === 0}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-hover active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
          >
            시작하기 ({matchCount}문제)
          </button>
        </div>
      </div>
    </div>
  );
}
