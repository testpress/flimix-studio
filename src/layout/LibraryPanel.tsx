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

  const contentLibraryTemplate = filteredTemplates.find(t => t.type === 'contentLibrary');
  const regularTemplates = filteredTemplates.filter(t => t.type !== 'contentLibrary');

  const isContentLibraryPresent = pageSchema.blocks.some(block => block.type === ('contentLibrary' as BlockType['type']));
  const hasBlocks = pageSchema.blocks.length > 0;

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
          <div className="space-y-4">
            {/* Special Section for Content Library */}
            {contentLibraryTemplate && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 text-transform uppercase mb-2 px-1">Special Blocks</div>
                {(() => {
                   const template = contentLibraryTemplate;
                   const IconComponent = iconMap[template.icon] || Layout;
                   
                   let isDisabled = false;
                   let tooltipMessage = template.description;
       
                   if (isContentLibraryPresent) {
                      isDisabled = true;
                      tooltipMessage = "Content Library takes up the entire page.";
                   } else if (hasBlocks && (template.type as string) === 'contentLibrary') {
                      isDisabled = true;
                      tooltipMessage = "This block requires an empty page. Please remove other blocks first.";
                   }

                   return (
                    <Tooltip
                      content={
                        <>
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent size={18} />
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            {isDisabled ? <span className="text-red-400 font-semibold">{tooltipMessage}</span> : tooltipMessage}
                          </p>
                        </>
                      }
                    >
                      <button
                        onClick={() => !isDisabled && handleBlockInsert(template.type)}
                        disabled={isDisabled}
                        className={`w-full flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg transition-all duration-200 group ${
                            isDisabled 
                            ? 'opacity-50 cursor-not-allowed bg-none bg-gray-50 border-gray-200' 
                            : 'hover:border-blue-400 hover:shadow-md'
                        }`}
                      >
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                          <IconComponent size={20} />
                        </div>
                        <div className="text-left">
                          <span className={`block text-sm font-semibold ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                            {template.name}
                          </span>
                          <span className={`block text-xs ${isDisabled ? 'text-gray-400' : 'text-blue-600/70'}`}>
                             Full-page specialized block 
                          </span>
                        </div>
                      </button>
                    </Tooltip>
                   );
                })()}
              </div>
            )}

            {/* Regular Grid for Other Blocks */}
            <div>
               {contentLibraryTemplate && <div className="text-xs font-semibold text-gray-500 text-transform uppercase mb-2 px-1">Standard Blocks</div>}
               <div className={`grid gap-3 grid-cols-3`}>
                {regularTemplates.map((template) => {
                const IconComponent = iconMap[template.icon] || Layout;
                
                let isDisabled = false;
                let tooltipMessage = template.description;

                if (isContentLibraryPresent) {
                   isDisabled = true;
                   tooltipMessage = "Content Library takes up the entire page. Remove it to add other blocks.";
                }

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
                            {isDisabled ? <span className="text-red-400 font-semibold">{tooltipMessage}</span> : tooltipMessage}
                          </p>
                        </>
                      }
                    >
                      <button
                        onClick={() => !isDisabled && handleBlockInsert(template.type)}
                        disabled={isDisabled}
                        className={`w-full aspect-square flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg transition-all duration-200 ${
                            isDisabled 
                            ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                            : 'hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-700'}`}>
                          <IconComponent 
                            size={18} 
                          />
                        </div>
                        
                        {/* Name */}
                        <span className={`text-xs font-medium text-center leading-tight w-full px-1 whitespace-normal ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                          {template.name}
                        </span>
                      </button>
                    </Tooltip>
                  </div>
                );
                })}
              </div>
            </div>
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