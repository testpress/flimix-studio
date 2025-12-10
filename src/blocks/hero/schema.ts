import type { Block } from '@blocks/shared/Block';

// Hero block interface
export interface HeroBlock extends Omit<Block, 'props'> {
  type: 'hero';
  props: HeroBlockProps;
}

export interface HeroItem {
  id: number;
  content_id: number;
  titleType?: 'text' | 'image';
  title?: string;
  url?: string;
  titleImage?: string;
  subtitle?: string;
  videoBackground?: string;
  details?: {
    duration?: string | number;
    release_year?: number | string;
    imdb_rating?: string | number;
    language?: string;
    videoBackground?: string;
    titleImage?: string;
    hashtag?: string;
  };
  genres?: string[];
  thumbnail?: string | null;
  poster?: string | null;
  cover?: string | null;
  primaryCTA?: HeroCTABtn;
  secondaryCTA?: HeroCTABtn;
  tertiaryCTA?: HeroCTABtn;
  hashtag?: HeroHashtag;
  showTitle?: boolean;     
  showSubtitle?: boolean; 
  showGenres?: boolean;     
  showMeta?: boolean;
  showHashtag?: boolean; 
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
  size?: 'small' | 'medium' | 'large'; // Button size option
}

export interface HeroHashtag {
  text: string;
  color?: string; // Hex color code for the hashtag
  size?: 'small' | 'medium' | 'large' | 'xl'; // Text size of the hashtag
}