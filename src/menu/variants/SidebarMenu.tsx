import React, { useState } from 'react';
import { MenuWrapper, MenuItem } from '@menu/shared';
import { getBackgroundColorProps, getContainerStyle, getHoverClassName, getInitials } from '@menu/shared/menuUtils';
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
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const { backgroundColorClass } = getBackgroundColorProps(backgroundColor);
  const containerStyle = getContainerStyle(backgroundColor, hoverColor);
  const hoverClassName = getHoverClassName(hoverColor);

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderItem = (item: MenuItemType) => (
    <li key={item.id} className="relative group w-full">
      <div className="rounded-lg p-2 hover:bg-opacity-70 transition-all duration-200 flex items-center">
        <div 
          className="flex items-center justify-center w-10 h-10 cursor-pointer border rounded-full text-sm font-semibold tracking-wider" 
          style={{ 
            color: textColor,
            borderColor: backgroundColor || '#6b7280'
          }}
          onClick={() => item.children && item.children.length > 0 ? toggleDropdown(item.id) : null}
        >
          {getInitials(item.label)}
        </div>
        <div className="absolute left-12 bg-black bg-opacity-90 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
          {item.label}
        </div>
      </div>
      {item.children && item.children.length > 0 && openDropdowns.has(item.id) && (
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
    >
      <div 
        className={`rounded-2xl shadow-2xl opacity-95 w-16 ${backgroundColorClass}`}
        style={containerStyle}
      >
        <MenuWrapper
          navClassName="p-3 h-full py-8 px-2"
        >
          <ul className={`flex flex-col items-start justify-center gap-2`}>
            {items.map((item) => renderItem(item))}
          </ul>
        </MenuWrapper>
      </div>
    </MenuWrapper>
  );
};

export default SidebarMenu;
