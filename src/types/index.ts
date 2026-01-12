// Core type definitions - barrel export
export type { Block, BlockType } from './block';
export type { EventProps } from './event';
export type { Field, FieldValue, NestedFormData } from './field';
export type { BlockProps, BlockItem, BlockFormProps } from './form';
export type { BlockLibraryItem } from './library';
export { 
  getAllBlockLibraryItems, 
  getAvailableBlockTypes,
  allLibraryItems,
  // Re-export individual library items
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
  CTAButtonLibraryItem,
  BadgeStripLibraryItem,
  RowLayoutLibraryItem,
  ContentLibraryLibraryItem
} from './library';
export type { PageSchema } from './page';
export type { 
  Theme, 
  TextAlign, 
  BorderRadius, 
  BoxShadow, 
  GridGap, 
  TabAlignment, 
  TabStyle, 
  StyleValue, 
  StyleProps 
} from './style';
export type { Platform, VisibilityProps, VisibilityContext } from './visibility';
