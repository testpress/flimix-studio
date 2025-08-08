import type { Block } from '@blocks/shared/Block';

export type DividerThickness = 'sm' | 'md' | 'lg';
export type DividerLength = 'full' | 'percentage';
export type DividerAlignment = 'left' | 'center' | 'right';
export type DividerStyle = 'solid' | 'dashed' | 'dotted';

export interface DividerBlock extends Omit<Block, 'props'> {
  type: 'divider';
  props: DividerBlockProps;
}

export interface DividerBlockProps {
  thickness: DividerThickness;
  length: DividerLength;
  percentageValue?: number; // Custom percentage value (1-100)
  alignment: DividerAlignment;
  style: DividerStyle;
} 