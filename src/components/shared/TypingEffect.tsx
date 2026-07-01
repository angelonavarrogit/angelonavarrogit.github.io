'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Props for the TypingEffect component.
 */
interface TypingEffectProps {
  strings: string[];
  typeSpeed: number; // ms per character (50)
  deleteSpeed: number; // ms per character
  pauseDuration: number; // ms between titles (2000)
}

/**
 * Phases of the typing animation loop:
 * - typing: adding characters one by one
 * - pausing: displaying full text with blinking cursor
 * - deleting: removing characters one by one
 */
type Phase = 'typing' | 'pausing' | 'deleting';

/**
 * TypingEffect — Cycles through an array of strings with a typewriter animation.
 *
 * Behavior:
 * 1. Types the current string character by character at `typeSpeed` ms per char
 * 2. Pauses for `pauseDuration` ms with a blinking cursor
 * 3. Deletes the string character by character at `deleteSpeed` ms per char
 * 4. Moves to the next string, looping continuously
 *
 * Respects `prefers-reduced-motion`: shows the first string statically.
 *
 * @see Requirements 1.2
 */
export default function TypingEffect({
  strings,
  typeSpeed,
  deleteSpeed,
  pauseDuration,
}: TypingEffectProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect prefers-reduced-motion on mount and listen for changes
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Get the current target string
  const currentString = strings[currentIndex] || '';

  // Animation loop using setTimeout
  const tick = useCallback(() => {
    if (phase === 'typing') {
      if (displayText.length < currentString.length) {
        // Type next character
        setDisplayText(currentString.slice(0, displayText.length + 1));
      } else {
        // Finished typing, start pausing
        setPhase('pausing');
      }
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        // Delete one character
        setDisplayText(currentString.slice(0, displayText.length - 1));
      } else {
        // Finished deleting, move to next string
        setCurrentIndex((prev) => (prev + 1) % strings.length);
        setPhase('typing');
      }
    }
  }, [phase, displayText, currentString, strings.length]);

  useEffect(() => {
    // Skip animation when reduced motion is preferred
    if (prefersReducedMotion) return;
    // Skip if no strings provided
    if (strings.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      timeout = setTimeout(tick, typeSpeed);
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => {
        setPhase('deleting');
      }, pauseDuration);
    } else if (phase === 'deleting') {
      timeout = setTimeout(tick, deleteSpeed);
    }

    return () => clearTimeout(timeout);
  }, [phase, displayText, tick, typeSpeed, deleteSpeed, pauseDuration, prefersReducedMotion, strings.length]);

  // Reduced motion: show first string statically without animation
  if (prefersReducedMotion) {
    return (
      <span className="typing-effect" aria-label={strings[0] || ''}>
        {strings[0] || ''}
      </span>
    );
  }

  return (
    <span className="typing-effect" aria-label={currentString}>
      {displayText}
      <span
        className={`typing-cursor ${phase === 'pausing' ? 'blinking' : ''}`}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}
