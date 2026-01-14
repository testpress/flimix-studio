import type { HeroBlockProps } from './schema';

// Hero block template for library
export const HeroLibraryItem = {
  type: 'hero' as const,
  name: 'Hero Block',
  description: 'Top-of-page hero with video, image, multiple CTAs, badges, metadata, and branding',
  icon: 'Layout' as const,
  defaultProps: {
    variant: 'single',
    aspect_ratio: '16:9',
    custom_height: '600px',
    show_arrows: true,
    autoplay: false,
    scroll_speed: 5000,
    items: []
  } as HeroBlockProps
}; 