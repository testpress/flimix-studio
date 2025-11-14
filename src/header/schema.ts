export type HeaderItemType = 'logo' | 'title' | 'internal' | 'external' | 'anchor' | 'dropdown' | 'button';

export const MAX_NAVIGATION_ITEMS = 10;
export const MAX_DROPDOWN_ITEMS = 8;

export type NavigationAlignment = 'left' | 'center' | 'right';
export type HoverEffect = 'text' | 'background';

export interface HeaderItem {
  id: string;
  type: HeaderItemType;
  isVisible?: boolean;
  label?: string;
  link?: string;
  icon?: string;
  items?: HeaderItem[];
  attrs?: {
    src?: string;
    alt?: string;
    id?: string;
    target?: string;
  };
  style?: {
    fontSize?: string;
    color?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    borderRadius?: string;
    border?: string;
  };
}

export interface HeaderSchema {
  type: 'header';
  items: HeaderItem[];
  style?: {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    navigationAlignment?: NavigationAlignment;
    navigationFontSize?: string;
    hoverColor?: string;
    disableHover?: boolean;
    hoverEffect?: HoverEffect;
    hideNavIcons?: boolean;
  };
}

