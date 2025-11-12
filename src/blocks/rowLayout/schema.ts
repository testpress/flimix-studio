import type { Block } from '@blocks/shared/Block';
import type { StyleProps } from '@blocks/shared/Style';
import type { SectionBlock } from '@blocks/section/schema';

export const MaxColumns = 4
export const MinColumns = 1

export interface RowLayoutBlock extends Omit<Block, 'props' | 'children'> {
  type: 'rowLayout';
  children: SectionBlock[];
  style?: StyleProps;
  props: RowLayoutBlockProps;
}

//for now, we don't need any props for the RowLayoutBlock while integrating layout presets we can add props here
export type RowLayoutBlockProps = Record<string, never>;