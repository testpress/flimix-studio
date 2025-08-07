import type { Block } from '@blocks/shared/Block';

// Define item shape type
export type ItemShape = 'rectangle-landscape' | 'rectangle-portrait' | 'square' | 'circle';

// Define grid dimension type
export type GridDimension = 2 | 3 | 4;

// Poster grid block interface
export interface PosterGridBlock extends Omit<Block, 'props'> {
  type: 'posterGrid';
  props: PosterGridBlockProps;
}

// Poster grid block props interface
export interface PosterGridBlockProps {
  title?: string;
  columns?: GridDimension;
  rows?: GridDimension;
  itemShape?: ItemShape;
  items?: PosterGridItem[];
}

// Individual poster item interface
export interface PosterGridItem {
  id: string;
  image: string;
  title: string;
  link?: string;
} 