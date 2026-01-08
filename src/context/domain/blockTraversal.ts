import type { Block } from '@type/block';
import type { BlockType } from '@type/block';
import type { TabsBlock } from '@blocks/tabs/schema';

export interface BlockPosition {
  parent: Block | null;
  children: Block[];
  index: number;
}

export interface BlockAndParent {
  block: BlockType | null;
  parent: BlockType | null;
  children: BlockType[] | null;
  parentIndex: number;
}

/**
 * Recursively searches for a block and its parent children array.
 * @param blockId - The ID of the block to find
 * @param blocks - Array of blocks to search in
 * @param parent - The parent block (null for root, used internally for recursion)
 * @returns Object containing the block, its parent, children array, and parent index
 */
export function findBlockAndParent(
  blockId: string, 
  blocks: BlockType[],
  parent: BlockType | null = null
): BlockAndParent {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.id === blockId) {
      return { block, parent, children: blocks, parentIndex: i };
    }
    if (block.children && block.children.length > 0) {
      const found = findBlockAndParent(blockId, block.children, block);
      if (found.block) {
        return found;
      }
    }

    if (block.type === 'tabs') {
      const tabsBlock = block as TabsBlock;
      for (const tab of tabsBlock.props.tabs) {
        if (tab.children && tab.children.length > 0) {
          const found = findBlockAndParent(blockId, tab.children, block);
          if (found.block) {
            return found;
          }
        }
      }
    }
  }
  return { block: null, parent: null, children: null, parentIndex: -1 };
}

/**
 * Finds the exact position of a block (parent, children array, and index).
 * This implementation uses the recursive findBlockAndParent.
 * @param blocks - Array of blocks to search in
 * @param targetId - ID of the block to find
 * @returns BlockPosition object or null if not found
 */
export function findBlockPositionById(
  blocks: BlockType[],
  targetId: string
): BlockPosition | null {
  const result = findBlockAndParent(targetId, blocks);

  if (result.block && result.children) {
    return {
      parent: result.parent,
      children: result.children as Block[],
      index: result.parentIndex,
    };
  }

  return null;
}

/**
 * Finds block position with additional metadata for UI display
 * Uses the recursive findBlockAndParent to find blocks at any depth
 * @param blockId - ID of the block to find
 * @param blocks - Array of blocks to search in
 * @returns Object with position information for UI
 */
export function findBlockPositionForUI(
  blockId: string, 
  blocks: BlockType[]
): { isTopLevel: boolean; parentId: string | null; index: number; totalSiblings: number } {
  const result = findBlockAndParent(blockId, blocks);

  if (result.block && result.children) {
    return {
      isTopLevel: result.parent === null,
      parentId: result.parent?.id || null,
      index: result.parentIndex,
      totalSiblings: result.children.length
    };
  }

  return { isTopLevel: false, parentId: null, index: -1, totalSiblings: 0 };
}
/**
 * Gets the children blocks array from the parent block in the blocks tree.
 * Uses parent information to efficiently locate the children blocks without full traversal.
 * @param parent - The parent block (null for root-level blocks)
 * @param targetBlockId - ID of the block whose children blocks we're finding
 * @param targetIndex - Index of the target block in its children blocks
 * @param blocks - The blocks tree to search in
 * @returns The children blocks array (BlockType[]) or null if not found
 */
export function getChildrenBlocks(
  parent: BlockType | null,
  targetBlockId: string,
  targetIndex: number,
  blocks: BlockType[]
): BlockType[] | null {
  // If parent is null, children blocks is the root blocks array
  if (!parent) {
    return blocks;
  }

  // Find the parent block in the blocks tree by its ID
  const result = findBlockAndParent(parent.id, blocks);
  if (!result.block) {
    return null;
  }
  const parentBlock = result.block;

  // If parent is a tabs block, find which tab contains the target block
  if (parentBlock.type === 'tabs') {
    const tabsBlock = parentBlock as TabsBlock;
    for (const tab of tabsBlock.props.tabs) {
      if (tab.children) {
        // Check if this tab contains the target block
        const childIndex = tab.children.findIndex(child => child.id === targetBlockId);
        if (childIndex !== -1 && childIndex === targetIndex) {
          return tab.children;
        }
      }
    }
    return null;
  }

  return parentBlock.children || null;
}