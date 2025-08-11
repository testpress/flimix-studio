import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';
import type { FeatureCalloutBlockProps, ItemSize } from './schema';
import { FEATURE_CALLOUT_ITEM_LIMIT } from './schema';
import { AlertCircle } from 'lucide-react';

// Feature callout block editor schema - only basic properties
const featureCalloutEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter feature callout title...'
  },
  { 
    key: 'subtitle', 
    label: 'Subtitle', 
    type: 'text',
    placeholder: 'Enter subtitle...'
  }
];

const FeatureCalloutForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const { props } = block;
  const featureCalloutProps = props as FeatureCalloutBlockProps;
  const itemCount = featureCalloutProps.items?.length || 0;
  const isAtLimit = itemCount >= FEATURE_CALLOUT_ITEM_LIMIT;
  
  return (
    <div className="space-y-4">
      {/* Basic Properties */}
      <PropertiesForm
        block={block}
        fieldDefinitions={featureCalloutEditorFields}
        updateProps={updateProps}
      />
      
      {/* Item Count and Limit Warning */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">
              Items: {itemCount}/{FEATURE_CALLOUT_ITEM_LIMIT}
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
            Maximum of {FEATURE_CALLOUT_ITEM_LIMIT} items allowed. Remove some items before adding more.
          </p>
        )}
      </div>
      
      {/* Layout Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Layout Settings</h3>
        
        <div className="space-y-4">
          {/* Item Size */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Size</label>
            <select
              value={featureCalloutProps.itemSize || 'medium'}
              onChange={(e) => updateProps({ ...featureCalloutProps, itemSize: e.target.value as ItemSize })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Display Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={featureCalloutProps.showIcons !== false}
                onChange={(e) => updateProps({ ...featureCalloutProps, showIcons: e.target.checked })}
                className="rounded"
              />
              <span>Show Icons</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={featureCalloutProps.showDescriptions !== false}
                onChange={(e) => updateProps({ ...featureCalloutProps, showDescriptions: e.target.checked })}
                className="rounded"
              />
              <span>Show Descriptions</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCalloutForm; 