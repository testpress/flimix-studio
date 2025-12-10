import type { Block } from '@blocks/shared/Block';

// Carousel item limit constant
export const CAROUSEL_ITEM_LIMIT = 12;

// Define item shape type
export type ItemShape = 'rectangle-landscape' | 'rectangle-portrait' | 'square' | 'circle';

// Define alignment type
export type Alignment = 'left' | 'center' | 'right';

// Define button alignment type
export type ButtonAlignment = 'left' | 'right';

// Define button icon type
export type ButtonIconPosition = 'left' | 'right' | 'none';

// Define item size type using abstract values
export type ItemSize = 'small' | 'medium' | 'large' | 'extra-large';

// Carousel item interface
export interface CarouselItem {
  id: number;
  content_id: number;
  title: string;
  subtitle?: string;
  url?: string;
  type?: string;
  status?: string;
  thumbnail?: string | null;
  poster?: string | null;
  cover?: string | null;
  genres?: string[];
  details?: {
    duration?: string | number;
    release_year?: number | string;
    imdb_rating?: string | number;
  };
  progress?: number;
}

// Carousel block interface
export interface CarouselBlock extends Omit<Block, 'props'> {
  type: 'carousel';
  props: CarouselBlockProps;
}

// Button properties interface
export interface ButtonProps {
  text: string;
  enabled: boolean;
  alignment: ButtonAlignment;
  icon: string;
  iconPosition: ButtonIconPosition;
  textColor?: string;
  link?: string;
}

// Progress bar interface
export interface ProgressBarProps {
  enabled: boolean;
  color?: string;
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
  button?: ButtonProps;
  progressBar?: ProgressBarProps;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showRating?: boolean;
  showGenre?: boolean;
  showDuration?: boolean;
} 