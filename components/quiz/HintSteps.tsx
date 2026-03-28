'use client';

import { useState } from 'react';
import type { TypedHints } from '@/types/problem';
import { getTypedHints } from '@/types/problem';

interface Props {
  hints: string[] | TypedHints | undefined;
  submitted?: boolean;
  onShowAnswer?: () => void;
}

const TYPE_STYLE: Record<string, string> = {
  '힌트': 'bg-primary-light text-primary',
  '방향': 'bg-blue-50 text-blue-700',
  '조건': 'bg-amber-50 text-amber-700',
  '오해': 'bg-rose-50 text-rose-700',
};

export default function HintSteps({ hints, submitted, onShowAnswer }: Props) {
  const [revealed, setRevealed] = useState(0);
  const typedHints = getTypedHints(hints);

  if (!typedHints || typedHints.length === 0) return null;

  const allRevealed = revealed >= typedHints.length;

  return (
    <div className="mt-4">
      {typedHints.slice(0, revealed).map((hint, i) => (
        <div
          key={i}
          className="bg-white border border-border rounded-xl px-4 py-3 mb-2 text-sm flex items-start gap-2"
        >
          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${TYPE_STYLE[hint.type] || TYPE_STYLE['힌트']}`}>
            {hint.type}
          </span>
          <span className="text-text-sub">{hint.text}</span>
        </div>
      ))}

      <div className="flex items-center gap-3">
        {!allRevealed && (
          <button
            onClick={() => setRevealed(r => r + 1)}
            className="text-sm px-3 py-1.5 rounded-lg border border-border text-text-sub hover:border-primary hover:text-primary transition-colors"
          >
            힌트 보기 ({revealed}/{typedHints.length})
          </button>
        )}

        {allRevealed && (
          <span className="text-xs text-text-muted">
            모든 힌트 확인 ({typedHints.length}/{typedHints.length})
          </span>
        )}

        {onShowAnswer && (allRevealed || submitted) && (
          <button
            onClick={onShowAnswer}
            className="text-sm px-3 py-1.5 rounded-lg border border-error/30 text-error hover:bg-error/5 transition-colors"
          >
            정답 보기
          </button>
        )}
      </div>
    </div>
  );
}
