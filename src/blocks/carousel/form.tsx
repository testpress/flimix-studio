import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';
import type { CarouselBlockProps, ItemShape, ItemSize } from './schema';
import { CAROUSEL_ITEM_LIMIT } from './schema';
import type { GridGap, StyleProps, StyleValue } from '@blocks/shared/Style';
import { AlertCircle } from 'lucide-react';

// Carousel block editor schema - only basic properties
const carouselEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Carousel Title', 
    type: 'text',
    placeholder: 'Enter carousel title (e.g., "Trending Now", "Featured Content")...'
  }
];

const CarouselForm: React.FC<BlockFormProps> = ({ block, updateProps, updateStyle }) => {
  const { props, style } = block;
  const carouselProps = props as CarouselBlockProps;
  const itemCount = carouselProps.items?.length || 0;
  const isAtLimit = itemCount >= CAROUSEL_ITEM_LIMIT;

  const handleStyleChange = (key: keyof StyleProps, value: StyleValue) => {
    if (updateStyle) {
      updateStyle({ [key]: value });
    }
  };

  return (
    <div className="space-y-4">
      {/* Basic Properties */}
      <PropertiesForm
        block={block}
        fieldDefinitions={carouselEditorFields}
        updateProps={updateProps}
      />
      
      {/* Carousel Layout Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Carousel Layout Settings</h3>
        
        {/* Item Count and Limit Warning */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Items: {itemCount}/{CAROUSEL_ITEM_LIMIT}
              </span>
            </div>
            {isAtLimit && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">Limit Reached</span>
              </div>
            )}
          </div>
          {isAtLimit && (
            <p className="text-xs text-yellow-700 mt-1">
              Maximum of {CAROUSEL_ITEM_LIMIT} items allowed. Remove some items before adding more.
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Item Size */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Size</label>
            <select
              value={carouselProps.itemSize || 'large'}
              onChange={e => updateProps({ ...carouselProps, itemSize: e.target.value as ItemSize })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>

          {/* Carousel Gap */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Gap</label>
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
              value={carouselProps.itemShape || 'rectangle-landscape'}
              onChange={e => updateProps({ ...carouselProps, itemShape: e.target.value as ItemShape })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="rectangle-landscape">Landscape</option>
              <option value="rectangle-portrait">Portrait</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          {/* Show Navigation Arrows */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Navigation</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showArrows"
                checked={carouselProps.showArrows !== false}
                onChange={e => updateProps({ ...carouselProps, showArrows: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="showArrows" className="text-sm text-gray-700">
                Show Navigation Arrows
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Display left/right arrow buttons for carousel navigation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselForm; 