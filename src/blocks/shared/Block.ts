import type { StyleProps } from '@blocks/shared/Style';
import type { VisibilityProps } from '@blocks/shared/Visibility';
import type { EventProps } from '@blocks/shared/Event';
import type { HeroBlock } from '@blocks/hero/schema';
import type { TextBlock } from '@blocks/text/schema';
import type { SectionBlock } from '@blocks/section/schema';
import type { PosterGridBlock } from '@blocks/poster-grid/schema';
import type { CarouselBlock } from '@blocks/carousel/schema';
import type { HeroBlockProps } from '@blocks/hero/schema';
import type { TextBlockProps } from '@blocks/text/schema';
import type { SectionBlockProps } from '@blocks/section/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';
import type { CarouselBlockProps } from '@blocks/carousel/schema';
import type { SpacerBlock } from '@blocks/spacer/schema';
import type { SpacerBlockProps } from '@blocks/spacer/schema';

// Union type for all block types (imported from individual block schemas)
export type BlockType = HeroBlock | TextBlock | SectionBlock | PosterGridBlock | CarouselBlock | SpacerBlock;

// Base Block interface that all blocks extend
export interface Block {
  id: string;
  type: 'hero' | 'text' | 'section' | 'posterGrid' | 'carousel' | 'spacer';
  props: HeroBlockProps | TextBlockProps | SectionBlockProps | PosterGridBlockProps | CarouselBlockProps | SpacerBlockProps;
  style?: StyleProps;
  visibility?: VisibilityProps;
  events?: EventProps;
  children?: BlockType[];
} 