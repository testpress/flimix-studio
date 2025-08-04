import React, { createContext, useContext, type ReactNode } from 'react';
import type { BlockType } from '@blocks/shared/Block';
import { createBlock, updateBlockChildren } from '@domain/blocks/blockFactory';
import { getAvailableBlockTypes } from '@blocks/shared/Library';
import { findBlockPositionById } from '@domain/blocks/blockTraversal';
import { useHistory } from './HistoryContext';
import { useSelection } from './SelectionContext';

interface BlockInsertContextType {
  insertBlockAfter: (blockType: BlockType['type']) => void;
  insertBlockBefore: (blockType: BlockType['type']) => void;
  insertBlockAtEnd: (blockType: BlockType['type']) => void;
}

const BlockInsertContext = createContext<BlockInsertContextType | undefined>(undefined);

interface BlockInsertProviderProps {
  children: ReactNode;
}

export const BlockInsertProvider: React.FC<BlockInsertProviderProps> = ({ children }) => {
  const { pageSchema, updatePageWithHistory, recordState } = useHistory();
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
   * Inserts a new block after the currently selected block
   * @param blockType - Type of block to create and insert
   */
  const insertBlockAfter = (blockType: BlockType['type']) => {
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
    
    // Record current state before making changes
    recordState(pageSchema.blocks);
    
    // Insert the new block after the selected block
    const result = findBlockPositionById(pageSchema.blocks, selectedBlockId);
    if (!result) {
      console.error(`Target block with ID ${selectedBlockId} not found`);
      return;
    }

    const { container, index } = result;
    const newContainer = [...container] as BlockType[];
    newContainer.splice(index + 1, 0, newBlock);
    
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
    setSelectedBlock(newBlock as BlockType);
    
    // Find the parent ID for the newly inserted block
    const newResult = findBlockPositionById(updatedBlocks, newBlock.id);
    setSelectedBlockParentId(newResult?.parent?.id || null);
  };

  /**
   * Inserts a new block before the currently selected block
   * @param blockType - Type of block to create and insert
   */
  const insertBlockBefore = (blockType: BlockType['type']) => {
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
    
    // Record current state before making changes
    recordState(pageSchema.blocks);
    
    // Insert the new block before the selected block
    const result = findBlockPositionById(pageSchema.blocks, selectedBlockId);
    if (!result) {
      console.error(`Target block with ID ${selectedBlockId} not found`);
      return;
    }

    const { container, index } = result;
    const newContainer = [...container] as BlockType[];
    newContainer.splice(index, 0, newBlock);
    
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
    setSelectedBlock(newBlock as BlockType);
    
    // Find the parent ID for the newly inserted block
    const newResult = findBlockPositionById(updatedBlocks, newBlock.id);
    setSelectedBlockParentId(newResult?.parent?.id || null);
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
    const newBlock = createBlock(blockType);
    
    // Record current state before making changes
    recordState(pageSchema.blocks);
    
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

  return (
    <BlockInsertContext.Provider value={{
      insertBlockAfter,
      insertBlockBefore,
      insertBlockAtEnd
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