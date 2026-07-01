/**
 * Professional experience data for Angelo Navarro
 * Uses i18n keys for bilingual support (ES/EN)
 */

import type { ExperiencePosition } from '@/lib/types';

export const EXPERIENCE: ExperiencePosition[] = [
  {
    id: 'cable-wireless-2020',
    titleKey: 'experience.cableWireless.title',
    company: 'Cable & Wireless Panama',
    startDate: '2020-01-01',
    endDate: '2021-06-30',
    descriptionKey: 'experience.cableWireless.description',
    achievementsKeys: [
      'experience.cableWireless.achievement1',
      'experience.cableWireless.achievement2',
      'experience.cableWireless.achievement3',
    ],
  },
  {
    id: 'especialista-sistemas-2021',
    titleKey: 'experience.especialistaSistemas.title',
    company: 'Cable & Wireless Panama',
    startDate: '2021-07-01',
    endDate: '2022-06-30',
    descriptionKey: 'experience.especialistaSistemas.description',
    achievementsKeys: [
      'experience.especialistaSistemas.achievement1',
      'experience.especialistaSistemas.achievement2',
      'experience.especialistaSistemas.achievement3',
    ],
  },
  {
    id: 'mas-movil-2022',
    titleKey: 'experience.masMovil.title',
    company: '+Móvil (Liberty Latin America)',
    startDate: '2022-07-01',
    endDate: null,
    descriptionKey: 'experience.masMovil.description',
    achievementsKeys: [
      'experience.masMovil.achievement1',
      'experience.masMovil.achievement2',
      'experience.masMovil.achievement3',
      'experience.masMovil.achievement4',
    ],
  },
];
