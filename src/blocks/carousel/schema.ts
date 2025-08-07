import type { Block } from '@blocks/shared/Block';

// Carousel item limit constant
export const CAROUSEL_ITEM_LIMIT = 12;

// Define item shape type
export type ItemShape = 'rectangle-landscape' | 'rectangle-portrait' | 'square' | 'circle';

// Define alignment type
export type Alignment = 'left' | 'center' | 'right';

// Define item size type using abstract values
export type ItemSize = 'small' | 'medium' | 'large' | 'extra-large';

// Carousel item interface
export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  meta?: {
    rating?: string;
    badge?: string;
    duration?: string;
  };
}

// Carousel block interface
export interface CarouselBlock extends Omit<Block, 'props'> {
  type: 'carousel';
  props: CarouselBlockProps;
}

// Carousel block props interface
export interface CarouselBlockProps {
  title?: string;
  itemShape: ItemShape;
  alignment: Alignment;
  autoplay: boolean;
  scrollSpeed: number;
  showArrows: boolean;
  itemSize?: ItemSize;
  items: CarouselItem[];
} 