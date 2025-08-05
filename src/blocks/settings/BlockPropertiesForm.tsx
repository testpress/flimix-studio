import React from 'react';
import type { Block } from '@blocks/shared/Block';
import type { Field } from '@blocks/shared/Field';

/**
 * Get a form field value from block props using dot notation path
 * Used for accessing nested block property values like 'ctaButton.label' in the editor
 * @param obj - The block props object containing the form data
 * @param fieldPath - The dot-notation path (e.g., 'ctaButton.label')
 * @param defaultValue - Default value if field doesn't exist
 * @returns The field value or default value
 */
function getFormFieldValue(obj: any, fieldPath: string, defaultValue: any = ''): any {
  if (!obj || !fieldPath) return defaultValue;
  
  const keys = fieldPath.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Set a form field value in block props using dot notation path
 * Used for updating nested block property values like 'ctaButton.label' in the editor
 * @param obj - The block props object containing the form data
 * @param fieldPath - The dot-notation path (e.g., 'ctaButton.label')
 * @param value - The new field value
 * @returns A new object with the updated field value
 */
function setFormFieldValue(obj: any, fieldPath: string, value: any): any {
  if (!obj || !fieldPath) return obj;
  
  const keys = fieldPath.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  // Navigate to the parent of the target field
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  // Set the final field value
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
  
  return newObj;
}

/**
 * Update a form field in block props using dot notation path
 * Used by the BlockPropertiesForm to update block properties in the editor
 * @param currentProps - Current block props
 * @param fieldPath - The dot-notation path to update
 * @param value - The new field value
 * @returns Updated props object
 */
function updateFormField(currentProps: any, fieldPath: string, value: any): any {
  return setFormFieldValue(currentProps, fieldPath, value);
}

interface BlockPropertiesFormProps {
  block: Block;
  fieldDefinitions: Field[];
  updateProps: (newProps: Partial<any>) => void;
}

const BlockPropertiesForm: React.FC<BlockPropertiesFormProps> = ({ 
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

export default BlockPropertiesForm; 