export type Size = 'none' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type FooterLayoutPreset = 
  | '1-col'
  | '2-col'
  | '2-col-heavy-left'
  | '2-col-heavy-right'
  | '3-col'
  | '3-col-wide-center'
  | '4-col';

export type LinkOrientation = 'vertical' | 'horizontal';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type ItemAlignment = 'start' | 'center' | 'end';

export const MAX_FOOTER_ROWS = 3;
export const MAX_COLUMN_ITEMS = 5;

export interface FooterItem {
  id: string;
  type: 'item';
  label?: string;
  url?: string;
  icon?: string;
  linkType?: 'internal' | 'external' | 'anchor';
  style?: {
    color?: string;
    size?: IconSize;
  };
}

export interface FooterColumn {
  id: string;
  type: 'column';
  items: FooterItem[];
  orientation: LinkOrientation;
  alignment?: ItemAlignment;
}

export interface FooterRow {
  id: string;
  type: 'row-layout';
  preset: FooterLayoutPreset;
  columns: FooterColumn[];
  style?: {
    padding?: string;
    backgroundColor?: string;
    borderTop?: string;
    columnGap?: Size;
  };
}

export interface FooterSchema {
  type: 'footer';
  rows: FooterRow[];
  style?: {
    padding?: Size;
    margin?: Size;
    fontSize?: Size;
    backgroundColor?: string;
    textColor?: string;
  };
}

