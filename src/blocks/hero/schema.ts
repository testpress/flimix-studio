import type { Block } from '@blocks/shared/Block';

// Hero block interface
export interface HeroBlock extends Omit<Block, 'props'> {
  type: 'hero';
  props: HeroBlockProps;
}

// Hero block props interface
export interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaButton?: {
    label: string;
    link: string;
  };
} 