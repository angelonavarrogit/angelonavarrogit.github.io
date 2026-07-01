'use client';

import { useTranslations } from 'next-intl';

/**
 * Premium Footer — Built with pride, shows tech stack and personality.
 * @see Sprint 08
 */

const TECH_STACK = ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'];

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border/50 bg-background-card/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Brand */}
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">Angelo Navarro</p>
            <p className="mt-1 text-sm text-foreground-muted">Enterprise Systems Engineer</p>
          </div>

          {/* Built with */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground-subtle">
              {t('builtWith')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {TECH_STACK.map((tech) => (
                <span key={tech} className="rounded-md border border-border/50 px-2.5 py-1 text-xs font-medium text-foreground-muted">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Made in Panama */}
          <div className="flex items-center gap-2 text-sm text-foreground-subtle">
            <span>🇵🇦</span>
            <span>{t('madeIn')}</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-foreground-subtle">
            © {new Date().getFullYear()} Angelo Navarro. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
