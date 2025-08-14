// Central re-export for all block library items
import { HeroLibraryItem } from '@blocks/hero/libraryItem';
import { TextLibraryItem } from '@blocks/text/libraryItem';
import { SectionLibraryItem } from '@blocks/section/libraryItem';
import { PosterGridLibraryItem } from '@blocks/poster-grid/libraryItem';
import { CarouselLibraryItem } from '@blocks/carousel/libraryItem';
import { TestimonialLibraryItem } from '@blocks/testimonial/libraryItem';
import { SpacerLibraryItem } from '@blocks/spacer/libraryItem';
import { DividerLibraryItem } from '@blocks/divider/libraryItem';
import { FeatureCalloutLibraryItem } from '@blocks/feature-callout/libraryItem';
import { FAQAccordionLibraryItem } from '@blocks/faq-accordion/libraryItem';
import { ImageLibraryItem } from '@blocks/image/libraryItem';
import { VideoLibraryItem } from '@blocks/video/libraryItem';
import { TabsLibraryItem } from '@blocks/tabs/libraryItem';
import { FooterLibraryItem } from '@blocks/footer/libraryItem';
import type { BlockType } from '@blocks/shared/Block';
import type { BlockProps } from '@blocks/shared/FormTypes';

// Export individual library items
export { HeroLibraryItem } from '@blocks/hero/libraryItem';
export { TextLibraryItem } from '@blocks/text/libraryItem';
export { SectionLibraryItem } from '@blocks/section/libraryItem';
export { PosterGridLibraryItem } from '@blocks/poster-grid/libraryItem';
export { CarouselLibraryItem } from '@blocks/carousel/libraryItem';
export { TestimonialLibraryItem } from '@blocks/testimonial/libraryItem';
export { SpacerLibraryItem } from '@blocks/spacer/libraryItem';
export { DividerLibraryItem } from '@blocks/divider/libraryItem';
export { FeatureCalloutLibraryItem } from '@blocks/feature-callout/libraryItem';
export { FAQAccordionLibraryItem } from '@blocks/faq-accordion/libraryItem';
export { ImageLibraryItem } from '@blocks/image/libraryItem';
export { VideoLibraryItem } from '@blocks/video/libraryItem';
export { TabsLibraryItem } from '@blocks/tabs/libraryItem';
export { FooterLibraryItem } from '@blocks/footer/libraryItem';

// Block library item type
export type BlockLibraryItem = {
  type: BlockType['type'];
  name: string;
  description: string;
  icon: 'Layout' | 'Type' | 'Square' | 'Grid2x2' | 'GalleryHorizontalEnd' | 'AlignVerticalSpaceBetween' | 'Minus' | 'MessageSquare' | 'Sparkles' | 'HelpCircle' | 'Image' | 'Video'| 'Columns3Cog' | 'Columns' | 'CreditCard';
  defaultProps: BlockProps;
};

// Re-export all library items as an array for easy iteration
export const allLibraryItems: BlockLibraryItem[] = [
  HeroLibraryItem,
  TextLibraryItem,
  SectionLibraryItem,
  PosterGridLibraryItem,
  CarouselLibraryItem,
  TestimonialLibraryItem,
  SpacerLibraryItem,
  DividerLibraryItem,
  FeatureCalloutLibraryItem,
  FAQAccordionLibraryItem,
  ImageLibraryItem,
  VideoLibraryItem,
  TabsLibraryItem,
  FooterLibraryItem,
];

// Helper function to get all available block types
export function getAvailableBlockTypes(): string[] {
  return allLibraryItems.map(item => item.type);
}

// Helper function to get all block library items
export function getAllBlockLibraryItems(): BlockLibraryItem[] {
  return [...allLibraryItems];
} 