import React, { useCallback, useMemo, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { TabsBlock } from './schema';
import BlockManager from '@domain/BlockManager';
import BlockInsertDropdown from '@layout/BlockInsertDropdown';
import type { VisibilityContext } from '@blocks/shared/Visibility';
import type { Block } from '@blocks/shared/Block';
import { useSelection } from '@context/SelectionContext';

interface TabsWidgetProps extends Omit<BaseWidgetProps<TabsBlock>, 'block'> {
  block: TabsBlock;
  visibilityContext: VisibilityContext;
  showDebug?: boolean;
  selectedBlockId?: string | null;
  onSelect?: (block: Block) => void;
}

const TabsWidget: React.FC<TabsWidgetProps> = ({ 
  block, 
  visibilityContext, 
  showDebug = false, 
  onSelect, 
  isSelected = false,
  selectedBlockId,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove
}) => {
  const { props, style } = block;
  const { tabs } = props;
  const { activeTabId, setActiveTabId, setSelectedItemId, setSelectedItemBlockId, selectedBlockId: contextSelectedBlockId, setSelectedBlockId, setSelectedBlock } = useSelection();
  
  // Convert style properties to Tailwind classes
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  const marginClass = style?.margin === 'lg' ? 'm-8' : 
                     style?.margin === 'md' ? 'm-6' : 
                     style?.margin === 'sm' ? 'm-4' : 'm-0';
  const borderRadiusClass = style?.borderRadius === 'lg' ? 'rounded-lg' : 
                           style?.borderRadius === 'md' ? 'rounded-md' : 
                           style?.borderRadius === 'sm' ? 'rounded-sm' : '';
  // Handle background color - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;
  
  // Handle box shadow - custom CSS values for better visibility
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg': return '0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.2)';
      case 'md': return '0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -2px rgba(255, 255, 255, 0.2)';
      case 'sm': return '0 4px 6px -1px rgba(255, 255, 255, 0.3), 0 2px 4px -1px rgba(255, 255, 255, 0.2)';
      default: return undefined;
    }
  };
  const boxShadowStyle = getBoxShadowStyle(style?.boxShadow);
  
  // Initialize activeTabId if not set
  useEffect(() => {
    if (!activeTabId && tabs[0]?.id) {
      setActiveTabId(tabs[0].id);
    }
  }, [activeTabId, tabs, setActiveTabId]);
  
  useEffect(() => {
    if (activeTabId && !tabs.some(tab => tab.id === activeTabId)) {
      const newActiveTabId = tabs[0]?.id;
      if (newActiveTabId) {
        setActiveTabId(newActiveTabId);
      }
    }
  }, [tabs, activeTabId, setActiveTabId]);
  
  // Memoize the current tab to prevent unnecessary recalculations
  const currentTab = useMemo(() => tabs.find(tab => tab.id === activeTabId), [tabs, activeTabId]);
  
  // Helper function to check if a block is a child of this tabs block
  const isChildOfThisTabsBlock = useCallback((blockId: string): boolean => {
    for (const tab of tabs) {
      if (tab.children) {
        for (const child of tab.children) {
          if (child.id === blockId) {
            return true;
          }
        }
      }
    }
    return false;
  }, [tabs]);
  
  const handleTabChange = useCallback((tabId: string) => {
    if (tabId !== activeTabId) {
      setActiveTabId(tabId);
      if (contextSelectedBlockId && isChildOfThisTabsBlock(contextSelectedBlockId)) {
        setSelectedBlockId(null);
        setSelectedBlock(null);
      }
      setSelectedItemId(null);
      setSelectedItemBlockId(null);
    }
  }, [activeTabId, setActiveTabId, contextSelectedBlockId, isChildOfThisTabsBlock, setSelectedBlockId, setSelectedBlock, setSelectedItemId, setSelectedItemBlockId]);

  const handleSelect = useCallback((tabsBlock: TabsBlock) => {
    onSelect?.(tabsBlock as Block);
  }, [onSelect]);

  // Memoize tab alignment class
  const tabAlignmentClass = useMemo(() => {
    switch (style?.tabAlignment) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      case 'center': return 'justify-center';
      default: return 'justify-center';
    }
  }, [style?.tabAlignment]);

  // Memoize tab style class function
  const getTabStyleClass = useCallback((isActive: boolean) => {
    const baseClass = 'px-4 py-2 rounded transition-all duration-200 font-medium';
    const activeClass = 'bg-blue-600 text-white shadow-md';
    const inactiveClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    
    switch (style?.tabStyle) {
      case 'pill':
        return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
      case 'boxed':
        return `${baseClass} border ${isActive ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`;
      case 'underline':
        return `${baseClass} border-b-2 ${isActive ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-700 hover:text-gray-900'}`;
      default:
        return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
    }
  }, [style?.tabStyle]);

  // Memoize the tab navigation section to prevent re-rendering
  const tabNavigation = useMemo(() => (
    <div className={`flex ${tabAlignmentClass} gap-2`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={(e) => {
            e.stopPropagation(); // Prevent block selection when clicking tabs
            handleTabChange(tab.id);
          }}
          className={`${getTabStyleClass(activeTabId === tab.id)} text-center`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ), [tabs, activeTabId, handleTabChange, getTabStyleClass, tabAlignmentClass]);

  // Memoize the tab content section to prevent re-rendering
  const tabContent = useMemo(() => {
    if (!currentTab) {
      return (
        <div className="p-4 border-2 border-dashed border-gray-600 bg-gray-800 rounded-lg">
          <p className="text-gray-300 text-center">No tab selected</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Render children blocks for the selected tab - exactly like section block */}
        {currentTab.children && currentTab.children.length > 0 ? (
          currentTab.children.map((childBlock) => (
            <div key={childBlock.id} data-block-id={childBlock.id}>
              <BlockInsertDropdown 
                position="above" 
                blockId={childBlock.id} 
                visibilityContext={visibilityContext} 
              />
              <BlockManager 
                block={childBlock} 
                visibilityContext={visibilityContext} 
                showDebug={showDebug}
                onSelect={onSelect}
                selectedBlockId={selectedBlockId}
                isSelected={selectedBlockId === childBlock.id}
              />
              <BlockInsertDropdown 
                position="below" 
                blockId={childBlock.id} 
                visibilityContext={visibilityContext} 
              />
            </div>
          ))
        ) : (
          <div className="p-4 border-2 border-dashed border-gray-600 bg-black rounded-lg">
            <p className="text-gray-300 text-center">No content in this tab</p>
            <p className="text-xs text-gray-400 text-center mt-1">Add blocks to populate this tab</p>
          </div>
        )}
      </div>
    );
  }, [currentTab, visibilityContext, showDebug, onSelect, selectedBlockId]);

  if (!tabs || tabs.length === 0) {
    return (
      <BaseWidget 
        block={block} 
        onSelect={handleSelect}
        isSelected={isSelected}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        className={`${paddingClass} ${marginClass} ${borderRadiusClass} border-2 border-dashed border-gray-300 ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
          maxWidth: style?.maxWidth,
        }}
      >
        <p className="text-gray-500 text-center">No tabs configured</p>
      </BaseWidget>
    );
  }

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
      <BaseWidget 
        block={block} 
        onSelect={handleSelect}
        isSelected={isSelected}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
          maxWidth: style?.maxWidth,
        }}
      >
        <div className="flex flex-col">
          {/* Tab Navigation */}
          {tabNavigation}

          {/* Tab Content */}
          <div className="flex-1 mt-4">
            {tabContent}
          </div>
        </div>
      </BaseWidget>
    </div>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(TabsWidget); 