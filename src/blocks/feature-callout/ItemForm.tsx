import React from 'react';
import BaseItemForm from '@components/block-settings/BaseItemForm';
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
  const handleStyleChange = (key: keyof NonNullable<FeatureCalloutItem['style']>, value: string) => {
    const currentStyle = item.style || {};
    const newStyle = { ...currentStyle, [key]: value };
    onChange({ ...item, style: newStyle });
  };

  // Style control configurations to reduce repetitive code
  const styleControls = [
    {
      key: 'padding' as const,
      label: 'Padding',
      type: 'select' as const,
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' }
      ],
      defaultValue: 'md'
    },
    {
      key: 'margin' as const,
      label: 'Margin',
      type: 'select' as const,
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' }
      ],
      defaultValue: 'sm'
    },
    {
      key: 'borderRadius' as const,
      label: 'Border Radius',
      type: 'select' as const,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' }
      ],
      defaultValue: 'md'
    },
    {
      key: 'boxShadow' as const,
      label: 'Box Shadow',
      type: 'select' as const,
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' }
      ],
      defaultValue: 'md'
    }
  ];

  // Render style control based on type
  const renderStyleControl = (control: typeof styleControls[0]) => {
    const currentValue = item.style?.[control.key] || control.defaultValue;
    
    return (
      <div key={control.key}>
        <label className="block text-sm text-gray-700 mb-1">{control.label}</label>
        <select
          value={currentValue}
          onChange={(e) => handleStyleChange(control.key, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {control.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
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
        
        {/* Style Controls */}
        <div className="space-y-4">
          {/* Color Controls */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={item.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Text Color</label>
            <input
              type="color"
              value={item.style?.textColor || '#000000'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Data-driven Style Controls */}
          {styleControls.map(renderStyleControl)}
        </div>
      </div>
    </div>
  );
};

export default FeatureCalloutItemForm; 