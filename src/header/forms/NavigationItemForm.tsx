import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { HeaderItem } from '../schema';
import { MAX_DROPDOWN_ITEMS } from '../schema';
import { generateUniqueId } from '@utils/id';

interface NavigationItemFormProps {
  item: HeaderItem;
  updateNavigationItem: (updatedItem: HeaderItem) => void;
  isDropdownItem?: boolean;
  selectedItemId?: string | null;
}

const NavigationItemForm: React.FC<NavigationItemFormProps> = ({ 
  item, 
  updateNavigationItem,
  isDropdownItem = false,
  selectedItemId
}) => {
  const { expandedPath } = useHeaderFooter();
  const [expandedSubItems, setExpandedSubItems] = useState<boolean>(true);
  
  useEffect(() => {
    if (item.type === 'dropdown' && item.items) {
      const hasSelectedSubItem = item.items.some(subItem => 
        subItem.id && (selectedItemId === subItem.id || (expandedPath as readonly string[]).includes(subItem.id))
      );
      if (hasSelectedSubItem) {
        setExpandedSubItems(true);
      }
    }
  }, [item.type, item.items, selectedItemId, expandedPath]);
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as HeaderItem['type'];
    
    if (newType === 'dropdown' && item.type !== 'dropdown') {
      updateNavigationItem({
        ...item,
        type: newType,
        items: item.items || []
      });
    } else if (newType !== 'dropdown' && item.type === 'dropdown') {
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
    const currentSubItemCount = item.items?.length || 0;
    if (currentSubItemCount >= MAX_DROPDOWN_ITEMS) {
      return;
    }

    const newItem: HeaderItem = {
      id: generateUniqueId(),
      type: 'internal',
      label: 'New Item',
      link: '/'
    };
    
    updateNavigationItem({
      ...item,
      items: [...(item.items || []), newItem]
    });
    
    setExpandedSubItems(true);
  };

  const handleUpdateSubItem = (subItemId: string, updatedSubItem: HeaderItem) => {
    if (!item.items) return;
    
    const updatedItems = item.items.map(subItem => 
      subItem.id === subItemId ? updatedSubItem : subItem
    );
    
    updateNavigationItem({
      ...item,
      items: updatedItems
    });
  };

  const handleDeleteSubItem = (subItemId: string) => {
    if (!item.items) return;
    
    const updatedItems = item.items.filter(subItem => subItem.id !== subItemId);
    
    updateNavigationItem({
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
              {(() => {
                const currentSubItemCount = item.items?.length || 0;
                const canAddSubItem = currentSubItemCount < MAX_DROPDOWN_ITEMS;
                return (
                  <>
                    {!canAddSubItem && (
                      <div className="text-xs text-gray-400 text-center mb-2">
                        Maximum {MAX_DROPDOWN_ITEMS} dropdown items allowed ({currentSubItemCount}/{MAX_DROPDOWN_ITEMS})
                      </div>
                    )}
                    {item.items && item.items.length > 0 ? (
                      <div className="space-y-2 mb-3">
                        {item.items.map((subItem) => {
                    const isSubItemSelected = selectedItemId === subItem.id;
                    
                    return (
                      <div 
                        key={subItem.id}
                        id={`panel-item-${subItem.id}`}
                        className={`bg-gray-600 rounded border p-2 transition-all ${
                          isSubItemSelected 
                            ? 'border-blue-500 ring-1 ring-blue-500' 
                            : 'border-gray-500'
                        }`}
                        data-item-id={subItem.id}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">{subItem.label || 'Sub Item'}</span>
                          <button 
                            onClick={() => handleDeleteSubItem(subItem.id)}
                            className="p-0.5 rounded text-gray-300 hover:text-red-400 hover:bg-gray-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-0.5">Label</label>
                            <input
                              type="text"
                              value={subItem.label || ''}
                              onChange={(e) => handleUpdateSubItem(subItem.id, { ...subItem, label: e.target.value })}
                              className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
                            />
                          </div>
                          
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-0.5">Link</label>
                            <input
                              type="text"
                              value={subItem.link || ''}
                              onChange={(e) => handleUpdateSubItem(subItem.id, { ...subItem, link: e.target.value })}
                              className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <label className="text-xs text-gray-400 mb-0.5">Type</label>
                          <select
                            value={subItem.type}
                            onChange={(e) => handleUpdateSubItem(subItem.id, { ...subItem, type: e.target.value as HeaderItem['type'] })}
                            className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs w-full"
                          >
                            <option value="internal">Internal Link</option>
                            <option value="external">External Link</option>
                            <option value="anchor">Anchor Link</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
                      ) : (
                        <p className="text-xs text-gray-400 mb-3">No items added yet.</p>
                      )}
                      
                      <button
                        onClick={handleAddSubItem}
                        disabled={!canAddSubItem}
                        className={`flex items-center text-xs px-2 py-1 rounded transition-colors ${
                          canAddSubItem
                            ? 'text-blue-400 hover:text-blue-300 bg-gray-600 hover:bg-gray-500 cursor-pointer'
                            : 'text-gray-500 bg-gray-700 cursor-not-allowed opacity-50'
                        }`}
                        title={!canAddSubItem ? `Maximum ${MAX_DROPDOWN_ITEMS} dropdown items allowed` : ''}
                      >
                        <Plus size={12} className="mr-1" />
                        Add Dropdown Item
                      </button>
                    </>
                  );
                })()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationItemForm;
