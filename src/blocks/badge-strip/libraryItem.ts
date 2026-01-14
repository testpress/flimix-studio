import type { BadgeStripBlockProps } from './schema';
import { generateUniqueId } from '@utils/id';

export const BadgeStripLibraryItem = {
  type: 'badge-strip' as const,
  name: 'Badge Strip',
  description: 'Horizontal row of badges/icons with optional links and tooltips',
  icon: 'Award' as const,   // Lucide icon suggestion
  defaultProps: {
    items: [
      {
        id: generateUniqueId(),
        label: '4K UHD',
        icon: 'Monitor',
        style: {
          padding_top: '15px',
          padding_right: '15px',
          padding_bottom: '15px',
          padding_left: '15px'
        }
      },
      {
        id: generateUniqueId(),
        label: 'Dolby Atmos',
        icon: 'Volume2',
        style: {
          padding_top: '15px',
          padding_right: '15px',
          padding_bottom: '15px',
          padding_left: '15px'
        }
      },
      {
        id: generateUniqueId(),
        label: 'iOS/Android',
        icon: 'Smartphone',
        style: {
          padding_top: '15px',
          padding_right: '15px',
          padding_bottom: '15px',
          padding_left: '15px'
        }
      },
      {
        id: generateUniqueId(),
        label: 'HDR10+',
        icon: 'Sun',
        style: {
          padding_top: '15px',
          padding_right: '15px',
          padding_bottom: '15px',
          padding_left: '15px'
        }
      },
      {
        id: generateUniqueId(),
        label: 'Multi-Language',
        icon: 'Globe',
        style: {
          padding_top: '15px',
          padding_right: '15px',
          padding_bottom: '15px',
          padding_left: '15px'
        }
      }
    ],
    wrap: true
  } as BadgeStripBlockProps
};
