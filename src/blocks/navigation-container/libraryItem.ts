import type { NavigationContainerProps } from './schema';
import { generateUniqueId } from '@utils/id';

export const NavigationContainerLibraryItem = {
  type: 'navigation-container' as const,
  name: 'Navigation Container',
  description: 'A flexible navigation menu with support for links, dropdowns, and badges',
  icon: 'Menu' as const,
  defaultProps: {
    items: [
      {
        id: generateUniqueId(),
        type: 'internal' as const,
        label: 'Home',
        link: '/',
      },
      {
        id: generateUniqueId(),
        type: 'internal' as const,
        label: 'About',
        link: '/about',
      },
    ],
    alignment: 'left' as const,
    fontSize: 'md' as const,
    iconSize: 'md' as const,
    hover: {
      effect: 'color' as const,
      disabled: false,
    },
    hideIcons: false,
    itemGap: 24,
  } as NavigationContainerProps,
};
