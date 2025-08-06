import type { Block } from '@blocks/shared/Block';
import type { HeroBlockProps } from '@blocks/hero/schema';
import type { TextBlockProps } from '@blocks/text/schema';
import type { SectionBlockProps } from '@blocks/section/schema';

// Define a type for all possible block props
export type BlockProps = HeroBlockProps | TextBlockProps | SectionBlockProps;

export interface BlockFormProps {
  block: Block;
  updateProps: (newProps: Partial<BlockProps>) => void;
} 