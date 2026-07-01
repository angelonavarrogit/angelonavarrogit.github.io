/**
 * Blog module for reading and filtering MDX blog posts.
 *
 * Server-side only — uses Node.js fs to read files at build time (SSG).
 * Compatible with next-mdx-remote for rendering in App Router.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ArticleCard, BlogCategory } from '@/lib/types';

/** Directory where MDX blog posts are stored */
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

/**
 * Sorts an array of articles by publishedAt date in descending order (newest first).
 * Exported for property testing.
 */
export function sortArticlesByDate(articles: ArticleCard[]): ArticleCard[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Filters articles by a given category.
 * Returns only articles whose category matches exactly.
 * Exported for property testing.
 */
export function filterByCategory(
  articles: ArticleCard[],
  category: BlogCategory
): ArticleCard[] {
  return articles.filter((article) => article.category === category);
}

/**
 * Reads all MDX files from src/content/blog/, extracts frontmatter,
 * and returns them sorted by date descending.
 */
export function getAllArticles(): ArticleCard[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_CONTENT_DIR).filter((file) => file.endsWith('.mdx'));

  const articles: ArticleCard[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(BLOG_CONTENT_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title as string,
      publishedAt: data.publishedAt as string,
      summary: data.summary as string,
      category: data.category as BlogCategory,
      language: data.language as 'ES' | 'EN',
    };
  });

  return sortArticlesByDate(articles);
}

/**
 * Returns articles filtered by a specific category, sorted by date descending.
 */
export function getArticlesByCategory(category: BlogCategory): ArticleCard[] {
  const allArticles = getAllArticles();
  return filterByCategory(allArticles, category);
}

/**
 * Reads a specific MDX file by slug and returns frontmatter + raw MDX content.
 * Returns null if the file doesn't exist.
 */
export function getArticleBySlug(
  slug: string
): { frontmatter: ArticleCard; content: string } | null {
  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const frontmatter: ArticleCard = {
    slug,
    title: data.title as string,
    publishedAt: data.publishedAt as string,
    summary: data.summary as string,
    category: data.category as BlogCategory,
    language: data.language as 'ES' | 'EN',
  };

  return { frontmatter, content };
}
