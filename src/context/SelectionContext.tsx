import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Block, BlockType } from '@blocks/shared/Block';
import type { PageSchema } from '@blocks/shared/Page';
import type { StyleProps } from '@blocks/shared/Style';
import { duplicateBlockWithNewIds, updateBlockChildren, findBlockAndParent, findBlockPositionById } from '@context/domain';
import { swap } from '@utils/array';
import { useHistory } from './HistoryContext';

interface SelectionContextType {
  selectedBlock: Block | null;
  setSelectedBlock: (block: Block | null) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  selectedBlockParentId: string | null;
  setSelectedBlockParentId: (id: string | null) => void;
  pageSchema: PageSchema;
  updateSelectedBlockProps: (newProps: Partial<Block['props']>) => void;
  updateSelectedBlockStyle: (newStyle: Partial<StyleProps>) => void;
  moveBlockUp: () => void;
  moveBlockDown: () => void;
  deleteSelectedBlock: () => void;
  duplicateSelectedBlock: () => void;
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
  }, [pageSchema, selectedBlockId]);


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

  return (
    <SelectionContext.Provider value={{
      selectedBlock,
      setSelectedBlock,
      selectedBlockId,
      setSelectedBlockId,
      selectedBlockParentId,
      setSelectedBlockParentId,
      pageSchema,
      updateSelectedBlockProps,
      updateSelectedBlockStyle,
      moveBlockUp,
      moveBlockDown,
      deleteSelectedBlock,
      duplicateSelectedBlock
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