import React from 'react';
import type { Block } from '@blocks/shared/Block';
import type { Field, FieldValue, NestedFormData } from '@blocks/shared/Field';
import type { BlockProps } from '@blocks/shared/FormTypes';

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
            className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required={field.required}
          />
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
            className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required={field.required}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );
        
      case 'color':
        return (
          <input
            type="color"
            value={String(value) || '#000000'}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full h-10 border border-neutral-700 bg-neutral-900 rounded text-sm"
          />
        );
        
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.checked)}
            className="rounded border-neutral-600 bg-neutral-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
          />
        );
        
      case 'select':
        return (
          <select
            value={String(value) || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        );
    }
  };

  return (
    <div className="p-4 bg-neutral-800 rounded-lg">
      <h3 className="font-medium text-white mb-2">Properties</h3>
      <div className="space-y-3">
        {fieldDefinitions.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-neutral-300 mb-1">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesForm; 