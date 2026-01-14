import type { Block } from '@type/block';

export type ContentLibraryItemSize = 'small' | 'medium' | 'large';
export type ContentLibraryItemGap = 'small' | 'medium' | 'large';
export type ContentLibraryItemShape = 'landscape' | 'portrait' | 'square';

export interface ContentLibraryBlockProps {
  content_type_id?: number;
  item_size?: ContentLibraryItemSize;
  item_gap?: ContentLibraryItemGap;
  item_shape?: ContentLibraryItemShape;
  show_title?: boolean;
  show_subtitle?: boolean;
  show_genres?: boolean;
  show_rating?: boolean;
  show_year?: boolean;
  title?: string;
  title_alignment?: 'left' | 'center' | 'right';
  empty_state_message?: string;
  loading_state_message?: string;
}

export interface ContentLibraryBlock extends Omit<Block, 'props'> {
  type: 'contentLibrary';
  props: ContentLibraryBlockProps;
}
