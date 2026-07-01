/**
 * Telecom competency blocks for Angelo Navarro
 * Visual representation of telecom domain expertise areas
 * Uses i18n keys for bilingual support (ES/EN)
 */

import type { TelecomBlock } from '@/lib/types';

export const TELECOM_BLOCKS: TelecomBlock[] = [
  {
    id: 'csg-mediation',
    nameKey: 'telecom.csgMediation',
    tools: ['Python Automation', 'Linux'],
  },
  {
    id: 'cdr-processing',
    nameKey: 'telecom.cdrProcessing',
    tools: ['Python', 'MySQL', 'Automation'],
  },
  {
    id: 'ims',
    nameKey: 'telecom.ims',
    tools: ['Node.js APIs', 'Python'],
  },
  {
    id: 'sms',
    nameKey: 'telecom.sms',
    tools: ['Python', 'Linux'],
  },
  {
    id: 'billing',
    nameKey: 'telecom.billing',
    tools: ['MySQL', 'Python'],
  },
  {
    id: 'mediation',
    nameKey: 'telecom.mediation',
    tools: ['Docker', 'Linux', 'Python'],
  },
  {
    id: 'mavenair',
    nameKey: 'telecom.mavenair',
    tools: ['Project Management (CAPM)', 'Node.js'],
  },
];
