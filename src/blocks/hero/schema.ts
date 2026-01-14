import type { Block } from '@type/block';

// Hero block interface
export interface HeroBlock extends Omit<Block, 'props'> {
  type: 'hero';
  props: HeroBlockProps;
}

export interface HeroItem {
  id: number;
  content_id: number;
  title_type?: 'text' | 'image';
  title?: string;
  url?: string;
  title_image?: string;
  subtitle?: string;
  video_background?: string;
  details?: {
    duration?: string | number;
    release_year?: number | string;
    imdb_rating?: string | number;
    language?: string;
    video_background?: string;
    title_image?: string;
    hashtag?: string;
  };
  genres?: string[];
  thumbnail_path?: string | null;
  poster_path?: string | null;
  cover_path?: string | null;
  thumbnail?: string | null;
  poster?: string | null;
  cover?: string | null;
  primary_cta?: HeroCTABtn;
  secondary_cta?: HeroCTABtn;
  tertiary_cta?: HeroCTABtn;
  hashtag?: HeroHashtag;
  show_title?: boolean;
  show_subtitle?: boolean;
  show_genres?: boolean;
  show_meta?: boolean;
  show_hashtag?: boolean;
}


export interface HeroBlockProps {
  variant?: 'single' | 'carousel';
  aspect_ratio?: '16:9' | 'auto' | 'custom';
  custom_height?: string; // Height value in pixels for custom aspect ratio (e.g., '600px')
  items: HeroItem[];
  show_arrows?: boolean;
  autoplay?: boolean;
  scroll_speed?: number; // in milliseconds
}
export interface HeroCTABtn {
  label: string;
  link: string;
  variant?: 'solid' | 'outline';
  background_color?: string;
  text_color?: string;
  icon?: 'Play' | 'Plus' | 'Info' | 'ChevronRight' | 'ChevronLeft' | 'ArrowRight' | 'ArrowLeft' | 'Download' | 'None';
  icon_position?: 'left' | 'right';
  border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  icon_thickness?: 'thin' | 'normal' | 'thick';
  size?: 'small' | 'medium' | 'large'; // Button size option
}

export interface HeroHashtag {
  text: string;
  color?: string; // Hex color code for the hashtag
  size?: 'small' | 'medium' | 'large' | 'xl'; // Text size of the hashtag
}