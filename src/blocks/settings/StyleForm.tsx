import React from 'react';
import type { StyleProps, Theme, Padding, TextAlign, BorderRadius, BoxShadow, StyleValue } from '@blocks/shared/Style';

interface StyleFormProps {
  style: StyleProps;
  onChange: (newStyle: StyleProps) => void;
}

const StyleForm: React.FC<StyleFormProps> = ({ style, onChange }) => {
  const handleStyleChange = (key: keyof StyleProps, value: StyleValue) => {
    onChange({
      ...style,
      [key]: value
    });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-4">Style Settings</h3>
      
      <div className="space-y-4">
        {/* Theme */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Theme</label>
          <select
            value={style.theme || 'light'}
            onChange={(e) => handleStyleChange('theme', e.target.value as Theme)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Padding</label>
          <select
            value={style.padding || 'md'}
            onChange={(e) => handleStyleChange('padding', e.target.value as Padding)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        {/* Margin */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Margin</label>
          <select
            value={style.margin || 'none'}
            onChange={(e) => handleStyleChange('margin', e.target.value as Padding)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        {/* Text Alignment */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Text Alignment</label>
          <select
            value={style.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value as TextAlign)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Background Color</label>
          <input
            type="color"
            value={style.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded text-sm"
          />
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Text Color</label>
          <input
            type="color"
            value={style.textColor || '#000000'}
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded text-sm"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Border Radius</label>
          <select
            value={style.borderRadius || 'none'}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value as BorderRadius)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        {/* Box Shadow */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Box Shadow</label>
          <select
            value={style.boxShadow || 'none'}
            onChange={(e) => handleStyleChange('boxShadow', e.target.value as BoxShadow)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        {/* Max Width */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Max Width</label>
          <input
            type="text"
            value={style.maxWidth || ''}
            onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
            placeholder="e.g., 1200px, 100%"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default StyleForm; 