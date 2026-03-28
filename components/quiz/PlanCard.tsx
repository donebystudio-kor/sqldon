'use client';

import { useState } from 'react';
import type { PlanProblem } from '@/types/problem';
import HintSteps from './HintSteps';

interface Props {
  problem: PlanProblem;
  onResult: (correct: boolean) => void;
}

export default function PlanCard({ problem, onResult }: Props) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = (value?: string) => {
    const val = (value || answer).trim();
    if (!val) return;
    const correct = val.toLowerCase() === problem.correctAnswer.toLowerCase();
    setResult(correct ? 'correct' : 'wrong');
    onResult(correct);
  };

  return (
    <div>
      {/* Plan Text */}
      <div className="mb-4">
        <p className="text-sm font-medium text-text-sub mb-1">실행계획</p>
        <pre className="bg-code-bg text-code-text rounded-lg p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
          {problem.planText}
        </pre>
      </div>

      {/* Question */}
      <div className="bg-surface border border-border rounded-lg p-4 mb-4">
        <p>{problem.question}</p>
      </div>

      {/* Choices or Input */}
      {problem.choices && problem.choices.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {problem.choices.map(choice => (
            <button
              key={choice}
              onClick={() => {
                if (result !== null) return;
                setAnswer(choice);
                handleSubmit(choice);
              }}
              disabled={result !== null}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                answer === choice && result === 'correct'
                  ? 'border-success bg-success/10 text-success'
                  : answer === choice && result === 'wrong'
                  ? 'border-error bg-error/10 text-error'
                  : 'border-border hover:border-primary'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="답을 입력하세요..."
            className="flex-1 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={result !== null}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          {result === null && (
            <button
              onClick={() => handleSubmit()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              제출
            </button>
          )}
        </div>
      )}

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
            {result === 'correct' ? '정답입니다!' : `오답입니다. 정답: ${problem.correctAnswer}`}
          </p>
          <p className="text-sm mt-1 text-text-sub">{problem.explanation}</p>
        </div>
      )}

      {/* Hints */}
      {result === null && (
        <HintSteps hints={problem.hints} onShowAnswer={() => setShowAnswer(true)} />
      )}

      {showAnswer && (
        <div className="mt-4 p-4 bg-primary-light rounded-lg">
          <p className="text-sm font-medium">정답: {problem.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
