import React, { createContext, useContext, type ReactNode } from 'react';
import type { Block, BlockType } from '@blocks/shared/Block';
import type { BlockItem } from '@blocks/shared/FormTypes';
import type { StyleProps } from '@blocks/shared/Style';
import type { VisibilityProps } from '@blocks/shared/Visibility';
import { duplicateBlockWithNewIds, findBlockAndParent, getChildrenBlocks } from '@context/domain';
import { createBlock } from '@context/domain/blockFactory';
import { findBlockPositionById } from '@context/domain/blockTraversal';
import { swap } from '@utils/array';
import { generateUniqueId } from '@utils/id';
import type { TabsBlock, Tab } from '@blocks/tabs/schema';
import type { RowLayoutBlock } from '@blocks/rowLayout/schema';
import { MaxColumns, MinColumns } from '@blocks/rowLayout/schema';
import type { SectionBlock } from '@blocks/section/schema';
import { useHistory } from './HistoryContext';
import { useSelection } from './SelectionContext';

interface BlockEditingContextType {
  updateSelectedBlockProps: (newProps: Partial<Block['props']>) => void;
  updateSelectedBlockStyle: (newStyle: Partial<StyleProps>) => void;
  updateSelectedBlockVisibility: (newVisibility: Partial<VisibilityProps>) => void;
  moveBlockUp: () => void;
  moveBlockDown: () => void;
  deleteSelectedBlock: () => void;
  duplicateSelectedBlock: () => void;
  addBlockItem: <T extends object>(
    blockId: string,
    defaultEntry: T
  ) => string;
  updateBlockItem: <T extends BlockItem>(
    blockId: string,
    itemId: string,
    updatedItem: T
  ) => void;
  removeBlockItem: (
    blockId: string,
    itemId: string
  ) => void;
  moveBlockItemLeft: (blockId: string, index: number) => void;
  moveBlockItemRight: (blockId: string, index: number) => void;
  moveBlockItemUp: (blockId: string, index: number) => void;
  moveBlockItemDown: (blockId: string, index: number) => void;
  modifyRowColumnCount: (direction: 'increase' | 'decrease') => void;
}

const BlockEditingContext = createContext<BlockEditingContextType | undefined>(undefined);

interface BlockEditingProviderProps {
  children: ReactNode;
}

export const BlockEditingProvider: React.FC<BlockEditingProviderProps> = ({ children }) => {
  const { pageSchema, updatePageWithHistory } = useHistory();
  const { 
    selectedBlock, 
    setSelectedBlock, 
    selectedBlockId, 
    setSelectedBlockId, 
    setSelectedBlockParentId,
    setSelectedItemId,
    setSelectedItemBlockId
  } = useSelection();

  const updateSelectedBlockProps = (newProps: Partial<Block['props']>) => {
    if (!selectedBlock) return;

    const updateBlockInSchema = (blocks: BlockType[]): BlockType[] => {
      return blocks.map(block => {
        if (block.id === selectedBlock.id) {
          return {
            ...block,
            props: {
              ...block.props,
              ...newProps
            }
          } as BlockType;
        }

        // Recursively update children if this block has them
        if (block.children) {
          return {
            ...block,
            children: updateBlockInSchema(block.children)
          } as BlockType;
        }

        // Check tabs blocks for nested children
        if (block.type === 'tabs') {
          return {
            ...block,
            props: {
              ...block.props,
              tabs: (block.props.tabs as Tab[]).map(tab => ({
                ...tab,
                children: tab.children ? updateBlockInSchema(tab.children) : tab.children
              }))
            }
          } as BlockType;
        }

        return block;
      });
    };

    const updatedBlocks = updateBlockInSchema(pageSchema.blocks);
    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };

    updatePageWithHistory(updatedSchema);

    // Update the selected block reference
    const findUpdatedBlock = (blocks: BlockType[]): Block | null => {
      for (const block of blocks) {
        if (block.id === selectedBlock.id) {
          return {
            ...block,
            props: {
              ...block.props,
              ...newProps
            }
          } as Block;
        }
        if (block.children) {
          const found = findUpdatedBlock(block.children);
          if (found) return found;
        }
        // Check tabs blocks for nested children
        if (block.type === 'tabs' && selectedBlockId) {
          const tabsBlock = block as TabsBlock;
          for (const tab of tabsBlock.props.tabs) {
            if (tab.children) {
              const found = findUpdatedBlock(tab.children);
              if (found) return found;
            }
          }
        }
      }
      return null;
    };

    const updatedSelectedBlock = findUpdatedBlock(updatedBlocks);
    if (updatedSelectedBlock) {
      setSelectedBlock(updatedSelectedBlock);
    }
  };

  const updateSelectedBlockStyle = (newStyle: Partial<StyleProps>) => {
    if (!selectedBlock) return;

    const updateBlockInSchema = (blocks: BlockType[]): BlockType[] => {
      return blocks.map(block => {
        if (block.id === selectedBlock.id) {
          return {
            ...block,
            style: {
              ...block.style,
              ...newStyle
            }
          } as BlockType;
        }

        // Recursively update children if this block has them
        if (block.children) {
          return {
            ...block,
            children: updateBlockInSchema(block.children)
          } as BlockType;
        }

        // Check tabs blocks for nested children
        if (block.type === 'tabs') {
          return {
            ...block,
            props: {
              ...block.props,
              tabs: (block.props.tabs as Tab[]).map(tab => ({
                ...tab,
                children: tab.children ? updateBlockInSchema(tab.children) : tab.children
              }))
            }
          } as BlockType;
        }

        return block;
      });
    };

    const updatedBlocks = updateBlockInSchema(pageSchema.blocks);
    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };

    updatePageWithHistory(updatedSchema);

    // Update the selected block reference
    const findUpdatedBlock = (blocks: BlockType[]): Block | null => {
      for (const block of blocks) {
        if (block.id === selectedBlock.id) {
          return {
            ...block,
            style: {
              ...block.style,
              ...newStyle
            }
          } as Block;
        }
        if (block.children) {
          const found = findUpdatedBlock(block.children);
          if (found) return found;
        }
        // Check tabs blocks for nested children
        if (block.type === 'tabs') {
          const tabsBlock = block as TabsBlock;
          for (const tab of tabsBlock.props.tabs) {
            if (tab.children) {
              const found = findUpdatedBlock(tab.children);
              if (found) return found;
            }
          }
        }
      }
      return null;
    };

    const updatedSelectedBlock = findUpdatedBlock(updatedBlocks);
    if (updatedSelectedBlock) {
      setSelectedBlock(updatedSelectedBlock);
    }
  };

  const updateSelectedBlockVisibility = (newVisibility: Partial<VisibilityProps>) => {
    if (!selectedBlock) return;

    const updateAndFindBlock = (blocks: BlockType[]): { updatedBlocks: BlockType[], foundBlock: Block | null } => {
      let foundBlock: Block | null = null;

      const updatedBlocks = blocks.map(block => {
        if (foundBlock) return block; // Optimization: stop mapping after found

        if (block.id === selectedBlock.id) {
          const updatedBlock = {
            ...block,
            visibility: {
              ...block.visibility,
              ...newVisibility,
            },
          } as BlockType;
          foundBlock = updatedBlock as Block;
          return updatedBlock;
        }

        if (block.children) {
          const result = updateAndFindBlock(block.children);
          if (result.foundBlock) {
            foundBlock = result.foundBlock;
            return { ...block, children: result.updatedBlocks } as BlockType;
          }
        }

        return block;
      });

      return { updatedBlocks, foundBlock };
    };

    const { updatedBlocks, foundBlock } = updateAndFindBlock(pageSchema.blocks);

    if (foundBlock) {
      const updatedSchema = {
        ...pageSchema,
        blocks: updatedBlocks,
      };
      updatePageWithHistory(updatedSchema);
      setSelectedBlock(foundBlock);
    }
  };


  const moveSelectedBlockVertical = (direction: 'up' | 'down') => {
    if (!selectedBlockId) return;

    const { block, children: container, parentIndex } = findBlockAndParent(
      selectedBlockId,
      pageSchema.blocks,
    );

    if (!block || !container) {
      console.error(`[BlockEditingContext] moveSelectedBlockVertical: Block not found.`);
      return;
    }

    const newIndex = direction === 'up' ? parentIndex - 1 : parentIndex + 1;

    if (newIndex < 0 || newIndex >= container.length) {
      return;
    }

    const newBlocks = structuredClone(pageSchema.blocks);

    const { children: newContainer } = findBlockAndParent(
      selectedBlockId,
      newBlocks,
    );

    if (!newContainer) {
      console.error(`[BlockEditingContext] moveSelectedBlockVertical: Cloned container not found.`);
      return;
    }

    const blockToMove = newContainer.splice(parentIndex, 1)[0];
    newContainer.splice(newIndex, 0, blockToMove);
    updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
  };

  const moveBlockUp = () => {
    moveSelectedBlockVertical('up');
  };

  const moveBlockDown = () => {
    moveSelectedBlockVertical('down');
  };

  const deleteSelectedBlock = () => {
    if (!selectedBlockId) return;

    const { block, parent, parentIndex } = findBlockAndParent(
      selectedBlockId,
      pageSchema.blocks,
    );

    if (!block) {
      console.error(`[BlockEditingContext] deleteSelectedBlock: Block not found.`);
      return;
    }
    if (
      block.type === 'section' &&
      parent &&
      parent.type === 'rowLayout'
    ) {
      const newBlocks = structuredClone(pageSchema.blocks);
      const newChildren = getChildrenBlocks(parent, selectedBlockId, parentIndex, newBlocks);

      if (newChildren && newChildren.length === MinColumns) {
        console.warn('[BlockEditingContext] Cannot delete the last column in a RowLayout.');
        return;
      }
    }

    const newBlocks = structuredClone(pageSchema.blocks);
    const newChildren = getChildrenBlocks(parent, selectedBlockId, parentIndex, newBlocks);

    if (!newChildren) {
      console.error(`[BlockEditingContext] deleteSelectedBlock: Cloned children array not found.`);
      return;
    }

    newChildren.splice(parentIndex, 1);

    updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
    setSelectedBlock(null);
    setSelectedBlockId(null);
    setSelectedBlockParentId(null);
  };

  const duplicateSelectedBlock = () => {
    if (!selectedBlockId) return;

    const { block, parent, parentIndex } = findBlockAndParent(
      selectedBlockId,
      pageSchema.blocks,
    );

    if (!block) {
      console.error(`[BlockEditingContext] duplicateSelectedBlock: Block not found.`);
      return;
    }

    const newBlock = duplicateBlockWithNewIds(block);

    const newBlocks = structuredClone(pageSchema.blocks);
    const newChildren = getChildrenBlocks(parent, selectedBlockId, parentIndex, newBlocks);

    if (!newChildren) {
      console.error(`[BlockEditingContext] duplicateSelectedBlock: Cloned children array not found.`);
      return;
    }

    newChildren.splice(parentIndex + 1, 0, newBlock);

    updatePageWithHistory({ ...pageSchema, blocks: newBlocks });

    setSelectedItemId(null);
    setSelectedItemBlockId(null);

    setSelectedBlock(newBlock);
    setSelectedBlockId(newBlock.id);
    setSelectedBlockParentId(parent?.id || null);
  };


  const modifyRowColumnCount = (direction: 'increase' | 'decrease') => {
    if (!selectedBlockId) return;

    const newBlocks = structuredClone(pageSchema.blocks);
    const pos = findBlockPositionById(newBlocks, selectedBlockId);

    if (!pos) {
      console.error(`[BlockEditingContext] modifyRowColumnCount: Block not found.`);
      return;
    }

    const rowBlock = pos.children[pos.index] as RowLayoutBlock;
    if (rowBlock.type !== 'rowLayout') {
      console.warn(`[BlockEditingContext] modifyRowColumnCount: Not a RowLayoutBlock.`);
      return;
    }

    const currentCount = rowBlock.children.length;
    if (direction === 'increase' && currentCount < MaxColumns) {
      const newColumn = createBlock('section');
      rowBlock.children.push(newColumn as SectionBlock);
    } else if (direction === 'decrease' && currentCount > MinColumns) {
      rowBlock.children.pop();
    } else {
      console.log(`[BlockEditingContext] Row column limit reached (Min ${MinColumns}, Max ${MaxColumns}).`);
      return;
    }

    updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
  };

  const modifyBlockItems = (
    blockId: string,
    modifyItems: (items: BlockItem[]) => BlockItem[]
  ) => {
    const block = findBlockAndParent(blockId, pageSchema.blocks);
    if (!block || !block.block) return;

    const updateBlockInSchema = (blocks: BlockType[]): BlockType[] => {
      return blocks.map(b => {
        if (b.id === blockId) {
          const currentItems = (b.props as { items?: BlockItem[] }).items || [];
          const newItems = modifyItems(currentItems);
          return {
            ...b,
            props: {
              ...b.props,
              items: newItems,
            },
          } as BlockType;
        }
        if (b.children) {
          return {
            ...b,
            children: updateBlockInSchema(b.children),
          } as BlockType;
        }

        // Check tabs blocks for nested children
        if (b.type === 'tabs') {
          const tabsBlock = b as TabsBlock;
          const updatedTabs = tabsBlock.props.tabs.map(tab => ({
            ...tab,
            children: tab.children ? updateBlockInSchema(tab.children) : tab.children
          }));

          return {
            ...b,
            props: { ...b.props, tabs: updatedTabs }
          } as BlockType;
        }

        return b;
      });
    };

    const updatedBlocks = updateBlockInSchema(pageSchema.blocks);
    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks,
    };
    updatePageWithHistory(updatedSchema);
  };

  const addBlockItem = <T extends object>(
    blockId: string,
    defaultEntry: T
  ): string => {
    const newEntryId = generateUniqueId();
    modifyBlockItems(blockId, (items) => [
      ...items,
      { ...defaultEntry, id: newEntryId },
    ]);
    return newEntryId;
  };

  const updateBlockItem = <T extends BlockItem>(
    blockId: string,
    itemId: string,
    updatedItem: T
  ): void => {
    modifyBlockItems(blockId, (items) =>
      items.map((item: BlockItem) =>
        item.id === itemId ? { ...item, ...updatedItem } : item
      )
    );
  };

  const removeBlockItem = (
    blockId: string,
    itemId: string
  ): void => {
    modifyBlockItems(blockId, (items) =>
      items.filter((item: BlockItem) => item.id !== itemId)
    );
  };

  const moveBlockItemLeft = (blockId: string, index: number) => {
    modifyBlockItems(blockId, (items) => swap(items, index, index - 1));
  };

  const moveBlockItemRight = (blockId: string, index: number) => {
    modifyBlockItems(blockId, (items) => swap(items, index, index + 1));
  };

  // Alias functions to reduce code duplication - same logic, different semantic meaning
  const moveBlockItemUp = moveBlockItemLeft;
  const moveBlockItemDown = moveBlockItemRight;

  return (
    <BlockEditingContext.Provider value={{
      updateSelectedBlockProps,
      updateSelectedBlockStyle,
      updateSelectedBlockVisibility,
      moveBlockUp,
      moveBlockDown,
      deleteSelectedBlock,
      duplicateSelectedBlock,
      addBlockItem,
      updateBlockItem,
      removeBlockItem,
      moveBlockItemLeft,
      moveBlockItemRight,
      moveBlockItemUp,
      moveBlockItemDown,
      modifyRowColumnCount
    }}>
      {children}
    </BlockEditingContext.Provider>
  );
};

export const useBlockEditing = (): BlockEditingContextType => {
  const context = useContext(BlockEditingContext);
  if (context === undefined) {
    throw new Error('useBlockEditing must be used within a BlockEditingProvider');
  }
  return context;
};
