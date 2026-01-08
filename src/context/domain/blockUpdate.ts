import type { BlockType } from '@type/block';
import type { TabsBlock } from '@blocks/tabs/schema';

type BlockTransformer = (block: BlockType) => BlockType;

/**
 * Recursively traverses the block tree to find and update a specific block.
 * Returns the updated blocks array and the updated block object in a single pass.
 * 
 * @param blocks - The array of blocks to traverse.
 * @param targetId - The ID of the block to update.
 * @param transformBlock - A callback function that takes the found block and returns the transformed (updated) block.
 * @returns An object containing the updated blocks array and the found/updated block (or null if not found).
 */
export function updateBlockInTree(
  blocks: BlockType[],
  targetId: string,
  transformBlock: BlockTransformer
): { updatedBlocks: BlockType[]; foundBlock: BlockType | null } {
  let foundBlock: BlockType | null = null;

  const updatedBlocks = blocks.map((block) => {
    // Optimization: if already found, skip traversal for siblings (assuming unique IDs)
    if (foundBlock) return block;

    if (block.id === targetId) {
      const updatedBlock = transformBlock(block);
      foundBlock = updatedBlock;
      return updatedBlock;
    }

    if (block.children) {
      const result = updateBlockInTree(block.children, targetId, transformBlock);
      if (result.foundBlock) {
        foundBlock = result.foundBlock;
        return { ...block, children: result.updatedBlocks } as BlockType;
      }
    }

    if (block.type === 'tabs') {
      const tabsBlock = block as TabsBlock;
      let tabFound = false;
      const updatedTabs = tabsBlock.props.tabs.map((tab) => {
        if (tabFound) return tab;
        if (tab.children) {
          const result = updateBlockInTree(tab.children, targetId, transformBlock);
          if (result.foundBlock) {
            foundBlock = result.foundBlock;
            tabFound = true;
            return { ...tab, children: result.updatedBlocks };
          }
        }
        return tab;
      });

      if (tabFound) {
        return {
          ...block,
          props: { ...block.props, tabs: updatedTabs },
        } as BlockType;
      }
    }

    return block;
  });

  return { updatedBlocks, foundBlock };
}
