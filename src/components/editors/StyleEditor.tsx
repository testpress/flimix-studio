import React from 'react';
import type { StyleProps } from '../../schema/blockTypes';

interface StyleEditorProps {
  style: StyleProps;
  onChange: (newStyle: StyleProps) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ style, onChange }) => {
  const handleStyleChange = (field: keyof StyleProps, value: any) => {
    const newStyle = {
      ...style,
      [field]: value
    };
    onChange(newStyle);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">🧩 Style Editor</h3>
      <div className="space-y-3">
        {/* Spacing */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Padding</label>
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={style.padding || ''}
              onChange={(e) => handleStyleChange('padding', e.target.value || undefined)}
            >
              <option value="">Default</option>
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Margin</label>
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={style.margin || ''}
              onChange={(e) => handleStyleChange('margin', e.target.value || undefined)}
            >
              <option value="">Default</option>
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Text Alignment</label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={style.textAlign || ''}
            onChange={(e) => handleStyleChange('textAlign', e.target.value || undefined)}
          >
            <option value="">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Text Color</label>
            <input
              type="color"
              value={style.textColor || '#000000'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Border and Shadow */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Border Radius</label>
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={style.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value || undefined)}
            >
              <option value="">Default</option>
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Box Shadow</label>
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={style.boxShadow || ''}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value || undefined)}
            >
              <option value="">Default</option>
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>

        {/* Max Width */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Max Width</label>
          <input
            type="text"
            value={style.maxWidth || ''}
            onChange={(e) => handleStyleChange('maxWidth', e.target.value || undefined)}
            placeholder="e.g., 1024px, 80%, 50rem"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default StyleEditor; 