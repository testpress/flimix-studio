import type { CarouselBlockProps } from './schema';

// Carousel block template for library
export const CarouselLibraryItem = {
  type: 'carousel' as const,
  name: 'Carousel',
  description: 'Horizontal scrolling gallery with customizable items and navigation',
  icon: 'GalleryHorizontalEnd' as const,
  defaultProps: {
    title: 'Trending Now',
    itemShape: 'rectangle-landscape' as const,
    alignment: 'left' as const,
    autoplay: false,
    scrollSpeed: 1000,
    showArrows: true,
    itemSize: 'large',
    items: []
  } as CarouselBlockProps
}; 