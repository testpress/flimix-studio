import React from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import type { FooterItem } from './schema';
import FooterItemForm from './FooterItemForm';

interface RowFormProps {
  rows: FooterItem[];
  updateRows: (updatedRows: FooterItem[]) => void;
  selectedItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const RowForm: React.FC<RowFormProps> = ({ 
  rows, 
  updateRows, 
  selectedItemId, 
  onSelectItem 
}) => {
  const handleAddRowItem = (rowIndex: number) => {
    const newItem: FooterItem = {
      id: `row-item-${Date.now()}`,
      type: 'external',
      label: 'New Item',
      link: 'https://example.com'
    };
    
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      items: [...(updatedRows[rowIndex].items || []), newItem]
    };
    
    updateRows(updatedRows);
    
    if (onSelectItem) {
      onSelectItem(newItem.id || '');
    }
  };

  const handleUpdateRowItem = (rowIndex: number, itemIndex: number, updatedItem: FooterItem) => {
    const updatedRows = [...rows];
    const updatedItems = [...(updatedRows[rowIndex].items || [])];
    updatedItems[itemIndex] = updatedItem;
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      items: updatedItems
    };
    
    updateRows(updatedRows);
  };

  const handleDeleteRowItem = (rowIndex: number, itemIndex: number) => {
    const updatedRows = [...rows];
    const updatedItems = (updatedRows[rowIndex].items || []).filter((_, i) => i !== itemIndex);
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      items: updatedItems
    };
    
    updateRows(updatedRows);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedRows = rows.filter((_, i) => i !== rowIndex);
    updateRows(updatedRows);
  };

  return (
    <div className="space-y-3">
      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map((row, rowIndex) => (
            <div 
              key={row.id || rowIndex} 
              className={`bg-gray-700 rounded-lg border ${selectedItemId === row.id ? 'border-blue-500' : 'border-gray-600'}`}
              data-item-id={row.id}
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium text-white">Row {rowIndex + 1}</span>
                  <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded text-gray-300">
                    {row.items?.length || 0} items
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => onSelectItem?.(row.id || '')}
                    className={`p-1 rounded ${selectedItemId === row.id ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                  >
                    <ChevronDown className={`w-4 h-4 ${selectedItemId === row.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="p-1 rounded text-gray-300 hover:text-red-400 hover:bg-gray-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {(selectedItemId === row.id || row.items?.some(item => item.id === selectedItemId)) && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-600">
                  <div className="space-y-3">
                    {row.items && row.items.length > 0 ? (
                      <div className="space-y-2">
                        {row.items.map((item, itemIndex) => (
                          <div 
                            key={item.id || itemIndex} 
                            className="bg-gray-600 rounded border border-gray-500 p-2"
                            data-item-id={item.id}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{item.label || 'Item'}</span>
                              <button 
                                onClick={() => handleDeleteRowItem(rowIndex, itemIndex)}
                                className="p-0.5 rounded text-gray-300 hover:text-red-400 hover:bg-gray-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            <FooterItemForm
                              item={item}
                              updateFooterItem={(updatedItem: FooterItem) => handleUpdateRowItem(rowIndex, itemIndex, updatedItem)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No items added yet.</p>
                    )}
                    
                    <button
                      onClick={() => handleAddRowItem(rowIndex)}
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
          <p>No rows added yet.</p>
          <p className="text-sm mt-1">Click the "Add Row" button to create your first row.</p>
        </div>
      )}
    </div>
  );
};

export default RowForm;

