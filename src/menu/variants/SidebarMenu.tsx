import React from 'react';
import { MenuWrapper, MenuItem } from '@menu/shared';
import { getBackgroundColorProps, getContainerStyle, getHoverClassName, getInitials } from '@menu/shared/menuUtils';
import { usePageSchema } from '@context/PageSchemaContext';
import { useDropdownToggle } from '@hooks/useDropdownToggle';
import { ChevronDown } from 'lucide-react';
import type { MenuItem as MenuItemType } from '@context/MenuSchemaContext';

interface SidebarMenuProps {
  items: MenuItemType[];
  textColor: string;
  backgroundColor: string;
  hoverColor?: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  items,
  textColor,
  backgroundColor,
  hoverColor
}) => {
  const { toggleDropdown, isDropdownOpen } = useDropdownToggle();
  const { loadPage } = usePageSchema();

  const { backgroundColorClass } = getBackgroundColorProps(backgroundColor);
  const containerStyle = getContainerStyle(backgroundColor, hoverColor);
  const hoverClassName = getHoverClassName(hoverColor);

  const renderItem = (item: MenuItemType) => (
    <li key={item.id} className="relative group w-full">
      <div className="rounded-lg p-2 hover:bg-opacity-70 transition-all duration-200 flex items-center">
        {item.children && item.children.length > 0 ? (
          <button
            className="flex items-center justify-center w-10 h-10 cursor-pointer border rounded-full text-sm font-semibold tracking-wider hover:bg-opacity-20 transition-all duration-200" 
            style={{ 
              color: textColor,
              borderColor: backgroundColor || '#6b7280'
            }}
            onClick={() => toggleDropdown(item.id)}
            aria-expanded={isDropdownOpen(item.id)}
            aria-haspopup="true"
           >
             <div className="flex items-center justify-center">
               {getInitials(item.label)}
               <ChevronDown className="w-3 h-3 ml-1" />
             </div>
           </button>
        ) : (
          <button
            className="flex items-center justify-center w-10 h-10 cursor-pointer border rounded-full text-sm font-semibold tracking-wider hover:bg-opacity-20 transition-all duration-200" 
            style={{ 
              color: textColor,
              borderColor: backgroundColor || '#6b7280'
            }}
            onClick={() => {
              // Handle navigation for items without children
              if (item.type === 'internal' && item.slug) {
                loadPage(item.slug);
              } else if (item.type === 'external' && item.url) {
                window.open(item.url, '_blank', 'noopener,noreferrer');
              } else if (item.type === 'anchor' && item.anchor) {
                const element = document.querySelector(item.anchor);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
          >
            {getInitials(item.label) }
          </button>
        )}
        <div className="absolute left-12 bg-black bg-opacity-90 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
          {item.label}
        </div>
      </div>
      {item.children && item.children.length > 0 && isDropdownOpen(item.id) && (
        <div 
          className="absolute left-full top-0 pt-0 z-50 ml-2"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-black bg-opacity-90 py-2 px-4 rounded shadow-lg min-w-48">
            {item.children.map((child: MenuItemType) => (
              <div key={child.id} className="py-2">
                <MenuItem
                  item={child}
                  textColor={textColor}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );

  return (
    <MenuWrapper
      className={`hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-30 ${hoverClassName}`}
      navClassName="p-3 h-full py-8 px-2"
    >
      <div 
        className={`rounded-2xl shadow-2xl opacity-95 w-16 ${backgroundColorClass}`}
        style={containerStyle}
      >
        <ul className={`flex flex-col items-start justify-center gap-2`}>
          {items.map((item) => renderItem(item))}
        </ul>
      </div>
    </MenuWrapper>
  );
};

export default SidebarMenu;
