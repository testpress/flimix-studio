import type { HeroBlockProps } from './schema';

// Hero block template for library
export const HeroLibraryItem = {
  type: 'hero' as const,
  name: 'Hero Block',
  description: 'Large banner with title, subtitle, and CTA button',
  icon: 'Layout' as const,
  defaultProps: {
    title: 'Welcome to Flimix',
    subtitle: 'Stream your favorite content anywhere',
    backgroundImage: '',
    ctaButton: {
      label: 'Get Started',
      link: '/signup'
    }
  } as HeroBlockProps
}; 