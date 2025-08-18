import type { BadgeStripBlockProps } from './schema';
import { generateUniqueId } from '@utils/id';

export const BadgeStripLibraryItem = {
  type: 'badge-strip' as const,
  name: 'Badge Strip',
  description: 'Horizontal row of badges/icons with optional links and tooltips',
  icon: 'Award' as const,   // Lucide icon suggestion
  defaultProps: {
    items: [
      { id: generateUniqueId(), label: '4K UHD', icon: 'Monitor' },
      { id: generateUniqueId(), label: 'Dolby Atmos', icon: 'Volume2' },
      { id: generateUniqueId(), label: 'iOS/Android', icon: 'Smartphone'},
      { id: generateUniqueId(), label: 'HDR10+', icon: 'Sun' },
      { id: generateUniqueId(), label: 'Multi-Language', icon: 'Globe' }
    ],
    wrap: true
  } as BadgeStripBlockProps
};
