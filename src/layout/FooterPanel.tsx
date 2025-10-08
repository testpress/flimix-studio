import React from 'react';
import { Plus } from 'lucide-react';
import type { FooterSchema, FooterItem } from '@footer/schema';
import ColumnForm from '@footer/ColumnForm';
import RowForm from '@footer/RowForm';

interface FooterPanelProps {
  footerSchema: FooterSchema;
  updateFooterSchema: (updatedSchema: FooterSchema) => void;
  selectedItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const FooterPanel: React.FC<FooterPanelProps> = ({ 
  footerSchema, 
  updateFooterSchema,
  selectedItemId,
  onSelectItem
}) => {
  const columns = footerSchema.items.filter(item => item.type === 'column');
  const rows = footerSchema.items.filter(item => item.type === 'row');

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFooterSchema({
      ...footerSchema,
      style: {
        ...footerSchema.style,
        backgroundColor: e.target.value
      }
    });
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFooterSchema({
      ...footerSchema,
      style: {
        ...footerSchema.style,
        textColor: e.target.value
      }
    });
  };

  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFooterSchema({
      ...footerSchema,
      style: {
        ...footerSchema.style,
        padding: e.target.value
      }
    });
  };

  const handleAddColumn = () => {
    const newColumn: FooterItem = {
      id: `column-${Date.now()}`,
      type: 'column',
      items: []
    };
    
    updateFooterSchema({
      ...footerSchema,
      items: [...footerSchema.items, newColumn]
    });
    
    if (onSelectItem) {
      onSelectItem(newColumn.id || '');
    }
  };

  const handleAddRow = () => {
    const newRow: FooterItem = {
      id: `row-${Date.now()}`,
      type: 'row',
      items: []
    };
    
    updateFooterSchema({
      ...footerSchema,
      items: [...footerSchema.items, newRow]
    });
    
    if (onSelectItem) {
      onSelectItem(newRow.id || '');
    }
  };

  const handleUpdateColumns = (updatedColumns: FooterItem[]) => {
    const nonColumnItems = footerSchema.items.filter(item => item.type !== 'column');
    const updatedItems = [...nonColumnItems, ...updatedColumns];
    
    updateFooterSchema({
      ...footerSchema,
      items: updatedItems
    });
  };

  const handleUpdateRows = (updatedRows: FooterItem[]) => {
    const nonRowItems = footerSchema.items.filter(item => item.type !== 'row');
    const updatedItems = [...nonRowItems, ...updatedRows];
    
    updateFooterSchema({
      ...footerSchema,
      items: updatedItems
    });
  };

  return (
    <div className="space-y-4">
      {/* Footer Styles */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Footer Styles</h3>
        
        <div className="space-y-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Background Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={footerSchema.style?.backgroundColor || '#111111'}
                onChange={handleBackgroundColorChange}
                className="w-10 h-10 rounded mr-2 border-0"
              />
              <input
                type="text"
                value={footerSchema.style?.backgroundColor || '#111111'}
                onChange={handleBackgroundColorChange}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white flex-1"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Text Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={footerSchema.style?.textColor || '#cccccc'}
                onChange={handleTextColorChange}
                className="w-10 h-10 rounded mr-2 border-0"
              />
              <input
                type="text"
                value={footerSchema.style?.textColor || '#cccccc'}
                onChange={handleTextColorChange}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white flex-1"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Padding</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Vertical</label>
                <input
                  type="number"
                  value={parseInt(footerSchema.style?.padding?.split(' ')[0] || '40px')}
                  onChange={(e) => {
                    const horizontal = footerSchema.style?.padding?.split(' ')[1] || '20px';
                    handlePaddingChange({ target: { value: `${e.target.value}px ${horizontal}` } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-full"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Horizontal</label>
                <input
                  type="number"
                  value={parseInt(footerSchema.style?.padding?.split(' ')[1] || '20px')}
                  onChange={(e) => {
                    const vertical = footerSchema.style?.padding?.split(' ')[0] || '40px';
                    handlePaddingChange({ target: { value: `${vertical} ${e.target.value}px` } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-full"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Columns */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Columns</h3>
          <button
            onClick={handleAddColumn}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Column
          </button>
        </div>
        
        <ColumnForm
          columns={columns} 
          updateColumns={handleUpdateColumns}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      </div>
      
      {/* Rows */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Rows</h3>
          <button
            onClick={handleAddRow}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Row
          </button>
        </div>
        
        <RowForm
          rows={rows} 
          updateRows={handleUpdateRows}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      </div>
    </div>
  );
};

export default FooterPanel;
