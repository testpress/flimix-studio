import React from 'react';
import type { Block } from '@blocks/shared/Block';
import type { Field } from '@blocks/shared/Field';
import { getFormFieldValue, updateFormField } from '@domain/blocks/dynamicFormAccess';

interface DynamicPropsFormProps {
  block: Block;
  fieldDefinitions: Field[];
  updateProps: (newProps: Partial<any>) => void;
}

const DynamicPropsForm: React.FC<DynamicPropsFormProps> = ({ 
  block, 
  fieldDefinitions, 
  updateProps 
}) => {
  const handleFieldChange = (path: string, value: any) => {
    const currentProps = block.props || {};
    const updatedProps = updateFormField(currentProps, path, value);
    updateProps(updatedProps);
  };

  const renderField = (field: Field) => {
    const value = getFormFieldValue(block.props, field.key, '');
    
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
        {fieldDefinitions.map((field) => (
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

export default DynamicPropsForm; 