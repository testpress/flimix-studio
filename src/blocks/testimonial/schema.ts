import type { Block } from '@type/block';

// Testimonial item limit constant for carousel
export const TESTIMONIAL_ITEM_LIMIT = 12;

// Define layout type
export type TestimonialLayout = 'carousel' | 'grid' | 'single';

// Define item shape type
export type ItemShape = 'square' | 'circle';

// Define item size type for carousel
export type ItemSize = 'small' | 'medium' | 'large' | 'extra-large';

// Define grid dimension type
export type GridDimension = 2 | 3 | 4;

// Testimonial item interface
export interface TestimonialItem {
  id: string;
  quote: string;
  name?: string;
  designation?: string;
  image?: string;
  rating?: number; // 1-5 stars
}

// Testimonial block interface
export interface TestimonialBlock extends Omit<Block, 'props'> {
  type: 'testimonial';
  props: TestimonialBlockProps;
}

// Testimonial block props interface
export interface TestimonialBlockProps {
  title?: string;
  layout: TestimonialLayout;
  items: TestimonialItem[];
  // Carousel-specific props
  autoplay?: boolean;
  scroll_speed?: number;
  show_arrows?: boolean;
  item_size?: ItemSize;
  // Grid-specific props
  columns?: GridDimension;
  rows?: GridDimension;
  // Common props
  item_shape?: ItemShape;
} 