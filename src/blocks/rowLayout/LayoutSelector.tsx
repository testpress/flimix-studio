import React from 'react';
import { ROW_LAYOUT_PRESETS } from './constants';
import type { RowLayoutPreset } from './schema';

interface LayoutSelectorProps {
  onLayoutSelect: (preset: RowLayoutPreset, cols: number) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ onLayoutSelect }) => {
  return (
    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
      <h3 className="text-gray-600 font-medium mb-6 text-lg">SELECT YOUR LAYOUT</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
        {ROW_LAYOUT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={(e) => {
              e.stopPropagation();
              onLayoutSelect(preset.id, preset.cols);
            }}
            className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={preset.label}
          >
            {/* Visual Preview of the Layout */}
            <div className={`w-32 h-16 bg-white border border-gray-300 rounded overflow-hidden grid gap-1 p-1 ${preset.previewClass}`}>
              {Array.from({ length: preset.cols }).map((_, i) => (
                <div key={i} className="bg-gray-200 h-full rounded-sm group-hover:bg-gray-300 transition-colors" />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium group-hover:text-gray-700">
              {preset.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;

