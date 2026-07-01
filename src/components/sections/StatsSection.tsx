'use client';

import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/shared/ScrollReveal';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { STATS } from '@/data/stats';

/**
 * StatsSection — Animated counter section showing key career metrics.
 *
 * Features:
 * - Horizontal row of counters on desktop (flex), 2-column grid on mobile
 * - Each counter animates from 0 to target with ease-out deceleration
 * - Animation triggers once when section is 20% visible
 * - Does NOT re-animate on re-entry
 * - Labels rendered in active locale
 *
 * @see Requirements 7.1, 7.2, 7.3, 7.4
 */
export default function StatsSection() {
  const t = useTranslations('stats');

  return (
    <section
      id="stats"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="stats-heading"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal duration={500}>
          <h2
            id="stats-heading"
            className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t('title')}
          </h2>
        </ScrollReveal>

        {/* Desktop: horizontal row | Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex lg:flex-row lg:justify-evenly lg:gap-6">
          {STATS.map((stat) => (
            <AnimatedCounter
              key={stat.labelKey}
              target={stat.target}
              suffix={stat.suffix}
              labelKey={stat.labelKey}
              duration={2000}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
