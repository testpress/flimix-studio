import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Block, BlockType } from '@blocks/shared/Block';
import type { TabsBlock } from '@blocks/tabs/schema';
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
  setSelectedItemBlockId: (id: string | null) => void;
  activeTabId: string | null;
  setActiveTabId: (id: string | null) => void;
  selectBlockItem: (blockId: string, itemId: string) => void;
  isItemSelected: (blockId: string, itemId: string) => boolean;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children }) => {
  const { pageSchema } = useHistory();
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlockParentId, setSelectedBlockParentId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemBlockId, setSelectedItemBlockId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Helper function to recursively check if a block exists in the schema
  const blockExistsInSchema = useCallback((blockId: string, blocks: BlockType[]): boolean => {
    for (const block of blocks) {
      if (block.id === blockId) {
        return true;
      }
      if (block.children && blockExistsInSchema(blockId, block.children)) {
        return true;
      }
      // Check tabs blocks for nested children using inline logic
      if (block.type === 'tabs') {
        const tabsBlock = block as TabsBlock;
        for (const tab of tabsBlock.props.tabs) {
          if (tab.children) {
            for (const child of tab.children) {
              if (child.id === blockId) {
                return true;
              }
              if (child.children && blockExistsInSchema(blockId, child.children)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }, []);

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
          // Check tabs blocks for nested children
          if (block.type === 'tabs') {
            const tabsBlock = block as TabsBlock;
            for (const tab of tabsBlock.props.tabs) {
              if (tab.children) {
                const found = findBlockInSchema(tab.children);
                if (found) return found;
              }
            }
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

  const selectBlockItem = (blockId: string, itemId: string): void => {
    // First, ensure the parent block is selected
    // Note: We need to find the block in the schema to get the full block object
    
    const findBlock = (blocks: BlockType[]): Block | null => {
        for (const block of blocks) {
            if (block.id === blockId) return block as Block;
            if (block.children) {
                const found = findBlock(block.children);
                if (found) return found;
            }
            if (block.type === 'tabs') {
                const tabsBlock = block as TabsBlock;
                for (const tab of tabsBlock.props.tabs) {
                    if (tab.children) {
                        const found = findBlock(tab.children);
                        if (found) return found;
                    }
                }
            }
        }
        return null;
    };

    const block = findBlock(pageSchema.blocks);

    if (block) {
      setSelectedBlockId(blockId);
      setSelectedBlock(block);
      
      const findParent = (blocks: BlockType[], parentId: string | null = null): string | null | undefined => {
          for (const b of blocks) {
              if (b.id === blockId) return parentId;
              if (b.children) {
                  const found = findParent(b.children, b.id);
                  if (found !== undefined) return found; // found can be null (root)
              }
              if (b.type === 'tabs') {
                  const tabsBlock = b as TabsBlock;
                  for (const tab of tabsBlock.props.tabs) {
                      if (tab.children) {
                          const found = findParent(tab.children, b.id); // Tabs children parent is the tabs block
                          if (found !== undefined) return found;
                      }
                  }
              }
          }
          return undefined; // Not found in this branch
      };
      
      const parentId = findParent(pageSchema.blocks);
      setSelectedBlockParentId(parentId ?? null);
    }

    // Then select the item
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
      setSelectedItemBlockId,
      activeTabId,
      setActiveTabId,
      selectBlockItem,
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
