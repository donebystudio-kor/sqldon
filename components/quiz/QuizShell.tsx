'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Problem, CategoryId } from '@/types/problem';
import { storage } from '@/lib/local-storage';
import { ALL_PROBLEMS } from '@/data/problems';
import { CATEGORIES } from '@/constants/categories';
import BookmarkButton from '@/components/shared/BookmarkButton';
import FillCard from './FillCard';
import OxCard from './OxCard';
import PlanCard from './PlanCard';

interface Props {
  problems: Problem[];
  category: CategoryId;
  categoryName: string;
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  basic: { label: '기초', color: 'bg-success/10 text-success' },
  intermediate: { label: '중급', color: 'bg-warning/10 text-warning' },
  advanced: { label: '고급', color: 'bg-error/10 text-error' },
};

const TYPE_LABELS: Record<string, string> = {
  fill: '빈칸 채우기',
  ox: 'O/X',
  plan: '실행계획',
};

const TYPE_GUIDE: Record<string, string> = {
  fill: '빈칸을 채워 쿼리를 완성하세요',
  ox: '문장이 맞으면 O, 틀리면 X를 선택하세요',
  plan: '병목이 의심되는 부분을 판단하세요',
};

const CATEGORY_ORDER: CategoryId[] = [
  'sql-basic', 'sql-join', 'sql-aggregate', 'sql-subquery',
  'sql-window', 'sql-tuning', 'oracle-arch',
];

function getNextCategory(current: CategoryId): CategoryId | null {
  const idx = CATEGORY_ORDER.indexOf(current);
  if (idx < 0 || idx >= CATEGORY_ORDER.length - 1) return null;
  return CATEGORY_ORDER[idx + 1];
}

function getCategoryCorrectRate(category: CategoryId): number {
  const progress = storage.getProgress();
  const probs = ALL_PROBLEMS.filter(p => p.category === category && p.type !== 'write');
  if (probs.length === 0) return 0;
  const solved = probs.filter(p => p.id in progress);
  if (solved.length === 0) return 0;
  const correct = solved.filter(p => progress[p.id] === true).length;
  return Math.round((correct / probs.length) * 100);
}

function getGlobalProgress(): { solved: number; total: number } {
  const progress = storage.getProgress();
  const total = ALL_PROBLEMS.filter(p => p.type !== 'write').length;
  const solved = Object.values(progress).filter(v => v === true).length;
  return { solved, total };
}

export default function QuizShell({ problems, category, categoryName }: Props) {
  const availableProblems = problems.filter(p => p.type !== 'write');

  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [globalProgress, setGlobalProgress] = useState({ solved: 0, total: 16 });

  useEffect(() => {
    storage.setRecentCategory(category);
    setGlobalProgress(getGlobalProgress());
  }, [category]);

  const problem = availableProblems[index];
  if (!problem) {
    return (
      <div className="text-center py-16 text-text-sub">
        이 카테고리에 문제가 없습니다.
      </div>
    );
  }

  const diff = DIFFICULTY_LABELS[problem.difficulty] || { label: problem.difficulty, color: '' };
  const progress = ((index + 1) / availableProblems.length) * 100;
  const isLastProblem = index >= availableProblems.length - 1;

  const handleResult = (correct: boolean) => {
    storage.markSolved(problem.id, correct);
    if (!correct) {
      storage.addWrongAnswer(problem.id);
    } else {
      storage.removeWrongAnswer(problem.id);
    }
    setSubmitted(true);
    setLastResult(correct ? 'correct' : 'wrong');
    setGlobalProgress(getGlobalProgress());
  };

  const goTo = (i: number) => {
    setIndex(i);
    setKey(k => k + 1);
    setSubmitted(false);
    setLastResult(null);
  };

  const handleRetry = () => {
    setKey(k => k + 1);
    setSubmitted(false);
    setLastResult(null);
  };

  const conceptTag = problem.relatedConceptTags?.[0];

  // Completion state for last problem
  const nextCategoryId = getNextCategory(category);
  const nextCategory = nextCategoryId ? CATEGORIES.find(c => c.id === nextCategoryId) : null;
  const correctRate = getCategoryCorrectRate(category);
  const canAdvance = correctRate >= 70;

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4 text-xs text-text-muted">
        <span>전체 {globalProgress.solved} / {globalProgress.total} 완료</span>
        <Link href="/result" className="hover:text-primary transition-colors">현황 보기 →</Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-bold">{categoryName}</h2>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${diff.color}`}>
            {diff.label}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-light text-primary">
            {TYPE_LABELS[problem.type] || problem.type}
          </span>
        </div>
        <BookmarkButton problemId={problem.id} />
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-text-sub mb-1">
          <span>{index + 1} / {availableProblems.length} 문제</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6">
        <p className="text-xs text-primary font-medium mb-2">
          {TYPE_GUIDE[problem.type] || '문제를 풀어보세요'}
        </p>
        <h3 className="font-semibold mb-2">{problem.title}</h3>
        <p className="text-text-sub">{problem.question}</p>
      </div>

      {/* Problem Card */}
      <div key={key}>
        {problem.type === 'fill' && (
          <FillCard problem={problem} onResult={handleResult} />
        )}
        {problem.type === 'ox' && (
          <OxCard problem={problem} onResult={handleResult} />
        )}
        {problem.type === 'plan' && (
          <PlanCard problem={problem} onResult={handleResult} />
        )}
      </div>

      {/* Post-submit actions (not last problem) */}
      {submitted && !isLastProblem && (
        <div className="mt-6 flex flex-wrap gap-2">
          {lastResult === 'wrong' && (
            <>
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary-light active:scale-95 transition-all"
              >
                다시 시도
              </button>
              {conceptTag && (
                <Link
                  href={`/concept/${conceptTag}`}
                  className="px-4 py-2 rounded-lg border border-border text-text-sub text-sm font-medium hover:border-primary hover:text-primary active:scale-95 transition-all"
                >
                  관련 개념 보기
                </Link>
              )}
            </>
          )}
          {lastResult === 'correct' && (
            <button
              onClick={() => goTo(index + 1)}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover active:scale-95 transition-all"
            >
              다음 문제 →
            </button>
          )}
        </div>
      )}

      {/* Last problem completion */}
      {submitted && isLastProblem && lastResult && (
        <div className="mt-6 bg-white border-2 border-primary/20 rounded-2xl p-6">
          <p className="text-lg font-bold mb-1">이 카테고리 문제를 모두 풀었어요!</p>
          <p className="text-sm text-text-sub mb-5">
            {categoryName} 정답률: {correctRate}%
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Next category */}
            {nextCategory ? (
              canAdvance ? (
                <Link
                  href={`/quiz/${nextCategoryId}`}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.97] transition-all shadow-sm shadow-primary/20 text-center"
                >
                  다음 카테고리로 → {nextCategory.name}
                </Link>
              ) : (
                <div className="relative group">
                  <button
                    disabled
                    className="px-5 py-2.5 rounded-xl bg-border text-text-muted text-sm font-semibold cursor-not-allowed text-center w-full"
                  >
                    다음 카테고리로 → {nextCategory.name}
                  </button>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-code-bg text-code-text text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    정답률 70% 이상 시 해제
                  </span>
                </div>
              )
            ) : (
              <span className="px-5 py-2.5 text-sm text-text-sub text-center">
                모든 카테고리를 완료했습니다!
              </span>
            )}

            {/* Result */}
            <Link
              href="/result"
              className="px-5 py-2.5 rounded-xl border-2 border-border text-text-sub text-sm font-semibold hover:border-primary hover:text-primary active:scale-[0.97] transition-all text-center"
            >
              학습 현황 보기
            </Link>

            {/* Wrong answers */}
            <Link
              href="/result#wrong"
              className="px-5 py-2.5 rounded-xl text-text-muted text-sm font-medium hover:text-error active:scale-[0.97] transition-all text-center"
            >
              틀린 문제 다시 풀기
            </Link>
          </div>
        </div>
      )}

      {/* Last problem + wrong: also show retry */}
      {submitted && isLastProblem && lastResult === 'wrong' && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary-light active:scale-95 transition-all"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="px-4 py-2.5 rounded-lg border border-border text-text-sub hover:border-primary hover:text-primary active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-w-[80px]"
        >
          ← 이전
        </button>
        <span className="text-sm text-text-sub">
          {index + 1} / {availableProblems.length}
          {!isLastProblem && (
            <span className="ml-1 hidden sm:inline">({availableProblems.length - index - 1}개 남음)</span>
          )}
        </span>
        <button
          onClick={() => goTo(index + 1)}
          disabled={isLastProblem}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium min-w-[80px] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            submitted && lastResult === 'correct' && !isLastProblem
              ? 'border-primary bg-primary text-white hover:bg-primary-hover'
              : 'border-border text-text-sub hover:border-primary hover:text-primary'
          }`}
        >
          다음 →
        </button>
      </div>

      {/* Learning Point */}
      {submitted && lastResult === 'correct' && (
        <div className="mt-6 p-4 bg-primary-light/50 rounded-lg">
          <p className="text-sm">
            <span className="font-medium text-primary">학습 포인트:</span>{' '}
            <span className="text-text-sub">{problem.learningPoint}</span>
          </p>
        </div>
      )}
    </div>
  );
}
