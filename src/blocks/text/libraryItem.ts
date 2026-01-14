import type { BlockLibraryItem } from '@type/library';

export const TextLibraryItem: BlockLibraryItem = {
  type: 'text',
  name: 'Text',
  description: 'A simple text block for displaying content',
  icon: 'Type',
  defaultProps: {
    content: 'Enter your text content here...',
    font_family: 'sans',
    font_size: 'base',
    font_weight: 'normal',
    font_style: 'normal',
    text_decoration: 'none',
    line_height: 'normal',
    letter_spacing: 'normal'
  }
};  