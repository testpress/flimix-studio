import React from 'react';
import type { Block } from '../../schema/blockTypes';
import type { EditorField } from './schemas';
import { getNestedValue, updateBlockProps } from './utils';

interface DynamicPropsEditorProps {
  block: Block;
  schema: EditorField[];
  updateProps: (newProps: Partial<any>) => void;
}

const DynamicPropsEditor: React.FC<DynamicPropsEditorProps> = ({ 
  block, 
  schema, 
  updateProps 
}) => {
  const handleFieldChange = (path: string, value: any) => {
    const currentProps = block.props || {};
    const updatedProps = updateBlockProps(currentProps, path, value);
    updateProps(updatedProps);
  };

  const renderField = (field: EditorField) => {
    const value = getNestedValue(block.props, field.key, '');
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required={field.required}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-none"
            required={field.required}
          />
        );
        
      case 'image':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        );
        
      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full h-10 border border-gray-300 rounded text-sm"
          />
        );
        
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleFieldChange(field.key, e.target.checked)}
            className="rounded"
          />
        );
        
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        );
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
      <div className="space-y-3">
        {schema.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicPropsEditor; 