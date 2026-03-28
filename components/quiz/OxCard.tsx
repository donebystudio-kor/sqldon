'use client';

import { useState } from 'react';
import type { OxProblem } from '@/types/problem';

interface Props {
  problem: OxProblem;
  onResult: (correct: boolean) => void;
}

export default function OxCard({ problem, onResult }: Props) {
  const [selected, setSelected] = useState<'O' | 'X' | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleClick = (choice: 'O' | 'X') => {
    if (result !== null) return;
    setSelected(choice);
    const correct = choice === problem.answer;
    setResult(correct ? 'correct' : 'wrong');
    onResult(correct);
  };

  const getButtonStyle = (choice: 'O' | 'X') => {
    if (result === null) {
      return 'border-border hover:border-primary hover:bg-primary-light';
    }
    if (choice === problem.answer) {
      return 'border-success bg-success/10 text-success';
    }
    if (choice === selected && choice !== problem.answer) {
      return 'border-error bg-error/10 text-error';
    }
    return 'border-border opacity-50';
  };

  return (
    <div>
      {/* Statement */}
      <div className="bg-surface border border-border rounded-lg p-5 mb-6">
        <p className="text-lg">{problem.statement}</p>
      </div>

      {/* O/X Buttons */}
      <div className="flex gap-4 mb-4">
        {(['O', 'X'] as const).map(choice => (
          <button
            key={choice}
            onClick={() => handleClick(choice)}
            disabled={result !== null}
            className={`flex-1 py-6 rounded-lg text-3xl font-bold border-2 transition-all ${getButtonStyle(choice)}`}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            result === 'correct'
              ? 'bg-success/10 border-success text-success'
              : 'bg-error/10 border-error text-error'
          }`}
        >
          <p className="font-medium">
            {result === 'correct' ? '정답입니다!' : `오답입니다. 정답은 ${problem.answer}입니다.`}
          </p>
          <p className="text-sm mt-1 text-text-sub">{problem.explanation}</p>
        </div>
      )}
    </div>
  );
}
