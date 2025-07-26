// Theme and padding enums
export type Theme = 'light' | 'dark';
export type Padding = 'none' | 'sm' | 'md' | 'lg';

// Platform types for visibility
export type Platform = 'tv' | 'mobile' | 'desktop';

// Base style properties
export interface StyleProps {
  theme?: Theme;
  padding?: Padding;
  textColor?: string;
}

// Visibility configuration
export interface VisibilityProps {
  platform?: Platform[];
}

// Event tracking
export interface EventProps {
  onCTAClick?: string;
  onView?: string;
  onInteraction?: string;
}

// Hero block specific props
export interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaButton?: {
    label: string;
    link: string;
  };
}

// Text block specific props
export interface TextBlockProps {
  content?: string;
}

// Base block interface
export interface Block {
  type: string;
  id: string;
  props: HeroBlockProps | TextBlockProps;
  style?: StyleProps;
  visibility?: VisibilityProps;
  events?: EventProps;
}

// Typed block interfaces for specific block types
export interface HeroBlock extends Omit<Block, 'props'> {
  type: 'hero';
  props: HeroBlockProps;
}

export interface TextBlock extends Omit<Block, 'props'> {
  type: 'text';
  props: TextBlockProps;
}

// Union type for all block types
export type BlockType = HeroBlock | TextBlock;

// Page schema interface
export interface PageSchema {
  title: string;
  theme?: Theme;
  visibility?: VisibilityProps;
  blocks: BlockType[];
} 