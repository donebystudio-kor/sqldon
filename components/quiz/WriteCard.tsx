'use client';

import { useState } from 'react';
import type { WriteProblem } from '@/types/problem';
import { checkWriteAnswer } from '@/lib/write-checker';
import HintSteps from './HintSteps';

interface Props {
  problem: WriteProblem;
  onResult: (correct: boolean) => void;
}

export default function WriteCard({ problem, onResult }: Props) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const correct = checkWriteAnswer(answer, problem.acceptableAnswers);
    setResult(correct ? 'correct' : 'wrong');
    onResult(correct);
  };

  return (
    <div>
      {/* Schema */}
      {problem.schema && (
        <div className="mb-4">
          <p className="text-sm font-medium text-text-sub mb-1">테이블 스키마</p>
          <pre className="bg-code-bg text-code-text rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {problem.schema}
          </pre>
        </div>
      )}

      {/* Sample Data */}
      {problem.sampleData && (
        <div className="mb-4">
          <p className="text-sm font-medium text-text-sub mb-1">샘플 데이터</p>
          <div className="overflow-x-auto">
            <table className="text-sm border border-border rounded-lg overflow-hidden w-full">
              <thead>
                <tr className="bg-primary-light">
                  {problem.sampleData.columns.map(col => (
                    <th key={col} className="px-3 py-1.5 text-left font-medium">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {problem.sampleData.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="mb-4">
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="SQL을 입력하세요..."
          className="w-full h-32 bg-code-bg text-code-text rounded-lg p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={result !== null}
        />
      </div>

      {/* Submit */}
      {result === null && (
        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          제출
        </button>
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
          {result === 'wrong' && !showAnswer && (
            <p className="text-sm mt-2 text-text-sub">힌트를 확인하거나 정답을 확인해보세요.</p>
          )}
        </div>
      )}

      {/* Hints - always available, answer button shows after submit */}
      <HintSteps
        hints={problem.hints}
        submitted={result !== null}
        onShowAnswer={() => setShowAnswer(true)}
      />

      {/* Answer + Explanation (only after showAnswer) */}
      {showAnswer && (
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-primary-light rounded-lg">
            <p className="text-sm font-medium mb-2">정답 예시:</p>
            <pre className="bg-code-bg text-code-text rounded-lg p-4 font-mono text-sm overflow-x-auto">
              {problem.acceptableAnswers[0]}
            </pre>
          </div>
          <div className="p-4 bg-surface border border-border rounded-lg">
            <p className="text-sm font-medium mb-1">해설:</p>
            <p className="text-sm text-text-sub">{problem.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
