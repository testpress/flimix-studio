import React from 'react';
import PropertiesForm from '@components/block-settings/PropertiesForm';
import type { BlockFormProps } from '@type/form';
import type { Field } from '@type/field';
import { NAVIGATION_ITEM_LIMIT } from './schema';
import type { NavigationContainerProps, NavigationItem, HoverConfig, NavigationColors } from './schema';
import { AlertCircle } from 'lucide-react';
import { generateUniqueId } from '@utils/id';
import { useSelection } from '@context/SelectionContext';

// Navigation container block editor schema
const navigationContainerEditorFields: Field[] = [
  {
    key: 'alignment',
    label: 'Navigation Alignment',
    type: 'select',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
  },
  {
    key: 'font_size',
    label: 'Font Size',
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
  },
  {
    key: 'icon_size',
    label: 'Icon Size',
    type: 'select',
    options: [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
  },
  {
    key: 'item_gap',
    label: 'Item Spacing (px)',
    type: 'range',
    min: 0,
    max: 100,
  },
  {
    key: 'hide_icons',
    label: 'Hide Icons',
    type: 'boolean',
  },
];

const NavigationContainerForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  // Get current item count with proper typing
  const currentProps = block.props as NavigationContainerProps;
  const itemCount = currentProps?.items?.length || 0;
  const isAtLimit = itemCount >= NAVIGATION_ITEM_LIMIT;
  const { selectBlockItem } = useSelection();

  // Handle adding a new navigation item
  const handleAddItem = () => {
    const newItem: NavigationItem = {
      id: generateUniqueId(),
      type: 'internal',
      label: 'New Item',
      link: '/',
    };

    updateProps({
      ...currentProps,
      items: [...(currentProps.items || []), newItem],
    });

    // Auto-select the newly added item
    setTimeout(() => {
      selectBlockItem(block.id, newItem.id);
    }, 0);
  };


  const handleHoverChange = (key: keyof HoverConfig, value: string | boolean) => {
    updateProps({
      ...currentProps,
      hover: {
        ...currentProps.hover,
        [key]: value
      }
    });
  };

  const handleColorChange = (key: keyof NavigationColors, value: string) => {
    updateProps({
      ...currentProps,
      colors: {
        ...currentProps.colors,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Navigation Item Section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-3">Navigation Items</h3>
        
        {/* Item Count and Limit Warning */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Items: {itemCount}/{NAVIGATION_ITEM_LIMIT}
              </span>
            </div>
            {isAtLimit && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">Limit Reached</span>
              </div>
            )}
          </div>
        </div>

        {/* Add Item Button */}
        <button
          onClick={handleAddItem}
          disabled={isAtLimit}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isAtLimit
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          + Add Navigation Item ({itemCount}/{NAVIGATION_ITEM_LIMIT})
        </button>

        {isAtLimit && (
          <p className="text-xs text-yellow-700 mt-2">
            Maximum of {NAVIGATION_ITEM_LIMIT} items allowed. Remove some items before adding more.
          </p>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Click on a navigation item in the preview to edit its details in the settings panel.
        </p>
      </div>

      {/* Properties Form for block properties */}
      <PropertiesForm
        block={block}
        updateProps={updateProps}
        fieldDefinitions={navigationContainerEditorFields}
      />

      {/* Hover Settings & Colors */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        
        <h3 className="font-medium text-gray-700">Navigation Item Colors</h3>
        
        {/* Item Colors Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={currentProps.colors?.item_text || '#ffffff'}
                onChange={(e) => handleColorChange('item_text', e.target.value)}
                className="flex-1 h-10 border border-gray-300 rounded text-sm cursor-pointer"
              />
              <button
                onClick={() => handleColorChange('item_text', '')}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                title="Clear color"
              >
                Clear
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Background</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={currentProps.colors?.item_background || '#000000'}
                onChange={(e) => handleColorChange('item_background', e.target.value)}
                className="flex-1 h-10 border border-gray-300 rounded text-sm cursor-pointer"
              />
              <button
                onClick={() => handleColorChange('item_background', '')}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                title="Clear color"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Disable Hover Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="disableHover"
            checked={currentProps.hover?.disabled || false}
            onChange={(e) => handleHoverChange('disabled', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <label htmlFor="disableHover" className="ml-2 block text-sm text-gray-700">
            Disable Hover
          </label>
        </div>

        {/* Hover Options - Hide if Disabled */}
        {!currentProps.hover?.disabled && (
          <div className="space-y-4">
             <div className="pt-2 border-t border-gray-200">
              <label className="block text-sm text-gray-700 mb-1">Hover Effect</label>
              <select
                value={currentProps.hover?.effect || 'none'}
                onChange={(e) => handleHoverChange('effect', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="scale">Scale</option>
                <option value="color">Color</option>
              </select>
            </div>



            {/* Hover Colors Grid - Only if Hover Effect is 'Color' */}
            {currentProps.hover?.effect === 'color' && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Hover Text</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentProps.colors?.hover_text || '#ffffff'}
                      onChange={(e) => handleColorChange('hover_text', e.target.value)}
                      className="flex-1 h-10 border border-gray-300 rounded text-sm cursor-pointer"
                    />
                    <button
                      onClick={() => handleColorChange('hover_text', '')}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                      title="Clear color"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Hover Bg</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentProps.colors?.hover_background || '#000000'}
                      onChange={(e) => handleColorChange('hover_background', e.target.value)}
                      className="flex-1 h-10 border border-gray-300 rounded text-sm cursor-pointer"
                    />
                    <button
                      onClick={() => handleColorChange('hover_background', '')}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                      title="Clear color"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Dropdown Colors Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Dropdown Text</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentProps.colors?.dropdown_text || '#ffffff'}
                    onChange={(e) => handleColorChange('dropdown_text', e.target.value)}
                    className="flex-1 h-10 border border-gray-300 rounded text-sm cursor-pointer"
                  />
                  <button
                    onClick={() => handleColorChange('dropdown_text', '')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                    title="Clear color"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Dropdown Bg</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentProps.colors?.dropdown_background || '#1a1a1a'}
                    onChange={(e) => handleColorChange('dropdown_background', e.target.value)}
                    className="flex-1 h-10 border border-gray-300 rounded text-sm cursor-pointer"
                  />
                  <button
                    onClick={() => handleColorChange('dropdown_background', '')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                    title="Clear color"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        

      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">How to use</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Click "+ Add Navigation Item" to add new items</li>
              <li>• Click on any item in the preview to edit its details</li>
              <li>• Hover over items to see move and delete controls</li>
              <li>• Use dropdown type for nested menus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationContainerForm;
