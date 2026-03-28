export type ProblemType = 'write' | 'fill' | 'ox' | 'plan';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type CategoryId = 'sql-basic' | 'sql-join' | 'sql-aggregate' | 'sql-subquery' | 'sql-window' | 'sql-tuning' | 'oracle-arch';

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
}

export interface WriteProblem extends ProblemBase {
  type: 'write';
  schema?: string;
  sampleData?: { columns: string[]; rows: string[][] };
  acceptableAnswers: string[];
  hints: string[];
  answerGuide?: string;
  expectedResultDescription?: string;
}

export interface FillProblem extends ProblemBase {
  type: 'fill';
  sqlTemplate: string;
  blanks: number;
  options: string[];
  correctAnswers: string[];
  hints: string[];
}

export interface OxProblem extends ProblemBase {
  type: 'ox';
  statement: string;
  answer: 'O' | 'X';
  hints?: string[];
}

export interface PlanProblem extends ProblemBase {
  type: 'plan';
  planText: string;
  choices?: string[];
  correctAnswer: string;
  hints: string[];
}

export type Problem = WriteProblem | FillProblem | OxProblem | PlanProblem;
