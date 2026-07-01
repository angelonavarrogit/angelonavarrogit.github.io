'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { PROJECTS } from '@/data/projects';
import type { Project } from '@/lib/types';

/**
 * ProjectsSection — Premium case-study style project gallery.
 *
 * Each project shows: problem → solution → result + tech + links.
 * Cards have hover glow, image zoom, and stagger animations.
 *
 * @see Sprint 03: Projects Premium
 */
export default function ProjectsSection() {
  const t = useTranslations('projects');
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 px-6 sm:px-8 lg:px-12"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        {shouldAnimate ? (
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
            <h2 id="projects-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground-muted">{t('subtitle')}</p>
          </motion.div>
        ) : (
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t('label')}</p>
            <h2 id="projects-heading" className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{t('title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground-muted">{t('subtitle')}</p>
          </div>
        )}

        {/* Project grid */}
        {shouldAnimate ? (
          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {PROJECTS.map((project) => (
              <motion.div key={project.id} variants={fadeUp}>
                <CaseStudyCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {PROJECTS.map((project) => (
              <CaseStudyCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CaseStudyCard({ project }: { project: Project }) {
  const t = useTranslations('projects');

  // Resolve translation keys
  const prefix = project.id.replace(/-/g, '');
  const getKey = (suffix: string) => {
    const keyMap: Record<string, string> = {
      'smartchangeanalyzer': 'smartChange',
      'imsdecoder': 'imsDecoder',
      'cdrvalidationtool': 'cdrValidation',
      'jpdve': 'jpdve',
      'portfolioevergreen': 'portfolio',
    };
    const base = keyMap[prefix] || prefix;
    return `${base}.${suffix}`;
  };

  const title = t(getKey('title'));
  const problem = t(getKey('problem'));
  const solution = t(getKey('solution'));
  const result = t(getKey('result'));

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background-card/50 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
      tabIndex={0}
      aria-label={title}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-background-elevated">
        <Image
          src={project.imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          unoptimized={project.imageUrl.endsWith('.svg')}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-card/90 to-transparent" />

        {/* Tech pills on image */}
        <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full bg-background/70 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-foreground">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>

        {/* Case study flow */}
        <div className="mt-4 space-y-3">
          <CaseStudyItem label={t('problemLabel')} text={problem} color="text-red-400/90" />
          <CaseStudyItem label={t('solutionLabel')} text={solution} color="text-accent" />
          <CaseStudyItem label={t('resultLabel')} text={result} color="text-emerald-400" />
        </div>

        {/* Links */}
        <div className="mt-6 flex items-center gap-3 border-t border-border/30 pt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors duration-200 hover:border-accent/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={`GitHub - ${title}`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/20 px-3 py-1.5 text-xs font-medium text-accent transition-colors duration-200 hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={`Demo - ${title}`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function CaseStudyItem({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`mt-0.5 text-xs font-bold uppercase tracking-wider ${color} shrink-0 w-16`}>
        {label}
      </span>
      <span className="text-sm text-foreground-muted leading-relaxed">{text}</span>
    </div>
  );
}
