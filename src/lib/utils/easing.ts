/**
 * Cubic ease-out function for counter animations.
 *
 * - Input: normalized time value t in range [0, 1]
 * - Output: eased value in range [0, 1]
 * - Produces a monotonically non-decreasing sequence
 * - Starts at 0 (when t=0) and ends at 1 (when t=1)
 * - Uses deceleration curve: 1 - (1 - t)^3
 */
export function easeOutCounter(t: number): number {
  // Clamp input to [0, 1] for safety
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 3);
}
