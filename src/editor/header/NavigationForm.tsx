import React from 'react';
import { Plus, Trash2, MoveUp, MoveDown, ChevronDown } from 'lucide-react';
import type { HeaderItem } from '@editor/header/schema';
import NavigationItemForm from '@editor/header/NavigationItemForm';
import { moveItemInArray } from '@utils/array';

interface NavigationEditorProps {
  navigationItems: HeaderItem[];
  updateNavigationItems: (updatedItems: HeaderItem[]) => void;
  selectedItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const NavigationForm: React.FC<NavigationEditorProps> = ({ 
  navigationItems, 
  updateNavigationItems,
  selectedItemId,
  onSelectItem
}) => {
  const handleAddNavigationItem = () => {
    const newItem: HeaderItem = {
      id: `nav-item-${Date.now()}`,
      type: 'internal',
      label: 'Navigation Item',
      link: '/'
    };
    
    updateNavigationItems([...navigationItems, newItem]);
    if (onSelectItem) {
      onSelectItem(newItem.id || '');
    }
  };

  const handleUpdateNavigationItem = (index: number, updatedItem: HeaderItem) => {
    const updatedItems = [...navigationItems];
    updatedItems[index] = updatedItem;
    updateNavigationItems(updatedItems);
  };

  const handleDeleteNavigationItem = (index: number) => {
    const updatedItems = navigationItems.filter((_, i) => i !== index);
    updateNavigationItems(updatedItems);
    
    // If the deleted item was selected, clear selection
    if (selectedItemId === navigationItems[index].id) {
      onSelectItem?.('');
    }
  };

  const handleMoveNavigationItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Check if move is valid
    if (newIndex < 0 || newIndex >= navigationItems.length) {
      return;
    }
    
    const updatedItems = moveItemInArray(navigationItems, index, newIndex);
    onUpdate(updatedItems);
  };

  return (
    <div className="space-y-3">
      {navigationItems.length > 0 ? (
        <div className="space-y-3">
          {navigationItems.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`bg-gray-700 rounded-lg border ${selectedItemId === item.id ? 'border-blue-500' : 'border-gray-600'}`}
              data-item-id={item.id}
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium text-white">{item.label || 'Navigation Item'}</span>
                  {item.type === 'dropdown' && (
                    <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded text-gray-300">
                      Dropdown
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Move Up Button */}
                  <button 
                    onClick={() => handleMoveNavigationItem(index, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded text-gray-300 hover:text-blue-400 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed`}
                    title="Move up"
                  >
                    <MoveUp size={16} />
                  </button>
                  
                  {/* Move Down Button */}
                  <button 
                    onClick={() => handleMoveNavigationItem(index, 'down')}
                    disabled={index === navigationItems.length - 1}
                    className={`p-1 rounded text-gray-300 hover:text-blue-400 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed`}
                    title="Move down"
                  >
                    <MoveDown size={16} />
                  </button>
                  
                  <button 
                    onClick={() => onSelectItem?.(item.id || '')}
                    className={`p-1 rounded ${selectedItemId === item.id ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                  >
                    <ChevronDown className={`w-4 h-4 ${selectedItemId === item.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteNavigationItem(index)}
                    className="p-1 rounded text-gray-300 hover:text-red-400 hover:bg-gray-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {selectedItemId === item.id && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-600">
                  <NavigationItemForm
                    item={item}
                    updateNavigationItem={(updatedItem) => handleUpdateNavigationItem(index, updatedItem)}
                    isDropdownItem={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 bg-gray-700 rounded-lg">
          <p>No navigation items added yet.</p>
          <p className="text-sm mt-1">Click the "Add Item" button to create your first navigation item.</p>
        </div>
      )}
      
      <button
        onClick={handleAddNavigationItem}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center text-sm"
      >
        <Plus size={16} className="mr-1" />
        Add Navigation Item
      </button>
    </div>
  );
};

export default NavigationForm;