// Central re-export for all block library items
import { HeroLibraryItem } from './hero/schema';
import { TextLibraryItem } from './text/schema';
import { SectionLibraryItem } from './section/schema';

export { HeroLibraryItem } from './hero/schema';
export { TextLibraryItem } from './text/schema';
export { SectionLibraryItem } from './section/schema';

// Re-export all library items as an array for easy iteration
export const allLibraryItems = [
  HeroLibraryItem,
  TextLibraryItem,
  SectionLibraryItem,
] as const;

// Helper function to get all available block types
export function getAvailableBlockTypes(): string[] {
  return allLibraryItems.map(item => item.type);
}

// Helper function to get all block templates
export function getAllBlockTemplates() {
  return [...allLibraryItems];
} 