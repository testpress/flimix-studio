import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { FeatureCalloutItem } from './schema';
import { FEATURE_ICONS } from './schema';

interface FeatureCalloutItemFormProps {
  item: FeatureCalloutItem;
  onChange: (updatedItem: FeatureCalloutItem) => void;
  title: string;
}

const FeatureCalloutItemForm: React.FC<FeatureCalloutItemFormProps> = ({ 
  item, 
  onChange, 
  title
}) => {
  const fields = [
    {
      key: 'icon' as keyof FeatureCalloutItem,
      label: 'Icon',
      type: 'select' as const,
      placeholder: 'Select an icon...',
      required: false,
      options: FEATURE_ICONS.map(iconName => ({
        value: iconName,
        label: iconName
      }))
    },
    {
      key: 'label' as keyof FeatureCalloutItem,
      label: 'Feature Label',
      type: 'text' as const,
      placeholder: 'Enter feature label...',
      required: true
    },
    {
      key: 'description' as keyof FeatureCalloutItem,
      label: 'Description (optional)',
      type: 'textarea' as const,
      placeholder: 'Enter feature description...',
      required: false,
      maxLength: 150
    }
  ];

  // Handle style changes
  const handleStyleChange = (key: string, value: string) => {
    const currentStyle = item.style || {};
    const newStyle = { ...currentStyle, [key]: value };
    onChange({ ...item, style: newStyle });
  };

  return (
    <div className="space-y-4">
      <BaseItemForm<FeatureCalloutItem>
        item={item}
        onChange={onChange}
        title={title}
        fields={fields}
      />
      
      {/* Item Styling */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Item Styling</h4>
        
        <div className="space-y-4">
          {/* Background Color */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={item.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Text Color</label>
            <input
              type="color"
              value={item.style?.textColor || '#000000'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Padding */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Padding</label>
            <select
              value={item.style?.padding || 'md'}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          {/* Margin */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Margin</label>
            <select
              value={item.style?.margin || 'sm'}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Border Radius</label>
            <select
              value={item.style?.borderRadius || 'md'}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          {/* Box Shadow */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Box Shadow</label>
            <select
              value={item.style?.boxShadow || 'md'}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCalloutItemForm; 