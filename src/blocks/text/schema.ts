import type { Block } from '@type/block';

// Text block interface
export interface TextBlock extends Omit<Block, 'props'> {
  type: 'text';
  props: TextBlockProps;
}

// Text block props interface
export interface TextBlockProps {
  content?: string;
  font_family?: 'sans' | 'serif' | 'mono' | 'display';
  font_size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  font_weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  font_style?: 'normal' | 'italic';
  text_decoration?: 'none' | 'underline' | 'line-through' | 'overline';
  line_height?: 'none' | 'tight' | 'normal' | 'relaxed' | 'loose';
  letter_spacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
} 