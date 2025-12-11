import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { HeaderItem, Size } from '../schema';
import { MAX_DROPDOWN_ITEMS } from '../schema';
import { generateUniqueId } from '@utils/id';

const borderRadiusOptions = [
  { label: 'None', value: 'none' },
  { label: 'X-Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'X-Large', value: 'xl' },
];

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

  const updateStyle = (key: string, value: string | Size) => {
    updateNavigationItem({
      ...item,
      style: { ...item.style, [key]: value }
    });
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-xs text-gray-300 mb-1.5">Type</label>
          <select
            value={item.type}
            onChange={handleTypeChange}
            className="bg-gray-700 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:border-blue-500 outline-none"
          >
            <option value="internal">Internal Link</option>
            <option value="external">External Link</option>
            <option value="anchor">Anchor Link</option>
            <option value="button">CTA Button</option>
            {!isDropdownItem && <option value="dropdown">Dropdown</option>}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-300 mb-1.5">Label</label>
          <input 
            type="text" 
            value={item.label || ''} 
            onChange={handleLabelChange} 
            className="bg-gray-700 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:border-blue-500 outline-none" 
          />
        </div>
      </div>

      {item.type !== 'dropdown' && (
         <div className="flex flex-col">
            <label className="text-xs text-gray-300 mb-1.5">
                {item.type === 'button' ? 'Button Link' : 'Link Path/URL'}
            </label>
            <input
                type="text"
                value={item.link || ''}
                onChange={handleLinkChange}
                className="bg-gray-700 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:border-blue-500 outline-none" 
            />
         </div>
      )}

      {/* Icon Input */}
      <div className="flex flex-col">
         <label className="text-xs text-gray-300 mb-1.5 flex items-center gap-1">
            <ImageIcon size={12} className="text-gray-400"/> Icon URL <span className="text-gray-500">(Optional)</span>
         </label>
         <input 
            type="text" 
            value={item.icon || ''} 
            onChange={(e) => updateNavigationItem({...item, icon: e.target.value})} 
            className="bg-gray-700 border border-gray-600 rounded px-2.5 py-2 text-white text-xs font-mono focus:border-blue-500 outline-none" 
            placeholder="https://..."
         />
      </div>

      {item.type === 'button' && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-blue-500/30 space-y-4">
           <div className="flex items-center gap-2 pb-2 border-b border-blue-500/20">
              <span className="text-xs font-semibold text-blue-100 tracking-wide">Button Styling</span>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              {/* Background Color */}
              <div className="flex flex-col space-y-1.5">
                 <label className="text-xs text-gray-400">Background</label>
                 <div className="flex items-center bg-gray-700 rounded border border-gray-600 px-2 py-1.5">
                    <input 
                        type="color" 
                        value={item.style?.backgroundColor || '#3b82f6'} 
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)} 
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 mr-2 shrink-0" 
                    />
                    <input 
                        type="text" 
                        value={item.style?.backgroundColor || '#3b82f6'} 
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)} 
                        className="bg-transparent text-xs text-white w-full focus:outline-none uppercase font-mono" 
                    />
                 </div>
              </div>

              {/* Text Color */}
              <div className="flex flex-col space-y-1.5">
                 <label className="text-xs text-gray-400">Text Color</label>
                 <div className="flex items-center bg-gray-700 rounded border border-gray-600 px-2 py-1.5">
                    <input 
                        type="color" 
                        value={item.style?.color || '#ffffff'} 
                        onChange={(e) => updateStyle('color', e.target.value)} 
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 mr-2 shrink-0" 
                    />
                    <input 
                        type="text" 
                        value={item.style?.color || '#ffffff'} 
                        onChange={(e) => updateStyle('color', e.target.value)} 
                        className="bg-transparent text-xs text-white w-full focus:outline-none uppercase font-mono" 
                    />
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col">
             <label className="text-xs text-gray-400 mb-1.5">Border Radius</label>
             <select
               value={item.style?.borderRadius || 'sm'}
               onChange={(e) => updateStyle('borderRadius', e.target.value as Size)}
               className="bg-gray-700 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:border-blue-500 outline-none"
             >
               {borderRadiusOptions.map(option => (
                 <option key={option.value} value={option.value}>{option.label}</option>
               ))}
             </select>
           </div>
        </div>
      )}

      {/* Dropdown sub-items */}
      {item.type === 'dropdown' && (
        <div className="mt-3 border-t border-gray-600 pt-3">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Dropdown Menu Items</h5>
            <button 
              onClick={() => setExpandedSubItems(!expandedSubItems)}
              className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
            >
              {expandedSubItems ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          
          {expandedSubItems && (
            <>
              {(() => {
                const currentSubItemCount = item.items?.length || 0;
                const canAddSubItem = currentSubItemCount < MAX_DROPDOWN_ITEMS;
                return (
                  <>
                    {!canAddSubItem && <div className="text-xs text-gray-500 text-center mb-2">Max {MAX_DROPDOWN_ITEMS} items reached</div>}
                    {item.items && item.items.length > 0 ? (
                        <div className="space-y-2 mb-3">
                            {item.items.map(subItem => (
                                <div key={subItem.id} className={`bg-gray-700/50 rounded border p-3 transition-all ${selectedItemId === subItem.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-600'}`}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-300">Sub Item</span>
                                        <button onClick={() => handleDeleteSubItem(subItem.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={12}/></button>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-[10px] text-gray-400 block mb-1">Type</label>
                                        <select
                                            value={subItem.type}
                                            onChange={(e) => {
                                                const newType = e.target.value as HeaderItem['type'];
                                                // Handle type change - remove items if changing from dropdown
                                                if (newType === 'dropdown' && subItem.type !== 'dropdown') {
                                                    handleUpdateSubItem(subItem.id, {
                                                        ...subItem,
                                                        type: newType,
                                                        items: []
                                                    });
                                                } else if (newType !== 'dropdown' && subItem.type === 'dropdown') {
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    const { items, ...rest } = subItem;
                                                    handleUpdateSubItem(subItem.id, {
                                                        ...rest,
                                                        type: newType
                                                    });
                                                } else {
                                                    handleUpdateSubItem(subItem.id, {
                                                        ...subItem,
                                                        type: newType
                                                    });
                                                }
                                            }}
                                            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                                        >
                                            <option value="internal">Internal Link</option>
                                            <option value="external">External Link</option>
                                            <option value="anchor">Anchor Link</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div className="col-span-1">
                                            <label className="text-[10px] text-gray-400 block mb-1">Label</label>
                                            <input type="text" value={subItem.label} onChange={(e) => handleUpdateSubItem(subItem.id, {...subItem, label: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="Label"/>
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] text-gray-400 block mb-1">
                                                {subItem.type === 'button' ? 'Button Link' : 'Link Path/URL'}
                                            </label>
                                            <input 
                                                type="text" 
                                                value={subItem.link || ''} 
                                                onChange={(e) => handleUpdateSubItem(subItem.id, {...subItem, link: e.target.value})} 
                                                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white" 
                                                placeholder={subItem.type === 'button' ? 'Button Link' : 'Link'}
                                            />
                                        </div>
                                    </div>
                                    {/* SUB ITEM ICON INPUT */}
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">Icon URL (Optional)</label>
                                        <input 
                                            type="text" 
                                            value={subItem.icon || ''} 
                                            onChange={(e) => handleUpdateSubItem(subItem.id, {...subItem, icon: e.target.value})} 
                                            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white font-mono" 
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-xs text-gray-500 italic text-center py-2">No sub-items yet.</p>}
                    
                    <button onClick={handleAddSubItem} disabled={!canAddSubItem} className={`w-full flex items-center justify-center text-xs py-2 rounded border border-dashed transition-colors ${canAddSubItem ? 'border-gray-600 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500/50' : 'border-gray-700 text-gray-600 cursor-not-allowed'}`}>
                        <Plus size={12} className="mr-1"/> Add Dropdown Item
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