import type { Block, BlockType } from '@blocks/shared/Block';

// Tab interface for individual tabs
export interface Tab {
  id: string;
  label: string;
  children?: BlockType[];
}

// Tabs block interface
export interface TabsBlock extends Omit<Block, 'props'> {
  type: 'tabs';
  props: TabsBlockProps;
}

// Tabs block props interface
export interface TabsBlockProps {
  tabs: Tab[];
}

// Maximum number of tabs allowed
export const TABS_ITEM_LIMIT = 5; 