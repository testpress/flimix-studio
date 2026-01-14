import type { Block } from '@type/block';

// Feature callout item limit constant
export const FEATURE_CALLOUT_ITEM_LIMIT = 8;

// Define item size type
export type ItemSize = 'small' | 'medium' | 'large';

// Predefined icon options for Feature Callout
export const FEATURE_ICONS = [
  'Clapperboard', 'Film', 'Video', 'Play', 'Star', 'Heart', 'Zap', 'Rocket',
  'Shield', 'CheckCircle', 'Award', 'Gift', 'Lightbulb', 'Target', 'TrendingUp',
  'Users', 'Globe', 'Smartphone', 'Monitor', 'Tv', 'Headphones', 'Music',
  'Camera', 'Image', 'FileText', 'BookOpen', 'GraduationCap', 'Briefcase',
  'Home', 'MapPin', 'Phone', 'Mail', 'MessageCircle', 'ThumbsUp', 'Smile'
] as const;

export type FeatureIcon = typeof FEATURE_ICONS[number];

// Feature callout item interface
export interface FeatureCalloutItem {
  id: string;
  icon?: FeatureIcon | string; // Can be predefined icon or custom string
  label: string;
  description?: string;
  // Item-level styling
  style?: {
    background_color?: string;
    text_color?: string;
    padding?: 'sm' | 'md' | 'lg';
    margin?: 'sm' | 'md' | 'lg';
    border_radius?: 'none' | 'sm' | 'md' | 'lg';
    box_shadow?: 'none' | 'sm' | 'md' | 'lg';
  };
}

// Feature callout block interface
export interface FeatureCalloutBlock extends Omit<Block, 'props'> {
  type: 'featureCallout';
  props: FeatureCalloutBlockProps;
}

// Feature callout block props interface
export interface FeatureCalloutBlockProps {
  title?: string;
  subtitle?: string;
  items: FeatureCalloutItem[];
  item_size?: ItemSize;
  show_icons: boolean;
  show_descriptions: boolean;
} 