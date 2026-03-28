'use client';

import { useState } from 'react';
import type { FillProblem } from '@/types/problem';
import HintSteps from './HintSteps';
import { formatSqlTemplate } from '@/lib/format-sql';

interface Props {
  problem: FillProblem;
  onResult: (correct: boolean) => void;
}

// Group options by type for cleaner display
function groupOptions(options: string[]): { label: string; items: string[] }[] {
  const clauses = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'AND', 'OR', 'IN', 'EXISTS'];
  const modifiers = ['ASC', 'DESC', 'DISTINCT', 'ALL', 'ANY'];

  const clauseItems = options.filter(o => clauses.includes(o.toUpperCase()));
  const modifierItems = options.filter(o => modifiers.includes(o.toUpperCase()));
  const otherItems = options.filter(o => !clauseItems.includes(o) && !modifierItems.includes(o));

  const groups: { label: string; items: string[] }[] = [];
  if (clauseItems.length > 0) groups.push({ label: '키워드', items: clauseItems });
  if (modifierItems.length > 0) groups.push({ label: '수식어', items: modifierItems });
  if (otherItems.length > 0) groups.push({ label: '기타', items: otherItems });

  // If only one group, don't label it
  if (groups.length === 1) return [{ label: '', items: options }];
  return groups;
}

export default function FillCard({ problem, onResult }: Props) {
  const [selected, setSelected] = useState<(string | null)[]>(
    Array(problem.blanks).fill(null)
  );
  const [activeBlank, setActiveBlank] = useState(0);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [blankResults, setBlankResults] = useState<boolean[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const handleOptionClick = (option: string) => {
    if (result !== null && !retrying) return;
    const next = [...selected];
    next[activeBlank] = option;
    setSelected(next);

    if (retrying) {
      const nextWrong = blankResults.findIndex((ok, i) => !ok && i > activeBlank);
      if (nextWrong >= 0) setActiveBlank(nextWrong);
    } else {
      if (activeBlank < problem.blanks - 1) setActiveBlank(activeBlank + 1);
    }
  };

  const handleReset = () => {
    setSelected(Array(problem.blanks).fill(null));
    setActiveBlank(0);
    setResult(null);
    setBlankResults([]);
    setRetrying(false);
  };

  const handleSubmit = () => {
    if (selected.some(s => s === null)) return;
    const perBlank = selected.map((s, i) => s === problem.correctAnswers[i]);
    setBlankResults(perBlank);
    const allCorrect = perBlank.every(Boolean);
    setResult(allCorrect ? 'correct' : 'wrong');
    setRetrying(false);
    onResult(allCorrect);
  };

  const handleRetry = () => {
    const next = selected.map((s, i) => blankResults[i] ? s : null);
    setSelected(next);
    setResult(null);
    setRetrying(true);
    const firstWrong = blankResults.findIndex(ok => !ok);
    setActiveBlank(firstWrong >= 0 ? firstWrong : 0);
  };

  const getBlankStyle = (i: number) => {
    if (blankResults.length > 0) {
      if (blankResults[i]) return 'border-success bg-success/20 text-success font-semibold';
      if (!retrying) return 'border-error bg-error/20 text-error font-semibold';
      if (activeBlank === i) return 'border-primary bg-primary/20 text-white';
      return selected[i] ? 'border-warning bg-warning/20 text-warning' : 'border-error/50 bg-error/10 text-error/50';
    }
    if (activeBlank === i && result === null) return 'border-primary bg-primary/20 text-white';
    if (selected[i]) return 'border-success/50 bg-success/20 text-success';
    return 'border-code-text/30 text-code-text/50';
  };

  const isBlankClickable = (i: number) => {
    if (result === null) return true;
    if (retrying && blankResults.length > 0 && !blankResults[i]) return true;
    return false;
  };

  const wrongCount = blankResults.filter(ok => !ok).length;
  const wrongIndices = blankResults.reduce<number[]>((acc, ok, i) => { if (!ok) acc.push(i + 1); return acc; }, []);
  const allFilled = selected.every(s => s !== null);
  const optionGroups = groupOptions(problem.options);

  // Format SQL template with line breaks (blanks preserved)
  const renderTemplate = () => {
    const formatted = formatSqlTemplate(problem.sqlTemplate);
    const parts = formatted.split('___');
    return (
      <pre className="bg-code-bg text-code-text rounded-xl p-5 font-mono text-sm overflow-x-auto whitespace-pre leading-7">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <button
                onClick={() => isBlankClickable(i) && setActiveBlank(i)}
                className={`inline-block min-w-[90px] px-2.5 py-0.5 mx-0.5 rounded text-sm font-medium border-2 border-dashed transition-all ${getBlankStyle(i)} ${
                  isBlankClickable(i) ? 'cursor-pointer hover:brightness-110' : 'cursor-default'
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
      {/* SQL Template */}
      <div className="mb-6">{renderTemplate()}</div>

      {/* Options - grouped */}
      <div className="mb-6 space-y-3">
        {optionGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">{group.label}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {group.items.map(option => {
                const isUsed = selected.includes(option);
                const disabled = result !== null && !retrying;
                return (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    disabled={disabled}
                    className={`px-3.5 py-2 rounded-lg text-sm font-mono border-2 transition-all ${
                      isUsed
                        ? 'bg-primary-light border-primary text-primary font-semibold'
                        : 'border-border bg-white hover:border-primary/50 hover:bg-primary-light/50'
                    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions: hint left, reset + submit right */}
      {(result === null || retrying) && (
        <div className="flex items-center justify-between gap-3">
          <div>{/* spacer for hint below */}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-text-muted hover:text-text-sub transition-colors px-2 py-1"
            >
              초기화
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allFilled}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-hover active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
            >
              제출
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !retrying && (
        <div className={`mt-5 p-4 rounded-xl border ${
          result === 'correct' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
        }`}>
          {result === 'correct' ? (
            <p className="font-semibold text-emerald-700">정답입니다!</p>
          ) : (
            <>
              <p className="font-semibold text-rose-700 mb-2">
                {wrongCount}개 빈칸이 틀렸습니다 (빈칸 {wrongIndices.join(', ')})
              </p>
              {/* Per-option explanation for wrong selections */}
              {problem.optionExplanations && blankResults.map((ok, i) => {
                if (ok || !selected[i]) return null;
                const optExp = problem.optionExplanations?.find(o => o.value === selected[i]);
                if (!optExp) return null;
                return (
                  <p key={i} className="text-sm text-rose-600/80 mb-1">
                    <span className="font-medium">빈칸 {i + 1}</span> "{selected[i]}" → {optExp.explanation}
                  </p>
                );
              })}
              {!problem.optionExplanations && (
                <p className="text-sm text-rose-600/80">
                  틀린 빈칸의 키워드를 다시 확인해보세요. 맞은 부분은 유지됩니다.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Retry button */}
      {result === 'wrong' && !retrying && !showAnswer && (
        <div className="mt-4">
          <button
            onClick={handleRetry}
            className="px-5 py-2 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary-light active:scale-[0.97] transition-all"
          >
            틀린 부분만 다시 시도
          </button>
        </div>
      )}

      {/* Hints */}
      <HintSteps
        hints={problem.hints}
        submitted={result !== null && !retrying}
        onShowAnswer={() => setShowAnswer(true)}
      />

      {/* Answer + Explanation */}
      {showAnswer && (
        <div className="mt-5 space-y-3">
          <div className="p-4 bg-primary-light rounded-xl">
            <p className="text-sm font-semibold mb-1">정답:</p>
            <p className="text-sm font-mono">{problem.correctAnswers.join(', ')}</p>
          </div>
          <div className="p-4 bg-white border border-border rounded-xl">
            <p className="text-sm font-semibold mb-1">해설:</p>
            <p className="text-sm text-text-sub leading-relaxed">{problem.explanation}</p>
          </div>
          <div className="p-4 bg-primary-light/50 rounded-xl">
            <p className="text-sm">
              <span className="font-semibold text-primary">학습 포인트:</span>{' '}
              <span className="text-text-sub">{problem.learningPoint}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
