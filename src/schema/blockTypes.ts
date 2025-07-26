// Theme and padding enums
export type Theme = 'light' | 'dark';
export type Padding = 'none' | 'sm' | 'md' | 'lg';

// Platform types for visibility
export type Platform = 'tv' | 'mobile' | 'desktop';

// Text alignment options
export type TextAlign = 'left' | 'center' | 'right';

// Border radius options
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg';

// Box shadow options
export type BoxShadow = 'none' | 'sm' | 'md' | 'lg';

// Enhanced visibility configuration
export interface VisibilityProps {
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  region?: string[];
  platform?: Platform[];
}

// Comprehensive event tracking
export interface EventProps {
  onClick?: string;
  onView?: string;
  onFocus?: string;
  onHover?: string;
  onSubmit?: string;
  onPlay?: string;
  onPause?: string;
  onExpand?: string;
  onCollapse?: string;
  onSwitch?: string;
  onSelect?: string;
}

// Enhanced style properties
export interface StyleProps {
  theme?: Theme;
  padding?: Padding;
  margin?: Padding;
  textAlign?: TextAlign;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: BorderRadius;
  boxShadow?: BoxShadow;
  maxWidth?: string;
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

// Section block specific props (container for nested blocks)
export interface SectionBlockProps {
  title?: string;
  description?: string;
}

// Base block interface with nested children support
export interface Block {
  type: string;
  id: string;
  props: HeroBlockProps | TextBlockProps | SectionBlockProps; // TODO: expand as needed
  style?: StyleProps;
  visibility?: VisibilityProps;
  events?: EventProps;
  children?: BlockType[];
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

export interface SectionBlock extends Omit<Block, 'props'> {
  type: 'section';
  props: SectionBlockProps;
  children: BlockType[]; // Section blocks must have children
}

// Union type for all block types
export type BlockType = HeroBlock | TextBlock | SectionBlock;

// Page schema interface
export interface PageSchema {
  title: string;
  theme?: Theme;
  visibility?: VisibilityProps;
  blocks: BlockType[];
} 