export type HeaderItemType = 'logo' | 'title' | 'internal' | 'external' | 'anchor' | 'dropdown' | 'button';
export type Size = 'none' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type HeaderLayout = 'horizontal' | 'vertical';

export const MAX_NAVIGATION_ITEMS = 10;
export const MAX_DROPDOWN_ITEMS = 5;

export type Alignment = 'start' | 'center' | 'end';
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
    fontSize?: Size;
    borderRadius?: Size;
    color?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    border?: string;
  };
}

export interface HeaderSchema {
  type: 'header';
  items: HeaderItem[];
  style?: {
    layout?: HeaderLayout;
    padding?: Size;
    margin?: Size;
    borderRadius?: Size;
    navigationFontSize?: Size;
    logoSize?: Size;
    navigationIconSize?: Size;
    backgroundColor?: string;
    textColor?: string;
    navigationAlignment?: Alignment;
    verticalItemAlignment?: Alignment;
    hoverColor?: string;
    hoverTextColor?: string;
    disableHover?: boolean;
    hoverEffect?: HoverEffect;
    hideNavIcons?: boolean;
  };
}

