import type { Block } from '@type/block';
import type { StyleProps } from '@type/style';
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
import type { VideoBlockProps } from '@blocks/video/schema';
import type { TabsBlockProps } from '@blocks/tabs/schema';
import type { CTAButtonBlockProps } from '@blocks/cta-button/schema';
import type { BadgeStripBlockProps } from '@blocks/badge-strip/schema';
import type { RowLayoutBlockProps } from '@blocks/row-layout/schema';
import type { ContentLibraryBlockProps } from '@blocks/content-library/schema';
import type { NavigationContainerProps } from '@blocks/navigation-container/schema';

// Define a type for all possible block props
export type BlockProps = 
  | HeroBlockProps
  | TextBlockProps
  | SectionBlockProps
  | PosterGridBlockProps
  | CarouselBlockProps
  | TestimonialBlockProps
  | SpacerBlockProps
  | DividerBlockProps
  | FeatureCalloutBlockProps
  | FAQAccordionBlockProps
  | ImageBlockProps
  | VideoBlockProps
  | TabsBlockProps
  | CTAButtonBlockProps
  | BadgeStripBlockProps
  | RowLayoutBlockProps
  | ContentLibraryBlockProps
  | NavigationContainerProps;

// Generic type for block items that have an id
export interface BlockItem {
  id: string;
}

export interface BlockFormProps {
  block: Block;
  updateProps: (newProps: Partial<BlockProps>) => void;
  updateStyle?: (newStyle: Partial<StyleProps>) => void;
} 