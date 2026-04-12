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
  const [progress, setProgressData] = useState<Record<string, boolean>>({});
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
    setProgressData(progress);
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
      <p className="text-text-sub mb-8">복습이 필요한 문제를 확인하고 다시 풀어보세요.</p>

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

      {/* Quick Actions */}
      {(wrongProblems.length > 0 || bookmarkProblems.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-8">
          {wrongProblems.length > 0 && (
            <Link
              href="#wrong"
              className="px-5 py-2.5 rounded-lg bg-error text-white text-sm font-medium hover:bg-error/90 active:scale-95 transition-all"
            >
              틀린 문제 다시 풀기 ({wrongProblems.length})
            </Link>
          )}
          {bookmarkProblems.length > 0 && (
            <Link
              href="#bookmarks"
              className="px-5 py-2.5 rounded-lg bg-warning text-white text-sm font-medium hover:bg-warning/90 active:scale-95 transition-all"
            >
              북마크 복습 ({bookmarkProblems.length})
            </Link>
          )}
        </div>
      )}

      {/* Category Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">카테고리별 진행률</h2>
        <div className="space-y-3">
          {stats.map(cat => {
            const pct = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
            return (
              <Link
                key={cat.id}
                href={`/quiz/${cat.id}?mode=unsolved`}
                className="block bg-surface border border-border rounded-lg p-4 hover:border-primary active:scale-[0.99] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-sub">
                      {cat.correct}/{cat.total} ({pct}%)
                    </span>
                    <span className="text-xs text-primary font-medium">풀기 →</span>
                  </div>
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

      {/* Tag Performance */}
      {totalSolved > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">태그별 정답률</h2>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const tagStats: Record<string, { correct: number; total: number }> = {};
              ALL_PROBLEMS.filter(p => p.type !== 'write').forEach(p => {
                if (!(p.id in progress)) return;
                p.tags.forEach(tag => {
                  if (!tagStats[tag]) tagStats[tag] = { correct: 0, total: 0 };
                  tagStats[tag].total++;
                  if (progress[p.id]) tagStats[tag].correct++;
                });
              });
              return Object.entries(tagStats)
                .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
                .map(([tag, s]) => {
                  const pct = Math.round((s.correct / s.total) * 100);
                  const color = pct >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : pct >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200';
                  return (
                    <span key={tag} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${color}`}>
                      {tag} {pct}%
                    </span>
                  );
                });
            })()}
          </div>
        </section>
      )}

      {/* Wrong Answers */}
      <section id="wrong" className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          오답 노트 ({wrongProblems.length}문제)
        </h2>
        {wrongProblems.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-6 text-center">
            <p className="text-text-sub text-sm">틀린 문제가 없습니다.</p>
            <p className="text-xs text-text-sub mt-1">문제를 풀면 여기에 오답이 기록됩니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {wrongProblems.map(p => p && (
              <Link
                key={p.id}
                href={`/quiz/${p.category}?mode=wrong`}
                className="flex items-center justify-between bg-surface border-2 border-error/20 rounded-lg p-4 hover:border-error active:scale-[0.99] transition-all"
              >
                <div>
                  <span className="font-medium">{p.title}</span>
                  <span className="ml-2 text-xs text-text-sub">{p.category}</span>
                </div>
                <span className="text-sm text-error font-medium shrink-0 ml-2">다시 풀기 →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bookmarks */}
      <section id="bookmarks" className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          북마크 ({bookmarkProblems.length}문제)
        </h2>
        {bookmarkProblems.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-6 text-center">
            <p className="text-text-sub text-sm">북마크한 문제가 없습니다.</p>
            <p className="text-xs text-text-sub mt-1">문제 풀이 중 별 버튼으로 북마크하세요</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarkProblems.map(p => p && (
              <div
                key={p.id}
                className="flex items-center justify-between bg-surface border-2 border-warning/20 rounded-lg p-4"
              >
                <div>
                  <span className="font-medium">{p.title}</span>
                  <span className="ml-2 text-xs text-text-sub">{p.category}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {p.relatedConceptTags?.[0] && (
                    <Link
                      href={`/concept/${p.relatedConceptTags[0]}`}
                      className="text-xs px-2.5 py-1 rounded border border-border text-text-sub hover:border-primary hover:text-primary transition-colors"
                    >
                      개념 보기
                    </Link>
                  )}
                  <Link
                    href={`/quiz/${p.category}?mode=unsolved`}
                    className="text-sm text-warning font-medium hover:underline"
                  >
                    풀어보기 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
