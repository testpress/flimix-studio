import React from 'react';
import { MenuWrapper, MenuItem } from '@menu/shared';
import { getAlignmentClass, getContainerStyle, getHoverClassName } from '@menu/shared/menuUtils';
import { useDropdownToggle } from '@hooks/useDropdownToggle';
import type { MenuItem as MenuItemType } from '@context/MenuSchemaContext';

interface DefaultMenuProps {
  items: MenuItemType[];
  textColor: string;
  backgroundColor: string;
  hoverColor?: string;
  alignment: 'left' | 'center' | 'right';
}

const DefaultMenu: React.FC<DefaultMenuProps> = ({
  items,
  textColor,
  backgroundColor,
  hoverColor,
  alignment
}) => {
  const { toggleDropdown, isDropdownOpen, handleKeyDown, handleBlur } = useDropdownToggle();
  const containerStyle = getContainerStyle(backgroundColor, hoverColor);
  const hoverClassName = getHoverClassName(hoverColor);

  const renderItem = (item: MenuItemType) => (
    <li 
      key={item.id} 
      className="relative group"
      onBlur={(e) => handleBlur(e, item.id)}
    >
      <div
        onClick={() => {
          if (item.children && item.children.length > 0) {
            toggleDropdown(item.id);
          }
        }}
        onKeyDown={(e) => handleKeyDown(e, item.id)}
        tabIndex={item.children && item.children.length > 0 ? 0 : -1}
        role={item.children && item.children.length > 0 ? "button" : undefined}
        aria-expanded={item.children && item.children.length > 0 ? isDropdownOpen(item.id) : undefined}
        aria-haspopup={item.children && item.children.length > 0 ? "true" : undefined}
      >
        <MenuItem 
          item={item} 
          textColor={textColor}
        />
      </div>
      {item.children && item.children.length > 0 && isDropdownOpen(item.id) && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="bg-black bg-opacity-90 py-2 px-4 rounded shadow-lg min-w-48">
            {item.children.map((child) => (
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
      className={`${hoverClassName}`}
      style={containerStyle}
    >
      <ul className={`flex flex-col ${getAlignmentClass(alignment)} gap-6 p-4`}>
        {items.map((item) => renderItem(item))}
      </ul>
    </MenuWrapper>
  );
};

export default DefaultMenu;
