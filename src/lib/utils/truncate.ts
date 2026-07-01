import type { TruncateOptions } from '@/lib/types';

/**
 * Truncates text to fit within a maximum length constraint.
 *
 * - If text.length ≤ maxLength, returns text unchanged.
 * - If text.length > maxLength, truncates so that (truncated + indicator).length ≤ maxLength.
 * - Edge case: if maxLength < indicator.length, returns indicator truncated to maxLength.
 */
export function truncateText(text: string, options: TruncateOptions): string {
  const { maxLength, indicator = '…' } = options;

  if (maxLength <= 0) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  // Edge case: maxLength is less than indicator length
  if (maxLength < indicator.length) {
    return indicator.slice(0, maxLength);
  }

  const availableLength = maxLength - indicator.length;
  return text.slice(0, availableLength) + indicator;
}
