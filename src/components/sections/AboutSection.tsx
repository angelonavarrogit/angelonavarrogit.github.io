'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/shared/ScrollReveal';

/**
 * AboutSection — Professional biography with photo and scroll reveal animation.
 *
 * Features:
 * - Professional bio paragraph rendered in active locale (ES/EN)
 * - Profile photo with descriptive alt text (i18n-aware)
 * - Photo fallback: initials placeholder ("AN") on image load error
 * - Wrapped in ScrollReveal for 300-600ms Framer Motion animation on viewport entry
 * - Responsive layout: side-by-side on desktop, stacked on mobile
 *
 * @see Requirements 2.1, 2.2, 2.3, 2.4
 */
export default function AboutSection() {
  const t = useTranslations('about');
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="about"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal duration={500}>
          <h2
            id="about-heading"
            className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t('title')}
          </h2>
        </ScrollReveal>

        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {/* Photo with fallback */}
          <ScrollReveal delay={100} duration={500}>
            <div className="relative flex-shrink-0">
              {imageError ? (
                <div
                  className="flex h-64 w-64 items-center justify-center rounded-full bg-accent/20 border-2 border-accent"
                  role="img"
                  aria-label={t('photoAlt')}
                >
                  <span className="text-5xl font-bold text-accent select-none">
                    AN
                  </span>
                </div>
              ) : (
                <Image
                  src="/images/angelo-profile.webp"
                  alt={t('photoAlt')}
                  width={256}
                  height={256}
                  className="rounded-full object-cover border-2 border-accent/30"
                  priority={false}
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </ScrollReveal>

          {/* Bio text */}
          <ScrollReveal delay={200} duration={500}>
            <div className="max-w-2xl text-center md:text-left">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('bio')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
