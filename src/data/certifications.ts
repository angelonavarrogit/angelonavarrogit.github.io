/**
 * Professional certifications data for Angelo Navarro
 * Uses i18n keys for bilingual support (ES/EN)
 */

import type { Certification } from '@/lib/types';

export const CERTIFICATIONS: Certification[] = [
  {
    nameKey: 'certs.capm',
    orgKey: 'certs.org.pmi',
    icon: 'capm',
  },
  {
    nameKey: 'certs.pmi',
    orgKey: 'certs.org.pmi',
    icon: 'pmi',
  },
  {
    nameKey: 'certs.nodejs',
    orgKey: 'certs.org.openjs',
    icon: 'nodejs',
  },
  {
    nameKey: 'certs.python',
    orgKey: 'certs.org.python',
    icon: 'python',
  },
  {
    nameKey: 'certs.scrum',
    orgKey: 'certs.org.scrum',
    icon: 'scrum',
  },
  {
    nameKey: 'certs.linux',
    orgKey: 'certs.org.lpi',
    icon: 'linux',
  },
  {
    nameKey: 'certs.docker',
    orgKey: 'certs.org.docker',
    icon: 'docker',
  },
];
