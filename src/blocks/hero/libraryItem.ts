import type { HeroBlockProps } from './schema';

// Hero block template for library
export const HeroLibraryItem = {
  type: 'hero' as const,
  name: 'Hero Block',
  description: 'Top-of-page hero with video, image, multiple CTAs, badges, metadata, and branding',
  icon: 'Layout' as const,
  defaultProps: {
    variant: 'single',
    aspectRatio: '16:9',
    customHeight: '600px',
    showArrows: true,
    autoplay: false,
    scrollSpeed: 5000,
    items: []
  } as HeroBlockProps
}; 