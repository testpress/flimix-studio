import type { Block } from '@blocks/shared/Block';

export type ContentLibraryItemSize = 'small' | 'medium' | 'large';
export type ContentLibraryItemGap = 'small' | 'medium' | 'large';
export type ContentLibraryItemShape = 'landscape' | 'portrait' | 'square';

export interface ContentLibraryBlockProps {
  contentTypeId?: number;
  itemSize?: ContentLibraryItemSize;
  itemGap?: ContentLibraryItemGap;
  itemShape?: ContentLibraryItemShape;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showGenres?: boolean;
  showRating?: boolean;
  showYear?: boolean;
  title?: string;
  titleAlignment?: 'left' | 'center' | 'right';
  emptyStateMessage?: string;
  loadingStateMessage?: string;
}

export interface ContentLibraryBlock extends Omit<Block, 'props'> {
  type: 'contentLibrary';
  props: ContentLibraryBlockProps;
}
