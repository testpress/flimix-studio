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
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  itemMarginTop?: number;
  itemMarginRight?: number;
  itemMarginBottom?: number;
  itemMarginLeft?: number;
}

export interface ItemAppearance {
  icon?: string;
  iconGap?: number;
  badge?: string;
  image?: {
    src?: string;
    alt?: string;
    id?: string;
    target?: string;
  };
}

export interface NavigationColors {
  itemText?: string;
  itemBackground?: string;
  hoverText?: string;
  hoverBackground?: string;
  dropdownText?: string;
  dropdownBackground?: string;
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
  fontSize?: Size;
  iconSize?: Size;
  itemGap?: number;
  hideIcons?: boolean;
  colors?: NavigationColors;
  hover?: HoverConfig;
}

// Navigation container block interface
export interface NavigationContainerBlock extends Omit<Block, 'props'> {
  type: 'navigation-container';
  props: NavigationContainerProps;
}
