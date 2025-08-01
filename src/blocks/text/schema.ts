import type { Block } from '@blocks/shared/Block';

// Text block interface
export interface TextBlock extends Omit<Block, 'props'> {
  type: 'text';
  props: TextBlockProps;
}

// Text block props interface
export interface TextBlockProps {
  content?: string;
} 