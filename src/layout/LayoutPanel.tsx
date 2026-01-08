import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Layout as LayoutIcon, 
  Columns, 
  Search,
  Type,
  Grid2x2,
  GalleryHorizontalEnd,
  AlignVerticalSpaceBetween,
  Minus,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Image,
  Video,
  Columns3Cog,
  RectangleEllipsis,
  Zap,
  Award,
  MoreVertical,
  Copy,
  Trash2,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { usePanel } from '@context/PanelContext';
import { useSelection } from '@context/SelectionContext';
import { useBlockEditing } from '@context/BlockEditingContext';
import { useHistory } from '@context/HistoryContext';
import { useOnClickOutside } from '@hooks/useOnClickOutside';
import { findBlockPositionForUI } from '@context/domain/blockTraversal';
import type { Block, BlockType } from '@blocks/shared/Block';
import type { TabsBlock } from '@blocks/tabs/schema';
import type { SectionBlockProps } from '@blocks/section/schema';
import type { FeatureCalloutBlockProps } from '@blocks/feature-callout/schema';
import type { FAQAccordionBlockProps } from '@blocks/faq-accordion/schema';
import type { TestimonialBlockProps } from '@blocks/testimonial/schema';
import type { CarouselBlockProps } from '@blocks/carousel/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';
import type { ContentLibraryBlockProps } from '@blocks/content-library/schema';
import { MaxColumns } from '@blocks/row-layout/schema';

interface BlockItemProps {
  block: Block;
  level: number;
  parentType?: BlockType['type'];
  onSelect: (block: Block) => void;
  selectedBlockId: string | null;
  findContainerForBlock: (blockId: string) => { containerBlock: TabsBlock; activePaneId: string } | null;
}

interface BlockOptionsMenuProps {
  onClose: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  triggerElement: HTMLElement | null;
}

function LayoutPanel() {
  const { isLayoutOpen } = usePanel();
  const { selectedBlockId, setSelectedBlockId, setSelectedBlock, setActiveTabId } = useSelection();
  const { pageSchema } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  
  const findContainerForBlock = (blockId: string): { containerBlock: TabsBlock; activePaneId: string } | null => {
    const findInBlocks = (blocks: BlockType[]): { containerBlock: TabsBlock; activePaneId: string } | null => {
      for (const block of blocks) {
        if (block.type === 'tabs') {
          const tabsBlock = block as TabsBlock;
          for (const tab of tabsBlock.props.tabs) {
            if (tab.children) {
              for (const child of tab.children) {
                if (child.id === blockId) {
                  return { containerBlock: tabsBlock, activePaneId: tab.id };
                }
                // Recursively check nested children
                if (child.children) {
                  const found = findInBlocks(child.children);
                  if (found) return found;
                }
              }
            }
          }
        }
        if (block.children) {
          const found = findInBlocks(block.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findInBlocks(pageSchema.blocks);
  };
  
  const scrollToBlock = (blockId: string) => {
    setTimeout(() => {
      const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);
      
      if (blockElement) {
        blockElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      } else {
        console.warn(`Block with ID ${blockId} not found in the DOM`);
      }
    }, 100);
  };
  
  const handleBlockSelect = (block: Block) => {
    setSelectedBlockId(block.id);
    setSelectedBlock(block);
    
    const tabInfo = findContainerForBlock(block.id);
    if (tabInfo) {
      setActiveTabId(tabInfo.activePaneId);
    }
    
    scrollToBlock(block.id);
  };
  
  // Memoized filtering logic for better performance
  const filteredBlocks = useMemo(() => {
    const filter = (blocks: BlockType[]): BlockType[] => {
      if (!searchQuery) return blocks;

      return blocks.filter(block => {
        const matchesType = block.type.toLowerCase().includes(searchQuery.toLowerCase());
        const hasMatchingChildren = block.children ? filter(block.children).length > 0 : false;

        // For tabs blocks, check tab children
        let hasMatchingTabChildren = false;
        if (block.type === 'tabs') {
          const tabsBlock = block as TabsBlock;
          hasMatchingTabChildren = tabsBlock.props.tabs.some(tab => 
            tab.children && filter(tab.children).length > 0
          );
        }

        return matchesType || hasMatchingChildren || hasMatchingTabChildren;
      });
    };

    return filter(pageSchema.blocks);
  }, [pageSchema.blocks, searchQuery]);

  return (
    <div className={`${isLayoutOpen ? 'w-[22rem] bg-white border-r border-gray-200' : 'w-0 bg-transparent border-0'} sticky top-16 self-start h-[calc(100vh-4rem)] min-h-0 flex flex-col transition-width duration-300 ease-in-out overflow-hidden`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Layout Structure</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Block Structure */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Search size={24} className="flex flex-col items-center justify-center h-full text-gray-500" />
            <p>No blocks found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBlocks.map((block) => (
              <BlockItem 
                key={block.id} 
                block={block} 
                level={0}
                onSelect={handleBlockSelect}
                selectedBlockId={selectedBlockId}
                findContainerForBlock={findContainerForBlock}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <span>Total blocks: {pageSchema.blocks.length}</span>
        </div>
      </div>
    </div>
  );
}

function BlockItem({ block, level, parentType, onSelect, selectedBlockId, findContainerForBlock }: BlockItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const { duplicateSelectedBlock, deleteSelectedBlock, moveBlockUp, moveBlockDown } = useBlockEditing();
  const { pageSchema } = useHistory();
  const blockOptionsRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  
  // Close options menu when clicking outside
  useOnClickOutside(blockOptionsRef, () => {
    setShowOptionsMenu(false);
  });
  
  // Get tabs for tabs blocks
  const getTabs = () => {
    if (block.type === 'tabs') {
      const tabsBlock = block as TabsBlock;
      return tabsBlock.props.tabs;
    }
    return [];
  };
  
  // Get children blocks to render
  const getChildrenBlocks = (): BlockType[] => {
    if (block.type === 'tabs') {
      const tabsBlock = block as TabsBlock;
      return tabsBlock.props.tabs.flatMap(tab => tab.children || []);
    }
    return block.children || [];
  };
  
  const childrenBlocks = getChildrenBlocks();
  const tabs = getTabs();
  const hasTabs = block.type === 'tabs' && tabs.length > 0;
  const hasChildren = (block.children && block.children.length > 0) || hasTabs;
  
  const isSelected = selectedBlockId === block.id;
  
  // Determine if block can move up or down - memoized for performance
  const { canMoveUp, canMoveDown, totalSiblings } = useMemo(() => {
    const position = findBlockPositionForUI(block.id, pageSchema.blocks);
    return {
      canMoveUp: position.index > 0,
      canMoveDown: position.index < position.totalSiblings - 1,
      totalSiblings: position.totalSiblings,
    };
  }, [block.id, pageSchema.blocks]);

  const isDuplicateAvailable = useMemo(() => {
    if (parentType === 'section') {
      return false;
    }
    if (block.type === 'section' && parentType === 'rowLayout' && totalSiblings >= MaxColumns) {
      return false;
    }
    
    return true;
  }, [block.type, parentType, totalSiblings]);

  const isDeleteAvailable = !(block.type === 'section' && parentType === 'rowLayout' && totalSiblings === 1);
  
  // Get level-based padding classes
  const getLevelClasses = (level: number) => {
    const baseClasses = "flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-colors duration-200";
    const levelClasses = [
      "pl-2",   // level 0: 8px
      "pl-5",   // level 1: 20px  
      "pl-8",   // level 2: 32px
    ]
    return `${baseClasses} ${levelClasses[level] || "pl-8"}`;
  };
  
  // Determine icon based on block type
  const getBlockIcon = () => {
    const iconSize = 14;
    const iconClass = "w-5 h-5 rounded-md flex items-center justify-center bg-gray-100 text-gray-600";
    
    const iconMap: Partial<Record<BlockType['type'], React.ReactNode>> = {
      hero: <LayoutIcon size={iconSize} />,
      text: <Type size={iconSize} />,
      section: <Columns size={iconSize} />,
      posterGrid: <Grid2x2 size={iconSize} />,
      carousel: <GalleryHorizontalEnd size={iconSize} />,
      testimonial: <MessageSquare size={iconSize} />,
      spacer: <AlignVerticalSpaceBetween size={iconSize} />,
      divider: <Minus size={iconSize} />,
      featureCallout: <Sparkles size={iconSize} />,
      'faq-accordion': <HelpCircle size={iconSize} />,
      image: <Image size={iconSize} />,
      video: <Video size={iconSize} />,
      tabs: <Columns3Cog size={iconSize} />,
      'cta-button': <Zap size={iconSize} />,
      'badge-strip': <Award size={iconSize} />,
      'rowLayout': <LayoutIcon size={iconSize} />,
      'contentLibrary': <Grid2x2 size={iconSize} />,
    };
    
    const icon = iconMap[block.type] ?? <RectangleEllipsis size={iconSize} />;
    return <div className={iconClass}>{icon}</div>;
  };
  
  return (
    <div className="select-none relative" data-layout-item-id={block.id} ref={blockOptionsRef}>
      <div 
        className={`${getLevelClasses(level)} ${isSelected ? 'bg-blue-100 border border-blue-200' : 'hover:bg-gray-100'}`}
        onClick={() => onSelect(block)}
      >
        {hasChildren ? (
          <div 
            className="mr-2 cursor-pointer hover:bg-gray-200 rounded p-1 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        ) : (
          <div className="w-6 mr-2"></div>
        )}
        {getBlockIcon()}
        <div className="ml-3 flex flex-col">
          {(() => {
            // Get block title if available
            const getBlockTitle = (): string | undefined => {
              switch (block.type) {
                case 'carousel':
                  return (block.props as CarouselBlockProps).title;
                case 'posterGrid':
                  return (block.props as PosterGridBlockProps).title;
                case 'section':
                  return (block.props as SectionBlockProps).title;
                case 'featureCallout':
                  return (block.props as FeatureCalloutBlockProps).title;
                case 'faq-accordion':
                  return (block.props as FAQAccordionBlockProps).title;
                case 'testimonial':
                  return (block.props as TestimonialBlockProps).title;
                case 'contentLibrary':
                  return (block.props as ContentLibraryBlockProps).title;
                default:
                  return undefined;
              }
            };

            const blockTitle = getBlockTitle();
            
            const displayNameMap: Partial<Record<BlockType['type'], string>> = {
              'hero': 'Hero',
              'text': 'Text',
              'section': 'Section',
              'posterGrid': 'Poster Grid',
              'carousel': 'Carousel',
              'testimonial': 'Testimonial',
              'spacer': 'Spacer',
              'divider': 'Divider',
              'featureCallout': 'Feature Callout',
              'faq-accordion': 'FAQ Accordion',
              'image': 'Image',
              'video': 'Video',
              'tabs': `Tabs (${tabs.length})`,
              'cta-button': 'CTA Button',
              'badge-strip': 'Badge Strip',
              'rowLayout': 'Row Layout',
              'contentLibrary': 'Content Library',
            };
            
            const defaultDisplayName = displayNameMap[block.type] || 'Unknown Block';
            
            return (
              <>
                <span className="text-base font-medium truncate">
                  {defaultDisplayName}
                </span>
                {blockTitle && blockTitle.trim() && (
                  <span className="text-xs text-gray-500 truncate">
                    {blockTitle}
                  </span>
                )}
              </>
            );
          })()}
        </div>
        
        {isSelected && (
          <div className="ml-auto">
            <button
              ref={triggerButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowOptionsMenu(!showOptionsMenu);
              }}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors duration-200"
              title="Block options"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        )}
      </div>
      
      {/* Options menu */}
      {showOptionsMenu && (
        <BlockOptionsMenu
          onClose={() => setShowOptionsMenu(false)}
          onDuplicate={isDuplicateAvailable ? duplicateSelectedBlock : undefined}
          onDelete={isDeleteAvailable ? deleteSelectedBlock : undefined}
          onMoveUp={moveBlockUp}
          onMoveDown={moveBlockDown}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          triggerElement={triggerButtonRef.current}
        />
      )}
      
      {isExpanded && hasTabs && (
        <div className="ml-2 space-y-2">
          {tabs.map((tab, tabIndex) => (
            <div key={tab.id} className="border-l-2 border-gray-300 ml-4">
              <div className="flex items-center py-1 px-2 ml-2">
                <div className="w-4 h-4 rounded bg-gray-200 text-gray-600 text-xs flex items-center justify-center mr-2">
                  {tabIndex + 1}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {tab.label || `Tab ${tabIndex + 1}`}
                </span>
                {tab.children && tab.children.length > 0 && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({tab.children.length} blocks)
                  </span>
                )}
              </div>
              {tab.children && tab.children.length > 0 && (
                <div className="ml-4 space-y-1">
                  {tab.children.map((child) => (
                    <BlockItem 
                      key={child.id} 
                      block={child} 
                      level={level + 2} 
                      parentType={block.type}
                      onSelect={onSelect}
                      selectedBlockId={selectedBlockId}
                      findContainerForBlock={findContainerForBlock}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isExpanded && !hasTabs && childrenBlocks.length > 0 && (
        <div className="ml-2 space-y-1">
          {childrenBlocks.map((child) => (
            <BlockItem 
              key={child.id} 
              block={child} 
              level={level + 1} 
              parentType={block.type}
              onSelect={onSelect}
              selectedBlockId={selectedBlockId}
              findContainerForBlock={findContainerForBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BlockOptionsMenu({
  onClose,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  triggerElement
}: BlockOptionsMenuProps) {
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePosition = () => {
      if (triggerElement && menuRef.current) {
        const triggerRect = triggerElement.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate available space above and below
        const spaceAbove = triggerRect.top;
        const spaceBelow = viewportHeight - triggerRect.bottom;
        
        if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
          setPosition('bottom');
        } else {
          setPosition('top');
        }
      }
    };

    calculatePosition();

    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [triggerElement, canMoveUp, canMoveDown]);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    onClose();
  };

  const getPositionClasses = () => {
    if (position === 'top') {
      return 'absolute right-2 bottom-full mb-1';
    }
    return 'absolute right-2 top-full mt-1';
  };

  return (
    <>
    {(canMoveUp || canMoveDown || onDuplicate || onDelete) && (
    <div className={`${getPositionClasses()} z-50`} ref={menuRef}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
        {canMoveUp && onMoveUp && (
          <button
            onClick={(e) => handleAction(e, onMoveUp)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <MoveUp size={14} />
            Move Up
          </button>
        )}
        
        {canMoveDown && onMoveDown && (
          <button
            onClick={(e) => handleAction(e, onMoveDown)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <MoveDown size={14} />
            Move Down
          </button>
        )}
        
        {onDuplicate && (
        <button
          onClick={(e) => handleAction(e, onDuplicate)}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <Copy size={14} />
          Duplicate
        </button>
        )}
        
        {onDelete && (
        <button
          onClick={(e) => handleAction(e, onDelete)}
          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <Trash2 size={14} />
          Delete
        </button>
        )}
      </div>
    </div>
    )}
    </>
  );
}

export default LayoutPanel;
