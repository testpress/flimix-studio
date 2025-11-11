import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Block, BlockType } from '@blocks/shared/Block';
import type { BlockItem } from '@blocks/shared/FormTypes';
import type { PageSchema } from '@blocks/shared/Page';
import type { StyleProps } from '@blocks/shared/Style';
import type { VisibilityProps } from '@blocks/shared/Visibility';
import { duplicateBlockWithNewIds, updateBlockChildren, findBlockAndParent, getChildrenBlocks } from '@context/domain';
import { swap } from '@utils/array';
import { generateUniqueId } from '@utils/id';
import type { TabsBlock, Tab } from '@blocks/tabs/schema';
import { useHistory } from './HistoryContext';
import { usePageSchema } from './PageSchemaContext';

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
  selectArrayItem: (blockId: string, itemId: string) => void;
  isItemSelected: (blockId: string, itemId: string) => boolean;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children }) => {
  const { pageSchema, updatePageWithHistory } = useHistory();
  const { currentPageSlug } = usePageSchema();

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlockParentId, setSelectedBlockParentId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemBlockId, setSelectedItemBlockId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const prevPageSlugRef = React.useRef(currentPageSlug);

  // Clear selection only when switching pages
  useEffect(() => {
    if (currentPageSlug !== prevPageSlugRef.current) {
      setSelectedBlock(null);
      setSelectedBlockId(null);
      setSelectedBlockParentId(null);
      setSelectedItemId(null);
      setSelectedItemBlockId(null);
      setActiveTabId(null);
      prevPageSlugRef.current = currentPageSlug;
    }
  }, [currentPageSlug]);

  // Helper function to recursively check if a block exists in the schema
  const blockExistsInSchema = (blockId: string, blocks: BlockType[]): boolean => {
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
    if (!selectedBlockId) return;

    const { block, parent, parentIndex } = findBlockAndParent(selectedBlockId, pageSchema.blocks);
    if (!block) return;

    // Handle top-level blocks
    if (!parent) {
      const currentIndex = pageSchema.blocks.findIndex(b => b.id === selectedBlockId);
      if (currentIndex <= 0) return; // Already at the top

      const newBlocks = swap(pageSchema.blocks, currentIndex, currentIndex - 1);
      updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
      return;
    }

    // Handle nested blocks (both regular and tabs)
    if (parentIndex <= 0) return; // Already at the top of children

    const newBlocks = updateBlockInContainer(
      parent.type === 'tabs' ? findTabContainingBlock(parent as TabsBlock, selectedBlockId)?.tab.children || [] : parent.children || [],
      (container) => swap(container, parentIndex, parentIndex - 1),
      parent
    );

    updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
  };

  const moveBlockDown = () => {
    if (!selectedBlockId) return;

    const { block, parent, parentIndex } = findBlockAndParent(selectedBlockId, pageSchema.blocks);
    if (!block) return;

    // Handle top-level blocks
    if (!parent) {
      const currentIndex = pageSchema.blocks.findIndex(b => b.id === selectedBlockId);
      if (currentIndex === -1 || currentIndex >= pageSchema.blocks.length - 1) return; // Already at the bottom

      const newBlocks = swap(pageSchema.blocks, currentIndex, currentIndex + 1);
      updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
      return;
    }

    // Handle nested blocks (both regular and tabs)
    const container = parent.type === 'tabs' ? findTabContainingBlock(parent as TabsBlock, selectedBlockId)?.tab.children || [] : parent.children || [];
    if (parentIndex >= container.length - 1) return; // Already at the bottom of children

    const newBlocks = updateBlockInContainer(
      container,
      (container) => swap(container, parentIndex, parentIndex + 1),
      parent
    );

    updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
  };

  const deleteSelectedBlock = () => {
    if (!selectedBlockId) return;

    const { block, parent, parentIndex } = findBlockAndParent(
      selectedBlockId,
      pageSchema.blocks,
    );

    if (!block) {
      console.error(`[SelectionContext] deleteSelectedBlock: Block not found.`);
      return;
    }

    const newBlocks = structuredClone(pageSchema.blocks);
    const newChildren = getChildrenBlocks(parent, selectedBlockId, parentIndex, newBlocks);

    if (!newChildren) {
      console.error(`[SelectionContext] deleteSelectedBlock: Cloned children array not found.`);
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
      console.error(`[SelectionContext] duplicateSelectedBlock: Block not found.`);
      return;
    }

    const newBlock = duplicateBlockWithNewIds(block);

    const newBlocks = structuredClone(pageSchema.blocks);
    const newChildren = getChildrenBlocks(parent, selectedBlockId, parentIndex, newBlocks);

    if (!newChildren) {
      console.error(`[SelectionContext] duplicateSelectedBlock: Cloned children array not found.`);
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
          };
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

  const selectArrayItem = (blockId: string, itemId: string): void => {
    // First, ensure the parent block is selected
    const { block } = findBlockAndParent(blockId, pageSchema.blocks);
    if (block) {
      setSelectedBlockId(blockId);
      setSelectedBlock(block);
      // Find and set the parent block ID if this block has a parent
      const { parent } = findBlockAndParent(blockId, pageSchema.blocks);
      setSelectedBlockParentId(parent?.id || null);
    }
    
    // Then select the item
    setSelectedItemId(itemId);
    setSelectedItemBlockId(blockId);
  };

  const isItemSelected = (blockId: string, itemId: string): boolean => {
    return selectedItemBlockId === blockId && selectedItemId === itemId;
  };

  // Generic helper functions to eliminate duplication between tabs and regular blocks
  const updateTabsBlockChildren = (tabsBlock: TabsBlock, targetTabId: string, newChildren: BlockType[]): BlockType[] => {
    const updatedTabs = tabsBlock.props.tabs.map(tab => 
      tab.id === targetTabId ? { ...tab, children: newChildren } : tab
    );
    
    return pageSchema.blocks.map(b => 
      b.id === tabsBlock.id 
        ? { ...b, props: { ...b.props, tabs: updatedTabs } } as BlockType
        : b
    );
  };

  const findTabContainingBlock = (tabsBlock: TabsBlock, blockId: string): { tab: Tab; childIndex: number } | null => {
    for (const tab of tabsBlock.props.tabs) {
      if (tab.children) {
        const childIndex = tab.children.findIndex(child => child.id === blockId);
        if (childIndex !== -1) {
          return { tab, childIndex };
        }
      }
    }
    return null;
  };

  const updateBlockInContainer = (container: BlockType[], operation: (container: BlockType[]) => BlockType[], parent?: BlockType): BlockType[] => {
    const newContainer = operation([...container]);
    
    if (!parent) {
      return newContainer;
    }
    
    if (parent.type === 'tabs') {
      const tabsBlock = parent as TabsBlock;
      const tabInfo = findTabContainingBlock(tabsBlock, selectedBlockId!);
      if (tabInfo) {
        return updateTabsBlockChildren(tabsBlock, tabInfo.tab.id, newContainer);
      }
    } else {
      return updateBlockChildren(pageSchema.blocks, parent.id, newContainer);
    }
    
    return pageSchema.blocks;
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
