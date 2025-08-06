import React, { useState } from 'react';
import type { BlockType } from '@blocks/shared/Block';
import type { VisibilityContext, VisibilityProps, Platform } from '@blocks/shared/Visibility';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import Dropdown, { DropdownItem } from '@components/Dropdown';
import { Plus } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';

interface BlockInsertDropdownProps {
  position: 'above' | 'below';
  blockId: string;
  visibilityContext: VisibilityContext;
}

/**
 * Evaluate if a block should be visible based on visibility rules and context
 * @param visibility - The visibility rules for the block
 * @param context - The current visibility context
 * @returns true if the block should be visible, false otherwise
 */
function evaluateVisibility(
  visibility?: VisibilityProps,
  context?: VisibilityContext
): boolean {
  if (!visibility) return true;
  if (!context) return false;

  if (
    visibility.isLoggedIn !== undefined &&
    visibility.isLoggedIn !== context.isLoggedIn
  )
    return false;

  if (
    visibility.isSubscribed !== undefined &&
    visibility.isSubscribed !== context.isSubscribed
  )
    return false;

  if (
    visibility.subscriptionTier &&
    visibility.subscriptionTier !== context.subscriptionTier
  )
    return false;

  if (
    visibility.region &&
    !visibility.region.includes(context.region ?? '')
  )
    return false;

  if (
    visibility.platform &&
    context.platform &&
    !visibility.platform.includes(context.platform as Platform)
  )
    return false;

  return true;
}

const BlockInsertDropdown: React.FC<BlockInsertDropdownProps> = ({ position, blockId, visibilityContext }) => {
  const { selectedBlockId } = useSelection();
  const { insertBlockAfter, insertBlockBefore, insertBlockInsideSection } = useBlockInsert();
  const { pageSchema } = useHistory();
  const [isHovered, setIsHovered] = useState(false);

  // Helper function to check if a block is a child of a Section
  const isChildBlock = (blockId: string) => {
    return pageSchema.blocks.some(block => 
      block.children && block.children.some(child => child.id === blockId)
    );
  };

  // Helper function to find the parent Section of a child block
  const findParentSection = (blockId: string) => {
    return pageSchema.blocks.find(block => 
      block.children && block.children.some(child => child.id === blockId)
    );
  };

  // Helper function to find a block by ID (including nested blocks)
  const findBlockById = (blockId: string): BlockType | null => {
    for (const block of pageSchema.blocks) {
      if (block.id === blockId) {
        return block;
      }
      if (block.children) {
        for (const child of block.children) {
          if (child.id === blockId) {
            return child;
          }
        }
      }
    }
    return null;
  };

  // Find the block and check its visibility
  const block = findBlockById(blockId);
  if (!block || !evaluateVisibility(block.visibility, visibilityContext)) {
    return null;
  }

  // Only show if this block is selected
  if (selectedBlockId !== blockId) {
    return null;
  }

  const handleInsert = (blockType: BlockType['type']) => {
    // Check if the selected block is a Section (only at top level)
    const selectedBlock = pageSchema.blocks.find(block => block.id === selectedBlockId);
    
    if (selectedBlock?.type === 'section') {
      // Insert inside the section's children (or after it if it's a Section)
      insertBlockInsideSection(blockType, selectedBlockId);
    } else {
      // Check if the selected block is a child of a Section
      if (isChildBlock(selectedBlockId)) {
        // Child block is selected - allow other blocks but restrict Section blocks
        if (blockType === 'section') {
          // Sections can't be nested - silently ignore or you could add console.warn here
          return;
        } else {
          // Find the parent Section and insert the block inside it
          const parentSection = findParentSection(selectedBlockId);
          if (parentSection) {
            insertBlockInsideSection(blockType, parentSection.id);
          }
        }
      } else {
        // Default: insert either before or after the selected block
        if (position === 'above') {
          insertBlockBefore(blockType);
        } else {
          insertBlockAfter(blockType);
        }
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