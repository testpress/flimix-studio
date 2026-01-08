import type { BlockLibraryItem } from '@type/library';

export const TextLibraryItem: BlockLibraryItem = {
  type: 'text',
  name: 'Text',
  description: 'A simple text block for displaying content',
  icon: 'Type',
  defaultProps: {
    content: 'Enter your text content here...',
    fontFamily: 'sans',
    fontSize: 'base',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    lineHeight: 'normal',
    letterSpacing: 'normal'
  }
};  