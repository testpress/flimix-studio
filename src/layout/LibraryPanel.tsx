import React, { useState } from 'react';
import { Type, Layout, Square, Grid2x2, GalleryHorizontalEnd, AlignVerticalSpaceBetween, Minus, MessageSquare, Sparkles, HelpCircle, Image, Video, Columns3Cog, CreditCard, RectangleEllipsis, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import { getAllBlockLibraryItems } from '@blocks/shared/Library';
import type { BlockType } from '@blocks/shared/Block';
import { useHistory } from '@context/HistoryContext';
import type { TabsBlock } from '@blocks/tabs/schema';
import { usePanel } from '@context/PanelContext';
import { Tooltip } from '@components/Tooltip';

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

const LibraryPanel: React.FC = () => {
  const { isLibraryOpen } = usePanel();
  const { selectedBlockId, selectedBlock } = useSelection();
  const { insertBlockAfter, insertBlockAtEnd, insertBlockInsideSection, insertBlockIntoTabs } = useBlockInsert();
  const { pageSchema } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

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

  // Helper function to find the parent Section of a child block
  const findParentSection = (blockId: string) => {
    return pageSchema.blocks.find(block => 
      block.children && block.children.some(child => child.id === blockId)
    );
  };

  // Helper function to find the parent Tab of a child block
  const findParentTab = (blockId: string) => {
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

  // Get all block templates using the helper function
  const allTemplates = getAllBlockLibraryItems();
  
  // Filter templates based on search query
  const filteredTemplates = searchQuery 
    ? allTemplates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTemplates;

  const handleBlockInsert = (blockType: BlockType['type']) => {
    if (!selectedBlock) {
      insertBlockAtEnd(blockType);
      return;
    }

    switch (selectedBlock.type) {
      case 'section':
        if (blockType === 'section' || blockType === 'tabs') {
          insertBlockAfter(blockType);
        } else {
          insertBlockInsideSection(blockType, selectedBlock.id);
        }
        break;

      case 'tabs':
        if (blockType === 'section' || blockType === 'tabs') {
          insertBlockAfter(blockType);
        } else {
          insertBlockIntoTabs(blockType, selectedBlock.id);
        }
        break;
      default:
        if (selectedBlockId && isChildBlock(selectedBlockId)) {
          const parentTab = findParentTab(selectedBlockId);
          if (parentTab) {
            if (blockType === 'section' || blockType === 'tabs') {
              return;
            } else {
              insertBlockIntoTabs(blockType, parentTab.tabsBlock.id, {  
                tabId: parentTab.tab.id,
                position: 'below',
                referenceBlockId: selectedBlockId
              });
            }
          } else {
            if (blockType === 'section' || blockType === 'tabs') {
              return;
            } else {
              const parentSection = findParentSection(selectedBlockId);
              if (parentSection) {
                insertBlockAfter(blockType);
              }
            }
          }
        } else {
          insertBlockAfter(blockType);
        }
        break;
    }
  };

  return (
    <div className={`${isLibraryOpen ? 'w-[22rem] bg-white border-r border-gray-200' : 'w-0 bg-transparent border-0'} sticky top-16 self-start h-[calc(100vh-4rem)] min-h-0 flex flex-col transition-width duration-300 ease-in-out overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Block Library</h2>
        <div className="mt-3">
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
      </div>
      {/* Block Templates */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Search size={24} className="mb-2" />
            <p>No blocks found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className={`grid gap-3 grid-cols-3`}>
            {filteredTemplates.map((template) => {
            const IconComponent = iconMap[template.icon] || Layout;
            
            return (
              <div key={template.type} className="relative">
                {/* Block Item */}
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
                    onClick={() => handleBlockInsert(template.type)}
                    className="w-full aspect-square flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 mb-2">
                      <IconComponent 
                        size={18} 
                      />
                    </div>
                    
                    {/* Name */}
                    <span className="text-xs font-medium text-gray-900 text-center leading-tight w-full px-1 whitespace-normal">
                      {template.name}
                    </span>
                  </button>
                </Tooltip>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          {selectedBlockId ? (
            (() => {
              const selectedBlock = pageSchema.blocks.find(block => block.id === selectedBlockId);
              
              if (selectedBlock?.type === 'section') {
                return <span>Adding inside section (Text/Hero go inside, Section goes after)</span>;
              } else if (selectedBlock?.type === 'tabs') {
                return <span>Adding to active tab</span>;
              } else {
                if (isChildBlock(selectedBlockId)) {
                  const parentTab = findParentTab(selectedBlockId);
                  if (parentTab) {
                    return <span>Adding to parent tab (no nested sections or tabs)</span>;
                  } else {
                    return <span>Adding to parent section (no nested sections)</span>;
                  }
                } else {
                  return <span>Adding after selected block</span>;
                }
              }
            })()
          ) : (
            <span>Adding to the end of page</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;