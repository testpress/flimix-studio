import type { Block } from '@blocks/shared/Block';

// Feature callout item limit constant
export const FEATURE_CALLOUT_ITEM_LIMIT = 8;

// Define alignment type
export type Alignment = 'left' | 'center' | 'right';

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
    backgroundColor?: string;
    textColor?: string;
    padding?: 'sm' | 'md' | 'lg';
    margin?: 'sm' | 'md' | 'lg';
    borderRadius?: 'none' | 'sm' | 'md' | 'lg';
    boxShadow?: 'none' | 'sm' | 'md' | 'lg';
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
  alignment: Alignment;
  itemSize?: ItemSize;
  showIcons: boolean;
  showDescriptions: boolean;
} 