import type { BlockType } from '@blocks/shared/Block';
import { generateUniqueId } from './idUtils';
import { HeroLibraryItem, TextLibraryItem, SectionLibraryItem } from '@blocks/shared/Library';

/**
 * Creates a new block of the specified type with default values and a unique ID
 * @param type - The type of block to create ('text', 'hero', 'section')
 * @returns A new block with minimal valid properties
 */
export function createBlock(type: BlockType['type']): BlockType {
  const id = generateUniqueId();

  switch (type) {
    case 'text':
      return {
        type: 'text',
        id,
        props: TextLibraryItem.defaultProps,
        style: {
          padding: 'md',
          textAlign: 'left'
        }
      };

    case 'hero':
      return {
        type: 'hero',
        id,
        props: HeroLibraryItem.defaultProps,
        style: {
          padding: 'lg',
          textAlign: 'center'
        }
      };

    case 'section':
      return {
        type: 'section',
        id,
        props: SectionLibraryItem.defaultProps,
        style: {
          padding: 'md',
          backgroundColor: '#f8f9fa'
        },
        children: []
      };

    default:
      // This will cause a compile-time error if a case is missed.
      const exhaustiveCheck: never = type;
      throw new Error(`Unhandled block type: ${exhaustiveCheck}`);
  }
} 