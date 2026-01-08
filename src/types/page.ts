import type { BlockType } from '@type/block';
import type { Theme } from '@type/style';
import type { VisibilityProps } from '@type/visibility';

// Page schema interface
export interface PageSchema {
  title: string;
  theme?: Theme;
  visibility?: VisibilityProps;
  blocks: BlockType[];
} 