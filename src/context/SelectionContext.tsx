import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Block, PageSchema, StyleProps, BlockType } from '../schema/blockTypes';
import { swap, isTopLevelBlock } from '../utils/arrayUtils';

interface SelectionContextType {
  selectedBlock: Block | null;
  setSelectedBlock: (block: Block | null) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  pageSchema: PageSchema;
  updateSelectedBlockProps: (newProps: Partial<Block['props']>) => void;
  updateSelectedBlockStyle: (newStyle: Partial<StyleProps>) => void;
  moveBlockUp: () => void;
  moveBlockDown: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

interface SelectionProviderProps {
  children: ReactNode;
  initialSchema: PageSchema;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children, initialSchema }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [pageSchema, setPageSchema] = useState<PageSchema>(initialSchema);

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

    setPageSchema(updatedSchema);
    
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

    setPageSchema(updatedSchema);
    
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
    if (!selectedBlockId || !isTopLevelBlock(selectedBlockId, pageSchema.blocks)) {
      return;
    }

    const currentIndex = pageSchema.blocks.findIndex(block => block.id === selectedBlockId);
    if (currentIndex <= 0) {
      return; // Already at the top
    }

    const newBlocks = swap(pageSchema.blocks, currentIndex, currentIndex - 1);
    const updatedSchema = {
      ...pageSchema,
      blocks: newBlocks
    };

    setPageSchema(updatedSchema);
  };

  const moveBlockDown = () => {
    if (!selectedBlockId || !isTopLevelBlock(selectedBlockId, pageSchema.blocks)) {
      return;
    }

    const currentIndex = pageSchema.blocks.findIndex(block => block.id === selectedBlockId);
    if (currentIndex === -1 || currentIndex >= pageSchema.blocks.length - 1) {
      return; // Already at the bottom
    }

    const newBlocks = swap(pageSchema.blocks, currentIndex, currentIndex + 1);
    const updatedSchema = {
      ...pageSchema,
      blocks: newBlocks
    };

    setPageSchema(updatedSchema);
  };

  return (
    <SelectionContext.Provider value={{
      selectedBlock,
      setSelectedBlock,
      selectedBlockId,
      setSelectedBlockId,
      pageSchema,
      updateSelectedBlockProps,
      updateSelectedBlockStyle,
      moveBlockUp,
      moveBlockDown
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