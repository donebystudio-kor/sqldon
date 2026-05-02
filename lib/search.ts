import { ALL_PROBLEMS } from '@/data/problems';
import { CONCEPTS } from '@/data/concepts';
import { ALL_DICTIONARY } from '@/data/dictionary';

export interface SearchResult {
  type: 'problem' | 'concept' | 'term';
  id: string;
  title: string;
  description: string;
  href: string;
  tags?: string[];
}

export function search(query: string): SearchResult[] {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase().trim();

  const problemResults: SearchResult[] = ALL_PROBLEMS
    .filter(p => p.type !== 'write')
    .filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.question.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
    .map(p => ({
      type: 'problem' as const,
      id: p.id,
      title: p.title,
      description: p.question.slice(0, 60) + '...',
      href: `/quiz/${p.category}/${p.id}`,
      tags: p.tags,
    }));

  const conceptResults: SearchResult[] = CONCEPTS
    .filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.shortDefinition.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q)
    )
    .map(c => ({
      type: 'concept' as const,
      id: c.tag,
      title: c.title,
      description: c.shortDefinition,
      href: `/concept/${c.tag}`,
    }));

  const termResults: SearchResult[] = ALL_DICTIONARY
    .filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.shortDescription.toLowerCase().includes(q) ||
      e.slug.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    )
    .map(e => ({
      type: 'term' as const,
      id: e.slug,
      title: e.title,
      description: e.shortDescription,
      href: `/terms/${e.slug}`,
      tags: e.tags,
    }));

  return [...termResults, ...conceptResults, ...problemResults].slice(0, 10);
}
