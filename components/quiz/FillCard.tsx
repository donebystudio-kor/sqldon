'use client';

import { useState } from 'react';
import type { FillProblem } from '@/types/problem';
import HintSteps from './HintSteps';

interface Props {
  problem: FillProblem;
  onResult: (correct: boolean) => void;
}

export default function FillCard({ problem, onResult }: Props) {
  const [selected, setSelected] = useState<(string | null)[]>(
    Array(problem.blanks).fill(null)
  );
  const [activeBlank, setActiveBlank] = useState(0);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleOptionClick = (option: string) => {
    if (result !== null) return;
    const next = [...selected];
    next[activeBlank] = option;
    setSelected(next);
    if (activeBlank < problem.blanks - 1) {
      setActiveBlank(activeBlank + 1);
    }
  };

  const handleReset = () => {
    setSelected(Array(problem.blanks).fill(null));
    setActiveBlank(0);
    setResult(null);
  };

  const handleSubmit = () => {
    if (selected.some(s => s === null)) return;
    const correct = selected.every((s, i) => s === problem.correctAnswers[i]);
    setResult(correct ? 'correct' : 'wrong');
    onResult(correct);
  };

  // Render template with blanks
  const renderTemplate = () => {
    const parts = problem.sqlTemplate.split('___');
    return (
      <pre className="bg-code-bg text-code-text rounded-lg p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <button
                onClick={() => result === null && setActiveBlank(i)}
                className={`inline-block min-w-[80px] px-2 py-0.5 mx-1 rounded text-sm font-medium border-2 border-dashed ${
                  activeBlank === i && result === null
                    ? 'border-primary bg-primary/20 text-white'
                    : selected[i]
                    ? 'border-success/50 bg-success/20 text-success'
                    : 'border-code-text/30 text-code-text/50'
                }`}
              >
                {selected[i] || `빈칸 ${i + 1}`}
              </button>
            )}
          </span>
        ))}
      </pre>
    );
  };

  return (
    <div>
      {/* Template */}
      <div className="mb-4">{renderTemplate()}</div>

      {/* Options */}
      <div className="flex flex-wrap gap-2 mb-4">
        {problem.options.map(option => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            disabled={result !== null}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-colors ${
              selected.includes(option)
                ? 'bg-primary-light border-primary text-primary'
                : 'border-border hover:border-primary'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Actions */}
      {result === null && (
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={selected.some(s => s === null)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            제출
          </button>
          <button
            onClick={handleReset}
            className="border border-border text-text-sub px-4 py-2 rounded-lg hover:border-primary transition-colors"
          >
            초기화
          </button>
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
          <p className="font-medium">{result === 'correct' ? '정답입니다!' : '오답입니다.'}</p>
          {result === 'wrong' && (
            <p className="text-sm mt-1 text-text-sub">
              정답: {problem.correctAnswers.join(', ')}
            </p>
          )}
          <p className="text-sm mt-1 text-text-sub">{problem.explanation}</p>
        </div>
      )}

      {/* Hints */}
      {result === null && (
        <HintSteps hints={problem.hints} onShowAnswer={() => setShowAnswer(true)} />
      )}

      {showAnswer && (
        <div className="mt-4 p-4 bg-primary-light rounded-lg">
          <p className="text-sm font-medium">정답: {problem.correctAnswers.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
