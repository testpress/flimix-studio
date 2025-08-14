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
import type { FeatureCalloutBlockProps } from '@blocks/feature-callout/schema';
import type { FAQAccordionBlockProps } from '@blocks/faq-accordion/schema';
import type { ImageBlockProps } from '@blocks/image/schema';
import type { TabsBlockProps } from '@blocks/tabs/schema';

// Define a type for all possible block props
export type BlockProps = HeroBlockProps | TextBlockProps | SectionBlockProps | PosterGridBlockProps | CarouselBlockProps | TestimonialBlockProps | SpacerBlockProps | DividerBlockProps | FeatureCalloutBlockProps | FAQAccordionBlockProps | ImageBlockProps | TabsBlockProps;

export interface BlockFormProps {
  block: Block;
  updateProps: (newProps: Partial<BlockProps>) => void;
  updateStyle?: (newStyle: Partial<StyleProps>) => void;
} 