// src/footer/FooterItemEditor.tsx
import React from 'react';
import type { FooterItem, IconSize } from './schema';

interface ColumnItemEditorProps {
  item: FooterItem;
  onChange: (updatedItem: FooterItem) => void;
}

const SIZE_OPTIONS: { value: IconSize; label: string }[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
];

const ColumnItemEditor: React.FC<ColumnItemEditorProps> = ({ item, onChange }) => {
  
  const handleLinkTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLinkType = e.target.value as 'internal' | 'external' | 'anchor';
    onChange({ ...item, linkType: newLinkType });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...item, url: e.target.value });
  };

  const currentSize = item.style?.size || 'md';
  const currentLinkType = item.linkType || 'internal';

  return (
    <div className="space-y-3 pt-2">
      {/* Label */}
      <div>
        <label className="text-[10px] text-gray-400 block mb-1">
          Label <span className="text-gray-600">(Optional if Icon present)</span>
        </label>
        <input
          type="text"
          value={item.label || ''}
          onChange={(e) => onChange({ ...item, label: e.target.value })}
          className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
          placeholder="e.g. About Us"
        />
      </div>

      {/* Link Type and URL */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-gray-400 block mb-1">Type</label>
          <select
            value={currentLinkType}
            onChange={handleLinkTypeChange}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
          >
            <option value="internal">Internal Link</option>
            <option value="external">External Link</option>
            <option value="anchor">Anchor Link</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-gray-400 block mb-1">
            {currentLinkType === 'external' ? 'URL' : currentLinkType === 'anchor' ? 'Anchor' : 'Path'}
          </label>
          <input
            type="text"
            value={item.url || ''}
            onChange={handleUrlChange}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
            placeholder={
              currentLinkType === 'external' 
                ? 'https://example.com' 
                : currentLinkType === 'anchor' 
                  ? '#section-id' 
                  : '/page-path'
            }
          />
        </div>
      </div>

      {/* Icon Configuration */}
      <div className="pt-2 border-t border-gray-700/50">
        <label className="text-[10px] font-semibold text-gray-400 block mb-2">Image / Icon Settings</label>
        
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Source URL</label>
            <input
              type="text"
              value={item.icon || ''}
              onChange={(e) => onChange({ ...item, icon: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          {/* Fixed Size Selector */}
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Icon Size</label>
            <div className="flex bg-gray-900/50 rounded border border-gray-700 p-0.5">
              {SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange({ ...item, style: { ...item.style, size: option.value } })}
                  className={`
                    flex-1 py-1 text-[10px] font-medium rounded transition-all
                    ${currentSize === option.value 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                  `}
                  title={`Size: ${option.label}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnItemEditor;
