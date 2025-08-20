import type { Block } from '@blocks/shared/Block';

// Hero block interface
export interface HeroBlock extends Omit<Block, 'props'> {
  type: 'hero';
  props: HeroBlockProps;
}

export interface HeroItem {
  id: string;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  videoBackground?: string;
  metadata?: HeroMetadata;
  badges?: HeroBadge[];
  primaryCTA?: HeroCTABtn;
  secondaryCTA?: HeroCTABtn;
  hashtag?: HeroHashtag;
}


export interface HeroBlockProps {
  variant?: 'single' | 'carousel';
  aspectRatio?: '16:9' | 'auto' | 'custom';
  customHeight?: string; // Height value in pixels for custom aspect ratio (e.g., '600px')
  items: HeroItem[];
  showArrows?: boolean;
  autoplay?: boolean;
  scrollSpeed?: number; // in milliseconds
}
export interface HeroCTABtn {
  label: string;
  link: string;
  variant?: 'solid' | 'outline';
  backgroundColor?: string;
  textColor?: string;
  icon?: 'Play' | 'Plus' | 'Info' | 'ChevronRight' | 'ChevronLeft' | 'ArrowRight' | 'ArrowLeft' | 'Download' | 'None';
  iconPosition?: 'left' | 'right';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  iconThickness?: 'thin' | 'normal' | 'thick';
}

export interface HeroMetadata {
  year?: string;
  seasons?: string;
  language?: string;
}

export interface HeroBadge {
  id: string;
  label: string;
}

export interface HeroHashtag {
  text: string;
  color?: string; // Hex color code for the hashtag
}