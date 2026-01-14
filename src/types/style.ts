// Theme and padding enums
export type Theme = 'light' | 'dark';

// Text alignment options
export type TextAlign = 'left' | 'center' | 'right';

// Border radius options
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg';

// Box shadow options
export type BoxShadow = 'none' | 'sm' | 'md' | 'lg';

export type GridGap = 'sm' | 'md' | 'lg';

// Tab alignment options
export type TabAlignment = 'left' | 'center' | 'right';

// Tab style options
export type TabStyle = 'underline' | 'pill' | 'boxed';

// Keep literal information *and* allow arbitrary strings
export type StyleValue =
  | Theme
  | TextAlign
  | BorderRadius
  | BoxShadow
  | GridGap
  | TabAlignment
  | TabStyle
  | (string & {});

// Enhanced style properties
export interface StyleProps {
  theme?: Theme;
  // Individual padding sides (in pixels as strings, e.g., "10px")
  padding_top?: string;
  padding_right?: string;
  padding_bottom?: string;
  padding_left?: string;
  // Individual margin sides (in pixels as strings, e.g., "10px")
  margin_top?: string;
  margin_right?: string;
  margin_bottom?: string;
  margin_left?: string;
  text_align?: TextAlign;
  background_color?: string;
  text_color?: string;
  border_radius?: BorderRadius;
  box_shadow?: BoxShadow;
  max_width?: string;
  grid_gap?: GridGap;
  tab_alignment?: TabAlignment;
  tab_style?: TabStyle;
} 