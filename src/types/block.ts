import type { StyleProps } from '@type/style';
import type { VisibilityProps } from '@type/visibility';
import type { EventProps } from '@type/event';
import type { HeroBlock } from '@blocks/hero/schema';
import type { TextBlock } from '@blocks/text/schema';
import type { SectionBlock } from '@blocks/section/schema';
import type { PosterGridBlock } from '@blocks/poster-grid/schema';
import type { CarouselBlock } from '@blocks/carousel/schema';
import type { TestimonialBlock } from '@blocks/testimonial/schema';
import type { HeroBlockProps } from '@blocks/hero/schema';
import type { TextBlockProps } from '@blocks/text/schema';
import type { SectionBlockProps } from '@blocks/section/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';
import type { CarouselBlockProps } from '@blocks/carousel/schema';
import type { TestimonialBlockProps } from '@blocks/testimonial/schema';
import type { SpacerBlock } from '@blocks/spacer/schema';
import type { SpacerBlockProps } from '@blocks/spacer/schema';
import type { DividerBlock } from '@blocks/divider/schema';
import type { DividerBlockProps } from '@blocks/divider/schema';
import type { FeatureCalloutBlock } from '@blocks/feature-callout/schema';
import type { FeatureCalloutBlockProps } from '@blocks/feature-callout/schema';
import type { FAQAccordionBlock } from '@blocks/faq-accordion/schema';
import type { FAQAccordionBlockProps } from '@blocks/faq-accordion/schema';
import type { ImageBlock } from '@blocks/image/schema';
import type { ImageBlockProps } from '@blocks/image/schema';
import type { VideoBlock } from '@blocks/video/schema';
import type { VideoBlockProps } from '@blocks/video/schema';
import type { TabsBlock } from '@blocks/tabs/schema';
import type { TabsBlockProps } from '@blocks/tabs/schema';
import type { CTAButtonBlock } from '@blocks/cta-button/schema';
import type { CTAButtonBlockProps } from '@blocks/cta-button/schema';
import type { BadgeStripBlock } from '@blocks/badge-strip/schema';
import type { BadgeStripBlockProps } from '@blocks/badge-strip/schema';
import type { RowLayoutBlockProps } from '@blocks/row-layout/schema';
import type { RowLayoutBlock } from '@blocks/row-layout/schema';
import type { ContentLibraryBlock } from '@blocks/content-library/schema';
import type { ContentLibraryBlockProps } from '@blocks/content-library/schema';
import type { NavigationContainerBlock } from '@blocks/navigation-container/schema';
import type { NavigationContainerProps } from '@blocks/navigation-container/schema';

// Union type for all block types (imported from individual block schemas)
export type BlockType = 
  | HeroBlock
  | TextBlock
  | SectionBlock
  | PosterGridBlock
  | CarouselBlock
  | TestimonialBlock
  | SpacerBlock
  | DividerBlock
  | FeatureCalloutBlock
  | FAQAccordionBlock
  | ImageBlock
  | VideoBlock
  | TabsBlock
  | CTAButtonBlock
  | BadgeStripBlock
  | RowLayoutBlock
  | ContentLibraryBlock
  | NavigationContainerBlock;

// Base Block interface that all blocks extend
export interface Block {
  id: string;
  type: 'hero' | 'text' | 'section' | 'posterGrid' | 'carousel' | 'testimonial' | 'spacer' | 'divider' | 'featureCallout' | 'faq-accordion' | 'image' | 'video' | 'tabs' | 'cta-button' | 'badge-strip'
  | 'rowLayout'
  | 'contentLibrary'
  | 'navigation-container';
  props: HeroBlockProps | TextBlockProps | SectionBlockProps | PosterGridBlockProps | CarouselBlockProps | TestimonialBlockProps | SpacerBlockProps | DividerBlockProps | FeatureCalloutBlockProps | FAQAccordionBlockProps | ImageBlockProps | VideoBlockProps | TabsBlockProps | CTAButtonBlockProps | BadgeStripBlockProps | RowLayoutBlockProps | ContentLibraryBlockProps | NavigationContainerProps;
  style?: StyleProps;
  visibility?: VisibilityProps;
  events?: EventProps;
  children?: BlockType[];
}