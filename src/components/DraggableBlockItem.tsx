import React from 'react';
import { Plus, Layout, Type, Square } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { useSelection } from '../context/SelectionContext';
import { type BlockTemplate } from '../schema/blockTemplates';
import type { BlockType } from '../schema/blockTypes';

// Icon mapping for the templates
const iconMap = {
  Layout,
  Type,
  Square
};

interface DraggableBlockItemProps {
  template: BlockTemplate;
}

const DraggableBlockItem: React.FC<DraggableBlockItemProps> = ({ template }) => {
  const { selectedBlockId, insertBlockBefore, insertBlockAtEnd } = useSelection();
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `block-template-${template.type}`,
    data: {
      type: 'block-template',
      blockType: template.type
    }
  });

  const handleBlockInsert = (blockType: BlockType['type']) => {
    if (selectedBlockId) {
      // Insert before the currently selected block
      insertBlockBefore(blockType);
    } else {
      // If no block is selected, insert at the end of the page
      insertBlockAtEnd(blockType);
    }
  };

  const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Layout;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group ${
        isDragging ? 'opacity-30 cursor-grabbing' : 'cursor-grab'
      }`}
      onClick={() => handleBlockInsert(template.type)}
      style={{ touchAction: 'none' }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${template.color}`}>
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
    </div>
  );
};

export default DraggableBlockItem; 