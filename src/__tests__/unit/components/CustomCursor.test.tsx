import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock framer-motion's useReducedMotion hook
const mockUseReducedMotion = vi.fn(() => false);
vi.mock('framer-motion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

import CustomCursor from '@/components/shared/CustomCursor';

describe('CustomCursor', () => {
  let originalInnerWidth: number;
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    rafCallbacks = [];
    mockUseReducedMotion.mockReturnValue(false);

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up any injected styles
    const style = document.getElementById('custom-cursor-style');
    if (style) style.remove();
    document.body.style.cursor = '';
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  function setViewportWidth(width: number) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    fireEvent(window, new Event('resize'));
  }

  it('renders nothing when viewport is <= 1024px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { container } = render(<CustomCursor />);
    expect(container.innerHTML).toBe('');
  });

  it('renders cursor elements when viewport is > 1024px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    const { container } = render(<CustomCursor />);
    // Should render 2 div elements (dot + ring)
    const cursorElements = container.querySelectorAll('[aria-hidden="true"]');
    expect(cursorElements).toHaveLength(2);
  });

  it('renders nothing when prefers-reduced-motion is active', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });
    mockUseReducedMotion.mockReturnValue(true);

    const { container } = render(<CustomCursor />);
    expect(container.innerHTML).toBe('');
  });

  it('hides native cursor when active', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    render(<CustomCursor />);
    expect(document.body.style.cursor).toBe('none');
    expect(document.getElementById('custom-cursor-style')).not.toBeNull();
  });

  it('does not hide native cursor when inactive', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<CustomCursor />);
    expect(document.body.style.cursor).not.toBe('none');
  });

  it('cursor elements are aria-hidden for accessibility', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    const { container } = render(<CustomCursor />);
    const elements = container.querySelectorAll('[aria-hidden="true"]');
    expect(elements.length).toBe(2);
  });

  it('cursor elements are pointer-events-none', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    const { container } = render(<CustomCursor />);
    const elements = container.querySelectorAll('.pointer-events-none');
    expect(elements.length).toBe(2);
  });

  it('removes cursor style on unmount', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    const { unmount } = render(<CustomCursor />);
    expect(document.getElementById('custom-cursor-style')).not.toBeNull();

    unmount();
    expect(document.getElementById('custom-cursor-style')).toBeNull();
    expect(document.body.style.cursor).toBe('');
  });
});
