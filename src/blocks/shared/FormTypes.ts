import type { Block } from '@blocks/shared/Block';
import type { StyleProps } from '@blocks/shared/Style';
import type { HeroBlockProps } from '@blocks/hero/schema';
import type { TextBlockProps } from '@blocks/text/schema';
import type { SectionBlockProps } from '@blocks/section/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';
import type { CarouselBlockProps } from '@blocks/carousel/schema';
import type { TestimonialBlockProps } from '@blocks/testimonial/schema';
import type { SpacerBlockProps } from '@blocks/spacer/schema';
import type { DividerBlockProps } from '@blocks/divider/schema';

// Define a type for all possible block props
export type BlockProps = HeroBlockProps | TextBlockProps | SectionBlockProps | PosterGridBlockProps | CarouselBlockProps | TestimonialBlockProps | SpacerBlockProps | DividerBlockProps;

export interface BlockFormProps {
  block: Block;
  updateProps: (newProps: Partial<BlockProps>) => void;
  updateStyle?: (newStyle: Partial<StyleProps>) => void;
} 