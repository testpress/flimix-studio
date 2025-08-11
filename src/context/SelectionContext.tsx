import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Block, BlockType } from '@blocks/shared/Block';
import type { PageSchema } from '@blocks/shared/Page';
import type { StyleProps } from '@blocks/shared/Style';
import type { VisibilityProps } from '@blocks/shared/Visibility';
import { duplicateBlockWithNewIds, updateBlockChildren, findBlockAndParent, findBlockPositionById } from '@context/domain';
import { swap } from '@utils/array';
import { generateUniqueId } from '@utils/id';
import { useHistory } from './HistoryContext';

interface SelectionContextType {
  selectedBlock: Block | null;
  setSelectedBlock: (block: Block | null) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  selectedBlockParentId: string | null;
  setSelectedBlockParentId: (id: string | null) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedItemBlockId: string | null;
  pageSchema: PageSchema;
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
  updateBlockItem: <T extends { id: string }>(
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
  selectArrayItem: (blockId: string, itemId: string) => void;
  isItemSelected: (blockId: string, itemId: string) => boolean;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children }) => {
  const { pageSchema, updatePageWithHistory } = useHistory();

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlockParentId, setSelectedBlockParentId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemBlockId, setSelectedItemBlockId] = useState<string | null>(null);

  // Helper function to recursively check if a block exists in the schema
  const blockExistsInSchema = (blockId: string, blocks: BlockType[]): boolean => {
    for (const block of blocks) {
      if (block.id === blockId) {
        return true;
      }
      if (block.children && blockExistsInSchema(blockId, block.children)) {
        return true;
      }
    }
    return false;
  };

  // Clear selectedId if it no longer exists in the schema after undo/redo
  useEffect(() => {
    if (selectedBlockId && !blockExistsInSchema(selectedBlockId, pageSchema.blocks)) {
      setSelectedBlockId(null);
      setSelectedBlock(null);
      setSelectedBlockParentId(null);
    }
  }, [pageSchema, selectedBlockId, blockExistsInSchema]);

  // Sync selectedBlock reference with page schema when it changes (undo/redo)
  useEffect(() => {
    if (selectedBlockId && selectedBlock) {
      // Find the current version of the selected block in the schema
      const findBlockInSchema = (blocks: BlockType[]): BlockType | null => {
        for (const block of blocks) {
          if (block.id === selectedBlockId) {
            return block;
          }
          if (block.children) {
            const found = findBlockInSchema(block.children);
            if (found) return found;
          }
        }
        return null;
      };

      const currentBlockInSchema = findBlockInSchema(pageSchema.blocks);
      
      // Compare specific properties that are likely to change
      if (currentBlockInSchema && hasBlockChanged(currentBlockInSchema, selectedBlock)) {
        setSelectedBlock(currentBlockInSchema as Block);
      }
    }
  }, [pageSchema, selectedBlockId, selectedBlock]);

  // Efficient comparison function for block changes
  const hasBlockChanged = (block1: BlockType, block2: Block): boolean => {
    // Compare props (most likely to change)
    if (JSON.stringify(block1.props) !== JSON.stringify(block2.props)) {
      return true;
    }
    
    // Compare style (likely to change)
    if (JSON.stringify(block1.style) !== JSON.stringify(block2.style)) {
      return true;
    }
    
    // Compare visibility (likely to change)
    if (JSON.stringify(block1.visibility) !== JSON.stringify(block2.visibility)) {
      return true;
    }
    
    // Compare children (less likely to change, but important)
    if (JSON.stringify(block1.children) !== JSON.stringify(block2.children)) {
      return true;
    }
    
    // Compare events (less likely to change)
    if (JSON.stringify(block1.events) !== JSON.stringify(block2.events)) {
      return true;
    }
    
    return false;
  };


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
            return { ...block, children: result.updatedBlocks };
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

  const moveBlockUp = () => {
    if (!selectedBlockId) {
      return;
    }

    const { block, parent, parentIndex } = findBlockAndParent(selectedBlockId, pageSchema.blocks);
    
    if (!block) {
      return;
    }

    // Handle top-level blocks
    if (!parent) {
      // Check if it's actually a top-level block
      const topLevelIndex = pageSchema.blocks.findIndex(b => b.id === selectedBlockId);
      if (topLevelIndex === -1) {
        return;
      }

      const currentIndex = pageSchema.blocks.findIndex(b => b.id === selectedBlockId);
      if (currentIndex <= 0) {
        return; // Already at the top
      }

      const newBlocks = swap(pageSchema.blocks, currentIndex, currentIndex - 1);
      const updatedSchema = {
        ...pageSchema,
        blocks: newBlocks
      };

      updatePageWithHistory(updatedSchema);
      return;
    }

    // Handle nested blocks
    if (!parent.children) {
      return;
    }

    if (parentIndex <= 0) {
      return; // Already at the top of children
    }

    const newChildren = swap(parent.children, parentIndex, parentIndex - 1);
    const newBlocks = updateBlockChildren(pageSchema.blocks, parent.id, newChildren);
    const updatedSchema = {
      ...pageSchema,
      blocks: newBlocks
    };

    updatePageWithHistory(updatedSchema);
  };

  const moveBlockDown = () => {
    if (!selectedBlockId) {
      return;
    }

    const { block, parent, parentIndex } = findBlockAndParent(selectedBlockId, pageSchema.blocks);
    
    if (!block) {
      return;
    }

    // Handle top-level blocks
    if (!parent) {
      // Check if it's actually a top-level block
      const topLevelIndex = pageSchema.blocks.findIndex(b => b.id === selectedBlockId);
      if (topLevelIndex === -1) {
        return;
      }

      const currentIndex = pageSchema.blocks.findIndex(b => b.id === selectedBlockId);
      if (currentIndex === -1 || currentIndex >= pageSchema.blocks.length - 1) {
        return; // Already at the bottom
      }

      const newBlocks = swap(pageSchema.blocks, currentIndex, currentIndex + 1);
      const updatedSchema = {
        ...pageSchema,
        blocks: newBlocks
      };

      updatePageWithHistory(updatedSchema);
      return;
    }

    // Handle nested blocks
    if (!parent.children) {
      return;
    }

    if (parentIndex >= parent.children.length - 1) {
      return; // Already at the bottom of children
    }

    const newChildren = swap(parent.children, parentIndex, parentIndex + 1);
    const newBlocks = updateBlockChildren(pageSchema.blocks, parent.id, newChildren);
    const updatedSchema = {
      ...pageSchema,
      blocks: newBlocks
    };

    updatePageWithHistory(updatedSchema);
  };

  const deleteSelectedBlock = () => {
    if (!selectedBlockId) return;
    
    const result = findBlockPositionById(pageSchema.blocks, selectedBlockId);
    if (!result) return;

    const { container, index } = result;
    
    // Create a new array without the deleted block
    const newContainer = [...container] as BlockType[];
    newContainer.splice(index, 1);
    
    // Update the schema
    const newBlocks = result.parent 
      ? updateBlockChildren(pageSchema.blocks, result.parent.id, newContainer)
      : newContainer;
    
    const updatedSchema = {
      ...pageSchema,
      blocks: newBlocks
    };
    
    updatePageWithHistory(updatedSchema);
    setSelectedBlockId(null);
    setSelectedBlock(null);
    setSelectedBlockParentId(null);
  };

  const duplicateSelectedBlock = () => {
    if (!selectedBlockId) return;
    
    const result = findBlockPositionById(pageSchema.blocks, selectedBlockId);
    if (!result) return;

    const { container, index } = result;
    
    // Find the original block
    const originalBlock = container[index];
    if (!originalBlock) return;
    
    // Clone the block with new IDs
    const duplicatedBlock = duplicateBlockWithNewIds(originalBlock as BlockType);
    
    // Insert the duplicated block immediately after the original
    const newContainer = [...container] as BlockType[];
    newContainer.splice(index + 1, 0, duplicatedBlock);
    
    // Update the schema
    const updatedSchema = {
      ...pageSchema,
      blocks: result.parent 
        ? updateBlockChildren(pageSchema.blocks, result.parent.id, newContainer)
        : newContainer
    };
    
    updatePageWithHistory(updatedSchema);
    
    // Optionally select the newly duplicated block
    setSelectedBlockId(duplicatedBlock.id);
    setSelectedBlock(duplicatedBlock as Block);
    setSelectedBlockParentId(result.parent?.id || null);
  };

  const modifyBlockItems = (
    blockId: string,
    modifyItems: (items: any[]) => any[]
  ) => {
    const block = findBlockAndParent(blockId, pageSchema.blocks);
    if (!block || !block.block) return;

    const updateBlockInSchema = (blocks: BlockType[]): BlockType[] => {
      return blocks.map(b => {
        if (b.id === blockId) {
          const currentItems = (b.props as any).items || [];
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
          };
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

  const updateBlockItem = <T extends { id: string }>(
    blockId: string,
    itemId: string,
    updatedItem: T
  ): void => {
    modifyBlockItems(blockId, (items) =>
      items.map((item: any) =>
        item.id === itemId ? { ...item, ...updatedItem } : item
      )
    );
  };

  const removeBlockItem = (
    blockId: string,
    itemId: string
  ): void => {
    modifyBlockItems(blockId, (items) =>
      items.filter((item: any) => item.id !== itemId)
    );
  };

  const moveBlockItemLeft = (blockId: string, index: number) => {
    modifyBlockItems(blockId, (items) => swap(items, index, index - 1));
  };

  const moveBlockItemRight = (blockId: string, index: number) => {
    modifyBlockItems(blockId, (items) => swap(items, index, index + 1));
  };

  const moveBlockItemUp = (blockId: string, index: number) => {
    modifyBlockItems(blockId, (items) => swap(items, index, index - 1));
  };

  const moveBlockItemDown = (blockId: string, index: number) => {
    modifyBlockItems(blockId, (items) => swap(items, index, index + 1));
  };

  const selectArrayItem = (blockId: string, itemId: string): void => {
    setSelectedItemId(itemId);
    setSelectedItemBlockId(blockId);
  };

  const isItemSelected = (blockId: string, itemId: string): boolean => {
    return selectedItemBlockId === blockId && selectedItemId === itemId;
  };

  return (
    <SelectionContext.Provider value={{
      selectedBlock,
      setSelectedBlock,
      selectedBlockId,
      setSelectedBlockId,
      selectedBlockParentId,
      setSelectedBlockParentId,
      selectedItemId,
      setSelectedItemId,
      selectedItemBlockId,
      pageSchema,
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
      selectArrayItem,
      isItemSelected
    }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}; 
