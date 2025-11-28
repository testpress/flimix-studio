import React, { useState } from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { TabsBlock, Tab } from './schema';
import { TABS_ITEM_LIMIT } from './schema';
import { generateUniqueId } from '@utils/id';
import { Plus, Trash2, Edit3 } from 'lucide-react';

const TabsForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const [editingTab, setEditingTab] = useState<Tab | null>(null);

  // Type guard to ensure we have a TabsBlock
  if (block.type !== 'tabs') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Invalid block type for TabsForm</p>
      </div>
    );
  }

  const tabsBlock = block as TabsBlock;

  const handleAddTab = () => {
    // Check if we're at the limit
    if ((tabsBlock.props.tabs?.length || 0) >= TABS_ITEM_LIMIT) {
      console.log(`Maximum ${TABS_ITEM_LIMIT} tabs allowed. Cannot add more.`);
      return;
    }

    const newTab: Tab = {
      id: generateUniqueId(),
      label: 'New Tab',
      children: []
    };

    const updatedTabs = [...(tabsBlock.props.tabs || []), newTab];
    updateProps({ tabs: updatedTabs });
  };

  const handleDeleteTab = (tabId: string) => {
    const updatedTabs = tabsBlock.props.tabs.filter(tab => tab.id !== tabId);
    updateProps({ tabs: updatedTabs });

    // If we're editing the deleted tab, clear the edit state
    if (editingTab?.id === tabId) {
      setEditingTab(null);
    }
  };

  const handleEditTab = (tab: Tab) => {
    setEditingTab({ ...tab });
  };

  const handleSaveTab = () => {
    if (!editingTab?.id || !editingTab?.label) return;

    const updatedTabs = tabsBlock.props.tabs.map(tab =>
      tab.id === editingTab.id
        ? { ...tab, label: editingTab.label }
        : tab
    );

    updateProps({ tabs: updatedTabs });
    setEditingTab(null);
  };

  const handleCancelEdit = () => {
    setEditingTab(null);
  };

  const handleTabLabelChange = (value: string) => {
    if (editingTab) {
      setEditingTab({ ...editingTab, label: value });
    }
  };

  return (
    <div className="space-y-6">

      {/* Tab Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Tabs</h3>
            <p className="text-sm text-gray-500">
              {(tabsBlock.props.tabs?.length || 0)}/{TABS_ITEM_LIMIT} tabs
            </p>
          </div>
          <button
            onClick={handleAddTab}
            disabled={(tabsBlock.props.tabs?.length || 0) >= TABS_ITEM_LIMIT}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tab
          </button>
        </div>

        {/* Show warning when at limit */}
        {(tabsBlock.props.tabs?.length || 0) >= TABS_ITEM_LIMIT && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Maximum of {TABS_ITEM_LIMIT} tabs allowed. Remove some tabs before adding more.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {tabsBlock.props.tabs?.map((tab) => (
            <div key={tab.id} className="border border-gray-200 rounded-lg p-4">
              {editingTab?.id === tab.id ? (
                // Edit mode
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tab Label
                    </label>
                    <input
                      type="text"
                      value={editingTab.label || ''}
                      onChange={(e) => handleTabLabelChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="Enter tab label"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveTab}
                      disabled={!editingTab.label}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{tab.label}</h4>
                    <p className="text-sm text-gray-500">ID: {tab.id}</p>
                    <p className="text-sm text-gray-500">
                      {tab.children?.length || 0} content blocks
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTab(tab)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit tab"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTab(tab.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="Delete tab"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!tabsBlock.props.tabs || tabsBlock.props.tabs.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No tabs configured</p>
              <p className="text-sm">Click "Add Tab" to create your first tab (max {TABS_ITEM_LIMIT} tabs)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabsForm; 