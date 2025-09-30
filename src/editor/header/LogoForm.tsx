import React from 'react';
import type { HeaderItem } from '@editor/header/schema';

interface LogoEditorProps {
  logoItem: HeaderItem;
  onUpdate: (updatedItem: HeaderItem) => void;
}

const LogoForm: React.FC<LogoEditorProps> = ({ logoItem, onUpdate }) => {
  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItem = {
      ...logoItem,
      attrs: {
        ...logoItem.attrs,
        src: e.target.value
      }
    };
    onUpdate(updatedItem);
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItem = {
      ...logoItem,
      attrs: {
        ...logoItem.attrs,
        alt: e.target.value
      }
    };
    onUpdate(updatedItem);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Logo URL</label>
        <input
          type="text"
          value={logoItem.attrs?.src || ''}
          onChange={handleSrcChange}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="https://example.com/logo.png"
        />
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Alt Text</label>
        <input
          type="text"
          value={logoItem.attrs?.alt || ''}
          onChange={handleAltChange}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          placeholder="Company logo"
        />
      </div>
    </div>
  );
};

export default LogoForm;
