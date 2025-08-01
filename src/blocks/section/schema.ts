import type { Block } from '@blocks/shared/Block';

// Section block interface
export interface SectionBlock extends Omit<Block, 'props'> {
  type: 'section';
  props: SectionBlockProps;
}

// Section block props interface
export interface SectionBlockProps {
  title?: string;
  description?: string;
} 