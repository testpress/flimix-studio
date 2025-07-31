import React from 'react';
import { useSelection } from '../context/SelectionContext';
import { getAllBlockTemplates } from '../schema/blockTemplates';
import DraggableBlockItem from './DraggableBlockItem';

const BlockInserterSidebar: React.FC = () => {
  const { selectedBlockId } = useSelection();
  // Get all block templates using the helper function
  const allTemplates = getAllBlockTemplates();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Block Library</h2>
        <p className="text-sm text-gray-600 mt-1">
          Click or drag to insert blocks into your page
        </p>
      </div>

      {/* Block Templates */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allTemplates.map((template) => (
          <DraggableBlockItem key={template.type} template={template} />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          {selectedBlockId ? (
            <span>Will insert before selected block</span>
          ) : (
            <span>Will insert at the end of the page</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockInserterSidebar; 