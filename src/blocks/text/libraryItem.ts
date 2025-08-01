import type { TextBlockProps } from './schema';

// Text block template for library
export const TextLibraryItem = {
  type: 'text' as const,
  name: 'Text Block',
  description: 'Simple text content with formatting options',
  icon: 'Type' as const,
  defaultProps: {
    content: 'Enter your text content here...'
  } as TextBlockProps
};  