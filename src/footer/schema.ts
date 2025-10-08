export type FooterItemType = 'column' | 'row' | 'internal' | 'external' | 'anchor';

export interface FooterItem {
  id?: string;
  type: FooterItemType;
  label?: string;
  link?: string;
  items?: FooterItem[];
  icon?: string;
  attrs?: {
    id?: string;
    target?: string;
  };
  style?: {
    padding?: string;
    margin?: string;
  };
}

export interface FooterSchema {
  type: 'footer';
  items: FooterItem[];
  style?: {
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

