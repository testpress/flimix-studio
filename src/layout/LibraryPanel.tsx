import React from 'react';
import { Plus, Type, Layout, Square, Grid2x2, GalleryHorizontalEnd, AlignVerticalSpaceBetween, Minus, MessageSquare, Sparkles, HelpCircle, Image, Video, Columns3Cog, CreditCard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSelection } from '@context/SelectionContext';
import { useBlockInsert } from '@context/BlockInsertContext';
import { getAllBlockLibraryItems } from '@blocks/shared/Library';
import type { BlockType } from '@blocks/shared/Block';
import { useHistory } from '@context/HistoryContext';
import type { TabsBlock } from '@blocks/tabs/schema';

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
};

const LibraryPanel: React.FC = () => {
  const { selectedBlockId } = useSelection();
  const { insertBlockAfter, insertBlockAtEnd, insertBlockInsideSection, insertBlockIntoTabs } = useBlockInsert();
  const { pageSchema } = useHistory();

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

  const handleBlockInsert = (blockType: BlockType['type']) => {
    if (selectedBlockId) {
      const selectedBlock = pageSchema.blocks.find(block => block.id === selectedBlockId);
      
      if (selectedBlock?.type === 'section') {
        if (blockType === 'section' || blockType === 'tabs') {
          insertBlockAfter(blockType);
        } else {
          insertBlockInsideSection(blockType, selectedBlockId);
        }
      } else if (selectedBlock?.type === 'tabs') {
        if (blockType === 'section' || blockType === 'tabs') {
          insertBlockAfter(blockType);
        } else {
          insertBlockIntoTabs(blockType, selectedBlockId);
        }
      } else {
        if (isChildBlock(selectedBlockId)) {
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
      }
    } else {
      insertBlockAtEnd(blockType);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Block Library</h2>
        <p className="text-sm text-gray-600 mt-1">
          Click to insert blocks into your page
        </p>
      </div>

      {/* Block Templates */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allTemplates.map((template) => {
          const IconComponent = iconMap[template.icon] || Layout;
          
          return (
            <button
              key={template.type}
              onClick={() => handleBlockInsert(template.type)}
              className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700">
                  <IconComponent 
                    size={20} 
                    className={template.type === 'footer' ? 'rotate-180' : ''} 
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    <Plus 
                      size={16} 
                      className="text-gray-400 group-hover:text-blue-500 transition-colors" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
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