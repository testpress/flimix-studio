import type { Block } from '@blocks/shared/Block';

// Define item shape type
export type ItemShape = 'rectangle-landscape' | 'rectangle-portrait' | 'square' | 'circle';

// Define grid dimension type
export type GridDimension = 2 | 3 | 4;

// Define button alignment type
export type ButtonAlignment = 'left' | 'right';

// Define button icon position type
export type ButtonIconPosition = 'left' | 'right' | 'none';

// Button properties interface
export interface ButtonProps {
  text: string;
  enabled: boolean;
  alignment: ButtonAlignment;
  icon: string;
  iconPosition: ButtonIconPosition;
  textColor?: string;
  link?: string;
}

// Progress bar interface
export interface ProgressBarProps {
  enabled: boolean;
  color?: string;
}

// Poster grid block interface
export interface PosterGridBlock extends Omit<Block, 'props'> {
  type: 'posterGrid';
  props: PosterGridBlockProps;
}

// Poster grid block props interface
export interface PosterGridBlockProps {
  title?: string;
  columns?: GridDimension;
  rows?: GridDimension;
  itemShape?: ItemShape;
  items?: PosterGridItem[];
  button?: ButtonProps;
  progressBar?: ProgressBarProps;
}

// Individual poster item interface
export interface PosterGridItem {
  id: string;
  image: string;
  title: string;
  link?: string;
  progress?: number;
} 