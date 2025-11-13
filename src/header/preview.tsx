import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HeaderSchema } from './schema';
import { HEADER_ROOT_ID } from '@footer/constants';

interface HeaderPreviewProps {
  headerSchema: HeaderSchema;
  selectedItemId: string | null;
  onItemSelect: (id: string) => void;
}

const HeaderPreview: React.FC<HeaderPreviewProps> = ({
  headerSchema,
  selectedItemId,
  onItemSelect
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getSelectionClass = (id: string) => 
    selectedItemId === id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black relative z-10' : '';

  return (
    <div 
      className={`border-b border-gray-800 transition-all duration-200 ${getSelectionClass(HEADER_ROOT_ID)}`}
      style={{
        backgroundColor: headerSchema.style?.backgroundColor || '#111111',
        color: headerSchema.style?.textColor || '#ffffff',
        padding: headerSchema.style?.padding || '10px 20px'
      }}
      onClick={() => onItemSelect(HEADER_ROOT_ID)}
    >
      <div className="flex items-center space-x-6 px-4">
        {/* Logo */}
        {headerSchema.items.find(item => item.type === 'logo')?.attrs?.src && (
          <div 
            className={`cursor-pointer ${selectedItemId === headerSchema.items.find(item => item.type === 'logo')?.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onItemSelect(headerSchema.items.find(item => item.type === 'logo')?.id || '');
            }}
          >
            <img 
              src={headerSchema.items.find(item => item.type === 'logo')?.attrs?.src}
              alt={headerSchema.items.find(item => item.type === 'logo')?.attrs?.alt || 'Logo'}
              style={{
                objectFit: 'contain',
                maxHeight: '40px'
              }}
            />
          </div>
        )}
        
        {/* Title */}
        {headerSchema.items.find(item => item.type === 'title')?.label && (
          <div 
            className={`cursor-pointer ${selectedItemId === headerSchema.items.find(item => item.type === 'title')?.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onItemSelect(headerSchema.items.find(item => item.type === 'title')?.id || '');
            }}
          >
            <span 
              style={{
                fontSize: headerSchema.items.find(item => item.type === 'title')?.style?.fontSize || '24px',
                color: headerSchema.items.find(item => item.type === 'title')?.style?.color || '#ffffff'
              }}
            >
              {headerSchema.items.find(item => item.type === 'title')?.label}
            </span>
          </div>
        )}
        
        {/* Menu Items */}
        <div className="flex items-center space-x-4 ml-auto">
          {headerSchema.items
            .filter(item => item.type !== 'logo' && item.type !== 'title')
            .map((item, index) => (
              <div 
                key={item.id || index} 
                className={`relative cursor-pointer ${selectedItemId === item.id ? 'ring-2 ring-blue-500 rounded px-2' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onItemSelect(item.id || '');
                }}
              >
                {item.type === 'dropdown' ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === item.label ? null : item.label || '');
                      }}
                      className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdown === item.label && item.items && (
                      <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                        {item.items.map((subItem, subIndex) => (
                          <div
                            key={subItem.id || subIndex}
                            className={`block px-4 py-2 text-sm hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                              selectedItemId === subItem.id ? 'bg-blue-900' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemSelect(subItem.id || '');
                            }}
                          >
                            {subItem.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="cursor-pointer hover:text-blue-400 transition-colors">
                    {item.label}
                  </span>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default HeaderPreview;

