import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { FooterColumn, FooterLinkItem } from './schema';
import { FOOTER_LINKS_MAX } from './schema';
import { generateUniqueId } from '@utils/id';
import { Plus, Trash2, Link } from 'lucide-react';

interface FooterItemFormProps {
  item: FooterColumn;
  onChange: (updatedItem: FooterColumn) => void;
  title: string;
}

const FooterItemForm: React.FC<FooterItemFormProps> = ({ 
  item, 
  onChange, 
  title
}) => {
  const fields = [
    {
      key: 'title' as keyof FooterColumn,
      label: 'Item Title',
      type: 'text' as const,
      placeholder: 'Enter item title...',
      required: false
    }
  ];

  const handleAddLink = () => {
    if ((item.links?.length || 0) >= FOOTER_LINKS_MAX) return;
    
    const newLink: FooterLinkItem = {
      id: generateUniqueId(),
      label: 'New Link',
      url: '/new-link'
    };
    
    const updatedLinks = [...(item.links || []), newLink];
    onChange({ ...item, links: updatedLinks });
  };

  const handleRemoveLink = (linkId: string) => {
    const updatedLinks = (item.links || []).filter(link => link.id !== linkId);
    onChange({ ...item, links: updatedLinks });
  };

  const handleLinkChange = (linkId: string, field: keyof FooterLinkItem, value: string | boolean) => {
    const updatedLinks = (item.links || []).map(link => 
      link.id === linkId ? { ...link, [field]: value } : link
    );
    onChange({ ...item, links: updatedLinks });
  };

  const linksCount = item.links?.length || 0;
  const isAtLinksLimit = linksCount >= FOOTER_LINKS_MAX;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">{title}</h3>
      
      {/* Use BaseItemForm for the title field */}
      <BaseItemForm<FooterColumn>
        item={item}
        onChange={onChange}
        title={title}
        fields={fields}
      />

      {/* Links Management */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">Item Links</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {linksCount}/{FOOTER_LINKS_MAX}
            </span>
            <button
              onClick={handleAddLink}
              disabled={isAtLinksLimit}
              className={`inline-flex items-center px-2 py-1 text-xs rounded-md focus:ring-2 focus:ring-offset-2 transition-colors font-medium ${
                isAtLinksLimit
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Link
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {item.links && item.links.map((link) => (
            <div key={link.id} className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200">
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Link label"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Link URL"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={link.external || false}
                    onChange={(e) => handleLinkChange(link.id, 'external', e.target.checked)}
                    className="mr-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600">External</span>
                </label>
                <button
                  onClick={() => handleRemoveLink(link.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Remove link"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {(!item.links || item.links.length === 0) && (
          <div className="text-center py-4 text-gray-500">
            <Link className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-xs">No links added yet</p>
            <p className="text-xs text-gray-400">Add your first link above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterItemForm;
