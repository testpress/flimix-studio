import React from 'react';
import { FOOTER_LAYOUT_PRESETS } from './constants';
import type { FooterLayoutPreset } from './schema';

interface RowLayoutSelectorProps {
  onSelect: (preset: FooterLayoutPreset, cols: number) => void;
  onCancel: () => void;
}

const RowLayoutSelector: React.FC<RowLayoutSelectorProps> = ({ onSelect, onCancel }) => {
  return (
    <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700/50 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-300 font-medium text-sm">SELECT ROW LAYOUT</h3>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-white">Cancel</button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {FOOTER_LAYOUT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id, preset.cols)}
            className="group flex flex-col items-center gap-2 p-2 rounded border border-gray-600 hover:bg-gray-600 hover:border-blue-500 transition-all"
            title={preset.label}
          >
            {/* Visual Preview */}
            <div className={`w-full h-8 bg-gray-800 rounded overflow-hidden grid gap-0.5 p-0.5 ${preset.previewClass}`}>
              {Array.from({ length: preset.cols }).map((_, i) => (
                <div key={i} className="bg-gray-500 h-full rounded-[1px] group-hover:bg-blue-400 transition-colors" />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-white">
              {preset.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RowLayoutSelector;

