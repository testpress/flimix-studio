import React, { useState } from 'react';
import { Plus, Trash2, Layout, ChevronDown, ChevronRight } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { FooterRow, FooterColumn, FooterLayoutPreset } from '@footer/schema';
import RowLayoutSelector from '@footer/RowLayoutSelector';
import ColumnForm from '@footer/forms/ColumnForm';
import RowForm from '@footer/forms/RowForm';
import { FOOTER_LAYOUT_PRESETS } from '@footer/constants';
import { FOOTER_ROOT_ID } from '@footer/constants';

const FooterPanel: React.FC = () => {
  const { footerSchema, updateFooterSchema, selectedId, expandedPath, selectItem } = useHeaderFooter();
  const [isAddingRow, setIsAddingRow] = useState(false);

  const handleAddRow = (presetId: FooterLayoutPreset, colCount: number) => {
    const newColumns: FooterColumn[] = Array.from({ length: colCount }).map((_, i) => ({
      id: `col-${Date.now()}-${i}`,
      type: 'column',
      items: [],
      orientation: 'vertical',
      alignment: 'start'
    }));

    const newRow: FooterRow = {
      id: `row-${Date.now()}`,
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

  const updateStyle = (key: string, value: string) => {
    updateFooterSchema({
      ...footerSchema,
      style: { ...footerSchema.style, [key]: value }
    });
  };

  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'vertical' | 'horizontal') => {
    const currentPadding = footerSchema.style?.padding || '40px 20px';
    const parts = currentPadding.trim().split(/\s+/);
    
    const currentVertical = parts[0] || '40px';
    const currentHorizontal = parts[1] || '20px';
    
    let val = parseInt(e.target.value) || 0;

    // Enforce Limits (max 100 vertical, max 400 horizontal)
    if (type === 'vertical') {
      if (val > 100) val = 100;
      if (val < 0) val = 0;
    } else {
      if (val > 400) val = 400;
      if (val < 0) val = 0;
    }
    
    let newPadding = '';
    if (type === 'vertical') {
      newPadding = `${val}px ${currentHorizontal}`;
    } else {
      newPadding = `${currentVertical} ${val}px`;
    }
    
    updateStyle('padding', newPadding);
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
                value={footerSchema.style?.backgroundColor || '#111111'}
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
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Padding</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Vertical</label>
                <input
                  type="number"
                  value={parseInt(footerSchema.style?.padding?.split(' ')[0] || '40')}
                  onChange={(e) => handlePaddingChange(e, 'vertical')}
                  className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white w-full text-sm focus:border-blue-500 outline-none"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Horizontal</label>
                <input
                  type="number"
                  value={parseInt(footerSchema.style?.padding?.split(' ')[1] || '20')}
                  onChange={(e) => handlePaddingChange(e, 'horizontal')}
                  className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white w-full text-sm focus:border-blue-500 outline-none"
                  min="0"
                  max="400"
                  step="1"
                />
              </div>
            </div>
          </div>
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
          <button
            onClick={() => setIsAddingRow(true)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded mb-4 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={14} /> Add Row Layout
          </button>
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
