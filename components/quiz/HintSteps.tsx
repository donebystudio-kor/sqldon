'use client';

import { useState } from 'react';

interface Props {
  hints: string[];
  onShowAnswer?: () => void;
}

export default function HintSteps({ hints, onShowAnswer }: Props) {
  const [revealed, setRevealed] = useState(0);
  const allRevealed = revealed >= hints.length;

  return (
    <div className="mt-4">
      {hints.slice(0, revealed).map((hint, i) => (
        <div
          key={i}
          className="bg-primary-light text-primary rounded-lg px-4 py-2 mb-2 text-sm"
        >
          <span className="font-medium">힌트 {i + 1}:</span> {hint}
        </div>
      ))}

      <div className="flex gap-2">
        {!allRevealed && (
          <button
            onClick={() => setRevealed(r => r + 1)}
            className="text-sm text-primary hover:underline"
          >
            힌트 보기 ({revealed}/{hints.length})
          </button>
        )}
        {allRevealed && onShowAnswer && (
          <button
            onClick={onShowAnswer}
            className="text-sm text-error hover:underline"
          >
            정답 보기
          </button>
        )}
      </div>
    </div>
  );
}
