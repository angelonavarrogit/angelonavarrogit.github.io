/**
 * Portfolio projects data for Angelo Navarro
 * Uses i18n keys for bilingual support (ES/EN)
 */

import type { Project } from '@/lib/types';

export const PROJECTS: Project[] = [
  {
    id: 'smart-change-analyzer',
    titleKey: 'projects.smartChange.title',
    descriptionKey: 'projects.smartChange.description',
    imageUrl: '/images/projects/smart-change.svg',
    techStack: ['Python', 'NLP', 'Git'],
    githubUrl: 'https://github.com/angelonavarro/smart-change-analyzer',
  },
  {
    id: 'ims-decoder',
    titleKey: 'projects.imsDecoder.title',
    descriptionKey: 'projects.imsDecoder.description',
    imageUrl: '/images/projects/ims-decoder.svg',
    techStack: ['Python', 'IMS', 'Telecom'],
    githubUrl: 'https://github.com/angelonavarro/ims-decoder',
  },
  {
    id: 'cdr-validation-tool',
    titleKey: 'projects.cdrValidation.title',
    descriptionKey: 'projects.cdrValidation.description',
    imageUrl: '/images/projects/cdr-validation.svg',
    techStack: ['Python', 'MySQL', 'Automation'],
    githubUrl: 'https://github.com/angelonavarro/cdr-validation-tool',
  },
  {
    id: 'j-pdve',
    titleKey: 'projects.jpdve.title',
    descriptionKey: 'projects.jpdve.description',
    imageUrl: '/images/projects/j-pdve.svg',
    techStack: ['TypeScript', 'Next.js', 'NestJS'],
    githubUrl: 'https://github.com/angelonavarro/j-pdve',
    demoUrl: 'https://jpdve.vercel.app',
  },
  {
    id: 'portfolio-evergreen',
    titleKey: 'projects.portfolio.title',
    descriptionKey: 'projects.portfolio.description',
    imageUrl: '/images/projects/portfolio.svg',
    techStack: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    githubUrl: 'https://github.com/angelonavarro/portfolio',
    demoUrl: 'https://angelonavarro.dev',
  },
];
