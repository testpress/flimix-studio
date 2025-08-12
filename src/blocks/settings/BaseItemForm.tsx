import React from 'react';

interface BaseItemFormProps<T extends { id: string }> {
  item: T;
  onChange: (updatedItem: T) => void;
  title: string;
  fields: Array<{
    key: keyof T;
    label: string;
    type: 'text' | 'textarea' | 'url' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string | number; label: string }>;
    description?: string;
    maxLength?: number;
  }>;
  children?: React.ReactNode; // Allow additional content to be passed in
  onFieldChange?: (field: keyof T, value: string) => void; // Custom field change handler
}

const BaseItemForm = <T extends { id: string }>({ 
  item, 
  onChange, 
  title, 
  fields,
  children,
  onFieldChange
}: BaseItemFormProps<T>) => {
  const handleChange = (field: keyof T, value: string) => {
    // Use custom field change handler if provided
    if (onFieldChange) {
      onFieldChange(field, value);
      return;
    }

    // Default behavior - just update with the string value
    onChange({ ...item, [field]: value });
  };

  const renderField = (field: typeof fields[0]) => {
    const value = String(item[field.key] || '');
    
    switch (field.type) {
      case 'textarea':
        const charCount = value.length;
        const isAtCharLimit = field.maxLength && charCount >= field.maxLength;
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={`w-full p-2 border rounded text-sm h-20 resize-none ${
                isAtCharLimit ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
              }`}
              placeholder={field.placeholder}
              required={field.required}
              maxLength={field.maxLength}
            />
            {field.maxLength && (
              <div className={`text-xs mt-1 text-right ${
                isAtCharLimit ? 'text-yellow-600 font-medium' : 'text-gray-500'
              }`}>
                {charCount}/{field.maxLength} characters
                {isAtCharLimit && ' (limit reached)'}
              </div>
            )}
          </div>
        );
      
      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required={field.required}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default: // text
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Basic Fields */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
        
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={String(field.key)}>
              <label className="block text-sm text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Additional content (meta fields, etc.) */}
      {children}
    </div>
  );
};

export default BaseItemForm; 