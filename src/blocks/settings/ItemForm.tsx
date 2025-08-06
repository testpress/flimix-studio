interface ItemFormProps<T extends { id: string }> {
  item: T;
  onChange: (updatedItem: T) => void;
  onRemove: () => void;
  title: string; // Add title prop
  fields: Array<{
    key: keyof T;
    label: string;
    type: 'text' | 'textarea' | 'url';
    placeholder?: string;
    required?: boolean;
  }>;
}

const ItemForm = <T extends { id: string }>({ 
  item, 
  onChange, 
  onRemove, 
  title, // Add title parameter
  fields 
}: ItemFormProps<T>) => {
  const handleChange = (field: keyof T, value: string) => {
    onChange({ ...item, [field]: value });
  };

  const renderField = (field: typeof fields[0]) => {
    const value = String(item[field.key] || '');
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-none"
            placeholder={field.placeholder}
            required={field.required}
          />
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
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
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
  );
};

export default ItemForm; 