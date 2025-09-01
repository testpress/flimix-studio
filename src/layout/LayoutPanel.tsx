import React, { useState } from 'react';
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
  CreditCard,
  RectangleEllipsis,
  Zap,
  Award
} from 'lucide-react';
import { useLayoutPanel } from '@context/LayoutPanelContext';
import { useSelection } from '@context/SelectionContext';
import type { Block, BlockType } from '@blocks/shared/Block';
import type { TabsBlock } from '@blocks/tabs/schema';

interface BlockItemProps {
  block: Block;
  level: number;
  onSelect: (block: Block) => void;
  selectedBlockId: string | null;
}

const BlockItem: React.FC<BlockItemProps> = ({ block, level, onSelect, selectedBlockId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    
    switch (block.type) {
      case 'hero':
        return <div className={iconClass}><LayoutIcon size={iconSize} /></div>;
      case 'text':
        return <div className={iconClass}><Type size={iconSize} /></div>;
      case 'section':
        return <div className={iconClass}><Columns size={iconSize} /></div>;
      case 'posterGrid':
        return <div className={iconClass}><Grid2x2 size={iconSize} /></div>;
      case 'carousel':
        return <div className={iconClass}><GalleryHorizontalEnd size={iconSize} /></div>;
      case 'testimonial':
        return <div className={iconClass}><MessageSquare size={iconSize} /></div>;
      case 'spacer':
        return <div className={iconClass}><AlignVerticalSpaceBetween size={iconSize} /></div>;
      case 'divider':
        return <div className={iconClass}><Minus size={iconSize} /></div>;
      case 'featureCallout':
        return <div className={iconClass}><Sparkles size={iconSize} /></div>;
      case 'faq-accordion':
        return <div className={iconClass}><HelpCircle size={iconSize} /></div>;
      case 'image':
        return <div className={iconClass}><Image size={iconSize} /></div>;
      case 'video':
        return <div className={iconClass}><Video size={iconSize} /></div>;
      case 'tabs':
        return <div className={iconClass}><Columns3Cog size={iconSize} /></div>;
      case 'footer':
        return <div className={iconClass}><CreditCard size={iconSize} /></div>;
      case 'cta-button':
        return <div className={iconClass}><Zap size={iconSize} /></div>;
      case 'badge-strip':
        return <div className={iconClass}><Award size={iconSize} /></div>;
      default:
        return <div className={iconClass}><RectangleEllipsis size={iconSize} /></div>;
    }
  };
  
  return (
    <div className="select-none" data-layout-item-id={block.id}>
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
        <span className="ml-3 text-base font-medium truncate">
          {block.type === 'hero' ? 'Hero' :
           block.type === 'text' ? 'Text' :
           block.type === 'section' ? 'Section' :
           block.type === 'posterGrid' ? 'Poster Grid' :
           block.type === 'carousel' ? 'Carousel' :
           block.type === 'testimonial' ? 'Testimonial' :
           block.type === 'spacer' ? 'Spacer' :
           block.type === 'divider' ? 'Divider' :
           block.type === 'featureCallout' ? 'Feature Callout' :
           block.type === 'faq-accordion' ? 'FAQ Accordion' :
           block.type === 'image' ? 'Image' :
           block.type === 'video' ? 'Video' :
           block.type === 'tabs' ? `Tabs (${tabs.length})` :
           block.type === 'footer' ? 'Footer' :
           block.type === 'cta-button' ? 'CTA Button' :
           block.type === 'badge-strip' ? 'Badge Strip' :
           'Unknown Block'}
        </span>
      </div>
      
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
                      onSelect={onSelect}
                      selectedBlockId={selectedBlockId}
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
              onSelect={onSelect}
              selectedBlockId={selectedBlockId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LayoutPanel: React.FC = () => {
  const { isLayoutOpen } = useLayoutPanel();
  const { pageSchema, selectedBlockId, setSelectedBlockId, setSelectedBlock } = useSelection();
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollToBlock = (blockId: string) => {
    setTimeout(() => {
      const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);
      
      if (blockElement) {
        blockElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        
        setTimeout(() => {
          blockElement.classList.remove('ring-4', 'ring-blue-300', 'ring-opacity-50', 'transition-all', 'duration-300');
        }, 2000);
      } else {
        console.warn(`Block with ID ${blockId} not found in the DOM`);
      }
    }, 100);
  };
  
  const handleBlockSelect = (block: Block) => {
    setSelectedBlockId(block.id);
    setSelectedBlock(block);
    scrollToBlock(block.id);
  };
  
  // Filter blocks based on search query
  const filterBlocks = (blocks: BlockType[]): BlockType[] => {
    if (!searchQuery) return blocks;
    
    return blocks.filter(block => {
      const matchesType = block.type.toLowerCase().includes(searchQuery.toLowerCase());
      const hasMatchingChildren = block.children ? filterBlocks(block.children).length > 0 : false;
      
      // For tabs blocks, check tab children
      let hasMatchingTabChildren = false;
      if (block.type === 'tabs') {
        const tabsBlock = block as TabsBlock;
        hasMatchingTabChildren = tabsBlock.props.tabs.some(tab => 
          tab.children && filterBlocks(tab.children).length > 0
        );
      }
      
      return matchesType || hasMatchingChildren || hasMatchingTabChildren;
    });
  };
  
  const filteredBlocks = filterBlocks(pageSchema.blocks);

  return (
    <div className={`${isLayoutOpen ? 'w-[22rem] bg-white border-r border-gray-200' : 'w-0 bg-transparent border-0'} sticky top-16 self-start h-[calc(100vh-4rem)] min-h-0 flex flex-col transition-width duration-300 ease-in-out overflow-hidden`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Layout Structure</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>
      </div>
      
      {/* Block Structure */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Search size={24} className="mb-2" />
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
};

export default LayoutPanel;
