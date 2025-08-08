import type { Block } from '@blocks/shared/Block';

export type SpacerHeight = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpacerBlock extends Omit<Block, 'props'> {
  type: 'spacer';
  props: SpacerBlockProps;
}

export interface SpacerBlockProps {
  height: SpacerHeight;
} 