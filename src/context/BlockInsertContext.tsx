import React, { createContext, useContext, type ReactNode } from 'react';
import type { BlockType } from '@blocks/shared/Block';
import { createBlock, updateBlockChildren, findBlockPositionById } from '@context/domain';
import { getAvailableBlockTypes } from '@blocks/shared/Library';
import { useHistory } from './HistoryContext';
import { useSelection } from './SelectionContext';

// Enum for insertion position relative to selected block
enum InsertPosition {
  BEFORE = 'before',
  AFTER = 'after'
}

interface BlockInsertContextType {
  insertBlockAfter: (blockType: BlockType['type']) => void;
  insertBlockBefore: (blockType: BlockType['type']) => void;
  insertBlockAtEnd: (blockType: BlockType['type']) => void;
  insertBlockInsideSection: (blockType: BlockType['type'], sectionId: string) => void;
}

const BlockInsertContext = createContext<BlockInsertContextType | undefined>(undefined);

interface BlockInsertProviderProps {
  children: ReactNode;
}

export const BlockInsertProvider: React.FC<BlockInsertProviderProps> = ({ children }) => {
  const { pageSchema, updatePageWithHistory } = useHistory();
  const { 
    selectedBlockId, 
    setSelectedBlockId, 
    setSelectedBlock, 
    setSelectedBlockParentId 
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
   * Private helper function to insert a block at a specific position relative to the selected block
   * @param blockType - Type of block to create and insert
   * @param position - Position relative to the selected block (BEFORE or AFTER)
   */
  const insertBlockRelative = (blockType: BlockType['type'], position: InsertPosition) => {
    if (!selectedBlockId) return;
    
    // Validate block type
    if (!isBlockTypeValid(blockType)) {
      return;
    }
    
    // Create new block using the factory function
    let newBlock;
    try {
      newBlock = createBlock(blockType);
    } catch (error) {
      console.error('Failed to create block:', error);
      return;
    }
    
    // Ensure Section blocks have children initialized
    if (newBlock.type === 'section' && !newBlock.children) {
      newBlock.children = []; // Initialize children array for Section blocks
    }
    
    // Find the position of the selected block
    const result = findBlockPositionById(pageSchema.blocks, selectedBlockId);
    if (!result) {
      console.error(`Target block with ID ${selectedBlockId} not found`);
      return;
    }

    const { container, index } = result;
    const newContainer = [...container] as BlockType[];
    const insertIndex = position === InsertPosition.AFTER ? index + 1 : index;
    newContainer.splice(insertIndex, 0, newBlock);
    
    const updatedBlocks = result.parent 
      ? updateBlockChildren(pageSchema.blocks, result.parent.id, newContainer)
      : newContainer;
    
    // Update the schema
    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };
    
    updatePageWithHistory(updatedSchema);
    
    // Select the newly inserted block
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock);
    
    // The parent of the new block is the same as the selected block's parent
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
    // Validate block type
    if (!isBlockTypeValid(blockType)) {
      return;
    }
    
    // Create new block using the factory function
    let newBlock;
    try {
      newBlock = createBlock(blockType);
    } catch (error) {
      console.error('Failed to create block:', error);
      return;
    }
    
    // Ensure Section blocks have children initialized
    if (newBlock.type === 'section' && !newBlock.children) {
      newBlock.children = []; // Initialize children array for Section blocks
    }
    
    // Add the new block to the end of the page
    const updatedSchema = {
      ...pageSchema,
      blocks: [...pageSchema.blocks, newBlock]
    };
    
    updatePageWithHistory(updatedSchema);
    
    // Select the newly inserted block
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock as BlockType);
    setSelectedBlockParentId(null);
  };

  /**
   * Inserts a new block as a child of a Section block
   * @param blockType - Type of block to create and insert
   * @param sectionId - ID of the section block to insert into
   */
  const insertBlockInsideSection = (blockType: BlockType['type'], sectionId: string) => {
    // If trying to insert a Section inside a Section, insert it after the Section instead
    if (blockType === 'section') {
      // Section is selected - use insertBlockRelative to insert after the selected Section
      insertBlockRelative(blockType, InsertPosition.AFTER);
      return;
    }

    // Validate block type
    if (!isBlockTypeValid(blockType)) {
      return;
    }
    
    // Create new block using the factory function
    let newBlock;
    try {
      newBlock = createBlock(blockType);
    } catch (error) {
      console.error('Failed to create block:', error);
      return;
    }
    
    // Simple find and update (no recursion needed since Section blocks are only at top level)
    const updatedBlocks = pageSchema.blocks.map(block => {
      if (block.id === sectionId) {
        return {
          ...block,
          children: [...(block.children || []), newBlock]
        };
      }
      return block;
    });
    
    // Update the schema with the new blocks array
    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };
    
    // Record state for undo
    updatePageWithHistory(updatedSchema);
    
    // Select the newly inserted block
    setSelectedBlockId(newBlock.id);
    setSelectedBlock(newBlock);
    setSelectedBlockParentId(sectionId);
  };

  return (
    <BlockInsertContext.Provider value={{
      insertBlockAfter,
      insertBlockBefore,
      insertBlockAtEnd,
      insertBlockInsideSection
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