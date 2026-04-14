export type ProblemType = 'write' | 'fill' | 'ox' | 'plan';
export type SolveMode = 'write' | 'fill';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type CategoryId = 'sql-basic' | 'sql-join' | 'sql-aggregate' | 'sql-subquery' | 'sql-window' | 'sql-advanced' | 'sql-tuning' | 'oracle-arch';

export interface OptionWithExplanation {
  value: string;
  explanation: string;
}

export interface TypedHints {
  directional: string[];
  constraint?: string[];
  misconception?: string[];
}

export interface ProblemBase {
  id: string;
  category: CategoryId;
  difficulty: Difficulty;
  type: ProblemType;
  title: string;
  question: string;
  learningPoint: string;
  tags: string[];
  explanation: string;
  relatedConceptTags?: string[];
  availableModes?: SolveMode[];
}

export interface WriteProblem extends ProblemBase {
  type: 'write';
  schema?: string;
  sampleData?: { columns: string[]; rows: string[][] };
  acceptableAnswers: string[];
  hints: string[] | TypedHints;
  answerGuide?: string;
  expectedResultDescription?: string;
}

export interface FillProblem extends ProblemBase {
  type: 'fill';
  sqlTemplate: string;
  blanks: number;
  options: string[];
  optionExplanations?: OptionWithExplanation[];
  correctAnswers: string[];
  hints: string[] | TypedHints;
}

export interface OxProblem extends ProblemBase {
  type: 'ox';
  statement: string;
  answer: 'O' | 'X';
  hints?: string[] | TypedHints;
}

export interface PlanProblem extends ProblemBase {
  type: 'plan';
  planText: string;
  choices?: string[];
  choiceExplanations?: OptionWithExplanation[];
  correctAnswer: string;
  hints: string[] | TypedHints;
}

export type Problem = WriteProblem | FillProblem | OxProblem | PlanProblem;

// Helper to normalize hints to flat array
export function getHintList(hints: string[] | TypedHints | undefined): string[] {
  if (!hints) return [];
  if (Array.isArray(hints)) return hints;
  return [
    ...hints.directional.map(h => h),
    ...(hints.constraint || []).map(h => h),
    ...(hints.misconception || []).map(h => h),
  ];
}

// Helper to get typed hint labels
export function getTypedHints(hints: string[] | TypedHints | undefined): { type: string; text: string }[] {
  if (!hints) return [];
  if (Array.isArray(hints)) return hints.map(h => ({ type: '힌트', text: h }));
  const result: { type: string; text: string }[] = [];
  hints.directional.forEach(h => result.push({ type: '방향', text: h }));
  (hints.constraint || []).forEach(h => result.push({ type: '조건', text: h }));
  (hints.misconception || []).forEach(h => result.push({ type: '오해', text: h }));
  return result;
}
