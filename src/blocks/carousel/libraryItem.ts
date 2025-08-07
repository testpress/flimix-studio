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
    scrollSpeed: 3000,
    showArrows: true,
    itemSize: 'w-72',
    items: [
      {
        id: '1',
        title: 'Sample Item 1',
        subtitle: 'Subtitle 1',
        image: 'https://images.unsplash.com/photo-1502136969935-8d8eef54d77b',
        link: '',
        meta: { badge: 'New', rating: 'PG-13' }
      },
      {
        id: '2',
        title: 'Sample Item 2',
        image: 'https://plus.unsplash.com/premium_photo-1674641194949-e154719cdc02?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2xpZGVyfGVufDB8fDB8fHww',
        link: '',
        meta: {}
      }
    ]
  } as CarouselBlockProps
}; 