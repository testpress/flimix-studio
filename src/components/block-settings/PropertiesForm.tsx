import React from 'react';
import type { Block } from '@type/block';
import type { Field, FieldValue, NestedFormData } from '@type/field';
import type { BlockProps } from '@type/form';

/**
 * Get a form field value from block props using dot notation path
 * Used for accessing nested block property values like 'ctaButton.label' in the editor
 * @param obj - The block props object containing the form data
 * @param fieldPath - The dot-notation path (e.g., 'ctaButton.label')
 * @param defaultValue - Default value if field doesn't exist
 * @returns The field value or default value
 */
function getFormFieldValue(obj: BlockProps | undefined, fieldPath: string, defaultValue: FieldValue = ''): FieldValue {
  if (!obj || !fieldPath) return defaultValue;
  
  const keys = fieldPath.split('.');
  let current: NestedFormData = obj as NestedFormData;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key] as NestedFormData;
  }
  
  return current !== undefined ? current as FieldValue : defaultValue;
}

/**
 * Set a form field value in block props using dot notation path
 * Used for updating nested block property values like 'ctaButton.label' in the editor
 * @param obj - The block props object containing the form data
 * @param fieldPath - The dot-notation path (e.g., 'ctaButton.label')
 * @param value - The new field value
 * @returns A new object with the updated field value
 */
function setFormFieldValue(obj: BlockProps, fieldPath: string, value: FieldValue): BlockProps {
  if (!obj || !fieldPath) return obj;
  
  const keys = fieldPath.split('.');
  const newObj = { ...obj };
  let current: NestedFormData = newObj as NestedFormData;
  
  // Navigate to the parent of the target field
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as NestedFormData;
  }
  
  // Set the final field value
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
  
  return newObj;
}

/**
 * Update a form field in block props using dot notation path
 * Used by the PropertiesForm to update block properties in the editor
 * @param currentProps - Current block props
 * @param fieldPath - The dot-notation path to update
 * @param value - The new field value
 * @returns Updated props object
 */
function updateFormField(currentProps: BlockProps, fieldPath: string, value: FieldValue): BlockProps {
  return setFormFieldValue(currentProps, fieldPath, value);
}

interface PropertiesFormProps {
  block: Block;
  fieldDefinitions: Field[];
  updateProps: (newProps: Partial<BlockProps>) => void;
}

const PropertiesForm: React.FC<PropertiesFormProps> = ({ 
  block, 
  fieldDefinitions, 
  updateProps 
}) => {
  const handleFieldChange = (path: string, value: FieldValue) => {
    const updatedProps = updateFormField(block.props, path, value);
    updateProps(updatedProps);
  };

  const renderField = (field: Field) => {
    const value = getFormFieldValue(block.props, field.key, '');
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required={field.required}
          />
        );
        
      case 'range':
        return (
          <div className="flex items-center gap-3">
            <input
              type="range"
              value={Number(value) || 0}
              onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
              min={field.min || 0}
              max={field.max || 100}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm text-gray-600 w-8 text-right font-mono">
              {Number(value) || 0}
            </span>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={String(value)}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty values (user clearing the field)
              if (inputValue === '') {
                handleFieldChange(field.key, '');
                return;
              }
              
              const numValue = Number(inputValue);
              if (!isNaN(numValue) && (!field.min || numValue >= field.min) && (!field.max || numValue <= field.max)) {
                handleFieldChange(field.key, numValue);
              }
            }}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required={field.required}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={String(value)}
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
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        );
        
      case 'color':
        return (
          <input
            type="color"
            value={String(value) || '#000000'}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full h-10 border border-gray-300 rounded text-sm"
          />
        );
        
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.checked)}
            className="rounded"
          />
        );
        
      case 'select':
        return (
          <select
            value={String(value) || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required={field.required}
          >
            {!value && <option value="">Select an option...</option>}
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
            value={String(value)}
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

export default PropertiesForm; 