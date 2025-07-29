import React from 'react';
import { useSelection } from '../context/SelectionContext';
import { isTopLevelBlock } from '../utils/arrayUtils';

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

  // Only show buttons for top-level blocks
  if (!isTopLevelBlock(blockId, pageSchema.blocks)) {
    return null;
  }

  const currentIndex = pageSchema.blocks.findIndex(block => block.id === blockId);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === pageSchema.blocks.length - 1;

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
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }
        `}
        title="Move Up"
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
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }
        `}
        title="Move Down"
      >
        ↓
      </button>
    </div>
  );
};

export default BlockMoveButtons; 