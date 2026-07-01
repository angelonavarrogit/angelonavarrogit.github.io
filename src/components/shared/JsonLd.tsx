/**
 * JsonLd Component
 *
 * Renders JSON-LD structured data as a <script type="application/ld+json"> tag.
 * Used for SEO structured data (Person, WebSite schemas) on the homepage.
 *
 * This is a Server Component — no client-side JS needed.
 */

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders one or more JSON-LD structured data objects.
 * Accepts a single schema object or an array of schema objects.
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonLdString = JSON.stringify(
    Array.isArray(data) ? data : data,
    null,
    0
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
