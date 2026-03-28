'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Problem, CategoryId } from '@/types/problem';
import { storage } from '@/lib/local-storage';
import BookmarkButton from '@/components/shared/BookmarkButton';
import WriteCard from './WriteCard';
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
  write: '직접 작성',
  fill: '빈칸 채우기',
  ox: 'O/X',
  plan: '실행계획',
};

export default function QuizShell({ problems, category, categoryName }: Props) {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0); // force re-render on navigation

  useEffect(() => {
    storage.setRecentCategory(category);
  }, [category]);

  const problem = problems[index];
  if (!problem) {
    return (
      <div className="text-center py-16 text-text-sub">
        이 카테고리에 문제가 없습니다.
      </div>
    );
  }

  const diff = DIFFICULTY_LABELS[problem.difficulty] || { label: problem.difficulty, color: '' };
  const progress = ((index + 1) / problems.length) * 100;

  const handleResult = (correct: boolean) => {
    storage.markSolved(problem.id, correct);
    if (!correct) {
      storage.addWrongAnswer(problem.id);
    } else {
      storage.removeWrongAnswer(problem.id);
    }
  };

  const goTo = (i: number) => {
    setIndex(i);
    setKey(k => k + 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">{categoryName}</h2>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${diff.color}`}>
            {diff.label}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-light text-primary">
            {TYPE_LABELS[problem.type]}
          </span>
        </div>
        <BookmarkButton problemId={problem.id} />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-text-sub mb-1">
          <span>{index + 1} / {problems.length}</span>
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
      <div className="bg-surface border border-border rounded-lg p-5 mb-6">
        <h3 className="font-semibold mb-2">{problem.title}</h3>
        <p className="text-text-sub">{problem.question}</p>
      </div>

      {/* Problem Card */}
      <div key={key}>
        {problem.type === 'write' && (
          <WriteCard problem={problem} onResult={handleResult} />
        )}
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

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-border">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="px-4 py-2 rounded-lg border border-border text-text-sub hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← 이전
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index >= problems.length - 1}
          className="px-4 py-2 rounded-lg border border-border text-text-sub hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          다음 →
        </button>
      </div>

      {/* Learning Point */}
      <div className="mt-6 p-4 bg-primary-light/50 rounded-lg">
        <p className="text-sm">
          <span className="font-medium text-primary">학습 포인트:</span>{' '}
          <span className="text-text-sub">{problem.learningPoint}</span>
        </p>
      </div>
    </div>
  );
}
