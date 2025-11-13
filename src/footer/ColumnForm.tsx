import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignHorizontalJustifyStart } from 'lucide-react';
import type { FooterColumn, FooterItem, ItemAlignment } from './schema';
import ColumnItemEditor from './ColumnItemEditor';

interface ColumnFormProps {
  column: FooterColumn;
  index: number;
  onUpdate: (updatedColumn: FooterColumn) => void;
  selectedItemId?: string | null;
}

const ColumnForm: React.FC<ColumnFormProps> = ({ column, index, onUpdate, selectedItemId }) => {
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  
  // Auto-expand item if it's selected
  React.useEffect(() => {
    const selectedItem = column.items.find(item => item.id === selectedItemId);
    if (selectedItem && expandedLinkId !== selectedItem.id) {
      setExpandedLinkId(selectedItem.id);
    }
  }, [selectedItemId, column.items, expandedLinkId]);

  const addItem = () => {
    const newItem: FooterItem = {
      id: `item-${Date.now()}`,
      type: 'item',
      label: 'New Link',
      url: '',
      linkType: 'internal'
    };
    onUpdate({
      ...column,
      items: [...column.items, newItem]
    });
    setExpandedLinkId(newItem.id);
  };

  const updateItem = (itemIndex: number, updatedItem: FooterItem) => {
    const newItems = [...column.items];
    newItems[itemIndex] = updatedItem;
    onUpdate({ ...column, items: newItems });
  };

  const removeItem = (itemIndex: number) => {
    const newItems = column.items.filter((_, i) => i !== itemIndex);
    onUpdate({ ...column, items: newItems });
  };

  const toggleOrientation = () => {
    onUpdate({
      ...column,
      orientation: column.orientation === 'vertical' ? 'horizontal' : 'vertical'
    });
  };

  const setAlignment = (alignment: ItemAlignment) => {
    onUpdate({ ...column, alignment });
  };

  return (
    <div className="bg-gray-800/50 rounded border border-gray-600/50 p-2">
      {/* Column Header / Toolbar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700/50">
        <span className="text-xs font-medium text-gray-300">Column {index + 1}</span>
        
        <div className="flex items-center gap-2">
          {/* Alignment Controls */}
          <div className="flex bg-gray-900 rounded border border-gray-700 p-0.5">
            <button 
              onClick={() => setAlignment('start')} 
              className={`p-1 rounded ${column.alignment === 'start' || !column.alignment ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`} 
              title="Align Start"
            >
              <AlignLeft size={12} />
            </button>
            <button 
              onClick={() => setAlignment('center')} 
              className={`p-1 rounded ${column.alignment === 'center' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`} 
              title="Align Center"
            >
              <AlignCenter size={12} />
            </button>
            <button 
              onClick={() => setAlignment('end')} 
              className={`p-1 rounded ${column.alignment === 'end' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`} 
              title="Align End"
            >
              <AlignRight size={12} />
            </button>
          </div>

          {/* Orientation Toggle */}
          <button 
            onClick={toggleOrientation}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded border border-transparent hover:border-gray-500"
            title={`Orientation: ${column.orientation}`}
          >
            {column.orientation === 'vertical' ? <AlignVerticalJustifyStart size={14} /> : <AlignHorizontalJustifyStart size={14} />}
          </button>
          
          {/* Add Item */}
          <button 
            onClick={addItem}
            className="p-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded shadow-sm"
            title="Add Item"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1">
        {column.items.length === 0 && (
           <div className="text-center py-3 border border-dashed border-gray-700 rounded bg-gray-800/30">
             <span className="text-[10px] text-gray-500">No items</span>
           </div>
        )}
        
        {column.items.map((item, i) => {
          const isSelected = selectedItemId === item.id;
          const shouldExpand = isSelected || expandedLinkId === item.id;
          
          // Display label based on available data
          const displayLabel = item.label || (item.icon ? 'Icon' : 'Untitled');
          const hasIcon = !!item.icon;
          
          return (
            <div 
              key={item.id} 
              className={`bg-gray-700 rounded border overflow-hidden transition-all ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-600'}`}
              data-item-id={item.id}
            >
              <div 
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => setExpandedLinkId(shouldExpand ? null : item.id)}
              >
              <div className="flex items-center gap-2 overflow-hidden">
                 {shouldExpand ? <ChevronDown size={12} className="text-gray-400"/> : <ChevronRight size={12} className="text-gray-400"/>}
                 <span className="text-xs text-white truncate">{displayLabel}</span>
                 {hasIcon && (
                   <span className="text-[10px] text-gray-500 bg-gray-800 px-1 rounded">ICON</span>
                 )}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>
            
            {shouldExpand && (
              <div className="p-2 bg-gray-700/50 border-t border-gray-600">
                <ColumnItemEditor item={item} onChange={(updated) => updateItem(i, updated)} />
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>  
  );
};

export default ColumnForm;
