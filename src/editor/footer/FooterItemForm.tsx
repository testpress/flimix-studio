import React from 'react';
import type { FooterItem } from '@editor/footer/schema';

interface FooterItemFormProps {
  item: FooterItem;
  updateFooterItem: (updatedItem: FooterItem) => void;
  isColumnItem?: boolean;
}

const FooterItemForm: React.FC<FooterItemFormProps> = ({ 
  item, 
  updateFooterItem,
  isColumnItem = false
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as FooterItem['type'];
    updateFooterItem({
      ...item,
      type: newType
    });
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFooterItem({
      ...item,
      label: e.target.value
    });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFooterItem({
      ...item,
      link: e.target.value
    });
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFooterItem({
      ...item,
      icon: e.target.value
    });
  };



  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-0.5">Type</label>
          <select
            value={item.type}
            onChange={handleTypeChange}
            className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
          >
            <option value="internal">Internal Link</option>
            <option value="external">External Link</option>
            <option value="anchor">Anchor Link</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-0.5">Label</label>
          <input
            type="text"
            value={item.label || ''}
            onChange={handleLabelChange}
            className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
            placeholder="Link label"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-0.5">
          {item.type === 'external' ? 'URL' : item.type === 'anchor' ? 'Anchor' : 'Path'}
        </label>
        <input
          type="text"
          value={item.link || ''}
          onChange={handleLinkChange}
          className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
          placeholder={
            item.type === 'external' 
              ? 'https://example.com' 
              : item.type === 'anchor' 
                ? '#section-id' 
                : '/page-path'
          }
        />
      </div>

      {/* Icon and styling options - only for row items */}
      {!isColumnItem && (
        <>
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 mb-0.5">Icon URL</label>
            <input
              type="text"
              value={item.icon || ''}
              onChange={handleIconChange}
              className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-xs"
              placeholder="https://example.com/icon.svg"
            />
          </div>

        </>
      )}
    </div>
  );
};

export default FooterItemForm;
