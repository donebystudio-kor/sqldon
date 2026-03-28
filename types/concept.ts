export interface Concept {
  tag: string;
  title: string;
  shortDefinition: string;
  whyImportant: string;
  commonMistakes: string[];
  example?: string;
  relatedCategories: string[];
  relatedProblemIds?: string[];
}
