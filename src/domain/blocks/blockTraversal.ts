import type { Block } from '@blocks/shared/Block';
import type { BlockType } from '@blocks/shared/Block';
import { generateUniqueId } from '@utils/id';

export interface BlockPosition {
  parent: Block | null;
  container: Block[];
  index: number;
}

export interface BlockAndParent {
  block: BlockType | null;
  parent: BlockType | null;
  parentIndex: number;
}

/**
 * Finds a block and its parent in the block tree
 * @param blockId - The ID of the block to find
 * @param blocks - Array of blocks to search in
 * @returns Object containing the block, its parent, and parent index
 */
export function findBlockAndParent(
  blockId: string, 
  blocks: BlockType[]
): BlockAndParent {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.id === blockId) {
      return { block, parent: null, parentIndex: i };
    }
    if (block.children) {
      for (let j = 0; j < block.children.length; j++) {
        if (block.children[j].id === blockId) {
          return { block: block.children[j], parent: block, parentIndex: j };
        }
      }
    }
  }
  return { block: null, parent: null, parentIndex: -1 };
}

/**
 * Updates the children array of a parent block
 * @param blocks - Array of blocks to update
 * @param parentId - ID of the parent block
 * @param newChildren - New children array
 * @returns Updated blocks array
 */
export function updateParentChildren(
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

/**
 * Finds a block's position in the block tree
 * @param blocks - Array of blocks to search in
 * @param targetId - ID of the block to find
 * @returns BlockPosition object or null if not found
 */
export function findBlockPositionById(
  blocks: Block[],
  targetId: string
): BlockPosition | null {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.id === targetId) {
      return { parent: null, container: blocks, index: i };
    }
    if (block.children && Array.isArray(block.children)) {
      for (let j = 0; j < block.children.length; j++) {
        const child = block.children[j];
        if (child.id === targetId) {
          return { parent: block, container: block.children, index: j };
        }
      }
    }
  }
  return null;
}

/**
 * Finds block position with additional metadata for UI display
 * @param blockId - ID of the block to find
 * @param blocks - Array of blocks to search in
 * @returns Object with position information for UI
 */
export function findBlockPositionForUI(
  blockId: string, 
  blocks: any[]
): { isTopLevel: boolean; parentId: string | null; index: number; totalSiblings: number } {
  // Check top-level blocks first
  const topLevelIndex = blocks.findIndex(block => block.id === blockId);
  if (topLevelIndex !== -1) {
    return {
      isTopLevel: true,
      parentId: null,
      index: topLevelIndex,
      totalSiblings: blocks.length
    };
  }

  // Check nested blocks
  for (const block of blocks) {
    if (block.children) {
      const childIndex = block.children.findIndex((child: any) => child.id === blockId);
      if (childIndex !== -1) {
        return {
          isTopLevel: false,
          parentId: block.id,
          index: childIndex,
          totalSiblings: block.children.length
        };
      }
    }
  }

  return { isTopLevel: false, parentId: null, index: -1, totalSiblings: 0 };
}

/**
 * Clones a block with new unique IDs for the block and all its children
 * @param block - The block to clone
 * @returns A deep copy of the block with new IDs
 */
export function cloneBlockWithNewIds(block: BlockType): BlockType {
  const newId = generateUniqueId();
  const cloned: BlockType = {
    ...block,
    id: newId,
    children: block.children?.map(child => cloneBlockWithNewIds(child)),
  } as BlockType;
  return cloned;
} 