import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { ExpansionPath } from '@context/HeaderFooterContext';
import { HEADER_ROOT_ID } from '@footer/constants';

const HeaderPreview: React.FC = () => {
  const { headerSchema, selectItem, selectedId } = useHeaderFooter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const logoItem = headerSchema.items.find(item => item.type === 'logo');
  const titleItem = headerSchema.items.find(item => item.type === 'title');
  const navigationItems = headerSchema.items.filter(item => 
    item.type !== 'logo' && item.type !== 'title'
  );

  const renderSelectableItem = (
    id: string,
    tab: 'header' | 'footer',
    path: ExpansionPath = [],
    className: string = '',
    children: React.ReactNode
  ) => {
    const isSelected = selectedId === id;
    
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      selectItem(id, tab, path);
    };

    return (
      <div 
        id={`canvas-item-${id}`}
        className={`relative group transition-all duration-200 p-1.5 ${className}
          ${isSelected 
            ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent z-10' 
            : 'hover:ring-1 hover:ring-blue-500/30'}
        `}
        onClick={handleClick}
        data-selection-id={id}
      >
        {/* Selection Label (Visible on Hover or Selection) */}
        <div className={`absolute -top-3 left-0 px-1.5 rounded-t text-[9px] font-bold uppercase tracking-wider z-20 transition-opacity
          ${isSelected 
            ? 'bg-blue-600 text-white opacity-100' 
            : 'bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100'}
        `}>
        </div>
        {children}
      </div>
    );
  };

  return (
    <div 
      className="border-b border-gray-800 transition-all duration-200"
      style={{
        backgroundColor: headerSchema.style?.backgroundColor || '#111111',
        color: headerSchema.style?.textColor || '#ffffff',
        padding: headerSchema.style?.padding || '10px 20px'
      }}
      onClick={() => selectItem(HEADER_ROOT_ID, 'header', [])}
    >
      <div className="flex items-center space-x-6 px-4">
        {/* Logo */}
        {logoItem?.attrs?.src && (
          renderSelectableItem(
            logoItem.id,
            'header',
            [],
            'cursor-pointer',
            <img 
              src={logoItem.attrs.src}
              alt={logoItem.attrs.alt || 'Logo'}
              style={{
                objectFit: 'contain',
                maxHeight: '40px'
              }}
            />
          )
        )}
        
        {/* Title */}
        {titleItem?.label && (
          renderSelectableItem(
            titleItem.id,
            'header',
            [],
            'cursor-pointer',
            <span 
              style={{
                fontSize: titleItem.style?.fontSize || '24px',
                color: titleItem.style?.color || '#ffffff'
              }}
            >
              {titleItem.label}
            </span>
          )
        )}
        
        {/* Menu Items */}
        <div className="flex items-center space-x-4 ml-auto">
          {navigationItems.map((item) => (
            <React.Fragment key={item.id}>
              {renderSelectableItem(
                item.id,
                'header',
                [],
                'relative cursor-pointer',
                item.type === 'dropdown' ? (
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
                        {item.items.map((subItem) => (
                          <React.Fragment key={subItem.id}>
                            {renderSelectableItem(
                              subItem.id,
                              'header',
                              [item.id],
                              'block',
                              <div className="px-4 py-2 text-sm hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer">
                                {subItem.label}
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="cursor-pointer hover:text-blue-400 transition-colors">
                    {item.label}
                  </span>
                )
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderPreview;
