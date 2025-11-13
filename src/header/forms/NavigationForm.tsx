import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { HeaderItem } from '../schema';
import NavigationItemForm from './NavigationItemForm';

interface NavigationFormProps {
  navigationItems: HeaderItem[];
  updateNavigationItems: (updatedItems: HeaderItem[]) => void;
  selectedItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const NavigationForm: React.FC<NavigationFormProps> = ({ 
  navigationItems, 
  updateNavigationItems, 
  selectedItemId, 
  onSelectItem 
}) => {
  const { selectItem, expandedPath } = useHeaderFooter();
  
  const handleAddNavigationItem = () => {
    const newItem: HeaderItem = {
      id: `nav-item-${Date.now()}`,
      type: 'internal',
      label: 'Navigation Item',
      link: '/'
    };
    
    updateNavigationItems([...navigationItems, newItem]);
    if (newItem.id) {
      selectItem(newItem.id, 'header', []);
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
    
    if (selectedItemId === navigationItems[index].id) {
      onSelectItem?.('');
    }
  };

  return (
    <div className="space-y-3">
      {navigationItems.length > 0 ? (
        <div className="space-y-3">
          {navigationItems.map((item, index) => {
            const isSelected = selectedItemId === item.id;
            const isExpanded = isSelected || (item.type === 'dropdown' && item.id && (expandedPath as readonly string[]).includes(item.id));
            
            return (
              <div 
                key={item.id || index}
                id={`panel-item-${item.id}`} 
                className={`rounded-lg border transition-all overflow-hidden ${
                  isSelected 
                    ? 'border-blue-500 bg-gray-700/50 ring-1 ring-blue-500/20' 
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
                data-item-id={item.id}
              >
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-600/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id) {
                      selectItem(item.id, 'header', []);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                    
                    <span className="text-sm font-medium text-white">
                      {item.label || 'Untitled Link'}
                    </span>
                    
                    {item.type === 'dropdown' && (
                      <span className="ml-2 text-xs bg-gray-600 px-1.5 py-0.5 rounded text-gray-300">
                        Dropdown
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNavigationItem(index);
                    }}
                    className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 2. EXPANDABLE FORM AREA */}
                {isExpanded && (
                  <div className="p-3 border-t border-gray-600 bg-gray-800/50">
                    <NavigationItemForm
                      item={item}
                      updateNavigationItem={(updatedItem) => handleUpdateNavigationItem(index, updatedItem)}
                      isDropdownItem={false}
                      selectedItemId={selectedItemId}
                    />
                  </div>
                )}
              </div>
            );
          })}
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
