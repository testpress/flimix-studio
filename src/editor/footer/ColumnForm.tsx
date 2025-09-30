import React from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import type { FooterItem } from '@editor/footer/schema';
import FooterItemForm from '@editor/footer/FooterItemForm';

interface ColumnEditorProps {
  columns: FooterItem[];
  onUpdate: (updatedColumns: FooterItem[]) => void;
  selectedItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const ColumnForm: React.FC<ColumnEditorProps> = ({ 
  columns, 
  onUpdate,
  selectedItemId,
  onSelectItem
}) => {
  const handleAddColumnItem = (columnIndex: number) => {
    const newItem: FooterItem = {
      id: `column-item-${Date.now()}`,
      type: 'internal',
      label: 'New Item',
      link: '/'
    };
    
    const updatedColumns = [...columns];
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      items: [...(updatedColumns[columnIndex].items || []), newItem]
    };
    
    onUpdate(updatedColumns);
    
    // Auto-select the new item
    if (onSelectItem) {
      onSelectItem(newItem.id || '');
    }
  };

  const handleUpdateColumnItem = (columnIndex: number, itemIndex: number, updatedItem: FooterItem) => {
    const updatedColumns = [...columns];
    const updatedItems = [...(updatedColumns[columnIndex].items || [])];
    updatedItems[itemIndex] = updatedItem;
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      items: updatedItems
    };
    
    onUpdate(updatedColumns);
  };

  const handleDeleteColumnItem = (columnIndex: number, itemIndex: number) => {
    const updatedColumns = [...columns];
    const updatedItems = (updatedColumns[columnIndex].items || []).filter((_, i) => i !== itemIndex);
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      items: updatedItems
    };
    
    onUpdate(updatedColumns);
  };

  const handleDeleteColumn = (columnIndex: number) => {
    const updatedColumns = columns.filter((_, i) => i !== columnIndex);
    onUpdate(updatedColumns);
  };

  return (
    <div className="space-y-3">
      {columns.length > 0 ? (
        <div className="space-y-3">
          {columns.map((column, columnIndex) => (
            <div 
              key={column.id || columnIndex} 
              className={`bg-gray-700 rounded-lg border ${selectedItemId === column.id ? 'border-blue-500' : 'border-gray-600'}`}
              data-item-id={column.id}
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium text-white">Column {columnIndex + 1}</span>
                  <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded text-gray-300">
                    {column.items?.length || 0} items
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => onSelectItem?.(column.id || '')}
                    className={`p-1 rounded ${selectedItemId === column.id ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                  >
                    <ChevronDown className={`w-4 h-4 ${selectedItemId === column.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteColumn(columnIndex)}
                    className="p-1 rounded text-gray-300 hover:text-red-400 hover:bg-gray-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {(selectedItemId === column.id || column.items?.some(item => item.id === selectedItemId)) && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-600">
                  <div className="space-y-3">
                    {/* Column Items */}
                    {column.items && column.items.length > 0 ? (
                      <div className="space-y-2">
                        {column.items.map((item, itemIndex) => (
                          <div 
                            key={item.id || itemIndex} 
                            className="bg-gray-600 rounded border border-gray-500 p-2"
                            data-item-id={item.id}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{item.label || 'Item'}</span>
                              <button 
                                onClick={() => handleDeleteColumnItem(columnIndex, itemIndex)}
                                className="p-0.5 rounded text-gray-300 hover:text-red-400 hover:bg-gray-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            <FooterItemForm
                              item={item}
                              onUpdate={(updatedItem: FooterItem) => handleUpdateColumnItem(columnIndex, itemIndex, updatedItem)}
                              isColumnItem={true}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No items added yet.</p>
                    )}
                    
                    {/* Add Item Button */}
                    <button
                      onClick={() => handleAddColumnItem(columnIndex)}
                      className="flex items-center text-xs text-blue-400 hover:text-blue-300 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
                    >
                      <Plus size={12} className="mr-1" />
                      Add Item
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 bg-gray-700 rounded-lg">
          <p>No columns added yet.</p>
          <p className="text-sm mt-1">Click the "Add Column" button to create your first column.</p>
        </div>
      )}
    </div>
  );
};

export default ColumnForm;