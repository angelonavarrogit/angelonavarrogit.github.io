'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * CustomCursor — Animated cursor replacement for desktop viewports (>1024px).
 *
 * Renders a small inner dot and a larger outer ring that follows the mouse
 * using CSS transforms for jank-free performance. The outer ring scales up
 * when hovering interactive elements (links, buttons, cards).
 *
 * Disabled automatically when:
 * - Viewport ≤ 1024px (touch/tablet devices)
 * - User has `prefers-reduced-motion` enabled
 *
 * @see Requirements 15.2, 15.5
 */

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [tabindex="0"], .project-card, .certification-card';

export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const ringPositionRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Check if viewport is desktop (>1024px)
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Determine if cursor should be active
  const isActive = isDesktop && !prefersReducedMotion;

  // Hide native cursor when custom cursor is active
  useEffect(() => {
    if (isActive) {
      document.body.style.cursor = 'none';
      // Also hide cursor on all elements
      const style = document.createElement('style');
      style.id = 'custom-cursor-style';
      style.textContent = '*, *::before, *::after { cursor: none !important; }';
      document.head.appendChild(style);

      return () => {
        document.body.style.cursor = '';
        const el = document.getElementById('custom-cursor-style');
        if (el) el.remove();
      };
    }
  }, [isActive]);

  // Smooth ring follow using RAF
  const animateRing = useCallback(() => {
    const ring = ringRef.current;
    if (!ring) return;

    // Lerp (linear interpolation) for smooth trailing
    const lerp = 0.15;
    ringPositionRef.current.x +=
      (positionRef.current.x - ringPositionRef.current.x) * lerp;
    ringPositionRef.current.y +=
      (positionRef.current.y - ringPositionRef.current.y) * lerp;

    ring.style.transform = `translate(${ringPositionRef.current.x}px, ${ringPositionRef.current.y}px) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;

    rafIdRef.current = requestAnimationFrame(animateRing);
  }, [isHovering]);

  // Mouse tracking and interactive element detection
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      // Update dot immediately for responsive feel
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnterInteractive = () => setIsHovering(true);
    const handleMouseLeaveInteractive = () => setIsHovering(false);

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    // Attach global mouse listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.documentElement.addEventListener('mouseenter', handleMouseEnterWindow);

    // Attach hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(INTERACTIVE_SELECTOR);
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnterInteractive);
      el.addEventListener('mouseleave', handleMouseLeaveInteractive);
    });

    // Start ring animation loop
    rafIdRef.current = requestAnimationFrame(animateRing);

    // MutationObserver to detect dynamically added interactive elements
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(INTERACTIVE_SELECTOR);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnterWindow);

      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      observer.disconnect();
    };
  }, [isActive, isVisible, animateRing]);

  // Don't render anything if not active
  if (!isActive) return null;

  return (
    <>
      {/* Inner dot — follows mouse instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgb(34, 197, 94)', // green-500 (forest green accent)
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease, background-color 0.2s ease',
          ...(isHovering && {
            backgroundColor: 'rgb(74, 222, 128)', // green-400 brighter on hover
          }),
        }}
      />
      {/* Outer ring — trails behind with smooth interpolation */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid rgba(34, 197, 94, 0.5)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease, border-color 0.2s ease, transform 0.1s ease',
          ...(isHovering && {
            borderColor: 'rgba(74, 222, 128, 0.8)',
          }),
        }}
      />
    </>
  );
}
