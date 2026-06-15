import type { Category } from '../types/database';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Sports',
    slug: 'sports',
    icon: 'trophy',
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: '2',
    name: 'Crypto',
    slug: 'crypto',
    icon: 'bitcoin',
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: '3',
    name: 'Technology',
    slug: 'technology',
    icon: 'cpu',
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: '4',
    name: 'Politics',
    slug: 'politics',
    icon: 'landmark',
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: '5',
    name: 'Entertainment',
    slug: 'entertainment',
    icon: 'clapperboard',
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: '6',
    name: 'Science',
    slug: 'science',
    icon: 'atom',
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: '7',
    name: 'Finance',
    slug: 'finance',
    icon: 'trending-up',
    created_at: '2026-06-14T00:00:00Z',
  },
  {
    id: '8',
    name: 'World Events',
    slug: 'world-events',
    icon: 'globe',
    created_at: '2026-06-14T00:00:00Z',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
