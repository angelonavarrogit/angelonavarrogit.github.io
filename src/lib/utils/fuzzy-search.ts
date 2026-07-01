import type { CommandResult } from '@/lib/types';

/**
 * Performs a fuzzy subsequence search on an array of CommandResult items.
 *
 * - Returns at most `maxResults` (default 8) results.
 * - Empty query returns empty array.
 * - Fuzzy match: characters from query appear in order in the item's title (case-insensitive).
 * - Results are sorted by match quality (earlier match start + shorter titles rank higher).
 */
export function fuzzySearch(
  query: string,
  items: CommandResult[],
  maxResults: number = 8
): CommandResult[] {
  if (!query || query.length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  const scored: Array<{ item: CommandResult; score: number }> = [];

  for (const item of items) {
    const matchScore = getSubsequenceScore(lowerQuery, item.title.toLowerCase());
    if (matchScore !== null) {
      scored.push({ item, score: matchScore });
    }
  }

  // Sort by score ascending (lower score = better match)
  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, maxResults).map((entry) => entry.item);
}

/**
 * Checks if `query` is a subsequence of `text` and returns a quality score.
 * Returns null if no match found.
 *
 * Score is calculated as:
 * - Position of first matched character (earlier = better)
 * - Plus text length penalty (shorter titles rank higher)
 *
 * Lower score = better match.
 */
function getSubsequenceScore(query: string, text: string): number | null {
  let queryIndex = 0;
  let firstMatchPosition = -1;

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      if (queryIndex === 0) {
        firstMatchPosition = i;
      }
      queryIndex++;
    }
  }

  // All query characters must be found in order
  if (queryIndex !== query.length) {
    return null;
  }

  // Score: earlier matches and shorter titles are preferred
  return firstMatchPosition * 100 + text.length;
}
