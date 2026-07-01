/**
 * Skills dashboard data for Angelo Navarro
 * Categorized technical competencies with proficiency levels
 * Uses i18n keys for bilingual support (ES/EN)
 */

import type { SkillCategory } from '@/lib/types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'backend',
    nameKey: 'skills.categories.backend',
    skills: [
      { nameKey: 'skills.python', level: 'expert', icon: 'python' },
      { nameKey: 'skills.nodejs', level: 'advanced', icon: 'nodejs' },
    ],
  },
  {
    id: 'devops',
    nameKey: 'skills.categories.devops',
    skills: [
      { nameKey: 'skills.docker', level: 'advanced', icon: 'docker' },
      { nameKey: 'skills.linux', level: 'expert', icon: 'linux' },
    ],
  },
  {
    id: 'telecom',
    nameKey: 'skills.categories.telecom',
    skills: [
      { nameKey: 'skills.ims', level: 'advanced', icon: 'ims' },
      { nameKey: 'skills.cdr', level: 'expert', icon: 'cdr' },
      { nameKey: 'skills.mediation', level: 'advanced', icon: 'mediation' },
    ],
  },
  {
    id: 'database',
    nameKey: 'skills.categories.database',
    skills: [
      { nameKey: 'skills.mysql', level: 'advanced', icon: 'mysql' },
    ],
  },
  {
    id: 'project-management',
    nameKey: 'skills.categories.projectManagement',
    skills: [
      { nameKey: 'skills.capm', level: 'intermediate', icon: 'capm' },
      { nameKey: 'skills.scrum', level: 'advanced', icon: 'scrum' },
    ],
  },
];
