import type { DictionaryEntry, DictionaryDomain } from '@/types/dictionary';
import { SQL_TERMS } from './terms';
import { SQL_FUNCTIONS } from './functions';
import { ORACLE_TERMS } from './oracle';

export const ALL_DICTIONARY: DictionaryEntry[] = [
  ...SQL_TERMS,
  ...SQL_FUNCTIONS,
  ...ORACLE_TERMS,
];

export function getDictionaryBySlug(slug: string): DictionaryEntry | undefined {
  return ALL_DICTIONARY.find(e => e.slug === slug);
}

export function getDictionaryByDomain(domain: DictionaryDomain): DictionaryEntry[] {
  return ALL_DICTIONARY.filter(e => e.domain === domain);
}

export function getDictionaryByCategory(category: string): DictionaryEntry[] {
  return ALL_DICTIONARY.filter(e => e.category === category);
}

export function getRelatedEntries(entry: DictionaryEntry): DictionaryEntry[] {
  return entry.relatedConcepts
    .map(slug => getDictionaryBySlug(slug))
    .filter((e): e is DictionaryEntry => Boolean(e));
}

export function getReverseRelated(slug: string): DictionaryEntry[] {
  return ALL_DICTIONARY.filter(
    e => e.slug !== slug && e.relatedConcepts.includes(slug)
  );
}
