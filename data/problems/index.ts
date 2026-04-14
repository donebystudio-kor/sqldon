import { SQL_BASIC_PROBLEMS } from './sql-basic';
import { SQL_JOIN_PROBLEMS } from './sql-join';
import { SQL_AGGREGATE_PROBLEMS } from './sql-aggregate';
import { SQL_SUBQUERY_PROBLEMS } from './sql-subquery';
import { SQL_WINDOW_PROBLEMS } from './sql-window';
import { SQL_ADVANCED_PROBLEMS } from './sql-advanced';
import { SQL_TUNING_PROBLEMS } from './sql-tuning';
import { ORACLE_ARCH_PROBLEMS } from './oracle-arch';
import type { Problem } from '@/types/problem';

export const ALL_PROBLEMS: Problem[] = [
  ...SQL_BASIC_PROBLEMS,
  ...SQL_JOIN_PROBLEMS,
  ...SQL_AGGREGATE_PROBLEMS,
  ...SQL_SUBQUERY_PROBLEMS,
  ...SQL_WINDOW_PROBLEMS,
  ...SQL_ADVANCED_PROBLEMS,
  ...SQL_TUNING_PROBLEMS,
  ...ORACLE_ARCH_PROBLEMS,
];

export function getProblemsByCategory(category: string): Problem[] {
  return ALL_PROBLEMS.filter(p => p.category === category);
}

export function getProblemById(id: string): Problem | undefined {
  return ALL_PROBLEMS.find(p => p.id === id);
}
