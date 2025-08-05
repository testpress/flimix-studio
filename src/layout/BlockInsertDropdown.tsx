import React, { useState } from 'react';
import type { BlockType } from '@blocks/shared/Block';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import Dropdown, { DropdownItem } from '@components/Dropdown';
import { Plus } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';

interface BlockInsertDropdownProps {
  position: 'above' | 'below';
  blockId: string;
}

const BlockInsertDropdown: React.FC<BlockInsertDropdownProps> = ({ position, blockId }) => {
  const { selectedBlockId } = useSelection();
  const { insertBlockAfter, insertBlockBefore, insertBlockInsideSection } = useBlockInsert();
  const { pageSchema } = useHistory();
  const [isHovered, setIsHovered] = useState(false);

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

  // Only show if this block is selected
  if (selectedBlockId !== blockId) {
    return null;
  }

  const handleInsert = (blockType: BlockType['type']) => {
    // Check if the selected block is a Section (including nested ones)
    const selectedBlock = findBlockRecursively(pageSchema.blocks, selectedBlockId);
    if (selectedBlock?.type === 'section') {
      // Insert inside the section's children
      insertBlockInsideSection(blockType, selectedBlockId);
    } else {
      // Default: insert either before or after the selected block
      if (position === 'above') {
        insertBlockBefore(blockType);
      } else {
        insertBlockAfter(blockType);
      }
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

export default BlockInsertDropdown; 