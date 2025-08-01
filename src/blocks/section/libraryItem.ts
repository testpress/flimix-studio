import type { SectionBlockProps } from './schema';

// Section block template for library
export const SectionLibraryItem = {
  type: 'section' as const,
  name: 'Section Block',
  description: 'Container for organizing multiple blocks',
  icon: 'Square' as const,
  defaultProps: {
    title: 'Section Title',
    description: 'Section description goes here...'
  } as SectionBlockProps
}; 