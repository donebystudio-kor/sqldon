'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/local-storage';
import { ALL_PROBLEMS } from '@/data/problems';
import { CATEGORIES } from '@/constants/categories';
import type { CategoryId } from '@/types/problem';

interface CategoryStat {
  id: CategoryId;
  name: string;
  total: number;
  solved: number;
  correct: number;
}

export default function ResultPage() {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const progress = storage.getProgress();
    const wrong = storage.getWrongAnswers();
    const bookmarks = storage.getBookmarks();

    const catStats = CATEGORIES.map(cat => {
      const problems = ALL_PROBLEMS.filter(p => p.category === cat.id);
      const solved = problems.filter(p => p.id in progress).length;
      const correct = problems.filter(p => progress[p.id] === true).length;
      return { id: cat.id, name: cat.name, total: problems.length, solved, correct };
    });

    setStats(catStats);
    setWrongIds(wrong);
    setBookmarkIds(bookmarks);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const totalSolved = stats.reduce((s, c) => s + c.solved, 0);
  const totalCorrect = stats.reduce((s, c) => s + c.correct, 0);
  const totalProblems = ALL_PROBLEMS.length;

  const wrongProblems = wrongIds
    .map(id => ALL_PROBLEMS.find(p => p.id === id))
    .filter(Boolean);

  const bookmarkProblems = bookmarkIds
    .map(id => ALL_PROBLEMS.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">학습 현황</h1>
      <p className="text-text-sub mb-8">진행 상황과 복습이 필요한 문제를 확인하세요.</p>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{totalSolved}/{totalProblems}</p>
          <p className="text-sm text-text-sub">풀이 완료</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-success">
            {totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0}%
          </p>
          <p className="text-sm text-text-sub">정답률</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-warning">{bookmarkIds.length}</p>
          <p className="text-sm text-text-sub">북마크</p>
        </div>
      </div>

      {/* Category Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">카테고리별 진행률</h2>
        <div className="space-y-3">
          {stats.map(cat => {
            const pct = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
            return (
              <Link
                key={cat.id}
                href={`/quiz/${cat.id}`}
                className="block bg-surface border border-border rounded-lg p-4 hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm text-text-sub">
                    {cat.correct}/{cat.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Wrong Answers */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          오답 노트 ({wrongProblems.length}문제)
        </h2>
        {wrongProblems.length === 0 ? (
          <p className="text-text-sub text-sm">틀린 문제가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {wrongProblems.map(p => p && (
              <Link
                key={p.id}
                href={`/quiz/${p.category}`}
                className="flex items-center justify-between bg-surface border border-error/20 rounded-lg p-4 hover:border-error transition-all"
              >
                <div>
                  <span className="font-medium">{p.title}</span>
                  <span className="ml-2 text-xs text-text-sub">{p.category}</span>
                </div>
                <span className="text-sm text-error">다시 풀기 →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bookmarks */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          북마크 ({bookmarkProblems.length}문제)
        </h2>
        {bookmarkProblems.length === 0 ? (
          <p className="text-text-sub text-sm">북마크한 문제가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {bookmarkProblems.map(p => p && (
              <Link
                key={p.id}
                href={`/quiz/${p.category}`}
                className="flex items-center justify-between bg-surface border border-warning/20 rounded-lg p-4 hover:border-warning transition-all"
              >
                <div>
                  <span className="font-medium">{p.title}</span>
                  <span className="ml-2 text-xs text-text-sub">{p.category}</span>
                </div>
                <span className="text-sm text-warning">풀어보기 →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
