import type { Block } from '@type/block';
import type { StyleProps } from '@type/style';
import type { SectionBlock } from '@blocks/section/schema';

export const MaxColumns = 4;
export const MinColumns = 1;

export type GapSize = 'none' | 'sm' | 'md' | 'lg';
export interface RowLayoutBlock extends Omit<Block, 'props' | 'children'> {
  type: 'rowLayout';
  children: SectionBlock[];
  style?: StyleProps;
  props: RowLayoutBlockProps;
}

export type RowLayoutPreset = 
  | '1-col'
  | '2-col'
  | '2-col-heavy-left'  // 66/33 or 70/30
  | '2-col-heavy-right' // 33/66 or 30/70
  | '3-col'
  | '3-col-wide-center' // 25/50/25
  | '4-col';

export interface RowLayoutBlockProps {
  preset?: RowLayoutPreset;
  columnGap?: GapSize;
}