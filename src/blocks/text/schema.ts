import type { Block } from '@type/block';

// Text block interface
export interface TextBlock extends Omit<Block, 'props'> {
  type: 'text';
  props: TextBlockProps;
}

// Text block props interface
export interface TextBlockProps {
  content?: string;
  fontFamily?: 'sans' | 'serif' | 'mono' | 'display';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  fontWeight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  lineHeight?: 'none' | 'tight'| 'normal' | 'relaxed' | 'loose';
  letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
} 