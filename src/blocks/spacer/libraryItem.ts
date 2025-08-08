import type { SpacerBlockProps } from './schema';

export const SpacerLibraryItem = {
  type: 'spacer' as const,
  name: 'Spacer',
  description: 'Vertical spacing between blocks',
  icon: 'AlignVerticalSpaceBetween' as const,
  defaultProps: {
    height: 'md',
  } as SpacerBlockProps,
}; 