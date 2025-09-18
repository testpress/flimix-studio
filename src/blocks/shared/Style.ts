// Theme and padding enums
export type Theme = 'light' | 'dark';
export type Padding = 'none' | 'sm' | 'md' | 'lg';

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
  | Padding
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
  padding?: Padding;
  margin?: Padding;
  textAlign?: TextAlign;
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  borderRadius?: BorderRadius;
  boxShadow?: BoxShadow;
  maxWidth?: string;
  gridGap?: GridGap;
  tabAlignment?: TabAlignment;
  tabStyle?: TabStyle;
} 