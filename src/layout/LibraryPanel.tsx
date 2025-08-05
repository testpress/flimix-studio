import React from 'react';
import { Plus, Type, Layout, Square } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import { getAllBlockLibraryItems } from '@blocks/shared/Library';
import type { BlockLibraryItem } from '@blocks/shared/Library';
import type { BlockType } from '@blocks/shared/Block';
import { useHistory } from '@context/HistoryContext';

// Icon mapping for the templates
const iconMap: Record<BlockLibraryItem['icon'], LucideIcon> = {
  Layout,
  Type,
  Square
};

const LibraryPanel: React.FC = () => {
  const { selectedBlockId } = useSelection();
  const { insertBlockAfter, insertBlockAtEnd, insertBlockInsideSection } = useBlockInsert();
  const { pageSchema } = useHistory();

  // Recursive function to find a block by ID at any depth
  const findBlockRecursively = (blocks: BlockType[], targetId: string): BlockType | null => {
    for (const block of blocks) {
      if (block.id === targetId) {
        return block;
      }
      if (block.children && block.children.length > 0) {
        const found = findBlockRecursively(block.children, targetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleBlockInsert = (blockType: BlockType['type']) => {
    if (selectedBlockId) {
      // Check if the selected block is a Section (including nested ones)
      const selectedBlock = findBlockRecursively(pageSchema.blocks, selectedBlockId);
      if (selectedBlock?.type === 'section') {
        // Insert into the children of the Section block
        insertBlockInsideSection(blockType, selectedBlockId);
      } else {
        // Default behavior: insert after the currently selected block
        insertBlockAfter(blockType);
      }
    } else {
      // If no block is selected, insert at the end of the page
      insertBlockAtEnd(blockType);
    }
  };

  // Get all block templates using the helper function
  const allTemplates = getAllBlockLibraryItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Block Library</h2>
        <p className="text-sm text-gray-600 mt-1">
          Click to insert blocks into your page
        </p>
      </div>

      {/* Block Templates */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allTemplates.map((template) => {
          const IconComponent = iconMap[template.icon] || Layout;
          
          return (
            <button
              key={template.type}
              onClick={() => handleBlockInsert(template.type)}
              className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700">
                  <IconComponent size={20} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    <Plus 
                      size={16} 
                      className="text-gray-400 group-hover:text-blue-500 transition-colors" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          {selectedBlockId ? (
            (() => {
              const selectedBlock = findBlockRecursively(pageSchema.blocks, selectedBlockId);
              if (selectedBlock?.type === 'section') {
                return <span>Will insert inside section</span>;
              }
              return <span>Will insert after selected block</span>;
            })()
          ) : (
            <span>Will insert at the end of the page</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel; 