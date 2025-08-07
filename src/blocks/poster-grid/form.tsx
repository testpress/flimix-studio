import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';
import type { PosterGridBlockProps, ItemShape, GridDimension } from './schema';
import type { GridGap, StyleProps, StyleValue } from '@blocks/shared/Style';

// Poster grid block editor schema - only basic properties
const posterGridEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter grid title...'
  }
];

const PosterGridForm: React.FC<BlockFormProps> = ({ block, updateProps, updateStyle }) => {
  const { props, style } = block;
  const posterGridProps = props as PosterGridBlockProps;

  // Calculate max items based on grid size
  const maxItems = (posterGridProps.columns || 3) * (posterGridProps.rows || 3);
  const currentItems = posterGridProps.items?.length || 0;
  const isAtItemLimit = currentItems >= maxItems;

  const handleStyleChange = (key: keyof StyleProps, value: StyleValue) => {
    if (updateStyle) {
      updateStyle({ [key]: value });
    }
  };

  const handleGridSizeChange = (newColumns: GridDimension, newRows: GridDimension) => {
    const newMaxItems = newColumns * newRows;
    const currentItems = posterGridProps.items || [];
    
    // Remove extra items if the new grid is smaller
    const updatedItems = currentItems.slice(0, newMaxItems);
    
    // Log if items were removed
    if (currentItems.length > newMaxItems) {
      console.log(`${currentItems.length - newMaxItems} items removed due to grid size change from ${posterGridProps.columns}×${posterGridProps.rows} to ${newColumns}×${newRows}`);
    }
    
    updateProps({
      ...posterGridProps,
      columns: newColumns,
      rows: newRows,
      items: updatedItems
    });
  };

  return (
    <div className="space-y-4">
      {/* Basic Properties */}
      <PropertiesForm
        block={block}
        fieldDefinitions={posterGridEditorFields}
        updateProps={updateProps}
      />
      
      {/* Grid Layout Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Grid Layout Settings</h3>
        
        {/* Item Limit Warning Message */}
        {isAtItemLimit && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs text-red-600">
              Maximum {maxItems} items allowed. Cannot add more items.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Grid Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Columns</label>
              <select
                value={posterGridProps.columns || 3}
                onChange={e => handleGridSizeChange(+e.target.value as GridDimension, posterGridProps.rows || 3)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Rows</label>
              <select
                value={posterGridProps.rows || 3}
                onChange={e => handleGridSizeChange(posterGridProps.columns || 3, +e.target.value as GridDimension)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>

          {/* Grid Gap */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Grid Gap</label>
            <select
              value={style?.gridGap || 'md'}
              onChange={e => handleStyleChange('gridGap', e.target.value as GridGap)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          {/* Item Shape */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Shape</label>
            <select
              value={posterGridProps.itemShape || 'rectangle-landscape'}
              onChange={e => updateProps({ ...posterGridProps, itemShape: e.target.value as ItemShape })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="rectangle-landscape">Landscape</option>
              <option value="rectangle-portrait">Portrait</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterGridForm; 