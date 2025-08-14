import React, { useState } from 'react';
import type { BlockType } from '@blocks/shared/Block';
import type { VisibilityContext, VisibilityProps, Platform } from '@blocks/shared/Visibility';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import Dropdown, { DropdownItem } from '@components/Dropdown';
import { Plus } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import type { TabsBlock } from '@blocks/tabs/schema';

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
    context.subscriptionTier && // Only check if context has a specific tier
    visibility.subscriptionTier !== context.subscriptionTier
  )
    return false;

  if (
    visibility.region &&
    context.region && // Only check if context has a specific region
    !visibility.region.includes(context.region)
  )
    return false;

  if (
    visibility.platform &&
    context.platform && // Only check if context has a specific platform
    !visibility.platform.includes(context.platform as Platform)
  )
    return false;

  return true;
}

const BlockInsertDropdown: React.FC<BlockInsertDropdownProps> = ({ position, blockId, visibilityContext }) => {
  const { selectedBlockId } = useSelection();
  const { insertBlockAfter, insertBlockBefore, insertBlockIntoTabs } = useBlockInsert();
  const { pageSchema } = useHistory();
  const [isHovered, setIsHovered] = useState(false);

  // Helper function to check if a block is a child of a Section or Tab
  const isChildBlock = (blockId: string) => {
    // Check if it's a child of a section
    const isSectionChild = pageSchema.blocks.some(block => 
      block.children && block.children.some(child => child.id === blockId)
    );
    
    // Check if it's a child of a tab using inline logic
    const isTabChild = pageSchema.blocks.some(block => 
      block.type === 'tabs' && (block as TabsBlock).props.tabs.some(tab => 
        tab.children?.some(child => child.id === blockId)
      )
    );
    
    return isSectionChild || isTabChild;
  };

  // Helper function to check if a block is a child of a Tab
  const isChildOfTab = (blockId: string) => {
    for (const block of pageSchema.blocks) {
      if (block.type === 'tabs') {
        const tabsBlock = block as TabsBlock;
        for (const tab of tabsBlock.props.tabs) {
          if (tab.children?.some(child => child.id === blockId)) {
            return { tabsBlock, tab };
          }
        }
      }
    }
    return null;
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
      // Check tabs blocks
      if (block.type === 'tabs') {
        const tabsBlock = block as TabsBlock;
        for (const tab of tabsBlock.props.tabs) {
          if (tab.children) {
            for (const child of tab.children) {
              if (child.id === blockId) {
                return child;
              }
              // Check nested children if they exist
              if (child.children) {
                for (const nestedChild of child.children) {
                  if (nestedChild.id === blockId) {
                    return nestedChild;
                  }
                }
              }
            }
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
    // Check if this block is inside a tab
    const tabInfo = isChildOfTab(blockId);
    
    if (tabInfo) {
      // Insert into the tab
      insertBlockIntoTabs(
        blockType, 
        tabInfo.tabsBlock.id, 
        {
          tabId: tabInfo.tab.id,
          position: position === 'above' ? 'above' : 'below',
          referenceBlockId: blockId
        }
      );
    } else if (position === 'above') {
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
        <DropdownItem onClick={() => handleInsert('cta-button')}>
          CTA Button Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('hero')}>
          Hero Block
        </DropdownItem>
        {!isChildBlock(selectedBlockId) && (
          <DropdownItem onClick={() => handleInsert('section')}>
            Section Block
          </DropdownItem>
        )}
        {!isChildBlock(selectedBlockId) && (
          <DropdownItem onClick={() => handleInsert('tabs')}>
            Tabs Block
          </DropdownItem>
        )}
        <DropdownItem onClick={() => handleInsert('posterGrid')}>
          Poster Grid Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('carousel')}>
          Carousel Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('spacer')}>
          Spacer Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('divider')}>
          Divider Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('testimonial')}>
          Testimonial Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('featureCallout')}>
          Feature Callout Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('badge-strip')}>
          Badge Strip Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('faq-accordion')}>
          FAQ Accordion Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('image')}>
          Image Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('video')}>
          Video Block
        </DropdownItem>
        <DropdownItem onClick={() => handleInsert('footer')}>
          Footer Block
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export default BlockInsertDropdown; 