import type { Block } from '@blocks/shared/Block';
import type { StyleProps } from '@blocks/shared/Style';
import type { HeroBlockProps } from '@blocks/hero/schema';
import type { TextBlockProps } from '@blocks/text/schema';
import type { SectionBlockProps } from '@blocks/section/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';

// Define a type for all possible block props
export type BlockProps = HeroBlockProps | TextBlockProps | SectionBlockProps | PosterGridBlockProps;

export interface BlockFormProps {
  block: Block;
  updateProps: (newProps: Partial<BlockProps>) => void;
  updateStyle?: (newStyle: Partial<StyleProps>) => void;
} 