'use client';

import { useState } from 'react';
import type { OxProblem } from '@/types/problem';
import HintSteps from './HintSteps';

interface Props {
  problem: OxProblem;
  onResult: (correct: boolean) => void;
}

export default function OxCard({ problem, onResult }: Props) {
  const [selected, setSelected] = useState<'O' | 'X' | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
    // After show answer, reveal correct
    if (showAnswer && choice === problem.answer) {
      return 'border-success bg-success/10 text-success';
    }
    // Selected wrong
    if (choice === selected && result === 'wrong') {
      return 'border-error bg-error/10 text-error';
    }
    // Selected correct
    if (choice === selected && result === 'correct') {
      return 'border-success bg-success/10 text-success';
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
              ? 'bg-success/5 border-success/30'
              : 'bg-error/5 border-error/30'
          }`}
        >
          {result === 'correct' ? (
            <p className="font-medium text-success">정답입니다!</p>
          ) : (
            <>
              <p className="font-medium text-error mb-1">틀렸습니다.</p>
              <p className="text-sm text-text-sub">
                문장을 다시 한번 꼼꼼히 읽어보세요. 핵심 키워드의 정확한 의미에 주목하면 답을 찾을 수 있습니다.
              </p>
            </>
          )}
        </div>
      )}

      {/* Hints */}
      {problem.hints && (
        <HintSteps
          hints={problem.hints}
          submitted={result !== null}
          onShowAnswer={() => setShowAnswer(true)}
        />
      )}

      {/* Explanation + answer (only after showAnswer or correct) */}
      {(showAnswer || result === 'correct') && (
        <div className="mt-4 space-y-3">
          {result === 'wrong' && (
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-sm font-medium">정답: {problem.answer}</p>
            </div>
          )}
          <div className="p-4 bg-surface border border-border rounded-lg">
            <p className="text-sm font-medium mb-1">해설:</p>
            <p className="text-sm text-text-sub">{problem.explanation}</p>
          </div>
          <div className="p-4 bg-primary-light/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium text-primary">학습 포인트:</span>{' '}
              <span className="text-text-sub">{problem.learningPoint}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
