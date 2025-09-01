import React, { useState, useMemo } from 'react';
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
import type { SectionBlockProps } from '@blocks/section/schema';
import type { FeatureCalloutBlockProps } from '@blocks/feature-callout/schema';
import type { FAQAccordionBlockProps } from '@blocks/faq-accordion/schema';
import type { TestimonialBlockProps } from '@blocks/testimonial/schema';
import type { CarouselBlockProps } from '@blocks/carousel/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';

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
      footer: <CreditCard size={iconSize} />,
      'cta-button': <Zap size={iconSize} />,
      'badge-strip': <Award size={iconSize} />,
    };
    
    const icon = iconMap[block.type] ?? <RectangleEllipsis size={iconSize} />;
    return <div className={iconClass}>{icon}</div>;
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
              'footer': 'Footer',
              'cta-button': 'CTA Button',
              'badge-strip': 'Badge Strip',
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
