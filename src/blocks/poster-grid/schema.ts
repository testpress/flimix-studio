import type { Block } from '@blocks/shared/Block';

// Poster grid block interface
export interface PosterGridBlock extends Omit<Block, 'props'> {
  type: 'posterGrid';
  props: PosterGridBlockProps;
}

// Poster grid block props interface
export interface PosterGridBlockProps {
  title?: string;
  itemShape?: 'rectangle-landscape' | 'rectangle-portrait' | 'square' | 'circle';
  items?: PosterGridItem[];
}

// Individual poster item interface
export interface PosterGridItem {
  id: string;
  image: string;
  title: string;
  link?: string;
} 