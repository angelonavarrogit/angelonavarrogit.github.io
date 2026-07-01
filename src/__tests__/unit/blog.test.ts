import { describe, it, expect } from 'vitest';
import { sortArticlesByDate, filterByCategory } from '@/lib/blog';
import type { ArticleCard } from '@/lib/types';

const mockArticles: ArticleCard[] = [
  {
    slug: 'older-post',
    title: 'Older Post',
    publishedAt: '2024-01-10',
    summary: 'An older post',
    category: 'IMS',
    language: 'EN',
  },
  {
    slug: 'newest-post',
    title: 'Newest Post',
    publishedAt: '2024-11-15',
    summary: 'The newest post',
    category: 'Python Automation',
    language: 'ES',
  },
  {
    slug: 'middle-post',
    title: 'Middle Post',
    publishedAt: '2024-06-20',
    summary: 'A middle post',
    category: 'Telecom',
    language: 'EN',
  },
  {
    slug: 'another-ims',
    title: 'Another IMS Post',
    publishedAt: '2024-08-05',
    summary: 'Another IMS article',
    category: 'IMS',
    language: 'EN',
  },
];

describe('sortArticlesByDate', () => {
  it('sorts articles by publishedAt in descending order (newest first)', () => {
    const sorted = sortArticlesByDate(mockArticles);

    expect(sorted[0].slug).toBe('newest-post');
    expect(sorted[1].slug).toBe('another-ims');
    expect(sorted[2].slug).toBe('middle-post');
    expect(sorted[3].slug).toBe('older-post');
  });

  it('does not mutate the original array', () => {
    const original = [...mockArticles];
    sortArticlesByDate(mockArticles);
    expect(mockArticles).toEqual(original);
  });

  it('returns an empty array when given an empty array', () => {
    const sorted = sortArticlesByDate([]);
    expect(sorted).toEqual([]);
  });

  it('handles single article', () => {
    const single = [mockArticles[0]];
    const sorted = sortArticlesByDate(single);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].slug).toBe('older-post');
  });
});

describe('filterByCategory', () => {
  it('returns only articles matching the specified category', () => {
    const imsArticles = filterByCategory(mockArticles, 'IMS');

    expect(imsArticles).toHaveLength(2);
    expect(imsArticles.every((a) => a.category === 'IMS')).toBe(true);
  });

  it('returns empty array when no articles match', () => {
    const capmArticles = filterByCategory(mockArticles, 'CAPM/PMI');
    expect(capmArticles).toHaveLength(0);
  });

  it('returns all articles when all match the category', () => {
    const allIms: ArticleCard[] = mockArticles
      .filter((a) => a.category === 'IMS');
    const filtered = filterByCategory(allIms, 'IMS');
    expect(filtered).toHaveLength(allIms.length);
  });

  it('returns empty array when input is empty', () => {
    const filtered = filterByCategory([], 'Telecom');
    expect(filtered).toEqual([]);
  });
});
