import React, { useState, useCallback, useRef } from 'react';
import type { BlockType } from '@type/block';
import type { VisibilityContext, VisibilityProps, Platform } from '@type/visibility';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import { Plus, Type, Layout, Square, Grid2x2, GalleryHorizontalEnd, AlignVerticalSpaceBetween, Minus, MessageSquare, Sparkles, HelpCircle, Image, Video, Columns3Cog, CreditCard, RectangleEllipsis, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import type { TabsBlock } from '@blocks/tabs/schema';
import { getAllBlockLibraryItems } from '@type/library';
import type { BlockLibraryItem } from '@type/library';
import { useOnClickOutside } from '@hooks/useOnClickOutside';
import { Tooltip } from '@components/Tooltip';

interface BlockInsertDropdownProps {
  position: 'above' | 'below';
  blockId: string;
  visibilityContext: VisibilityContext;
}


interface TemplateGridProps {
  templates: BlockLibraryItem[];
  searchQuery: string;
  onInsert: (blockType: BlockType['type']) => void;
}

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

/**
 * Evaluate if a block should be visible based on visibility rules and context
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
    context.subscriptionTier &&
    visibility.subscriptionTier !== context.subscriptionTier
  )
    return false;

  if (
    visibility.region &&
    context.region &&
    !visibility.region.includes(context.region)
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

/**
 * Find a block by ID in the page schema (including nested blocks)
 */
function findBlockById(blockId: string, blocks: BlockType[]): BlockType | null {
  for (const block of blocks) {
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
}

/**
 * Check if a block is a child of a Section or Tab
 */
function isChildBlock(blockId: string, blocks: BlockType[]): boolean {
  const isSectionChild = blocks.some(block =>
    block.children && block.children.some(child => child.id === blockId)
  );

  const isTabChild = blocks.some(block =>
    block.type === 'tabs' && (block as TabsBlock).props.tabs.some(tab =>
      tab.children?.some(child => child.id === blockId)
    )
  );

  return isSectionChild || isTabChild;
}

/**
 * Check if a block is a child of a Tab and return tab info
 */
function findParentTab(blockId: string, blocks: BlockType[]): { tabsBlock: TabsBlock; tab: TabsBlock['props']['tabs'][0] } | null {
  for (const block of blocks) {
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
}

/**
 * Filter templates based on context
 */
function filterTemplatesByContext(
  templates: BlockLibraryItem[],
  selectedBlockId: string | null,
  blocks: BlockType[]
): BlockLibraryItem[] {
  return templates.filter(template => {
    if (selectedBlockId && isChildBlock(selectedBlockId, blocks)) {
      // Don't allow section or tabs blocks inside child blocks
      if (template.type === 'section' || template.type === 'tabs') {
        return false;
      }
    }
    return true;
  });
}

/**
 * Filter templates based on search query
 */
function filterTemplatesBySearch(
  templates: BlockLibraryItem[],
  searchQuery: string
): BlockLibraryItem[] {
  if (!searchQuery) return templates;
  
  const query = searchQuery.toLowerCase();
  return templates.filter(template =>
    template.name.toLowerCase().includes(query) ||
    template.description.toLowerCase().includes(query)
  );
}


/**
 * Search bar component
 */
const SearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="mb-3">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search blocks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  </div>
);

/**
 * Template grid component
 */
const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  searchQuery,
  onInsert
}) => {
  if (templates.length === 0) {
    return (
      <div
        className="col-span-4 flex flex-col items-center justify-center py-4 text-gray-500"
        onClick={(e) => e.stopPropagation()}
      >
        <Search size={20} className="mb-2" />
        <p className="text-xs">No blocks found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <>
      {templates.map((template) => {
        const IconComponent = iconMap[template.icon] || Layout;

        return (
          <div key={template.type} className="relative">
            <Tooltip
              content={
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent size={18} />
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </>
              }
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInsert(template.type);
                }}
                data-template-type={template.type}
                className="w-full aspect-square flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 mb-1">
                  <IconComponent size={14} />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center leading-tight w-full px-1 whitespace-normal">
                  {template.name}
                </span>
              </button>
            </Tooltip>
          </div>
        );
      })}
    </>
  );
};

const BlockInsertDropdown: React.FC<BlockInsertDropdownProps> = ({
  position,
  blockId,
  visibilityContext
}) => {
  // Hooks
  const { selectedBlockId } = useSelection();
  const { insertBlockAfter, insertBlockBefore, insertBlockIntoTabs } = useBlockInsert();
  const { pageSchema } = useHistory();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Ref for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });


  const handleInsert = useCallback((blockType: BlockType['type']) => {
    const tabInfo = findParentTab(blockId, pageSchema.blocks);

    if (tabInfo) {
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

    // Reset state
    setIsOpen(false);
    setSearchQuery('');
  }, [blockId, pageSchema.blocks, position, insertBlockIntoTabs, insertBlockBefore, insertBlockAfter]);

  // Early returns
  const block = findBlockById(blockId, pageSchema.blocks);
  if (!block || !evaluateVisibility(block.visibility, visibilityContext)) {
    return null;
  }
  if (block.type === 'contentLibrary') {
    return null;
  }

  if (selectedBlockId !== blockId) {
    return null;
  }

  // Compute filtered templates
  const allTemplates = getAllBlockLibraryItems().filter(
    item => item.type !== 'contentLibrary'
  );
  const contextFilteredTemplates = filterTemplatesByContext(allTemplates, selectedBlockId, pageSchema.blocks);
  const searchFilteredTemplates = filterTemplatesBySearch(contextFilteredTemplates, searchQuery);

  // Render
  return (
    <div
      ref={dropdownRef}
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
          setIsOpen(!isOpen);
        }}
      >
        <Plus size={16} />
      </button>

      {/* Dropdown panel */}
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

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className="grid gap-2 grid-cols-4">
            <TemplateGrid
              templates={searchFilteredTemplates}
              searchQuery={searchQuery}
              onInsert={handleInsert}
            />
          </div>
        </div>
      )}


    </div>
  );
};

export default BlockInsertDropdown;
