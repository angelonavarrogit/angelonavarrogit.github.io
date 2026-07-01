'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { easeOutCounter } from '@/lib/utils/easing';

interface AnimatedCounterProps {
  target: number;
  suffix: string;
  labelKey: string;
  duration?: number;
}

/**
 * AnimatedCounter — Animates a number from 0 to a target value with ease-out deceleration.
 *
 * Uses requestAnimationFrame loop with the easeOutCounter function.
 * Triggers animation once when parent container is 20% visible (via useInView with once: true).
 * Does NOT re-animate if section exits and re-enters viewport.
 * Respects prefers-reduced-motion: shows final value immediately without animation.
 *
 * @see Requirements 7.1, 7.2, 7.3, 7.4
 */
export default function AnimatedCounter({
  target,
  suffix,
  labelKey,
  duration = 2000,
}: AnimatedCounterProps) {
  const t = useTranslations('stats');
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [displayValue, setDisplayValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hasAnimatedRef = useRef(false);

  // Cap duration to max 2000ms
  const cappedDuration = Math.min(2000, duration);

  const animate = useCallback(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / cappedDuration);
      const easedProgress = easeOutCounter(t);
      const currentValue = Math.round(easedProgress * target);

      setDisplayValue(currentValue);

      if (t >= 1) {
        setDisplayValue(target);
        setIsComplete(true);
        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, cappedDuration]);

  useEffect(() => {
    // If reduced motion is preferred, show final value immediately
    if (prefersReducedMotion) {
      setDisplayValue(target);
      setIsComplete(true);
      return;
    }

    // Trigger animation once when in view
    if (isInView && !hasAnimatedRef.current) {
      animate();
    }
  }, [isInView, prefersReducedMotion, target, animate]);

  // Extract the label from the labelKey (e.g., "stats.yearsExperience" → "yearsExperience")
  const labelId = labelKey.replace('stats.', '');

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 text-center"
      role="group"
      aria-label={t(labelId)}
    >
      <span
        className="text-4xl font-bold text-primary sm:text-5xl"
        aria-live="polite"
        aria-atomic="true"
      >
        {displayValue}
        {isComplete && <span>{suffix}</span>}
      </span>
      <span className="text-sm text-muted-foreground sm:text-base">
        {t(labelId)}
      </span>
    </div>
  );
}
