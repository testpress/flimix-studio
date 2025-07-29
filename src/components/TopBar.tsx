import React from 'react';
import { useSelection } from '../context/SelectionContext';

const TopBar: React.FC = () => {
  const { 
    selectedBlockId, 
    pageSchema, 
    moveBlockUp, 
    moveBlockDown 
  } = useSelection();

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

  const position = selectedBlockId ? findBlockPosition(selectedBlockId, pageSchema.blocks) : null;
  const isFirst = position ? position.index === 0 : true;
  const isLast = position ? position.index === position.totalSiblings - 1 : true;
  const hasSelectedBlock = selectedBlockId && position && position.index !== -1;

  return (
    <div className="bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Flimix Studio</h1>
        <div className="flex items-center space-x-4">
          {/* Move Block Controls */}
          {hasSelectedBlock && (
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-300 mr-2">
                {position?.isTopLevel ? 'Move Block' : 'Move Block (within parent)'}
              </span>
              <button
                onClick={moveBlockUp}
                disabled={isFirst}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors
                  ${isFirst 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                  }
                `}
                title="Move Block Up"
              >
                ⬆️
              </button>
              <button
                onClick={moveBlockDown}
                disabled={isLast}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors
                  ${isLast 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                  }
                `}
                title="Move Block Down"
              >
                ⬇️
              </button>
            </div>
          )}
          
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            Save
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 