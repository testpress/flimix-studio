import React, { useState, useRef } from 'react';
import BaseItemForm from '@components/block-settings/BaseItemForm';
import type { NavigationItem, NavigationItemType, ItemAppearance, DropdownConfig } from './schema';
import { DROPDOWN_ITEM_LIMIT } from './schema';
import { iconNames } from '@components/Icon';
import { Plus, Trash2, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { generateUniqueId } from '@utils/id';

interface NavigationItemFormProps {
  item: NavigationItem;
  onChange: (updatedItem: NavigationItem) => void;
  title: string;
  isSubItem?: boolean;
}

// Navigation item fields
const navigationItemFields = [
  {
    key: 'label' as keyof NavigationItem,
    label: 'Label',
    type: 'text' as const,
    placeholder: 'Enter navigation label...',
    required: true,
  },
  {
    key: 'subtitle' as keyof NavigationItem,
    label: 'Subtitle',
    type: 'text' as const,
    placeholder: 'Optional subtitle...',
  },
  {
    key: 'link' as keyof NavigationItem,
    label: 'Link',
    type: 'text' as const,
    placeholder: '/path or https://example.com',
  },

  {
    key: 'badge' as keyof NavigationItem,
    label: 'Badge',
    type: 'text' as const,
    placeholder: 'e.g., "2" or "New"',
  },
];

const NavigationItemForm: React.FC<NavigationItemFormProps> = ({ 
  item, 
  onChange, 
  title,
  isSubItem = false
}) => {
  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(new Set());
  const subItemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleFieldChange = (field: keyof NavigationItem, value: string | boolean | number) => {
    onChange({
      ...item,
      [field]: value
    });
  };

  const handleTypeChange = (type: NavigationItemType) => {
    onChange({
      ...item,
      type,
      // Clear items if changing from dropdown to non-dropdown
      ...(type !== 'dropdown' && item.items ? { items: undefined } : {}),
      // Initialize items array if changing to dropdown
      ...(type === 'dropdown' && !item.items ? { items: [] } : {})
    });
  };


  const handleAppearanceChange = (key: keyof ItemAppearance, value: string | number) => {
    onChange({
      ...item,
      appearance: {
        ...item.appearance,
        [key]: value
      }
    });
  };

  const handleImageChange = (key: string, value: string) => {
    onChange({
      ...item,
      appearance: {
        ...item.appearance,
        image: {
          ...item.appearance?.image,
          [key]: value
        }
      }
    });
  };

  const handleDropdownChange = (key: keyof DropdownConfig, value: string | number) => {
    onChange({
      ...item,
      dropdown: {
        ...item.dropdown,
        [key]: value
      }
    });
  };

  // Dropdown sub-item management
  const handleAddSubItem = () => {
    const newSubItem: NavigationItem = {
      id: generateUniqueId(),
      type: 'internal',
      label: 'New Sub-Item',
      link: '/',
    };

    onChange({
      ...item,
      items: [...(item.items || []), newSubItem]
    });

    // Auto-expand the newly added sub-item
    setExpandedSubItems(prev => {
      const newSet = new Set(prev);
      newSet.add(newSubItem.id);
      return newSet;
    });

    // Scroll to the newly added item
    setTimeout(() => {
      const element = subItemRefs.current.get(newSubItem.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  };

  const handleUpdateSubItem = (subItemId: string, updatedSubItem: NavigationItem) => {
    onChange({
      ...item,
      items: item.items?.map(si => si.id === subItemId ? updatedSubItem : si)
    });
  };

  const handleRemoveSubItem = (subItemId: string) => {
    onChange({
      ...item,
      items: item.items?.filter(si => si.id !== subItemId)
    });
  };

  const handleMoveSubItemUp = (index: number) => {
    if (index === 0 || !item.items) return;
    const newItems = [...item.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onChange({
      ...item,
      items: newItems
    });
  };

  const handleMoveSubItemDown = (index: number) => {
    if (!item.items || index === item.items.length - 1) return;
    const newItems = [...item.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onChange({
      ...item,
      items: newItems
    });
  };

  const toggleSubItemExpanded = (subItemId: string) => {
    setExpandedSubItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subItemId)) {
        newSet.delete(subItemId);
      } else {
        newSet.add(subItemId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">{title}</h3>
      
      {/* Item Type */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm text-gray-700 mb-2">Navigation Item Type</label>
        <select
          value={item.type}
          onChange={(e) => handleTypeChange(e.target.value as NavigationItemType)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          <option value="internal">Internal Link</option>
          <option value="external">External Link</option>
          <option value="anchor">Anchor Link</option>
          {!isSubItem && <option value="dropdown">Dropdown Menu</option>}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {item.type === 'dropdown' 
            ? 'This item will show a dropdown menu with sub-items'
            : item.type === 'anchor'
            ? 'Link to a section on the same page (e.g., #section-id)'
            : item.type === 'external'
            ? 'Link to an external website'
            : 'Link to another page on your site'}
        </p>
      </div>



      {/* Use BaseItemForm for standard fields */}
      <BaseItemForm<NavigationItem>
        item={item}
        onChange={onChange}
        title={title}
        fields={navigationItemFields}
        onFieldChange={handleFieldChange}
      />

      {/* Visual Element Selector */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm text-gray-700 mb-2">Image or Icon</label>
        <select
          value={item.appearance?.image !== undefined ? 'image' : item.appearance?.icon ? 'icon' : 'none'}
          onChange={(e) => {
            const newType = e.target.value;
            if (newType === 'none') {
              onChange({ ...item, appearance: { ...item.appearance, icon: undefined, image: undefined } });
            } else if (newType === 'icon') {
              onChange({ ...item, appearance: { ...item.appearance, image: undefined, icon: 'Star' } });
            } else if (newType === 'image') {
              onChange({ ...item, appearance: { ...item.appearance, icon: undefined, image: { src: '' } } });
            }
          }}
          className="w-full p-2 border border-gray-300 rounded text-sm mb-3"
        >
          <option value="none">None</option>
          <option value="icon">Icon</option>
          <option value="image">Image</option>
        </select>

        {/* Icon Selection */}
        {item.appearance?.icon !== undefined && item.appearance?.image === undefined && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Select Icon</label>
            <select
              value={item.appearance.icon}
              onChange={(e) => handleAppearanceChange('icon', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select an icon...</option>
              {iconNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-700">Icon Gap (px)</label>
                <span className="text-xs text-gray-500">{item.appearance?.icon_gap || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={item.appearance?.icon_gap || 0}
                onChange={(e) => handleAppearanceChange('icon_gap', parseInt(e.target.value) || 0)}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Image Selection */}
        {item.appearance?.image !== undefined && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={item.appearance?.image?.src || ''}
                onChange={(e) => handleImageChange('src', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                value={item.appearance?.image?.alt || ''}
                onChange={(e) => handleImageChange('alt', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Image description"
              />
            </div>
          </div>
        )}
      </div>

      {/* Link Target (for external links) */}
      {item.type === 'external' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm text-gray-700 mb-2">Link Target</label>
          <select
            value={item.target || '_self'}
            onChange={(e) => handleFieldChange('target', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="_self">Same Tab</option>
            <option value="_blank">New Tab</option>
          </select>
        </div>
      )}

      {/* Dropdown Sub-Items Management */}
      {item.type === 'dropdown' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-800">Dropdown Sub-Items</h4>
              <p className="text-xs text-blue-600 mt-1">
                Current sub-items: {item.items?.length || 0}/{DROPDOWN_ITEM_LIMIT}
              </p>
            </div>
            <button
              onClick={handleAddSubItem}
              disabled={(item.items?.length || 0) >= DROPDOWN_ITEM_LIMIT}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                (item.items?.length || 0) >= DROPDOWN_ITEM_LIMIT
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Plus size={14} />
              Add Sub-Item
            </button>
          </div>

          {(item.items?.length || 0) >= DROPDOWN_ITEM_LIMIT && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-800">
                Maximum of {DROPDOWN_ITEM_LIMIT} sub-items reached. Remove some items before adding more.
              </p>
            </div>
          )}

          {/* Dropdown Layout Selector */}
          <div className="pt-2 border-t border-blue-200">
            <label className="block text-sm text-blue-800 mb-1 font-medium">Dropdown Layout</label>
            <select
              value={item.dropdown?.layout || 'list'}
              onChange={(e) => handleDropdownChange('layout', e.target.value as 'list' | 'grid-2x2')}
              className="w-full p-2 border border-blue-300 rounded text-sm bg-white"
            >
              <option value="list">List</option>
              <option value="grid-2x2">Grid 2x2</option>
            </select>
            <p className="text-xs text-blue-600 mt-1">
              {item.dropdown?.layout === 'grid-2x2' 
                ? 'Sub-items will be displayed in a 2-column grid'
                : 'Sub-items will be displayed in a vertical list'}
            </p>
          </div>

          {/* Dropdown Spacing Controls */}
          <div className="pt-2 border-t border-blue-200 space-y-3">
            {/* Padding Controls */}
            <div>
              <label className="block text-sm text-blue-800 mb-2 font-medium">Dropdown Padding (Top - Right - Bottom - Left)</label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.dropdown?.padding_top || 0}
                  onChange={(e) => handleDropdownChange('padding_top', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="T"
                  title="Top Padding"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.dropdown?.padding_right || 0}
                  onChange={(e) => handleDropdownChange('padding_right', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="R"
                  title="Right Padding"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.dropdown?.padding_bottom || 0}
                  onChange={(e) => handleDropdownChange('padding_bottom', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="B"
                  title="Bottom Padding"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.dropdown?.padding_left || 0}
                  onChange={(e) => handleDropdownChange('padding_left', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="L"
                  title="Left Padding"
                />
              </div>
            </div>

            {/* Margin Controls */}
            <div>
              <label className="block text-sm text-blue-800 mb-2 font-medium">Item Margin (Top - Right - Bottom - Left)</label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={item.dropdown?.item_margin_top || 0}
                  onChange={(e) => handleDropdownChange('item_margin_top', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="T"
                  title="Top Margin"
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={item.dropdown?.item_margin_right || 0}
                  onChange={(e) => handleDropdownChange('item_margin_right', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="R"
                  title="Right Margin"
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={item.dropdown?.item_margin_bottom || 0}
                  onChange={(e) => handleDropdownChange('item_margin_bottom', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="B"
                  title="Bottom Margin"
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={item.dropdown?.item_margin_left || 0}
                  onChange={(e) => handleDropdownChange('item_margin_left', parseInt(e.target.value) || 0)}
                  className="p-1 px-2 border border-blue-300 rounded text-sm text-center"
                  placeholder="L"
                  title="Left Margin"
                />
              </div>
            </div>
          </div>

          {/* List of Sub-Items */}
          {item.items && item.items.length > 0 && (
            <div className="space-y-2 mt-3">
              {item.items.map((subItem, index) => {
                const isExpanded = expandedSubItems.has(subItem.id);
                return (
                  <div 
                    key={subItem.id} 
                    className="bg-white border border-blue-200 rounded-lg overflow-hidden"
                    ref={(el) => {
                      if (el) {
                        subItemRefs.current.set(subItem.id, el);
                      } else {
                        subItemRefs.current.delete(subItem.id);
                      }
                    }}
                  >
                    {/* Sub-Item Header */}
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          onClick={() => toggleSubItemExpanded(subItem.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                          {subItem.label || `Sub-Item ${index + 1}`}
                        </span>
                        <span className="text-xs text-gray-500">({subItem.type})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveSubItemUp(index)}
                          disabled={index === 0}
                          className={`p-1 ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveSubItemDown(index)}
                          disabled={index === item.items!.length - 1}
                          className={`p-1 ${index === item.items!.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoveSubItem(subItem.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove sub-item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Sub-Item Form (Expanded) */}
                    {isExpanded && (
                      <div className="p-3 border-t border-gray-200">
                        <NavigationItemForm
                          item={subItem}
                          onChange={(updatedSubItem) => handleUpdateSubItem(subItem.id, updatedSubItem)}
                          title={`Sub-Item ${index + 1}`}
                          isSubItem={true}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {(!item.items || item.items.length === 0) && (
            <p className="text-sm text-blue-700 text-center py-4">
              No sub-items yet. Click "Add Sub-Item" to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationItemForm;
