import type { DividerBlockProps } from './schema';

export const DividerLibraryItem = {
  type: 'divider' as const,
  name: 'Divider',
  description: 'Horizontal line divider with customizable styling',
  icon: 'Minus' as const,
  defaultProps: {
    thickness: 'md',
    length: 'full',
    percentage_value: 75,
    alignment: 'center',
    style: 'solid',
  } as DividerBlockProps,
  defaultStyle: {
    backgroundColor: '#ffffff',
  },
}; 