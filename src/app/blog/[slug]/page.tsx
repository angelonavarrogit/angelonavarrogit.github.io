import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllArticles, getArticleBySlug } from '@/lib/blog';
import type { Metadata } from 'next';

/**
 * Blog article page — Server component rendering MDX content.
 *
 * Features:
 * - SSG via generateStaticParams (built at build time)
 * - Full MDX rendering with next-mdx-remote (RSC)
 * - Article header: title, date, category badge, language indicator
 * - Proper typography styling for MDX content
 * - Back link to homepage (#blog section)
 * - 404 handling if slug doesn't exist
 * - Per-page metadata for SEO
 *
 * @see Requirements 9.3, 9.4, 9.5
 */

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/** Generate static paths for all blog posts at build time */
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

/** Generate per-page metadata for SEO */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.summary,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.summary,
      type: 'article',
      publishedTime: article.frontmatter.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;

  // Format the date
  const formattedDate = new Date(frontmatter.publishedAt).toLocaleDateString(
    'es-PA',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        {/* Back link */}
        <nav className="mb-8">
          <Link
            href="/#blog"
            className="inline-flex items-center text-sm font-medium text-accent hover:underline transition-colors duration-200"
          >
            ← Volver al Blog
          </Link>
        </nav>

        {/* Article header */}
        <header className="mb-10">
          {/* Category + Language indicators */}
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent">
              {frontmatter.category}
            </span>
            <span className="inline-flex items-center rounded-md bg-background-card border border-border px-2 py-0.5 text-xs font-semibold text-foreground-muted">
              {frontmatter.language}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl leading-tight">
            {frontmatter.title}
          </h1>

          {/* Date */}
          <time
            dateTime={frontmatter.publishedAt}
            className="mt-4 block text-sm text-foreground-muted"
          >
            {formattedDate}
          </time>
        </header>

        {/* MDX Content */}
        <div className="prose prose-invert prose-green max-w-none prose-headings:text-foreground prose-p:text-foreground-muted prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent prose-code:bg-background-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-background-card prose-pre:border prose-pre:border-border prose-li:text-foreground-muted prose-ul:text-foreground-muted prose-ol:text-foreground-muted">
          <MDXRemote source={content} />
        </div>

        {/* Footer - back link */}
        <footer className="mt-16 pt-8 border-t border-border">
          <Link
            href="/#blog"
            className="inline-flex items-center text-sm font-medium text-accent hover:underline transition-colors duration-200"
          >
            ← Volver al Blog
          </Link>
        </footer>
      </article>
    </div>
  );
}
