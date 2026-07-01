'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Particles from '@tsparticles/react';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

/**
 * ParticleBackground — Animated particle canvas that renders behind hero content.
 *
 * Uses @tsparticles/slim for a lightweight bundle with green-themed particles,
 * subtle linking lines, and slow movement for a premium ambient effect.
 *
 * When `enabled` is false (e.g., prefers-reduced-motion active), renders nothing.
 * Maintains 30fps+ with a low particle count (40 particles) and optimized config.
 *
 * @see Requirements 1.4, 15.5, 15.6
 */

export interface ParticleBackgroundProps {
  enabled: boolean;
}

export default function ParticleBackground({ enabled }: ParticleBackgroundProps) {
  const [engineReady, setEngineReady] = useState(false);

  /**
   * Initialize the tsParticles engine once with the slim bundle.
   * The engine must be loaded before the Particles component renders.
   */
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setEngineReady(true);
    });
  }, []);

  /**
   * Optional callback when particles container has loaded.
   * useCallback prevents unnecessary re-renders of the Particles component.
   */
  const particlesLoaded = useCallback(async () => {
    // Particles loaded — no-op, available for debugging
  }, []);

  /**
   * Particle configuration optimized for performance (30fps+):
   * - 40 particles (low count for smooth rendering)
   * - Forest green palette (#228B22, #34d399)
   * - Slow movement speed (1-2)
   * - Semi-transparent (opacity 0.3-0.6)
   * - Subtle linking lines between nearby particles
   * - FPS limit of 60 to prevent unnecessary CPU usage
   */
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },
        color: {
          value: ['#228B22', '#34d399'],
        },
        opacity: {
          value: { min: 0.3, max: 0.6 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
        },
        move: {
          enable: true,
          speed: { min: 1, max: 2 },
          direction: 'none',
          outModes: {
            default: 'out',
          },
          random: true,
          straight: false,
        },
        links: {
          enable: true,
          distance: 150,
          color: '#228B22',
          opacity: 0.2,
          width: 1,
        },
        shape: {
          type: 'circle',
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: false,
          },
          onClick: {
            enable: false,
          },
        },
      },
    }),
    []
  );

  // When disabled (prefers-reduced-motion), render nothing
  if (!enabled) {
    return null;
  }

  // Wait for engine initialization before rendering particles
  if (!engineReady) {
    return null;
  }

  return (
    <Particles
      id="hero-particles"
      className="absolute inset-0 -z-10 h-full w-full"
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
}
