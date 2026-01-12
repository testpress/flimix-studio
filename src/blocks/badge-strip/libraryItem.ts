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
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px'
        }
      },
      { 
        id: generateUniqueId(), 
        label: 'Dolby Atmos', 
        icon: 'Volume2',
        style: {
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px'
        }
      },
      { 
        id: generateUniqueId(), 
        label: 'iOS/Android', 
        icon: 'Smartphone',
        style: {
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px'
        }
      },
      { 
        id: generateUniqueId(), 
        label: 'HDR10+', 
        icon: 'Sun',
        style: {
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px'
        }
      },
      { 
        id: generateUniqueId(), 
        label: 'Multi-Language', 
        icon: 'Globe',
        style: {
          paddingTop: '15px',
          paddingRight: '15px',
          paddingBottom: '15px',
          paddingLeft: '15px'
        }
      }
    ],
    wrap: true
  } as BadgeStripBlockProps
};
