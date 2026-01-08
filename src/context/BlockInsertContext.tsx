import React, { createContext, useContext, type ReactNode } from 'react';
import type { BlockType } from '@type/block';
import { createBlock, findBlockPositionById, findBlockAndParent, updateBlockInTree } from '@domain';
import { getAvailableBlockTypes } from '@type/library';
import { useHistory } from './HistoryContext';
import { useSelection } from './SelectionContext';
import type { TabsBlock } from '@blocks/tabs/schema';

// Const for insertion position relative to selected block
const InsertPosition = {
  BEFORE: 'before',
  AFTER: 'after'
} as const;

type InsertPositionType = typeof InsertPosition[keyof typeof InsertPosition];

interface BlockInsertContextType {
  insertBlockAfter: (blockType: BlockType['type']) => void;
  insertBlockBefore: (blockType: BlockType['type']) => void;
  insertBlockAtEnd: (blockType: BlockType['type']) => void;
  insertBlockInsideSection: (blockType: BlockType['type'], sectionId: string) => void;
  insertBlockIntoTabs: (blockType: BlockType['type'], tabsBlockId: string, options?: { tabId?: string, position?: 'above' | 'below', referenceBlockId?: string }) => void;
}

export const BlockInsertContext = createContext<BlockInsertContextType | undefined>(undefined);

// Helper: Insert at index
const insertAtIndex = (blocks: BlockType[] | undefined, newBlock: BlockType, index?: number): BlockType[] => {
  const list = blocks || [];
  if (index !== undefined && index >= 0 && index <= list.length) {
    return [...list.slice(0, index), newBlock, ...list.slice(index)];
  }
  return [...list, newBlock];
};

// Helper: Insert relative to ID
const insertRelative = (
  blocks: BlockType[] | undefined,
  newBlock: BlockType,
  refId?: string,
  position: 'before' | 'after' = 'after'
): BlockType[] => {
  const list = blocks || [];
  if (refId) {
    const index = list.findIndex(b => b.id === refId);
    if (index !== -1) {
      const targetIndex = position === 'before' ? index : index + 1;
      return insertAtIndex(list, newBlock, targetIndex);
    }
  }
  return [...list, newBlock];
};

interface BlockInsertProviderProps {
  children: ReactNode;
}

export const BlockInsertProvider: React.FC<BlockInsertProviderProps> = ({ children }) => {
  const { pageSchema, updatePageWithHistory } = useHistory();
  const {
    selectedBlockId,
    setSelectedBlockId,
    setSelectedBlock,
    setSelectedBlockParentId,
    setSelectedItemId,
    setSelectedItemBlockId,
    activeTabId
  } = useSelection();

  // Helper function to validate block types
  const isBlockTypeValid = (blockType: string): boolean => {
    const availableTypes = getAvailableBlockTypes();
    if (!availableTypes.includes(blockType)) {
      console.error(`Invalid block type: ${blockType}. Available types: ${availableTypes.join(', ')}`);
      return false;
    }
    return true;
  };

  /**
   * Recursively finds a container block and adds a new block to its children.
   * Handles section, tabs, and column containers at any depth in the block tree.
   * @param blocks - The block tree to search and update
   * @param containerId - ID of the container block to add the block to
   * @param newBlock - The block to insert
   * @param getActiveTabId - Optional function to determine which tab to use for tabs blocks
   * @param insertIndex - Optional index to insert at. If not provided, appends to the end
   * @returns Updated block tree with the new block added to the container
   */
  const addBlockToChildren = (
    blocks: BlockType[],
    containerId: string,
    newBlock: BlockType,
    getActiveTabId?: (tabsBlock: TabsBlock) => string | null,
    insertIndex?: number
  ): BlockType[] => {
    
    const { updatedBlocks } = updateBlockInTree(blocks, containerId, (block) => {
      if (block.type === 'section') {
        return {
          ...block,
          children: insertAtIndex(block.children, newBlock, insertIndex)
        } as BlockType;
      }

      if (block.type === 'tabs') {
        const tabsBlock = block as TabsBlock;
        const targetTabId = getActiveTabId
          ? getActiveTabId(tabsBlock)
          : (activeTabId || tabsBlock.props.tabs[0]?.id);

        if (!targetTabId) {
          console.warn(`[BlockInsertContext] No active tab found for tabs block ${containerId}`);
          return block;
        }

        const updatedTabs = tabsBlock.props.tabs.map(tab =>
          tab.id === targetTabId
            ? { ...tab, children: insertAtIndex(tab.children, newBlock, insertIndex) }
            : tab
        );

        return {
          ...block,
          props: { ...block.props, tabs: updatedTabs }
        } as BlockType;
      }

      return block;
    });

    return updatedBlocks;
  };

  /**
   * Private helper function to insert a block at a specific position relative to the selected block
   * @param blockType - Type of block to create and insert
   * @param position - Position relative to the selected block (BEFORE or AFTER)
   */
  const insertBlockRelative = (blockType: BlockType['type'], position: InsertPositionType) => {
    if (!selectedBlockId) return;

    if (!isBlockTypeValid(blockType)) {
      return;
    }

    let newBlock;
    try {
      newBlock = createBlock(blockType);
    } catch (error) {
      console.error('Failed to create block:', error);
      return;
    }

    if (newBlock.type === 'section' && !newBlock.children) {
      newBlock.children = [];
    }

    const result = findBlockPositionById(pageSchema.blocks, selectedBlockId);
    if (!result) {
      console.error(`Target block with ID ${selectedBlockId} not found`);
      return;
    }
    const insertIndex = position === InsertPosition.AFTER ? result.index + 1 : result.index;
    let updatedBlocks: BlockType[];
    
    //If parent is found, insert the block into the parent
    if (result.parent) {
      const newBlocks = structuredClone(pageSchema.blocks);
      if (result.parent.type === 'tabs') {
        // For tabs, we need to find which tab contains the selected block
        const getActiveTabId = (tabs: TabsBlock) => {
          const tab = tabs.props.tabs.find(t =>
            t.children && t.children.some(child => child.id === selectedBlockId)
          );
          return tab?.id || null;
        };

        updatedBlocks = addBlockToChildren(
          newBlocks,
          result.parent.id,
          newBlock,
          getActiveTabId,
          insertIndex
        );
      } else {
        updatedBlocks = addBlockToChildren(
          newBlocks,
          result.parent.id,
          newBlock,
          undefined,
          insertIndex
        );
      }
    } else {
      // Top-level block - insert directly into root array
      const newBlocks = [...pageSchema.blocks];
      newBlocks.splice(insertIndex, 0, newBlock);
      updatedBlocks = newBlocks;
    }

    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };

    updatePageWithHistory(updatedSchema);
    setSelectedItemId(null);
    setSelectedItemBlockId(null);
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock);
    setSelectedBlockParentId(result.parent?.id || null);
  };

  /**
   * Inserts a new block after the currently selected block
   * @param blockType - Type of block to create and insert
   */
  const insertBlockAfter = (blockType: BlockType['type']) => {
    insertBlockRelative(blockType, InsertPosition.AFTER);
  };

  /**
   * Inserts a new block before the currently selected block
   * @param blockType - Type of block to create and insert
   */
  const insertBlockBefore = (blockType: BlockType['type']) => {
    insertBlockRelative(blockType, InsertPosition.BEFORE);
  };

  /**
   * Inserts a new block at the end of the page
   * @param blockType - Type of block to create and insert
   */
  const insertBlockAtEnd = (blockType: BlockType['type']) => {
    if (!isBlockTypeValid(blockType)) {
      return;
    }

    let newBlock;
    try {
      newBlock = createBlock(blockType);
    } catch (error) {
      console.error('Failed to create block:', error);
      return;
    }

    if (newBlock.type === 'section' && !newBlock.children) {
      newBlock.children = [];
    }

    const updatedSchema = {
      ...pageSchema,
      blocks: [...pageSchema.blocks, newBlock]
    };

    updatePageWithHistory(updatedSchema);

    // Clear any previously selected item when selecting a newly inserted block
    setSelectedItemId(null);
    setSelectedItemBlockId(null);

    // Select the newly inserted block
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock as BlockType);
    setSelectedBlockParentId(null);
  };

  /**
   * Inserts a new block as a child of a Section.
   * This function is recursive and can find containers at any depth.
   * @param blockType - Type of block to create and insert
   * @param sectionId - ID of the section block to insert into
   */
  const insertBlockInsideSection = (blockType: BlockType['type'], sectionId: string) => {
    // Find the selected section and its parent
    const { block: targetContainer, parent: targetParent } = findBlockAndParent(
      sectionId,
      pageSchema.blocks,
    );

    if (!targetContainer) {
      console.error(`[BlockInsertContext] insertBlockInsideSection: Container not found with id ${sectionId}`);
      return;
    }

    if (targetContainer.type === 'section') {
      if (blockType === 'section') {
        if (targetParent && targetParent.type === 'rowLayout') {
          console.warn("[BlockInsertContext] Cannot insert a 'section' inside a 'section' that is acting as a column.");
          return;
        } else {
          insertBlockRelative(blockType, InsertPosition.AFTER);
          return;
        }
      }
      if (blockType === 'tabs' && targetParent && targetParent.type === 'rowLayout') {
        console.warn("[BlockInsertContext] Cannot insert 'tabs' inside a 'section' that is acting as a column.");
        return;
      }
    }

    if (targetContainer.type !== 'section' && targetContainer.type !== 'tabs') {
      console.warn(`[BlockInsertContext] Target block is not a 'section' or 'tabs'. Got type: ${targetContainer.type}`);
      return;
    }

    if (!isBlockTypeValid(blockType)) {
      return;
    }
    let newBlock;
    try {
      newBlock = createBlock(blockType);
    } catch (error) {
      console.error('Failed to create block:', error);
      return;
    }

    const newBlocks = structuredClone(pageSchema.blocks);

    // 5. Recursively add the new block to the container
    const updatedBlocks = addBlockToChildren(
      newBlocks,
      sectionId,
      newBlock
    );

    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };
    updatePageWithHistory(updatedSchema);
    setSelectedItemId(null);
    setSelectedItemBlockId(null);
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock as BlockType);
    setSelectedBlockParentId(sectionId);
  };

  /**
   * Smart insertion function that handles inserting blocks into tabs based on context
   * @param blockType - Type of block to create and insert
   * @param tabsBlockId - ID of the tabs block
   * @param options - Optional parameters for specific insertion behavior
   */
  const insertBlockIntoTabs = (
    blockType: BlockType['type'],
    tabsBlockId: string,
    options?: {
      tabId?: string,
      position?: 'above' | 'below',
      referenceBlockId?: string
    }
  ) => {
    if (!isBlockTypeValid(blockType) || blockType === 'rowLayout') {
      return;
    }

    let newBlock;
    try {
      newBlock = createBlock(blockType);
    } catch (error) {
      console.error('Failed to create block:', error);
      return;
    }

    const { updatedBlocks } = updateBlockInTree(pageSchema.blocks, tabsBlockId, (block) => {
      if (block.type === 'tabs') {
        const tabsBlock = block as TabsBlock;
        const tabs = tabsBlock.props.tabs || [];

        // Determine which tab to insert into
        let targetTab;
        if (options?.tabId) {
          // Use specified tab ID
          targetTab = tabs.find(tab => tab.id === options.tabId);
        } else {
          targetTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
        }

        if (targetTab) {
          const position = options?.position === 'above' ? 'before' : 'after';
          const updatedTabs = tabs.map(tab =>
            tab.id === targetTab.id
              ? {
                ...tab,
                children: insertRelative(tab.children, newBlock, options?.referenceBlockId, position)
              }
              : tab
          );

          return {
            ...block,
            props: { ...block.props, tabs: updatedTabs }
          } as BlockType;
        }
      }
      return block;
    });

    // Update the schema
    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };

    updatePageWithHistory(updatedSchema);

    // Clear any previously selected item when selecting a newly inserted block
    setSelectedItemId(null);
    setSelectedItemBlockId(null);

    // Select the newly inserted block
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock as BlockType);
    setSelectedBlockParentId(tabsBlockId);
  };

  return (
    <BlockInsertContext.Provider value={{
      insertBlockAfter,
      insertBlockBefore,
      insertBlockAtEnd,
      insertBlockInsideSection,
      insertBlockIntoTabs
    }}>
      {children}
    </BlockInsertContext.Provider>
  );
};

export const useBlockInsert = (): BlockInsertContextType => {
  const context = useContext(BlockInsertContext);
  if (context === undefined) {
    throw new Error('useBlockInsert must be used within a BlockInsertProvider');
  }
  return context;
}; 