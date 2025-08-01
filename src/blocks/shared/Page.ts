import type { BlockType } from './Block';
import type { Theme } from './Style';
import type { VisibilityProps } from './Visibility';

// Page schema interface
export interface PageSchema {
  title: string;
  theme?: Theme;
  visibility?: VisibilityProps;
  blocks: BlockType[];
} 