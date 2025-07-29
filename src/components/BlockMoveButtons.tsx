import React from 'react';
import { useSelection } from '../context/SelectionContext';

interface BlockMoveButtonsProps {
  blockId: string;
}

const BlockMoveButtons: React.FC<BlockMoveButtonsProps> = ({ blockId }) => {
  const { 
    selectedBlockId, 
    pageSchema, 
    moveBlockUp, 
    moveBlockDown 
  } = useSelection();

  // Only show buttons for the currently selected block
  if (selectedBlockId !== blockId) {
    return null;
  }

  // Helper function to find block position (works for both top-level and nested)
  const findBlockPosition = (blockId: string, blocks: any[]): { isTopLevel: boolean; parentId: string | null; index: number; totalSiblings: number } => {
    // Check top-level blocks first
    const topLevelIndex = blocks.findIndex(block => block.id === blockId);
    if (topLevelIndex !== -1) {
      return {
        isTopLevel: true,
        parentId: null,
        index: topLevelIndex,
        totalSiblings: blocks.length
      };
    }

    // Check nested blocks
    for (const block of blocks) {
      if (block.children) {
        const childIndex = block.children.findIndex((child: any) => child.id === blockId);
        if (childIndex !== -1) {
          return {
            isTopLevel: false,
            parentId: block.id,
            index: childIndex,
            totalSiblings: block.children.length
          };
        }
      }
    }

    return { isTopLevel: false, parentId: null, index: -1, totalSiblings: 0 };
  };

  const position = findBlockPosition(blockId, pageSchema.blocks);
  
  // Don't show buttons if block not found
  if (position.index === -1) {
    return null;
  }

  const isFirst = position.index === 0;
  const isLast = position.index === position.totalSiblings - 1;

  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          moveBlockUp();
        }}
        disabled={isFirst}
        className={`
          p-2 rounded-md text-sm font-medium transition-colors
          ${isFirst 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : position.isTopLevel
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
          }
        `}
        title={`Move Up${position.isTopLevel ? '' : ' (within parent)'}`}
      >
        ↑
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          moveBlockDown();
        }}
        disabled={isLast}
        className={`
          p-2 rounded-md text-sm font-medium transition-colors
          ${isLast 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : position.isTopLevel
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
          }
        `}
        title={`Move Down${position.isTopLevel ? '' : ' (within parent)'}`}
      >
        ↓
      </button>
    </div>
  );
};

export default BlockMoveButtons; 