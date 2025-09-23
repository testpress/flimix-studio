import React from 'react';
import { MenuWrapper, MenuItem } from '@menu/shared';
import { getAlignmentClass, getContainerStyle, getHoverClassName } from '@menu/shared/menuUtils';
import type { MenuItem as MenuItemType } from '@context/MenuSchemaContext';

interface HeaderMenuProps {
  items: MenuItemType[];
  textColor: string;
  backgroundColor: string;
  hoverColor?: string;
  alignment: 'left' | 'center' | 'right';
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  items,
  textColor,
  backgroundColor,
  hoverColor,
  alignment
}) => {
  const containerStyle = getContainerStyle(backgroundColor, hoverColor);
  const hoverClassName = getHoverClassName(hoverColor);

  const renderItem = (item: MenuItemType) => (
    <li key={item.id} className="relative group">
      <MenuItem
        item={item}
        textColor={textColor}
      />
      {item.children && item.children.length > 0 && (
        <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50">
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
      className={`z-40 ${hoverClassName}`}
      style={containerStyle}
      navClassName="w-full py-3 px-6"
    >
      <ul className={`flex flex-row ${getAlignmentClass(alignment)} gap-8 py-2`}>
        {items.map((item) => renderItem(item))}
      </ul>
    </MenuWrapper>
  );
};

export default HeaderMenu;
