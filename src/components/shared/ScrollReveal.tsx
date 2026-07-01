'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ScrollRevealProps } from '@/lib/types';

/**
 * ScrollReveal — Wrapper that animates children on viewport entry.
 *
 * Default animation: fade in + slide up (opacity 0→1, translateY 20px→0).
 * Respects `prefers-reduced-motion` by rendering children immediately.
 * Animation triggers ONCE (does not re-animate on re-entry).
 *
 * @see Requirements 15.3, 15.5
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 500,
  disabled,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  // Clamp duration to 300-600ms range
  const clampedDuration = Math.min(600, Math.max(300, duration));

  // Skip animations when reduced-motion is preferred OR explicitly disabled
  const shouldAnimate = !prefersReducedMotion && !disabled;

  if (!shouldAnimate) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: clampedDuration / 1000, // Convert ms to seconds for Framer Motion
        delay: delay / 1000, // Convert ms to seconds
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}
