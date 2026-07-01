import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TypingEffect from './TypingEffect';

describe('TypingEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Default: no reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultProps = {
    strings: ['Hello', 'World'],
    typeSpeed: 50,
    deleteSpeed: 30,
    pauseDuration: 2000,
  };

  /**
   * Helper to advance timers one tick at a time for N iterations.
   * Each tick advances the specified ms and flushes React state updates.
   */
  function advanceByTicks(count: number, msPerTick: number) {
    for (let i = 0; i < count; i++) {
      act(() => {
        vi.advanceTimersByTime(msPerTick);
      });
    }
  }

  it('starts with empty text and types the first character after one tick', () => {
    render(<TypingEffect {...defaultProps} />);

    const el = screen.getByLabelText('Hello');
    // Initial state: no typed text, just cursor
    expect(el.textContent).toBe('|');

    // After one typeSpeed tick, first character appears
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(el.textContent).toBe('H|');
  });

  it('types the full string character by character', () => {
    render(<TypingEffect {...defaultProps} />);

    // "Hello" = 5 chars, each takes one tick of 50ms
    advanceByTicks(5, 50);

    const el = screen.getByLabelText('Hello');
    expect(el.textContent).toBe('Hello|');
  });

  it('enters pausing phase with blinking cursor after full string is typed', () => {
    render(<TypingEffect {...defaultProps} />);

    // Type all 5 characters of "Hello" (5 ticks)
    advanceByTicks(5, 50);

    // One more tick transitions phase from typing → pausing
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Now in pausing phase — cursor should have blinking class
    const cursor = document.querySelector('.typing-cursor');
    expect(cursor).toHaveClass('blinking');
  });

  it('starts deleting after pause duration', () => {
    render(<TypingEffect {...defaultProps} />);

    // Type "Hello" (5 ticks) + phase transition tick
    advanceByTicks(5, 50);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Advance through pause (2000ms) — transitions to deleting phase
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // After pause, one deleteSpeed tick removes last character
    act(() => {
      vi.advanceTimersByTime(30);
    });

    const el = screen.getByLabelText('Hello');
    expect(el.textContent?.replace('|', '')).toBe('Hell');
  });

  it('cycles to next string after fully deleting', () => {
    render(<TypingEffect {...defaultProps} />);

    // Type "Hello" (5 ticks) + phase transition tick
    advanceByTicks(5, 50);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Pause (2000ms)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Delete "Hello" (5 ticks × 30ms) + final transition tick
    advanceByTicks(5, 30);
    act(() => {
      vi.advanceTimersByTime(30);
    });

    // Now should start typing "World" — first character after one tick
    act(() => {
      vi.advanceTimersByTime(50);
    });

    const el = screen.getByLabelText('World');
    expect(el.textContent).toBe('W|');
  });

  it('shows first string statically when prefers-reduced-motion is active', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<TypingEffect {...defaultProps} />);

    const el = screen.getByLabelText('Hello');
    // Should show full first string without cursor
    expect(el.textContent).toBe('Hello');
  });

  it('does not render cursor element when reduced motion is active', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<TypingEffect {...defaultProps} />);

    const cursor = document.querySelector('.typing-cursor');
    expect(cursor).toBeNull();
  });
});
