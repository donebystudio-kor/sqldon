import type { CategoryId } from '@/types/problem';

export type DictionaryDomain = 'sql' | 'function' | 'oracle';
export type DictionaryDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface DictionaryEntry {
  slug: string;
  domain: DictionaryDomain;
  category: string;
  title: string;
  shortDescription: string;
  definition: string;
  whyImportant: string;
  exampleSql?: string;
  performanceNote?: string;
  oracleSpecific?: boolean;
  relatedConcepts: string[];
  relatedQuizCategory: CategoryId;
  tags: string[];
  difficulty: DictionaryDifficulty;
}

export interface DictionaryCategory {
  id: string;
  domain: DictionaryDomain;
  name: string;
}

export const DICTIONARY_DOMAINS: { id: DictionaryDomain; name: string; description: string }[] = [
  { id: 'sql', name: 'SQL 용어', description: 'JOIN, GROUP BY, INDEX 등 SQL 문법과 개념' },
  { id: 'function', name: 'SQL 함수', description: 'COUNT, COALESCE, ROW_NUMBER 등 함수 레퍼런스' },
  { id: 'oracle', name: 'Oracle 아키텍처', description: 'SGA, PGA, Execution Plan 등 내부 구조' },
];

export const DICTIONARY_CATEGORIES: DictionaryCategory[] = [
  { id: 'join', domain: 'sql', name: '조인' },
  { id: 'aggregate', domain: 'sql', name: '집계' },
  { id: 'set', domain: 'sql', name: '집합 연산' },
  { id: 'subquery', domain: 'sql', name: '서브쿼리' },
  { id: 'object', domain: 'sql', name: '객체/인덱스' },
  { id: 'optimizer', domain: 'sql', name: '옵티마이저' },
  { id: 'design', domain: 'sql', name: '설계' },

  { id: 'aggregate-fn', domain: 'function', name: '집계 함수' },
  { id: 'null-handling', domain: 'function', name: 'NULL 처리' },
  { id: 'conditional', domain: 'function', name: '조건 함수' },
  { id: 'window-fn', domain: 'function', name: '윈도우 함수' },
  { id: 'string', domain: 'function', name: '문자열 함수' },
  { id: 'date', domain: 'function', name: '날짜 함수' },

  { id: 'memory', domain: 'oracle', name: '메모리 구조' },
  { id: 'file', domain: 'oracle', name: '파일 구조' },
  { id: 'transaction', domain: 'oracle', name: '트랜잭션/락' },
  { id: 'execution', domain: 'oracle', name: '실행/파싱' },
];
