import React from 'react';
import { Plus } from 'lucide-react';
import type { FooterSchema, FooterItem } from '@editor/footer/schema';
import ColumnForm from '@editor/footer/ColumnForm';
import RowForm from '@editor/footer/RowForm';

interface FooterSectionEditorProps {
  footerSchema: FooterSchema;
  onUpdate: (updatedSchema: FooterSchema) => void;
  selectedItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const FooterSectionForm: React.FC<FooterSectionEditorProps> = ({ 
  footerSchema, 
  onUpdate,
  selectedItemId,
  onSelectItem
}) => {
  // Find columns and rows from the schema
  const columns = footerSchema.items.filter(item => item.type === 'column');
  const rows = footerSchema.items.filter(item => item.type === 'row');

  // Handle background color change
  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...footerSchema,
      style: {
        ...footerSchema.style,
        backgroundColor: e.target.value
      }
    });
  };

  // Handle text color change
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...footerSchema,
      style: {
        ...footerSchema.style,
        textColor: e.target.value
      }
    });
  };

  // Handle padding change
  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...footerSchema,
      style: {
        ...footerSchema.style,
        padding: e.target.value
      }
    });
  };

  // Handle adding new column
  const handleAddColumn = () => {
    const newColumn: FooterItem = {
      id: `column-${Date.now()}`,
      type: 'column',
      items: []
    };
    
    onUpdate({
      ...footerSchema,
      items: [...footerSchema.items, newColumn]
    });
  };

  // Handle adding new row
  const handleAddRow = () => {
    const newRow: FooterItem = {
      id: `row-${Date.now()}`,
      type: 'row',
      items: []
    };
    
    onUpdate({
      ...footerSchema,
      items: [...footerSchema.items, newRow]
    });
  };

  // Handle updating columns
  const handleUpdateColumns = (updatedColumns: FooterItem[]) => {
    const nonColumns = footerSchema.items.filter(item => item.type !== 'column');
    onUpdate({
      ...footerSchema,
      items: [...nonColumns, ...updatedColumns]
    });
  };

  // Handle updating rows
  const handleUpdateRows = (updatedRows: FooterItem[]) => {
    const nonRows = footerSchema.items.filter(item => item.type !== 'row');
    onUpdate({
      ...footerSchema,
      items: [...nonRows, ...updatedRows]
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
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Padding (px)</label>
            <input
              type="number"
              value={parseInt(footerSchema.style?.padding?.split(' ')[0] || '40px')}
              onChange={(e) => handlePaddingChange({ target: { value: e.target.value + 'px 20px' } } as React.ChangeEvent<HTMLInputElement>)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              min="0"
              max="100"
              step="1"
            />
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
          onUpdate={handleUpdateColumns}
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
          onUpdate={handleUpdateRows}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      </div>
    </div>
  );
};

export default FooterSectionForm;
