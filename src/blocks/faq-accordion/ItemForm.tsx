import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { FAQAccordionItem } from './schema';

interface FAQAccordionItemFormProps {
  item: FAQAccordionItem;
  onChange: (updatedItem: FAQAccordionItem) => void;
  title: string;
}

// Move fields array outside the component to prevent recreation on every render
const faqAccordionItemFields = [
  {
    key: 'question' as keyof FAQAccordionItem,
    label: 'Question',
    type: 'textarea' as const,
    placeholder: 'Enter your question...',
    required: true,
    maxLength: 200,
  },
  {
    key: 'answer' as keyof FAQAccordionItem,
    label: 'Answer',
    type: 'textarea' as const,
    placeholder: 'Enter the answer to your question...',
    required: true,
    maxLength: 500,
  }
];

const FAQAccordionItemForm: React.FC<FAQAccordionItemFormProps> = ({ 
  item, 
  onChange, 
  title
}) => {
  const handleFieldChange = (field: keyof FAQAccordionItem, value: string) => {
    onChange({
      ...item,
      [field]: value
    });
  };

  // Handle style changes
  const handleStyleChange = (key: keyof NonNullable<FAQAccordionItem['style']>, value: string) => {
    const currentStyle = item.style || {};
    const newStyle = { ...currentStyle, [key]: value };
    onChange({ ...item, style: newStyle });
  };

  // Style control configurations to reduce repetitive code
  const styleControls = [
    {
      key: 'fontWeight' as const,
      label: 'Font Weight',
      type: 'select' as const,
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Bold' }
      ],
      defaultValue: 'normal'
    },
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
      defaultValue: 'md'
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
      <h3 className="font-medium text-gray-700">{title}</h3>
      
      {/* Use BaseItemForm for standard fields */}
      <BaseItemForm<FAQAccordionItem>
        item={item}
        onChange={onChange}
        title={title}
        fields={faqAccordionItemFields}
        onFieldChange={handleFieldChange}
      />

      {/* Item Styling */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Item Styling</h4>
        
        {/* Style Controls */}
        <div className="space-y-4">
          {/* Color Controls */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Text Color</label>
            <input
              type="color"
              value={item.style?.textColor || '#000000'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={item.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
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

export default FAQAccordionItemForm; 