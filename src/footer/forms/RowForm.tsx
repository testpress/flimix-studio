import React from 'react';
import type { FooterRow, FooterLayoutPreset } from '../schema';
import { FOOTER_LAYOUT_PRESETS } from '../constants';
import { generateUniqueId } from '@utils/id';

interface RowFormProps {
  row: FooterRow;
  onUpdate: (updatedRow: FooterRow) => void;
}

const RowForm: React.FC<RowFormProps> = ({ row, onUpdate }) => {
  
  const handlePresetChange = (newPresetId: FooterLayoutPreset) => {
    const newPresetConfig = FOOTER_LAYOUT_PRESETS.find(p => p.id === newPresetId);
    if (!newPresetConfig) return;

    const currentCols = row.columns;
    const targetColCount = newPresetConfig.cols;
    let newColumns = [...currentCols];

    if (newColumns.length < targetColCount) {
      const colsToAdd = targetColCount - newColumns.length;
      for (let i = 0; i < colsToAdd; i++) {
        newColumns.push({
          id: generateUniqueId(),
          type: 'column',
          items: [],
          orientation: 'vertical',
          alignment: 'start'
        });
      }
    } else if (newColumns.length > targetColCount) {
      newColumns = newColumns.slice(0, targetColCount);
    }

    onUpdate({ ...row, preset: newPresetId, columns: newColumns });
  };

  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-600 mb-4">
      <label className="text-xs font-semibold text-gray-300 mb-2 block">Row Layout</label>
      
      <div className="grid grid-cols-4 gap-2">
        {FOOTER_LAYOUT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetChange(preset.id)}
            title={preset.label}
            className={`
              group flex flex-col items-center gap-1 p-1.5 rounded border transition-all
              ${row.preset === preset.id 
                ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' 
                : 'bg-gray-700 border-gray-600 hover:border-gray-400 hover:bg-gray-600'}
            `}
          >
            <div className={`w-full h-4 bg-gray-800 rounded overflow-hidden grid gap-0.5 ${preset.previewClass}`}>
              {Array.from({ length: preset.cols }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-full rounded-[1px] ${row.preset === preset.id ? 'bg-blue-400' : 'bg-gray-400 group-hover:bg-gray-300'}`} 
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RowForm;

