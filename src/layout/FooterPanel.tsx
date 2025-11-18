import React, { useState } from 'react';
import { Plus, Trash2, Layout, ChevronDown, ChevronRight } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { FooterRow, FooterColumn, FooterLayoutPreset, Size } from '@footer/schema';
import { MAX_FOOTER_ROWS } from '@footer/schema';
import RowLayoutSelector from '@footer/RowLayoutSelector';
import ColumnForm from '@footer/forms/ColumnForm';
import RowForm from '@footer/forms/RowForm';
import { FOOTER_LAYOUT_PRESETS } from '@footer/constants';
import { FOOTER_ROOT_ID } from '@footer/constants';
import { generateUniqueId } from '@utils/id';

interface StyleSelectProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

const StyleSelect: React.FC<StyleSelectProps> = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-300 mb-1.5 font-medium">{label}</label>
    <select
      value={value || options[0].value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:border-blue-500 outline-none"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const sizeOptions = [
  { label: 'None', value: 'none' },
  { label: 'X-Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'X-Large', value: 'xl' },
];

const fontSizeOptions = [
  { label: 'X-Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Large', value: 'lg' },
  { label: 'X-Large', value: 'xl' },
];

const maxWidthOptions = [
  { label: 'Large (Default)', value: 'lg' },
  { label: 'Medium', value: 'md' },
  { label: 'Small', value: 'sm' },
  { label: 'Full Width', value: 'none' },
];

const FooterPanel: React.FC = () => {
  const { footerSchema, updateFooterSchema, selectedId, expandedPath, selectItem } = useHeaderFooter();
  const [isAddingRow, setIsAddingRow] = useState(false);

  const currentRowCount = footerSchema.rows?.length || 0;
  const canAddRow = currentRowCount < MAX_FOOTER_ROWS;

  const handleAddRow = (presetId: FooterLayoutPreset, colCount: number) => {
    if (currentRowCount >= MAX_FOOTER_ROWS) {
      setIsAddingRow(false);
      return;
    }

    const newColumns: FooterColumn[] = Array.from({ length: colCount }).map(() => ({
      id: generateUniqueId(),
      type: 'column',
      items: [],
      orientation: 'vertical',
      alignment: 'start'
    }));

    const newRow: FooterRow = {
      id: generateUniqueId(),
      type: 'row-layout',
      preset: presetId,
      columns: newColumns
    };
    
    updateFooterSchema({
      ...footerSchema,
      rows: [...(footerSchema.rows || []), newRow]
    });
    
    setIsAddingRow(false);
  };

  const handleRemoveRow = (rowId: string) => {
    updateFooterSchema({
      ...footerSchema,
      rows: footerSchema.rows.filter(r => r.id !== rowId)
    });
  };

  const handleUpdateRow = (rowId: string, updatedRow: FooterRow) => {
    updateFooterSchema({
      ...footerSchema,
      rows: footerSchema.rows.map(r => r.id === rowId ? updatedRow : r)
    });
  };

  const handleUpdateColumnInRow = (rowId: string, colIndex: number, updatedColumn: FooterColumn) => {
    const row = footerSchema.rows.find(r => r.id === rowId);
    if (!row) return;

    const newColumns = [...row.columns];
    newColumns[colIndex] = updatedColumn;

    handleUpdateRow(rowId, { ...row, columns: newColumns });
  };

  const updateStyle = (key: string, value: string | Size) => {
    updateFooterSchema({
      ...footerSchema,
      style: { ...footerSchema.style, [key]: value }
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <div 
        className={`bg-gray-700 p-4 rounded-lg space-y-3 transition-all duration-300 ${selectedId === FOOTER_ROOT_ID ? 'ring-2 ring-blue-500' : ''}`}
        data-item-id={FOOTER_ROOT_ID}
      >
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Layout size={16} /> Footer Styles
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Background Color</label>
            <div className="flex items-center">
              <input
                type="color"
                className="w-10 h-10 rounded mr-2 border-0 p-0 cursor-pointer bg-transparent" 
                value={footerSchema.style?.backgroundColor || '#111111'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              />
              <input
                type="text"
                className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white flex-1 text-sm focus:border-blue-500 outline-none"
                value={footerSchema.style?.backgroundColor || ''}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Text Color</label>
            <div className="flex items-center">
              <input
                type="color"
                className="w-10 h-10 rounded mr-2 border-0 p-0 cursor-pointer bg-transparent" 
                value={footerSchema.style?.textColor || '#cccccc'}
                onChange={(e) => updateStyle('textColor', e.target.value)}
              />
              <input
                type="text"
                className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white flex-1 text-sm focus:border-blue-500 outline-none"
                value={footerSchema.style?.textColor || '#cccccc'}
                onChange={(e) => updateStyle('textColor', e.target.value)}
              />
            </div>
          </div>
          
          {/* Padding Select */}
          <StyleSelect
            label="Padding"
            value={footerSchema.style?.padding}
            onChange={(value) => updateStyle('padding', value as Size)}
            options={sizeOptions}
          />

          {/* Margin Select */}
          <StyleSelect
            label="Margin"
            value={footerSchema.style?.margin}
            onChange={(value) => updateStyle('margin', value as Size)}
            options={sizeOptions}
          />

          {/* Font Size Select */}
          <StyleSelect
            label="Global Font Size"
            value={footerSchema.style?.fontSize}
            onChange={(value) => updateStyle('fontSize', value as Size)}
            options={fontSizeOptions}
          />

          {/* Content Max Width Select */}
          <StyleSelect
            label="Content Max Width"
            value={footerSchema.style?.maxWidth || 'lg'}
            onChange={(value) => updateStyle('maxWidth', value as Size)}
            options={maxWidthOptions}
          />

          {/* Row Gap Select */}
          <StyleSelect
            label="Row Gap"
            value={footerSchema.style?.rowGap || 'xl'}
            onChange={(value) => updateStyle('rowGap', value as Size)}
            options={sizeOptions}
          />
        </div>
      </div>
      
      <div className="border-t border-gray-600 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-white">Layout Rows</h3>
        </div>
      
        {isAddingRow ? (
          <RowLayoutSelector 
            onSelect={handleAddRow} 
            onCancel={() => setIsAddingRow(false)} 
          />
        ) : (
          <>
            <button
              onClick={() => setIsAddingRow(true)}
              disabled={!canAddRow}
              className={`w-full py-2 text-white text-xs font-medium rounded mb-4 flex items-center justify-center gap-2 transition-colors ${
                canAddRow
                  ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
              title={!canAddRow ? `Maximum ${MAX_FOOTER_ROWS} rows allowed` : ''}
            >
              <Plus size={14} /> Add Row Layout
            </button>
            {!canAddRow && (
              <div className="text-xs text-gray-400 text-center mb-4">
                Maximum {MAX_FOOTER_ROWS} rows allowed ({currentRowCount}/{MAX_FOOTER_ROWS})
              </div>
            )}
          </>
        )}

        {/* Row List */}
        <div className="space-y-3">
          {(!footerSchema.rows || footerSchema.rows.length === 0) && !isAddingRow && (
            <div className="text-center text-gray-500 text-xs py-4 border-2 border-dashed border-gray-700 rounded">
              No rows added. Click above to start.
            </div>
          )}

          {footerSchema.rows?.map((row, rowIndex) => {
            const presetInfo = FOOTER_LAYOUT_PRESETS.find(p => p.id === row.preset);
            
            const isRowOpen = selectedId === row.id || (expandedPath as readonly string[]).includes(row.id);
            const isSelected = selectedId === row.id;

            return (
              <div 
                key={row.id}
                id={`panel-item-${row.id}`} 
                className={`rounded-lg border transition-all overflow-hidden ${
                  isSelected ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                {/* Row Header - CLICKABLE */}
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    // IMPORTANT: Manually trigger selection on click
                    selectItem(row.id, 'footer', [row.id]);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {isRowOpen ? <ChevronDown size={14} className="text-blue-400" /> : <ChevronRight size={14} className="text-gray-500" />}
                    <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      Row {rowIndex + 1}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 border border-gray-600">
                      {presetInfo?.label || row.preset}
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleRemoveRow(row.id);
                    }}
                    className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Row Content - Accordion Body */}
                {isRowOpen && (
                  <div className="p-3 border-t border-gray-700 bg-gray-900/30 space-y-4">
                    
                    {/* 1. Row Settings (Layout selector) */}
                    {isSelected && (
                      <div className="mb-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded">
                        <RowForm row={row} onUpdate={(updated) => handleUpdateRow(row.id, updated)} />
                      </div>
                    )}

                    {/* 2. Columns List */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Columns</h4>
                      {row.columns.map((col, colIndex) => {
                        const isColOpen = selectedId === col.id || (expandedPath as readonly string[]).includes(col.id);
                        
                        return (
                          <div key={col.id}>
                            {/* If Column is open, show its form */}
                            {isColOpen ? (
                              <div 
                                id={`panel-item-${col.id}`} 
                                data-item-id={col.id}
                                className={`transition-all ${selectedId === col.id ? 'ring-2 ring-blue-500 rounded' : ''}`}
                              >
                                <ColumnForm
                                  column={col}
                                  index={colIndex}
                                  onUpdate={(updatedCol) => handleUpdateColumnInRow(row.id, colIndex, updatedCol)}
                                  selectedItemId={selectedId}
                                />
                              </div>
                            ) : (
                              /* Collapsed Column State (Optional: just a clickable bar) */
                              <div 
                                id={`panel-item-${col.id}`} // Unique ID for Scrolling
                                className="p-2 bg-gray-800 border border-gray-700 rounded cursor-pointer hover:border-gray-500 flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectItem(col.id, 'footer', [row.id, col.id]);
                                }}
                              >
                                <Layout size={12} className="text-gray-500"/>
                                <span className="text-xs text-gray-400">Column {colIndex + 1}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FooterPanel;
