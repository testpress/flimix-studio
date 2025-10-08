export type HeaderItemType = 'logo' | 'title' | 'internal' | 'external' | 'anchor' | 'dropdown';

export interface HeaderItem {
  id?: string;
  type: HeaderItemType;
  label?: string;
  link?: string;
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
  };
}

export interface HeaderSchema {
  type: 'header';
  items: HeaderItem[];
  style?: {
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
  };
}

