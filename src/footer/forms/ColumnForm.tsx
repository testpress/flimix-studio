import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignHorizontalJustifyStart, Grid2x2Plus } from 'lucide-react';
import type { FooterColumn, FooterItem, ItemAlignment, Size, ColumnChild } from '../schema';
import { MAX_COLUMN_ITEMS, MAX_NESTED_COLUMN_ITEMS } from '../schema';
import ColumnItemEditor from './ColumnItemEditor';
import { generateUniqueId } from '@utils/id';

const sizeOptions = [
  { label: 'None', value: 'none' },
  { label: 'X-Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'X-Large', value: 'xl' },
];

interface ColumnFormProps {
  column: FooterColumn;
  index: number;
  onUpdate: (updatedColumn: FooterColumn) => void;
  onRemove?: () => void;
  selectedItemId?: string | null;
  isNested?: boolean;
}

const ColumnForm: React.FC<ColumnFormProps> = ({ column, index, onUpdate, onRemove, selectedItemId, isNested = false }) => {
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  
  // Auto-expand item if it's selected
  const selectedChildId = React.useMemo(() => {
    if (!selectedItemId) return null;
    const selectedChild = column.items.find(child => child.id === selectedItemId);
    return selectedChild ? selectedChild.id : null;
  }, [selectedItemId, column.items]);

  React.useEffect(() => {
    if (selectedChildId) {
      setExpandedLinkId(selectedChildId);
    }
  }, [selectedChildId]);

  const currentItemCount = column.items.length;
  const maxItems = isNested ? MAX_NESTED_COLUMN_ITEMS : MAX_COLUMN_ITEMS;
  const canAddItem = currentItemCount < maxItems;

  const addItem = () => {
    if (currentItemCount >= maxItems) return;

    const newItem: FooterItem = {
      id: generateUniqueId(),
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

  const addNestedColumn = () => {
    if (isNested || !canAddItem) return;

    const newColumn: FooterColumn = {
      id: generateUniqueId(),
      type: 'column',
      items: [],
      orientation: 'vertical',
      alignment: 'start',
      isNested: true
    };
    onUpdate({
      ...column,
      items: [...column.items, newColumn]
    });
    setExpandedLinkId(newColumn.id);
  };

  const updateItem = (itemIndex: number, updatedItem: ColumnChild) => {
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
    <div className={`bg-gray-800/50 rounded border ${isNested ? 'border-gray-600/50 p-2' : 'border-transparent p-0'}`}>
      {/* Column Header / Toolbar */}
      <div className={`flex items-center justify-between mb-3 pb-2 ${isNested ? 'border-b border-gray-700/50' : ''}`}>
        <span className="text-xs font-medium text-gray-300">
          {isNested ? 'Nested Column' : `Column ${index + 1}`}
        </span>
        
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
            disabled={!canAddItem}
            className={`p-1.5 rounded shadow-sm ${
              canAddItem
                ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            title={!canAddItem ? `Maximum ${maxItems} items allowed` : (isNested ? 'Add Item' : 'Add Link/Item')}
          >
            <Plus size={14} />
          </button>
          
          {!isNested && (
            <button 
              onClick={addNestedColumn}
              disabled={!canAddItem}
              className={`p-1.5 rounded shadow-sm ${
                canAddItem
                  ? 'bg-gray-600 text-white hover:bg-gray-500 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }`}
              title={!canAddItem ? `Maximum ${maxItems} items allowed` : 'Add Nested Column'}
            >
              <Grid2x2Plus size={14} />
            </button>
          )}

          {/* Remove button for nested columns */}
          {isNested && onRemove && (
            <button 
              onClick={onRemove}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded"
              title="Remove Nested Column"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Item Gap Control */}
      <div className="mb-3 px-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-300 mb-1.5 font-medium">Item Gap</label>
          <select
            value={column.itemGap || (column.orientation === 'vertical' ? 'sm' : 'md')}
            onChange={(e) => onUpdate({ ...column, itemGap: e.target.value as Size })}
            className="bg-gray-700 border border-gray-600 rounded px-2.5 py-1.5 text-white text-xs focus:border-blue-500 outline-none"
          >
            {sizeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1">
        {!canAddItem && (
          <div className="text-[10px] text-gray-400 text-center mb-2">
            Maximum {maxItems} items allowed ({currentItemCount}/{maxItems})
          </div>
        )}
        {column.items.length === 0 && (
           <div className="text-center py-3 border border-dashed border-gray-700 rounded bg-gray-800/30">
             <span className="text-[10px] text-gray-500">No items</span>
           </div>
        )}
        
        {column.items.map((child, i) => {
          
          if (child.type === 'column') {
            const nestedColumn = child as FooterColumn;
            const isSelected = selectedItemId === nestedColumn.id;
            const isExpanded = isSelected || expandedLinkId === nestedColumn.id;
            
            return (
              <div 
                key={nestedColumn.id}
                id={`panel-item-${nestedColumn.id}`}
                className={`bg-gray-700 rounded border overflow-hidden transition-all ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-600'}`}
              >
                <div 
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => setExpandedLinkId(isExpanded ? null : nestedColumn.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {isExpanded ? <ChevronDown size={12} className="text-gray-400"/> : <ChevronRight size={12} className="text-gray-400"/>}
                    <Grid2x2Plus size={12} className="text-blue-300" />
                    <span className="text-xs text-white truncate">Nested Column</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="p-2 bg-gray-700/50 border-t border-gray-600">
                    <ColumnForm
                      column={nestedColumn}
                      index={i}
                      onUpdate={(updatedCol) => updateItem(i, updatedCol)}
                      onRemove={() => removeItem(i)}
                      selectedItemId={selectedItemId}
                      isNested={true}
                    />
                  </div>
                )}
              </div>
            );
          }

          const item = child as FooterItem;
          const isSelected = selectedItemId === item.id;
          const shouldExpand = isSelected || expandedLinkId === item.id;
          
          // Display label based on available data
          const displayLabel = item.label || (item.icon ? 'Icon' : 'Untitled');
          const hasIcon = !!item.icon;
          
          return (
            <div 
              key={item.id}
              id={`panel-item-${item.id}`} // Unique ID for Scrolling
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

