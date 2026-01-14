import type { BlockLibraryItem } from '@type/library';
import { generateUniqueId } from '@utils/id';

export const TabsLibraryItem: BlockLibraryItem = {
  type: 'tabs' as const,
  name: 'Tabs Block',
  description: 'Display content in tabbed sections with customizable tabs',
  icon: 'Columns3Cog' as const,
  defaultProps: {
    tabs: [
      {
        id: 'features',
        label: 'Features',
        children: [
          {
            type: 'text',
            id: generateUniqueId(),
            props: { content: 'Features content here...' },
            style: {
              padding_top: '16px',
              padding_bottom: '16px',
              padding_left: '16px',
              padding_right: '16px',
              text_align: 'center'
            }
          }
        ]
      },
      {
        id: 'pricing',
        label: 'Pricing',
        children: [
          {
            type: 'text',
            id: generateUniqueId(),
            props: { content: 'Pricing content here...' },
            style: {
              padding_top: '16px',
              padding_bottom: '16px',
              padding_left: '16px',
              padding_right: '16px',
              text_align: 'center'
            }
          }
        ]
      },
      {
        id: 'reviews',
        label: 'Reviews',
        children: [
          {
            type: 'text',
            id: generateUniqueId(),
            props: { content: 'Reviews content here...' },
            style: {
              padding_top: '16px',
              padding_bottom: '16px',
              padding_left: '16px',
              padding_right: '16px',
              text_align: 'center'
            }
          }
        ]
      }
    ]
  }
}; 