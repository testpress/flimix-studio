import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSelection } from '../context/SelectionContext';
import type { BlockType } from '../schema/blockTypes';
import Dropdown, { DropdownItem } from './Dropdown';

interface BlockInsertionMenuProps {
  position: 'above' | 'below';
  blockId: string;
}

const BlockInsertionMenu: React.FC<BlockInsertionMenuProps> = ({ position, blockId }) => {
  const { selectedBlockId, insertBlockAfter, insertBlockBefore } = useSelection();
  const [isHovered, setIsHovered] = useState(false);

  // Only show if this block is selected
  if (selectedBlockId !== blockId) {
    return null;
  }

  const handleInsert = (blockType: BlockType['type']) => {
    if (position === 'above') {
      insertBlockBefore(blockType);
    } else {
      insertBlockAfter(blockType);
    }
  };

  return (
    <div 
      className={`flex justify-center py-1 ${position === 'above' ? 'mb-2' : 'mt-2'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Dropdown
        trigger={
          <button 
            className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${isHovered 
                ? 'bg-blue-500 text-white shadow-lg scale-110' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }
            `}
            title={`Insert block ${position} this block`}
          >
            <Plus size={16} />
          </button>
        }
      >
        <DropdownItem onClick={() => handleInsert('text')}>
          Text Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('hero')}>
          Hero Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('section')}>
          Section Block
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export default BlockInsertionMenu; 