import type { Block } from '@blocks/shared/Block';
import type { BlockType } from '@blocks/shared/Block';
import type { TabsBlock } from '@blocks/tabs/schema';

export interface BlockPosition {
  parent: Block | null;
  container: Block[];
  index: number;
}

export interface BlockAndParent {
  block: BlockType | null;
  parent: BlockType | null;
  container: BlockType[] | null;
  parentIndex: number;
}

/**
 * Recursively searches for a block and its parent container.
 * @param blockId - The ID of the block to find
 * @param blocks - Array of blocks to search in
 * @param parent - The parent block (null for root, used internally for recursion)
 * @returns Object containing the block, its parent, container array, and parent index
 */
export function findBlockAndParent(
  blockId: string, 
  blocks: BlockType[],
  parent: BlockType | null = null
): BlockAndParent {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.id === blockId) {
      return { block, parent, container: blocks, parentIndex: i };
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
            // Special: container is the tab's children array
            return { ...found, container: tab.children };
          }
        }
      }
    }
  }
  return { block: null, parent: null, container: null, parentIndex: -1 };
}

/**
 * Finds the exact position of a block (parent, container array, and index).
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

  if (result.block && result.container) {
    return {
      parent: result.parent,
      container: result.container as Block[],
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

  if (result.block && result.container) {
    return {
      isTopLevel: result.parent === null,
      parentId: result.parent?.id || null,
      index: result.parentIndex,
      totalSiblings: result.container.length
    };
  }

  return { isTopLevel: false, parentId: null, index: -1, totalSiblings: 0 };
} 