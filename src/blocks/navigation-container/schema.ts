import type { Block } from '@type/block';
import type { StyleProps } from '@type/style';

// Supporting types
export type Size = 'sm' | 'md' | 'lg' | 'none';
export type NavigationItemType = 'internal' | 'external' | 'anchor' | 'dropdown';
export type NavigationAlignment = 'left' | 'center' | 'right';
export type HoverEffect = 'underline' | 'scale' | 'color' | 'none';
export type DropdownLayout = 'list' | 'grid-2x2';

// Navigation item limit constant
export const NAVIGATION_ITEM_LIMIT = 10;

// Dropdown item limit constant
export const DROPDOWN_ITEM_LIMIT = 10;

// Grouped configuration interfaces
export interface DropdownConfig {
  layout?: DropdownLayout;
  padding_top?: number;
  padding_right?: number;
  padding_bottom?: number;
  padding_left?: number;
  item_margin_top?: number;
  item_margin_right?: number;
  item_margin_bottom?: number;
  item_margin_left?: number;
}

export interface ItemAppearance {
  icon?: string;
  icon_gap?: number;
  badge?: string;
  image?: {
    src?: string;
    alt?: string;
    id?: string;
    target?: string;
  };
}

export interface NavigationColors {
  item_text?: string;
  item_background?: string;
  hover_text?: string;
  hover_background?: string;
  dropdown_text?: string;
  dropdown_background?: string;
}

export interface HoverConfig {
  disabled?: boolean;
  effect?: HoverEffect;
}

// Navigation item interface
export interface NavigationItem {
  id: string;
  type: NavigationItemType;
  label?: string;
  subtitle?: string;
  link?: string;
  target?: string;
  appearance?: ItemAppearance;
  items?: NavigationItem[];
  dropdown?: DropdownConfig;
  style?: StyleProps;
}

// Navigation container block props interface
export interface NavigationContainerProps {
  items: NavigationItem[];
  alignment?: NavigationAlignment;
  font_size?: Size;
  icon_size?: Size;
  item_gap?: number;
  hide_icons?: boolean;
  colors?: NavigationColors;
  hover?: HoverConfig;
}

// Navigation container block interface
export interface NavigationContainerBlock extends Omit<Block, 'props'> {
  type: 'navigation-container';
  props: NavigationContainerProps;
}
