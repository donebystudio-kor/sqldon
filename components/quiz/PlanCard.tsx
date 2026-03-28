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
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors active:scale-95 ${
                answer === choice && result === 'correct'
                  ? 'border-success bg-success/10 text-success'
                  : answer === choice && result === 'wrong'
                  ? 'border-error bg-error/10 text-error'
                  : result !== null && showAnswer && choice === problem.correctAnswer
                  ? 'border-success bg-success/10 text-success'
                  : 'border-border hover:border-primary'
              } ${result !== null ? 'cursor-default' : ''}`}
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
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-colors"
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
              ? 'bg-success/5 border-success/30'
              : 'bg-error/5 border-error/30'
          }`}
        >
          {result === 'correct' ? (
            <p className="font-medium text-success">정답입니다!</p>
          ) : (
            <>
              <p className="font-medium text-error mb-1">틀렸습니다.</p>
              {problem.choiceExplanations?.find(c => c.value === answer) ? (
                <p className="text-sm text-text-sub">
                  "{answer}" → {problem.choiceExplanations.find(c => c.value === answer)?.explanation}
                </p>
              ) : (
                <p className="text-sm text-text-sub">
                  실행계획의 각 단계별 비용(Cost)과 오퍼레이션 이름을 다시 확인해보세요.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Hints */}
      <HintSteps
        hints={problem.hints}
        submitted={result !== null}
        onShowAnswer={() => setShowAnswer(true)}
      />

      {/* Answer + Explanation + Learning point (only after showAnswer or correct) */}
      {(showAnswer || result === 'correct') && (
        <div className="mt-4 space-y-3">
          {result === 'wrong' && (
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-sm font-medium">정답: {problem.correctAnswer}</p>
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
