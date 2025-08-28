import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { BlockType } from '@blocks/shared/Block';
import type { VisibilityContext, VisibilityProps, Platform } from '@blocks/shared/Visibility';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import { Plus, Type, Layout, Square, Grid2x2, GalleryHorizontalEnd, AlignVerticalSpaceBetween, Minus, MessageSquare, Sparkles, HelpCircle, Image, Video, Columns3Cog, CreditCard, RectangleEllipsis, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import type { TabsBlock } from '@blocks/tabs/schema';
import { getAllBlockLibraryItems } from '@blocks/shared/Library';
import type { BlockLibraryItem } from '@blocks/shared/Library';

// Type for dropdown event callback
type DropdownEventCallback = (blockId: string | null, position: 'above' | 'below' | null) => void;

// Event bus for dropdown communication
const dropdownEventBus = {
  // The currently open dropdown info
  currentDropdown: {
    blockId: null as string | null,
    position: null as 'above' | 'below' | null
  },
  
  // List of subscribers
  listeners: [] as DropdownEventCallback[],
  
  // Subscribe to dropdown open/close events
  subscribe(callback: DropdownEventCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  },
  
  // Notify all subscribers about dropdown state change
  notify(blockId: string | null, position: 'above' | 'below' | null) {
    this.currentDropdown = { blockId, position };
    this.listeners.forEach(callback => callback(blockId, position));
  }
};

// Icon mapping for the templates
const iconMap: Record<string, LucideIcon> = {
  Layout,
  Type,
  Square,
  Grid2x2,
  GalleryHorizontalEnd,
  AlignVerticalSpaceBetween,
  Columns3Cog,
  Minus,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Image,
  Video,
  CreditCard,
  RectangleEllipsis,
};

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
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{ name: string; description: string; icon: string }>({ name: '', description: '', icon: '' });

  // Listen for dropdown open/close events
  useEffect(() => {
    // Handler for dropdown events
    const handleDropdownEvent = (openBlockId: string | null, openPosition: 'above' | 'below' | null) => {
      // If another dropdown is opening, close this one
      if (openBlockId && (openBlockId !== blockId || openPosition !== position)) {
        setIsOpen(false);
      }
    };
    
    // Subscribe to dropdown events
    const unsubscribe = dropdownEventBus.subscribe(handleDropdownEvent);
    
    // Cleanup subscription when component unmounts
    return unsubscribe;
  }, [blockId, position]);

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.block-insert-dropdown')) {
        setIsOpen(false);
        // Also clear the dropdown state in the event bus
        dropdownEventBus.notify(null, null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Reset tooltip state when selected block changes
  useEffect(() => {
    setActiveTooltip(null);
    setTooltipVisible(false);
    setTooltipContent({ name: '', description: '', icon: '' });
  }, [selectedBlockId]);

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

  // Get all block templates
  const allTemplates = getAllBlockLibraryItems();
  
  // Filter templates based on context (e.g., don't show section/tabs inside child blocks)
  const filteredTemplates = allTemplates.filter(template => {
    if (selectedBlockId && isChildBlock(selectedBlockId)) {
      // Don't allow section or tabs blocks inside child blocks
      if (template.type === 'section' || template.type === 'tabs') {
        return false;
      }
    }
    return true;
  });

  // Filter templates based on search query
  const searchFilteredTemplates = searchQuery 
    ? filteredTemplates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTemplates;

  // Handle mouse enter to show tooltip and set its position
  const handleMouseEnter = useCallback((e: React.MouseEvent, template: BlockLibraryItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const tooltipWidth = 250;
    const tooltipHeight = 120;
    
    // Check if tooltip would go off-screen to the right
    const rightEdgePosition = rect.right + 10 + tooltipWidth;
    const isOffScreenRight = rightEdgePosition > windowWidth;
    
    // Check if tooltip would go off-screen at the bottom
    const bottomEdgePosition = rect.top + tooltipHeight;
    const isOffScreenBottom = bottomEdgePosition > windowHeight;
    
    // Calculate top position with adjustment for scrolling
    const topPosition = isOffScreenBottom 
      ? rect.top - (tooltipHeight - rect.height)
      : rect.top;
    
    // Position the tooltip based on available space
    if (isOffScreenRight) {
      setTooltipPosition({
        top: topPosition,
        left: rect.left - tooltipWidth - 10
      });
    } else {
      setTooltipPosition({
        top: topPosition,
        left: rect.right + 10
      });
    }
    
    // Set tooltip content and make it visible
    setTooltipContent({
      name: template.name,
      description: template.description,
      icon: template.icon
    });
    setActiveTooltip(template.type);
    setTooltipVisible(true);
  }, []);

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
    
    // Close the dropdown after inserting
    setIsOpen(false);
    // Clear search query
    setSearchQuery('');
    // Reset tooltip state
    setActiveTooltip(null);
    setTooltipVisible(false);
    setTooltipContent({ name: '', description: '', icon: '' });
    
    // Clear the dropdown state in the event bus
    dropdownEventBus.notify(null, null);
  };

  // Tooltip component to be rendered in portal
  const Tooltip = () => {
    if (!tooltipVisible || !activeTooltip) return null;
    
    const IconComponent = iconMap[tooltipContent.icon] || Layout;
    
    return createPortal(
      <div 
        className="fixed z-[9999] bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
        style={{
          width: '250px',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          maxWidth: '300px',
          maxHeight: '200px',
          overflow: 'auto'
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <IconComponent size={18} />
          <h3 className="font-medium text-gray-900">{tooltipContent.name}</h3>
        </div>
        <p className="text-sm text-gray-600">
          {tooltipContent.description}
        </p>
        {/* Arrow pointing to the block - position depends on which side the tooltip is on */}
        {tooltipPosition.left > window.innerWidth / 2 ? (
          /* Arrow pointing right when tooltip is on the left side */
          <div className="absolute top-4 right-0 transform translate-x-1/2 rotate-45 w-3 h-3 bg-white border-t border-r border-gray-200"></div>
        ) : (
          /* Arrow pointing left when tooltip is on the right side */
          <div className="absolute top-4 left-0 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white border-l border-b border-gray-200"></div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <div 
      className={`block-insert-dropdown relative flex justify-center py-1 ${position === 'above' ? 'mb-2' : 'mt-2'}`}
    >
      {/* Plus button */}
      <button 
        className={`
          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          ${isOpen 
            ? 'bg-blue-500 text-white shadow-lg scale-110' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }
        `}
        title={`Insert block ${position} this block`}
        onClick={(e) => {
          e.stopPropagation();
          
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          
          // If opening, notify event bus to close other dropdowns
          if (newIsOpen) {
            dropdownEventBus.notify(blockId, position);
          } else {
            // If closing, clear the current dropdown
            dropdownEventBus.notify(null, null);
          }
        }}
      >
        <Plus size={16} />
      </button>

      {/* Dropdown panel - positioned above the plus button */}
      {isOpen && (
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[260px] max-w-[400px] z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Plus size={16} className="text-blue-500" />
            <h3 className="text-sm font-medium text-gray-900">
              Insert block {position} this block
            </h3>
          </div>

          {/* Search bar */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          {/* Block templates grid */}
          <div className="grid gap-2 grid-cols-4">
            {searchFilteredTemplates.length === 0 ? (
              <div 
                className="col-span-4 flex flex-col items-center justify-center py-4 text-gray-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Search size={20} className="mb-2" />
                <p className="text-xs">No blocks found matching "{searchQuery}"</p>
              </div>
            ) : (
              searchFilteredTemplates.map((template) => {
                const IconComponent = iconMap[template.icon] || Layout;
                
                return (
                  <div key={template.type} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInsert(template.type);
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, template)}
                      onMouseLeave={() => {
                        setActiveTooltip(null);
                        setTooltipVisible(false);
                      }}
                      data-template-type={template.type}
                      className="w-full aspect-square flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      {/* Icon */}
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 mb-1">
                        <IconComponent 
                          size={14} 
                          className={template.type === 'footer' ? 'rotate-180' : ''} 
                        />
                      </div>
                      
                      {/* Name */}
                      <span className="text-xs font-medium text-gray-900 text-center leading-tight w-full px-1 whitespace-normal">
                        {template.name}
                      </span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Render tooltip through portal */}
      <Tooltip />
    </div>
  );
};

export default BlockInsertDropdown; 