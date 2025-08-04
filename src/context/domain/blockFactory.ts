import type { BlockType } from '@blocks/shared/Block';
import { generateUniqueId } from '@utils/id';
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

/**
 * Creates a deep copy of a block with new unique IDs for the block and all its children
 * Used for duplicating blocks in the editor
 * @param block - The block to duplicate
 * @returns A deep copy of the block with new IDs
 */
export function duplicateBlockWithNewIds(block: BlockType): BlockType {
  const newId = generateUniqueId();
  const duplicated: BlockType = {
    ...block,
    id: newId,
    children: block.children?.map(child => duplicateBlockWithNewIds(child)),
  } as BlockType;
  return duplicated;
}

/**
 * Updates the children array of a parent block in the block tree
 * Used for modifying block hierarchy when blocks are moved, added, or removed
 * @param blocks - Array of blocks to update
 * @param parentId - ID of the parent block
 * @param newChildren - New children array
 * @returns Updated blocks array
 */
export function updateBlockChildren(
  blocks: BlockType[], 
  parentId: string, 
  newChildren: BlockType[]
): BlockType[] {
  return blocks.map(block => {
    if (block.id === parentId) {
      return {
        ...block,
        children: newChildren
      } as BlockType;
    }
    return block;
  });
} 