import type { Problem, CategoryId } from '@/types/problem';
import { ALL_PROBLEMS } from '@/data/problems';

export function getProblemsForCategory(category: CategoryId): Problem[] {
  return ALL_PROBLEMS.filter(p => p.category === category);
}

export function getStats(category?: CategoryId) {
  const problems = category ? getProblemsForCategory(category) : ALL_PROBLEMS;
  return {
    total: problems.length,
    write: problems.filter(p => p.type === 'write').length,
    fill: problems.filter(p => p.type === 'fill').length,
    ox: problems.filter(p => p.type === 'ox').length,
    plan: problems.filter(p => p.type === 'plan').length,
  };
}
