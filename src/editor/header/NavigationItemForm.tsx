import React, { useState } from 'react';
import type { HeaderItem } from '@editor/header/schema';
import { ChevronDown, ChevronUp, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

interface NavigationItemFormProps {
  item: HeaderItem;
  updateNavigationItem: (updatedItem: HeaderItem) => void;
  isDropdownItem?: boolean;
}

const NavigationItemForm: React.FC<NavigationItemFormProps> = ({ 
  item, 
  updateNavigationItem,
  isDropdownItem = false
}) => {
  const [expandedSubItems, setExpandedSubItems] = useState<boolean>(true);
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as HeaderItem['type'];
    
    // If changing to/from dropdown, handle items array
    if (newType === 'dropdown' && item.type !== 'dropdown') {
      updateNavigationItem({
        ...item,
        type: newType,
        items: item.items || []
      });
    } else if (newType !== 'dropdown' && item.type === 'dropdown') {
      // Remove items when changing from dropdown to another type
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { items, ...rest } = item;
      updateNavigationItem({
        ...rest,
        type: newType
      });
    } else {
      updateNavigationItem({
        ...item,
        type: newType
      });
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNavigationItem({
      ...item,
      label: e.target.value
    });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNavigationItem({
      ...item,
      link: e.target.value
    });
  };

  const handleAddSubItem = () => {
    const newItem: HeaderItem = {
      id: `sub-item-${Date.now()}`,
      type: 'internal',
      label: 'New Item',
      link: '/'
    };
    
    updateNavigationItem({
      ...item,
      items: [...(item.items || []), newItem]
    });
    
    // Ensure sub-items are expanded
    setExpandedSubItems(true);
    
  };

  const handleUpdateSubItem = (index: number, updatedSubItem: HeaderItem) => {
    if (!item.items) return;
    
    const updatedItems = [...item.items];
    updatedItems[index] = updatedSubItem;
    
    updateNavigationItem({
      ...item,
      items: updatedItems
    });
  };

  const handleDeleteSubItem = (index: number) => {
    if (!item.items) return;
    
    const updatedItems = item.items.filter((_, i) => i !== index);
    
    updateNavigationItem({
      ...item,
      items: updatedItems
    });
  };

  const handleMoveSubItem = (index: number, direction: 'up' | 'down') => {
    if (!item.items) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Check if move is valid
    if (newIndex < 0 || newIndex >= item.items.length) {
      return;
    }
    
    const updatedItems = [...item.items];
    // splice(startIndex, deleteCount) - Remove 1 item at current position
    const [movedItem] = updatedItems.splice(index, 1);
    // splice(startIndex, deleteCount, itemToInsert) - Insert item at new position, remove 0 items
    updatedItems.splice(newIndex, 0, movedItem);
    
    onUpdate({
      ...item,
      items: updatedItems
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-xs text-gray-300 mb-1">Type</label>
          <select
            value={item.type}
            onChange={handleTypeChange}
            className="bg-gray-600 border border-gray-500 rounded px-2 py-1.5 text-white text-sm"
          >
            <option value="internal">Internal Link</option>
            <option value="external">External Link</option>
            <option value="anchor">Anchor Link</option>
            {!isDropdownItem && <option value="dropdown">Dropdown</option>}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-300 mb-1">Label</label>
          <input
            type="text"
            value={item.label || ''}
            onChange={handleLabelChange}
            className="bg-gray-600 border border-gray-500 rounded px-2 py-1.5 text-white text-sm"
            placeholder="Navigation item label"
          />
        </div>
      </div>

      {item.type !== 'dropdown' && (
        <div className="flex flex-col">
          <label className="text-xs text-gray-300 mb-1">
            {item.type === 'external' ? 'URL' : item.type === 'anchor' ? 'Anchor' : 'Path'}
          </label>
          <input
            type="text"
            value={item.link || ''}
            onChange={handleLinkChange}
            className="bg-gray-600 border border-gray-500 rounded px-2 py-1.5 text-white text-sm"
            placeholder={
              item.type === 'external' 
                ? 'https://example.com' 
                : item.type === 'anchor' 
                  ? '#section-id' 
                  : '/page-path'
            }
          />
        </div>
      )}

      {/* Dropdown sub-items */}
      {item.type === 'dropdown' && (
        <div className="mt-3 border-t border-gray-600 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-medium text-gray-300">Dropdown Items</h5>
            <button 
              onClick={() => setExpandedSubItems(!expandedSubItems)}
              className="p-1 rounded hover:bg-gray-600 text-gray-300"
            >
              {expandedSubItems ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          {expandedSubItems && (
            <>
              {item.items && item.items.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {item.items.map((subItem, index) => (
                    <div 
                      key={subItem.id || index} 
                      className="bg-gray-600 rounded border border-gray-500 p-2"
                      data-item-id={subItem.id}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{subItem.label || 'Sub Item'}</span>
                        <div className="flex items-center space-x-1">
                          {/* Move Up Button */}
                          <button 
                            onClick={() => handleMoveSubItem(index, 'up')}
                            disabled={index === 0}
                            className={`p-0.5 rounded text-gray-300 hover:text-blue-400 hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed`}
                            title="Move up"
                          >
                            <MoveUp size={12} />
                          </button>
                          
                          {/* Move Down Button */}
                          <button 
                            onClick={() => handleMoveSubItem(index, 'down')}
                            disabled={index === (item.items?.length || 0) - 1}
                            className={`p-0.5 rounded text-gray-300 hover:text-blue-400 hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed`}
                            title="Move down"
                          >
                            <MoveDown size={12} />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteSubItem(index)}
                            className="p-0.5 rounded text-gray-300 hover:text-red-400 hover:bg-gray-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-400 mb-0.5">Label</label>
                          <input
                            type="text"
                            value={subItem.label || ''}
                            onChange={(e) => handleUpdateSubItem(index, { ...subItem, label: e.target.value })}
                            className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-400 mb-0.5">Link</label>
                          <input
                            type="text"
                            value={subItem.link || ''}
                            onChange={(e) => handleUpdateSubItem(index, { ...subItem, link: e.target.value })}
                            className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
                          />
                        </div>
                      </div>
                      
                      {/* Type selector for dropdown items */}
                      <div className="mt-2">
                        <label className="text-xs text-gray-400 mb-0.5">Type</label>
                        <select
                          value={subItem.type}
                          onChange={(e) => handleUpdateSubItem(index, { ...subItem, type: e.target.value as HeaderItem['type'] })}
                          className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs w-full"
                        >
                          <option value="internal">Internal Link</option>
                          <option value="external">External Link</option>
                          <option value="anchor">Anchor Link</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">No items added yet.</p>
              )}
              
              <button
                onClick={handleAddSubItem}
                className="flex items-center text-xs text-blue-400 hover:text-blue-300 bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
              >
                <Plus size={12} className="mr-1" />
                Add Dropdown Item
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationItemForm;
