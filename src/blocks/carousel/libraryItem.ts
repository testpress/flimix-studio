import type { CarouselBlockProps } from './schema';

// Carousel block template for library
export const CarouselLibraryItem = {
  type: 'carousel' as const,
  name: 'Carousel',
  description: 'Horizontal scrolling gallery with customizable items and navigation',
  icon: 'GalleryHorizontalEnd' as const,
  defaultProps: {
    title: 'Trending Now',
    item_shape: 'rectangle-landscape' as const,
    alignment: 'left' as const,
    autoplay: false,
    scroll_speed: 1000,
    show_arrows: true,
    item_size: 'large',
    items: [],
    show_title: true,
    show_subtitle: true,
    show_rating: true,
    show_genre: true,
    show_duration: true
  } as CarouselBlockProps
}; 