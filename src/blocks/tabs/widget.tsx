import React, { useState, useCallback, useMemo, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { TabsBlock } from './schema';
import BlockRenderer from '@renderer/BlockRenderer';
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
  const { activeTabId, setActiveTabId } = useSelection();
  
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
  const boxShadowClass = style?.boxShadow === 'lg' ? 'shadow-lg' : 
                        style?.boxShadow === 'md' ? 'shadow-md' : 
                        style?.boxShadow === 'sm' ? 'shadow-sm' : '';
  
  // State for currently selected tab - use activeTabId from context if available, otherwise use first tab
  const [selectedTab, setSelectedTab] = useState(() => activeTabId || tabs[0]?.id);
  
  // Update activeTabId in context when tab changes
  useEffect(() => {
    if (selectedTab && selectedTab !== activeTabId) {
      setActiveTabId(selectedTab);
    }
  }, [selectedTab, activeTabId, setActiveTabId]);
  
  // Initialize activeTabId if not set
  useEffect(() => {
    if (!activeTabId && tabs[0]?.id) {
      setActiveTabId(tabs[0].id);
      setSelectedTab(tabs[0].id);
    }
  }, [activeTabId, tabs, setActiveTabId]);
  
  // Handle case when selected tab is deleted - fallback to first available tab
  useEffect(() => {
    // If the selected tab no longer exists in the tabs list (e.g., it was deleted),
    // reset the selection to the first available tab.
    if (selectedTab && !tabs.some(tab => tab.id === selectedTab)) {
      const newSelectedTab = tabs[0]?.id;
      if (newSelectedTab) {
        setSelectedTab(newSelectedTab);
        // Also update the global context if it was pointing to the deleted tab
        if (activeTabId === selectedTab) {
          setActiveTabId(newSelectedTab);
        }
      }
    }
  }, [tabs, selectedTab, activeTabId, setActiveTabId]);
  
  // Memoize the current tab to prevent unnecessary recalculations
  const currentTab = useMemo(() => tabs.find(tab => tab.id === selectedTab), [tabs, selectedTab]);
  
  const handleTabChange = useCallback((tabId: string) => {
    if (tabId !== selectedTab) {
      setSelectedTab(tabId);
    }
  }, [selectedTab]);

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
    <div className={`flex ${tabAlignmentClass} border-b border-gray-200`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`${getTabStyleClass(selectedTab === tab.id)} text-center`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ), [tabs, selectedTab, handleTabChange, getTabStyleClass, tabAlignmentClass]);

  // Memoize the tab content section to prevent re-rendering
  const tabContent = useMemo(() => {
    if (!currentTab) {
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-center">No tab selected</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Render children blocks for the selected tab - exactly like section block */}
        {currentTab.children && currentTab.children.length > 0 ? (
          currentTab.children.map((childBlock) => (
            <div key={childBlock.id}>
              <BlockInsertDropdown 
                position="above" 
                blockId={childBlock.id} 
                visibilityContext={visibilityContext} 
              />
              <BlockRenderer 
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
          <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-center">No content in this tab</p>
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
        className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${boxShadowClass} border-2 border-dashed border-gray-300 bg-gray-50`}
        style={{
          backgroundColor: style?.backgroundColor,
          maxWidth: style?.maxWidth,
        }}
      >
        <p className="text-gray-500 text-center">No tabs configured</p>
      </BaseWidget>
    );
  }

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
      className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${boxShadowClass} bg-white border border-gray-200`}
      style={{
        backgroundColor: style?.backgroundColor,
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
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(TabsWidget); 