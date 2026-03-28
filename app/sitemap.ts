import type { MetadataRoute } from 'next';
import { SITE } from '@/constants/site';
import { CATEGORIES } from '@/constants/categories';
import { CONCEPTS } from '@/data/concepts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/diagram`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/plan`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/result`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${base}/quiz/${cat.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const conceptPages: MetadataRoute.Sitemap = CONCEPTS.map(c => ({
    url: `${base}/concept/${c.tag}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...conceptPages];
}
