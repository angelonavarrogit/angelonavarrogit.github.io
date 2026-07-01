'use client';

import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ProjectCard from '@/components/shared/ProjectCard';
import { PROJECTS } from '@/data/projects';

/**
 * ProjectsSection — Responsive grid of project cards with stagger animations.
 *
 * Features:
 * - Section heading with scroll reveal animation
 * - Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
 * - Each project card animates in with stagger via Framer Motion
 * - Renders project descriptions in active locale via useTranslations
 *
 * @see Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
export default function ProjectsSection() {
  const t = useTranslations('projects');

  return (
    <section
      id="projects"
      className="relative py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal duration={500}>
          <h2
            id="projects-heading"
            className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t('title')}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
