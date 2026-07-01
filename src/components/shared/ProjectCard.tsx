'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/types';
import { truncateText } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * ProjectCard — Individual project card with hover/focus reveal of action links.
 *
 * Features:
 * - Preview image via next/image with placeholder blur
 * - Description truncated to 200 chars max (uses truncateText utility)
 * - Tech stack shown as individual badges/pills
 * - GitHub link: visible always if githubUrl exists, opens in new tab
 * - Demo link: visible ONLY if demoUrl exists — no empty space when missing
 * - Hover/focus/touch: card elevates with shadow, action links become prominent (<300ms)
 * - Keyboard/touch equivalent behavior for action link visibility
 * - Stagger appearance via Framer Motion
 *
 * @see Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations('projects');

  const description = t(project.descriptionKey.replace('projects.', ''));
  const title = t(project.titleKey.replace('projects.', ''));
  const truncatedDescription = truncateText(description, { maxLength: 200 });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-[250ms] ease-out hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 focus-within:shadow-xl focus-within:shadow-accent/10 focus-within:-translate-y-1"
      tabIndex={0}
      aria-label={title}
    >
      {/* Preview image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={project.imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[250ms] ease-out group-hover:scale-105 group-focus-within:scale-105"
          placeholder="empty"
          unoptimized={project.imageUrl.endsWith('.svg')}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {title}
        </h3>

        {/* Description truncated to 200 chars */}
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {truncatedDescription}
        </p>

        {/* Tech stack badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action links — revealed on hover/focus/touch */}
        <div className="mt-auto flex gap-3 opacity-0 transition-opacity duration-[250ms] ease-out group-hover:opacity-100 group-focus-within:opacity-100">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground/10 px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card"
              aria-label={`${t('viewGithub')} - ${title}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {t('viewGithub')}
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent transition-colors duration-150 hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card"
              aria-label={`${t('viewDemo')} - ${title}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t('viewDemo')}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
