import type { HeroBlockProps } from './schema';
import { generateUniqueId } from '@utils/id';

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
    items: [
      {
        id: generateUniqueId(),
        title: 'Experience True Crime Stories',
        subtitle: 'Documentaries & Originals',
        backgroundImage: 'https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/2249/1740399792249-i',
        videoBackground: '',
        primaryCTA: { 
          label: 'Watch Now', 
          link: '/watch',
          variant: 'solid',
          icon: 'Play',
          iconPosition: 'left',
          iconThickness: 'normal',
          borderRadius: 'md',
          size: 'medium'
        },
        secondaryCTA: { 
          label: 'Trailer', 
          link: '/trailer',
          variant: 'outline',
          icon: 'Info',
          iconPosition: 'right',
          iconThickness: 'normal',
          borderRadius: 'md',
          size: 'medium'
        },
        metadata: { 
          year: '2025', 
          seasons: '4', 
          language: 'English' 
        },
        badges: [
          { label: 'Documentary' }, 
          { label: 'Crime' }
        ]
      }
    ]
  } as HeroBlockProps
}; 