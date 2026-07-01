/**
 * Skills data — Reorganized into premium categories per Sprint 04.
 * Categories: Backend, Cloud & DevOps, Telecommunications, Automation, AI, Project Management
 */

import type { SkillCategory } from '@/lib/types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'backend',
    nameKey: 'skills.categories.backend',
    skills: [
      { nameKey: 'skills.python', level: 'expert', icon: 'python' },
      { nameKey: 'skills.nodejs', level: 'advanced', icon: 'nodejs' },
      { nameKey: 'skills.mysql', level: 'advanced', icon: 'mysql' },
      { nameKey: 'skills.restApis', level: 'expert', icon: 'api' },
    ],
  },
  {
    id: 'cloud',
    nameKey: 'skills.categories.cloud',
    skills: [
      { nameKey: 'skills.docker', level: 'advanced', icon: 'docker' },
      { nameKey: 'skills.linux', level: 'expert', icon: 'linux' },
      { nameKey: 'skills.cicd', level: 'advanced', icon: 'cicd' },
      { nameKey: 'skills.vercel', level: 'advanced', icon: 'vercel' },
    ],
  },
  {
    id: 'telecom',
    nameKey: 'skills.categories.telecom',
    skills: [
      { nameKey: 'skills.ims', level: 'advanced', icon: 'ims' },
      { nameKey: 'skills.cdr', level: 'expert', icon: 'cdr' },
      { nameKey: 'skills.mediation', level: 'advanced', icon: 'mediation' },
      { nameKey: 'skills.billing', level: 'advanced', icon: 'billing' },
    ],
  },
  {
    id: 'automation',
    nameKey: 'skills.categories.automation',
    skills: [
      { nameKey: 'skills.scripting', level: 'expert', icon: 'script' },
      { nameKey: 'skills.etl', level: 'advanced', icon: 'etl' },
      { nameKey: 'skills.monitoring', level: 'advanced', icon: 'monitor' },
    ],
  },
  {
    id: 'ai',
    nameKey: 'skills.categories.ai',
    skills: [
      { nameKey: 'skills.nlp', level: 'intermediate', icon: 'nlp' },
      { nameKey: 'skills.dataAnalysis', level: 'advanced', icon: 'data' },
      { nameKey: 'skills.promptEng', level: 'advanced', icon: 'ai' },
    ],
  },
  {
    id: 'project-management',
    nameKey: 'skills.categories.projectManagement',
    skills: [
      { nameKey: 'skills.capm', level: 'advanced', icon: 'capm' },
      { nameKey: 'skills.scrum', level: 'advanced', icon: 'scrum' },
      { nameKey: 'skills.stakeholder', level: 'advanced', icon: 'people' },
    ],
  },
];
