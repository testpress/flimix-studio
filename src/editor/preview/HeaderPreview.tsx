import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HeaderSchema } from '@editor/header/schema';

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

  // Get layout settings
  const logoPosition = headerSchema.layout?.logoPosition || 'start';
  const showTitle = headerSchema.layout?.showTitle !== false;
  const navigationAlignment = headerSchema.layout?.navigationAlignment || 'left';
  
  // Get items
  const logoItem = headerSchema.items.find(item => item.type === 'logo');
  const titleItem = headerSchema.items.find(item => item.type === 'title');
  const navigationItems = headerSchema.items.filter(item => item.type !== 'logo' && item.type !== 'title');
  
  // Determine navigation alignment classes
  const getNavigationAlignmentClass = () => {
    switch (navigationAlignment) {
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  return (
    <div 
      className="border-b border-gray-800"
      style={{
        backgroundColor: headerSchema.style?.backgroundColor || '#111111',
        color: headerSchema.style?.textColor || '#ffffff',
        padding: headerSchema.style?.padding || '10px 20px'
      }}
    >
      <div className="flex items-center px-4">
        {/* Left side content (logo and title when logo is at start) */}
        <div className="flex items-center space-x-6">
          {logoPosition === 'start' && logoItem?.attrs?.src && (
            <div 
              className={`cursor-pointer ${selectedItemId === logoItem.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onItemSelect(logoItem.id || '')}
            >
              <img 
                src={logoItem.attrs.src}
                alt={logoItem.attrs.alt || 'Logo'}
                style={{
                  objectFit: 'contain',
                  maxHeight: '40px'
                }}
              />
            </div>
          )}
          
          {showTitle && titleItem?.label && (
            <div 
              className={`cursor-pointer ${selectedItemId === titleItem.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onItemSelect(titleItem.id || '')}
            >
              <span 
                style={{
                  fontSize: titleItem.style?.fontSize || '24px',
                  color: titleItem.style?.color || '#ffffff'
                }}
              >
                {titleItem.label}
              </span>
            </div>
          )}
        </div>
        
        {/* Navigation Items */}
        <div className={`flex items-center space-x-4 flex-1 ${getNavigationAlignmentClass()} ${navigationAlignment === 'left' ? 'ml-8' : ''}`}>
          {navigationItems.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`relative cursor-pointer ${selectedItemId === item.id ? 'ring-2 ring-blue-500 rounded px-2' : ''}`}
              onClick={() => onItemSelect(item.id || '')}
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
          ))}
        </div>
        
        {/* Right side content (logo when positioned at end) */}
        {logoPosition === 'end' && logoItem?.attrs?.src && (
          <div 
            className={`cursor-pointer ${selectedItemId === logoItem.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => onItemSelect(logoItem.id || '')}
          >
            <img 
              src={logoItem.attrs.src}
              alt={logoItem.attrs.alt || 'Logo'}
              style={{
                objectFit: 'contain',
                maxHeight: '40px'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderPreview;
