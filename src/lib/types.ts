/**
 * Shared TypeScript types and interfaces for Angelo Portfolio (EVERGREEN)
 *
 * Central type definitions used across the application.
 * All component props, data models, and utility types are defined here.
 */

// ============================================
// i18n
// ============================================

/** Supported locales for the bilingual portfolio */
export type Locale = 'es' | 'en';

/** Configuration for the i18n system */
export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
  storageKey: string;
}

// ============================================
// Navigation
// ============================================

/** A navigable section link used in header and command palette */
export interface SectionLink {
  id: string;
  labelKey: string; // i18n translation key
  href: string;
}

// ============================================
// Experience Timeline
// ============================================

/** A professional position in the experience timeline */
export interface ExperiencePosition {
  id: string;
  titleKey: string;
  company: string;
  startDate: string; // ISO date string
  endDate: string | null; // null = "Present"
  descriptionKey: string;
  achievementsKeys: string[];
}

// ============================================
// Skills Dashboard
// ============================================

/** Skill proficiency levels */
export type SkillLevel = 'intermediate' | 'advanced' | 'expert';

/** An individual technical skill */
export interface Skill {
  nameKey: string;
  level: SkillLevel;
  icon?: string;
}

/** A category grouping related skills */
export interface SkillCategory {
  id: string;
  nameKey: string;
  skills: Skill[];
}

// ============================================
// Projects
// ============================================

/** A portfolio project */
export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

// ============================================
// Certifications
// ============================================

/** A professional certification */
export interface Certification {
  nameKey: string;
  orgKey: string;
  icon: string;
}

// ============================================
// Stats Counter
// ============================================

/** A stat item for the animated counters section */
export interface StatItem {
  target: number;
  suffix: string;
  labelKey: string;
}

// ============================================
// Telecom Section
// ============================================

/** A telecom competency block */
export interface TelecomBlock {
  id: string;
  nameKey: string;
  tools: string[];
}

// ============================================
// GitHub Integration
// ============================================

/** Complete GitHub data fetched via ISR */
export interface GitHubData {
  contributions: ContributionDay[];
  pinnedRepos: PinnedRepo[];
  totalCommits: number;
  topLanguages: LanguageStat[];
  lastUpdated: string; // ISO timestamp
  isStale: boolean; // true if using fallback data
  partialFailure: string[]; // list of failed sections
}

/** A single day in the contribution heatmap */
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/** A pinned GitHub repository */
export interface PinnedRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
}

/** A programming language usage statistic */
export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

// ============================================
// Blog
// ============================================

/** Blog article categories */
export type BlogCategory = 'IMS' | 'CDR' | 'Python Automation' | 'CAPM/PMI' | 'Telecom';

/** A blog article card displayed in the blog section */
export interface ArticleCard {
  slug: string;
  title: string;
  publishedAt: string; // ISO date string
  summary: string;
  category: BlogCategory;
  language: 'ES' | 'EN';
}

// ============================================
// Contact Form
// ============================================

/** Contact form field values */
export interface ContactFormData {
  name: string; // 2-100 chars
  email: string; // max 254, valid format
  subject: string; // 3-150 chars
  message: string; // 10-1000 chars
}

/** Contact form UI state */
export interface ContactFormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  errors: Partial<Record<keyof ContactFormData, string>>;
  serverError?: string;
}

// ============================================
// Command Palette
// ============================================

/** A search result in the command palette */
export interface CommandResult {
  id: string;
  title: string;
  type: 'section' | 'project' | 'article';
  href: string;
}

// ============================================
// SEO
// ============================================

/** Page-level SEO metadata */
export interface PageSEO {
  title: string; // max 60 chars
  description: string; // max 160 chars
  ogImage?: string;
  ogUrl: string;
  jsonLd?: Record<string, unknown>;
}

// ============================================
// Shared / Utilities
// ============================================

/** Props for the ScrollReveal animation wrapper */
export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // stagger delay in ms
  duration?: number; // 300-600ms
  disabled?: boolean; // true when prefers-reduced-motion
}

/** Options for the text truncation utility */
export type TruncateOptions = {
  maxLength: number;
  indicator?: string; // default "…"
};
