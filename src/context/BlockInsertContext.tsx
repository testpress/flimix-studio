import React, { createContext, useContext, type ReactNode } from 'react';
import type { BlockType } from '@blocks/shared/Block';
import { createBlock, updateBlockChildren, findBlockPositionById } from '@context/domain';
import { getAvailableBlockTypes } from '@blocks/shared/Library';
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

const BlockInsertContext = createContext<BlockInsertContextType | undefined>(undefined);

interface BlockInsertProviderProps {
  children: ReactNode;
}

export const BlockInsertProvider: React.FC<BlockInsertProviderProps> = ({ children }) => {
  const { pageSchema, updatePageWithHistory } = useHistory();
  const { 
    selectedBlockId, 
    selectNewBlock,
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
   * Private helper function to insert a block at a specific position relative to the selected block
   * @param blockType - Type of block to create and insert
   * @param position - Position relative to the selected block (BEFORE or AFTER)
   */
  const insertBlockRelative = (blockType: BlockType['type'], position: InsertPositionType) => {
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
    
    let updatedBlocks: BlockType[];
    
    if (result.parent) {
      // Check if parent is a tabs block
      if (result.parent.type === 'tabs') {
        const tabsBlock = result.parent as TabsBlock;
        // Find which tab contains the selected block
        const updatedTabs = tabsBlock.props.tabs.map(tab => {
          if (tab.children && tab.children.some(child => child.id === selectedBlockId)) {
            // This tab contains the selected block, update its children
            return { ...tab, children: newContainer };
          }
          return tab;
        });
        
        updatedBlocks = pageSchema.blocks.map(b => 
          b.id === result.parent!.id 
            ? { ...b, props: { ...b.props, tabs: updatedTabs } } as BlockType
            : b
        );
      } else {
        // Regular block with children
        updatedBlocks = updateBlockChildren(pageSchema.blocks, result.parent.id, newContainer);
      }
    } else {
      // Top-level block
      updatedBlocks = newContainer;
    }
    
    // Update the schema
    const updatedSchema = {
      ...pageSchema,
      blocks: updatedBlocks
    };
    
    updatePageWithHistory(updatedSchema);
    
    // Select the newly inserted block
    selectNewBlock(newBlock.id);
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
    selectNewBlock(newBlock.id);
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
    selectNewBlock(newBlock.id);
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
    
    // Find the tabs block and determine insertion context
    const updatedBlocks = pageSchema.blocks.map(block => {
      if (block.id === tabsBlockId && block.type === 'tabs') {
        const tabsBlock = block as TabsBlock;
        const tabs = tabsBlock.props.tabs || [];
        
        // Determine which tab to insert into
        let targetTab;
        if (options?.tabId) {
          // Use specified tab ID
          targetTab = tabs.find(tab => tab.id === options.tabId);
        } else {
          // Use active tab or fallback to first tab
          targetTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
        }
        
        if (targetTab) {
          // Use inline logic for insertion instead of helper
          const updatedTabs = tabs.map(tab => {
            if (tab.id === targetTab.id) {
              let updatedChildren = [...(tab.children || [])];
              
              const position = options?.position === 'above' ? 'before' : 'after';
              const referenceId = options?.referenceBlockId;
              
              if (position === 'before' && referenceId) {
                const refIndex = updatedChildren.findIndex(child => child.id === referenceId);
                if (refIndex !== -1) {
                  updatedChildren.splice(refIndex, 0, newBlock);
                } else {
                  updatedChildren.push(newBlock);
                }
              } else if (position === 'after' && referenceId) {
                const refIndex = updatedChildren.findIndex(child => child.id === referenceId);
                if (refIndex !== -1) {
                  updatedChildren.splice(refIndex + 1, 0, newBlock);
                } else {
                  updatedChildren.push(newBlock);
                }
              } else {
                updatedChildren.push(newBlock);
              }
              
              return { ...tab, children: updatedChildren };
            }
            return tab;
          });
          
          return {
            ...block,
            props: { ...block.props, tabs: updatedTabs }
          };
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
    
    // Select the newly inserted block
    selectNewBlock(newBlock.id);
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