import React from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { HeaderItem } from '../schema';
import { MAX_NAVIGATION_ITEMS } from '../schema';
import NavigationItemForm from './NavigationItemForm';
import { generateUniqueId } from '@utils/id';
import { HeaderFooterControls } from '@layout/HeaderFooterControls';

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
  const { selectItem, expandedPath, moveHeaderItem } = useHeaderFooter();
  
  const currentItemCount = navigationItems.length;
  const canAddItem = currentItemCount < MAX_NAVIGATION_ITEMS;
  
  const handleAddNavigationItem = () => {
    if (currentItemCount >= MAX_NAVIGATION_ITEMS) {
      return;
    }

    const newItem: HeaderItem = {
      id: generateUniqueId(),
      type: 'internal',
      label: 'Navigation Item',
      link: '/'
    };
    
    updateNavigationItems([...navigationItems, newItem]);
    selectItem(newItem.id, 'header', []);
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
            const isExpanded = isSelected || (item.type === 'dropdown' && (expandedPath as readonly string[]).includes(item.id));
            
            return (
              <div 
                key={item.id}
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
                    selectItem(item.id, 'header', []);
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

                  <HeaderFooterControls
                    canMoveUp={index > 0}
                    canMoveDown={index < navigationItems.length - 1}
                    onMoveUp={() => moveHeaderItem(item.id, 'up')}
                    onMoveDown={() => moveHeaderItem(item.id, 'down')}
                    onRemove={() => handleDeleteNavigationItem(index)}
                  />
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
      
      {!canAddItem && (
        <div className="text-xs text-gray-400 text-center mb-2">
          Maximum {MAX_NAVIGATION_ITEMS} navigation items allowed ({currentItemCount}/{MAX_NAVIGATION_ITEMS})
        </div>
      )}
      
      <button
        onClick={handleAddNavigationItem}
        disabled={!canAddItem}
        className={`w-full px-3 py-2 text-white rounded flex items-center justify-center text-sm transition-colors ${
          canAddItem
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-600 cursor-not-allowed opacity-50'
        }`}
        title={!canAddItem ? `Maximum ${MAX_NAVIGATION_ITEMS} navigation items allowed` : ''}
      >
        <Plus size={16} className="mr-1" />
        Add Navigation Item
      </button>
    </div>
  );
};

export default NavigationForm;
