import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Block, BlockType } from '@type/block';

import { useHistory } from './HistoryContext';
import { findBlockAndParent } from '@domain';

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
  isReadOnly?: boolean;
}

export const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

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

  // Clear selectedId if it no longer exists in the schema after undo/redo
  useEffect(() => {
    if (selectedBlockId) {
      const { block } = findBlockAndParent(selectedBlockId, pageSchema.blocks);
      if (!block) {
        setSelectedBlockId(null);
        setSelectedBlock(null);
        setSelectedBlockParentId(null);
      }
    }
  }, [pageSchema, selectedBlockId]);

  // Sync selectedBlock reference with page schema when it changes (undo/redo)
  // selected block is values changed also selectedBlock should presist
  useEffect(() => {
    if (selectedBlockId && selectedBlock) {
      const { block: currentBlockInSchema } = findBlockAndParent(selectedBlockId, pageSchema.blocks);

      // Compare specific properties that are likely to change
      if (currentBlockInSchema && hasBlockChanged(currentBlockInSchema, selectedBlock)) {
        setSelectedBlock(currentBlockInSchema as Block);
      }
    }
  }, [pageSchema, selectedBlockId, selectedBlock]);

  // Efficient comparison function for block changes
  const hasBlockChanged = (block1: BlockType, block2: Block): boolean => {
    if (block1 === block2) return false;

    if (block1.props !== block2.props) {
      const keys1 = Object.keys(block1.props);
      const keys2 = Object.keys(block2.props);
      if (keys1.length !== keys2.length) return true;
      
      if (JSON.stringify(block1.props) !== JSON.stringify(block2.props)) return true;
    }

    if (block1.style !== block2.style) {
       if (JSON.stringify(block1.style) !== JSON.stringify(block2.style)) return true;
    }

    if (block1.visibility !== block2.visibility) {
       if (JSON.stringify(block1.visibility) !== JSON.stringify(block2.visibility)) return true;
    }

    if (block1.children !== block2.children) {
       if ((block1.children?.length || 0) !== (block2.children?.length || 0)) return true;
       if (JSON.stringify(block1.children) !== JSON.stringify(block2.children)) return true;
    }

    return false;
  };

  const selectBlockItem = (blockId: string, itemId: string): void => {
    // First, ensure the parent block is selected
    // Note: We need to find the block in the schema to get the full block object
    const { block, parent } = findBlockAndParent(blockId, pageSchema.blocks);

    if (block) {
      setSelectedBlockId(blockId);
      setSelectedBlock(block as Block);
      setSelectedBlockParentId(parent?.id || null);
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
      isItemSelected,
      isReadOnly: false
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
