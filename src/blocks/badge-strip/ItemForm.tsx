import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { BadgeStripItem } from './schema';
import { Plus, Trash2, Link, MessageSquare, Award, Star, CheckCircle, Monitor, Volume2, Smartphone, Sun, Globe, Zap, Shield, Heart, Camera, Music, Video, Gamepad2, Palette } from 'lucide-react';

interface BadgeStripItemFormProps {
  item: BadgeStripItem;
  onChange: (updatedItem: BadgeStripItem) => void;
  title: string;
}

// Constants moved outside component to prevent recreation on every render
const fields = [
  {
    key: 'label' as keyof BadgeStripItem,
    label: 'Badge Label',
    type: 'text' as const,
    placeholder: 'Enter badge label...',
    required: false
  }
];

// Popular Lucide icons for badges
const popularIcons = [
  { name: 'Award', icon: Award },
  { name: 'Star', icon: Star },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'Monitor', icon: Monitor },
  { name: 'Volume2', icon: Volume2 },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Sun', icon: Sun },
  { name: 'Globe', icon: Globe },
  { name: 'Zap', icon: Zap },
  { name: 'Shield', icon: Shield },
  { name: 'Heart', icon: Heart },
  { name: 'Camera', icon: Camera },
  { name: 'Music', icon: Music },
  { name: 'Video', icon: Video },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Palette', icon: Palette }
];

// Style control configurations to reduce repetitive code
const styleControls = [
  {
    key: 'padding' as const,
    label: 'Padding',
    type: 'select' as const,
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' }
    ],
    defaultValue: 'md'
  },
  {
    key: 'margin' as const,
    label: 'Margin',
    type: 'select' as const,
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' }
    ],
    defaultValue: 'sm'
  },
  {
    key: 'borderRadius' as const,
    label: 'Border Radius',
    type: 'select' as const,
    options: [
      { value: 'none', label: 'None' },
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' }
    ],
    defaultValue: 'md'
  },
  {
    key: 'boxShadow' as const,
    label: 'Box Shadow',
    type: 'select' as const,
    options: [
      { value: 'none', label: 'None' },
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' }
    ],
    defaultValue: 'md'
  }
];

const BadgeStripItemForm: React.FC<BadgeStripItemFormProps> = ({ 
  item, 
  onChange, 
  title
}) => {
  const handleAddLink = () => {
    if (!item.link) {
      onChange({ ...item, link: 'https://example.com' });
    }
  };

  const handleRemoveLink = () => {
    onChange({ ...item, link: undefined });
  };

  const handleAddTooltip = () => {
    if (!item.tooltip) {
      onChange({ ...item, tooltip: 'Badge description' });
    }
  };

  const handleRemoveTooltip = () => {
    onChange({ ...item, tooltip: undefined });
  };

  // Handle style changes
  const handleStyleChange = (key: keyof NonNullable<BadgeStripItem['style']>, value: string) => {
    const currentStyle = item.style || {};
    const newStyle = { ...currentStyle, [key]: value };
    onChange({ ...item, style: newStyle });
  };

  // Render style control based on type
  const renderStyleControl = (control: typeof styleControls[0]) => {
    const currentValue = item.style?.[control.key] || control.defaultValue;
    
    return (
      <div key={control.key}>
        <label className="block text-sm text-gray-700 mb-1">{control.label}</label>
        <select
          value={currentValue}
          onChange={(e) => handleStyleChange(control.key, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {control.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">{title}</h3>
      
      {/* Use BaseItemForm for the label field */}
      <BaseItemForm<BadgeStripItem>
        item={item}
        onChange={onChange}
        title={title}
        fields={fields}
      />

      {/* Icon Management */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">Badge Icon</h4>
        </div>
        
        <div className="space-y-3">
          {/* Icon Selector */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Select Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {popularIcons.map(({ name, icon: IconComponent }) => (
                <button
                  key={name}
                  onClick={() => onChange({ ...item, icon: name })}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    item.icon === name
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={name}
                >
                  <IconComponent className="w-5 h-5 mx-auto" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Icon Preview */}
          {item.icon && (
            <div className="flex items-center space-x-2 p-2 bg-white rounded border">
              <span className="text-xs text-gray-500">Preview:</span>
              <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">
                {(() => {
                  const IconComponent = popularIcons.find(icon => icon.name === item.icon)?.icon;
                  return IconComponent ? <IconComponent className="w-4 h-4" /> : <span className="text-xs">?</span>;
                })()}
              </div>
              <span className="text-xs font-mono text-gray-600">{item.icon}</span>
            </div>
          )}
        </div>
      </div>

      {/* Link Management */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">Badge Link</h4>
          <div className="flex items-center gap-2">
            {item.link ? (
              <button
                onClick={handleRemoveLink}
                className="p-1.5 rounded-md transition-colors text-red-600 hover:bg-red-100 hover:text-red-700"
                title="Remove link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddLink}
                className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors font-medium"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Link
              </button>
            )}
          </div>
        </div>
        
        {item.link && (
          <input
            type="text"
            value={item.link}
            onChange={(e) => onChange({ ...item, link: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Link URL"
          />
        )}
        
        {!item.link && (
          <div className="text-center py-4 text-gray-500">
            <Link className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-xs">No link added</p>
            <p className="text-xs text-gray-400">Add a link above to make this badge clickable</p>
          </div>
        )}
      </div>

      {/* Tooltip Management */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">Badge Tooltip</h4>
          <div className="flex items-center gap-2">
            {item.tooltip ? (
              <button
                onClick={handleRemoveTooltip}
                className="p-1.5 rounded-md transition-colors text-red-600 hover:bg-red-100 hover:text-red-700"
                title="Remove tooltip"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddTooltip}
                className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Tooltip
              </button>
            )}
          </div>
        </div>
        
        {item.tooltip && (
          <textarea
            value={item.tooltip}
            onChange={(e) => onChange({ ...item, tooltip: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tooltip text (appears on hover)"
            rows={2}
          />
        )}
        
        {!item.tooltip && (
          <div className="text-center py-4 text-gray-500">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-xs">No tooltip added</p>
            <p className="text-xs text-gray-400">Add a tooltip above for better user experience</p>
          </div>
        )}
      </div>

      {/* Item Styling */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Item Styling</h4>
        
        {/* Style Controls */}
        <div className="space-y-4">
          {/* Color Controls */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={item.style?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Text Color</label>
            <input
              type="color"
              value={item.style?.textColor || '#000000'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Data-driven Style Controls */}
          {styleControls.map(renderStyleControl)}
        </div>
      </div>
    </div>
  );
};

export default BadgeStripItemForm;
