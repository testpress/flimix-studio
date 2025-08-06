// Central re-export for all block library items
import { HeroLibraryItem } from '@blocks/hero/libraryItem';
import { TextLibraryItem } from '@blocks/text/libraryItem';
import { SectionLibraryItem } from '@blocks/section/libraryItem';
import { PosterGridLibraryItem } from '@blocks/poster-grid/libraryItem';
import type { BlockType } from '@blocks/shared/Block';
import type { BlockProps } from '@blocks/shared/FormTypes';

// Export individual library items
export { HeroLibraryItem } from '@blocks/hero/libraryItem';
export { TextLibraryItem } from '@blocks/text/libraryItem';
export { SectionLibraryItem } from '@blocks/section/libraryItem';
export { PosterGridLibraryItem } from '@blocks/poster-grid/libraryItem';

// Block library item type
export type BlockLibraryItem = {
  type: BlockType['type'];
  name: string;
  description: string;
  icon: 'Layout' | 'Type' | 'Square' | 'Grid2x2';
  defaultProps: BlockProps;
};

// Re-export all library items as an array for easy iteration
export const allLibraryItems = [
  HeroLibraryItem,
  TextLibraryItem,
  SectionLibraryItem,
  PosterGridLibraryItem,
] as const;

// Helper function to get all available block types
export function getAvailableBlockTypes(): string[] {
  return allLibraryItems.map(item => item.type);
}

// Helper function to get all block library items
export function getAllBlockLibraryItems(): BlockLibraryItem[] {
  return [...allLibraryItems];
} 