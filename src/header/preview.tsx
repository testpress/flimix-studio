import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { ExpansionPath } from '@context/HeaderFooterContext';
import { HEADER_ROOT_ID } from '@footer/constants';

const HeaderPreview: React.FC = () => {
  const { headerSchema, selectItem, selectedId } = useHeaderFooter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const logoItem = headerSchema.items.find(item => item.type === 'logo');
  const titleItem = headerSchema.items.find(item => item.type === 'title');
  const navigationItems = headerSchema.items.filter(item => 
    item.type !== 'logo' && item.type !== 'title'
  );

  const getNavAlignmentClass = () => {
    const align = headerSchema.style?.navigationAlignment || 'right';
    switch (align) {
      case 'left': return 'justify-start pl-8';
      case 'center': return 'justify-center';
      default: return 'justify-end';
    }
  };

  const getActiveStyle = (itemId: string, baseTextColor: string = '#ffffff') => {
    const activeColor = headerSchema.style?.hoverColor || '#3b82f6';
    const hoverEffect = headerSchema.style?.hoverEffect || 'text';
    const isDisabled = headerSchema.style?.disableHover;

    const isSelected = selectedId === itemId;
    const isHovered = hoveredItemId === itemId && !isDisabled;
    const isActive = isSelected || isHovered;

    const style: React.CSSProperties = {
      color: baseTextColor,
      transition: 'all 0.2s ease',
    };

    if (isActive) {
      if (hoverEffect === 'background') {
        style.backgroundColor = activeColor;
        style.color = '#ffffff';
        style.borderRadius = '6px';
      } else {
        style.color = activeColor;
        style.backgroundColor = 'transparent';
      }
    }

    return style;
  };

  const getItemPaddingClass = () => {
    return headerSchema.style?.hoverEffect === 'background' ? 'px-3 py-1.5' : 'px-0 py-0';
  };

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
            ? 'ring-2 ring-blue-500 z-10 rounded' 
            : 'hover:ring-1 hover:ring-blue-500/30 rounded'}
        `}
        onClick={handleClick}
        onMouseEnter={() => setHoveredItemId(id)}
        onMouseLeave={() => setHoveredItemId(null)}
        data-selection-id={id}
      >
        {children}
      </div>
    );
  };

  const navFontSize = headerSchema.style?.navigationFontSize || '14px';

  const renderIcon = (url?: string) => {
    if (headerSchema.style?.hideNavIcons || !url) return null;
    return (
      <img 
        src={url} 
        className="object-contain mr-1.5 inline-block"
        style={{ width: '1.1em', height: '1.1em' }} 
        alt="icon"
      />
    );
  };

  return (
    <div 
      className="transition-all duration-200 border-b border-gray-800"
      style={{
        backgroundColor: headerSchema.style?.backgroundColor || '#111111',
        color: headerSchema.style?.textColor || '#ffffff',
        padding: headerSchema.style?.padding || '10px 20px',
        margin: headerSchema.style?.margin || '0px',
        borderRadius: headerSchema.style?.borderRadius
      }}
      onClick={() => selectItem(HEADER_ROOT_ID, 'header', [])}
    >
      <div className="flex items-center px-4 w-full relative">
        <div className="flex items-center gap-4 shrink-0 z-10 relative">
          {logoItem?.attrs?.src && logoItem.isVisible !== false && (
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
          
          {/* Title - Check Visibility */}
          {titleItem?.label && titleItem.isVisible !== false && (
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
        </div>

        <div className={`flex-1 flex items-center ${getNavAlignmentClass()}`}>
          <div className="flex items-center gap-4">
            {navigationItems.map((item, index) => {
              if (item.isVisible === false) return null;

              if (item.type === 'button') {
                return renderSelectableItem(item.id, 'header', [], '', (
                  <a 
                    href={item.link || '#'} 
                    className="px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2"
                    style={{
                      backgroundColor: item.style?.backgroundColor || '#3b82f6',
                      color: item.style?.color || '#ffffff',
                      borderRadius: item.style?.borderRadius || '4px',
                      fontSize: navFontSize,
                      opacity: (!headerSchema.style?.disableHover && hoveredItemId === item.id) ? 0.9 : 1
                    }}
                  >
                    {renderIcon(item.icon)}
                    {item.label}
                  </a>
                ));
              }

              // Dropdown Rendering
              if (item.type === 'dropdown') {
                const subItems = item.items || [];
                const hasSubItems = subItems.length > 0;
                const isMultiColumn = subItems.length > 4;
                const threshold = Math.floor(navigationItems.length / 2) - 1;
                const isRightSide = index > threshold;

                return renderSelectableItem(item.id, 'header', [], 'relative', (
                  <div className="relative">
                    <button 
                      className={`flex items-center gap-1 font-medium ${getItemPaddingClass()}`}
                      style={{
                        ...getActiveStyle(item.id, headerSchema.style?.textColor),
                        fontSize: navFontSize
                      }}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (hasSubItems) {
                          setOpenDropdown(openDropdown === item.label ? null : item.label || ''); 
                        }
                      }}
                    >
                      {renderIcon(item.icon)}
                      {item.label}
                      
                      {/* Only show Chevron if sub-items exist */}
                      {hasSubItems && (
                        <ChevronDown size={14} style={{ width: '1em', height: '1em' }} />
                      )}
                    </button>
                    
                    {/* Dropdown Menu (Only if items exist) */}
                    {hasSubItems && openDropdown === item.label && (
                      <div 
                        className={`absolute top-full mt-6 bg-gray-800 border border-gray-600 rounded shadow-xl z-50 py-2 max-w-[90vw]
                          ${isRightSide ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}
                          ${isMultiColumn ? 'grid grid-cols-2 gap-x-4 min-w-[340px]' : 'flex flex-col min-w-[180px]'}
                        `}
                      >
                        {subItems.map(sub => (
                          <div 
                            key={sub.id} 
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 flex items-center gap-2 transition-colors"
                            style={{ fontSize: '0.9em' }}
                          >
                            {/* SUB ITEM ICON */}
                            {sub.icon && (
                              <img src={sub.icon} style={{ width: '1.1em', height: '1.1em' }} className="object-contain" alt="" />
                            )}
                            {sub.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ));
              }
              return renderSelectableItem(item.id, 'header', [], '', (
                <a 
                  href={item.link || '#'} 
                  className={`font-medium flex items-center gap-2 ${getItemPaddingClass()}`}
                  style={{
                    ...getActiveStyle(item.id, headerSchema.style?.textColor),
                    fontSize: navFontSize
                  }}
                >
                  {renderIcon(item.icon)}
                  {item.label}
                </a>
              ));
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPreview;
