import type { CategoryId } from '@/types/problem';

export type ConceptDomain = 'sql' | 'function' | 'oracle';
export type ConceptDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Concept {
  tag: string;
  title: string;
  shortDefinition: string;
  whyImportant: string;
  commonMistakes: string[];
  example?: string;
  relatedCategories: CategoryId[];
  relatedProblemIds?: string[];

  definition?: string;
  performanceNote?: string;
  difficulty?: ConceptDifficulty;
  oracleSpecific?: boolean;
  domain?: ConceptDomain;
  category?: string;
  relatedConcepts?: string[];
}

export interface ConceptCategory {
  id: string;
  domain: ConceptDomain;
  name: string;
}

export const CONCEPT_DOMAINS: { id: ConceptDomain; name: string; description: string }[] = [
  { id: 'sql', name: 'SQL 개념', description: 'SELECT, JOIN, GROUP BY, INDEX 등 SQL 문법과 개념' },
  { id: 'function', name: 'SQL 함수', description: 'COUNT, COALESCE, ROW_NUMBER 등 함수 레퍼런스' },
  { id: 'oracle', name: 'Oracle 아키텍처', description: 'SGA, PGA, Execution Plan 등 내부 구조' },
];

export const CONCEPT_CATEGORIES: ConceptCategory[] = [
  { id: 'basic', domain: 'sql', name: '기초 SQL' },
  { id: 'join', domain: 'sql', name: 'JOIN' },
  { id: 'aggregate', domain: 'sql', name: '집계' },
  { id: 'set', domain: 'sql', name: '집합 연산' },
  { id: 'subquery', domain: 'sql', name: '서브쿼리' },
  { id: 'window', domain: 'sql', name: '윈도우 함수' },
  { id: 'object', domain: 'sql', name: '인덱스/객체' },
  { id: 'design', domain: 'sql', name: '설계' },
  { id: 'tuning', domain: 'sql', name: '튜닝' },

  { id: 'aggregate-fn', domain: 'function', name: '집계 함수' },
  { id: 'null-handling', domain: 'function', name: 'NULL 처리' },
  { id: 'conditional', domain: 'function', name: '조건 함수' },
  { id: 'window-fn', domain: 'function', name: '윈도우 함수' },
  { id: 'string', domain: 'function', name: '문자열 함수' },
  { id: 'date', domain: 'function', name: '날짜 함수' },

  { id: 'memory', domain: 'oracle', name: '메모리 구조' },
  { id: 'process', domain: 'oracle', name: '프로세스' },
  { id: 'execution', domain: 'oracle', name: '실행/파싱' },
];
