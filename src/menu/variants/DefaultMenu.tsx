import React from 'react';
import { MenuWrapper, MenuItem } from '@menu/shared';
import { getAlignmentClass, getContainerStyle, getHoverClassName } from '@menu/shared/menuUtils';
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
  const containerStyle = getContainerStyle(backgroundColor, hoverColor);
  const hoverClassName = getHoverClassName(hoverColor);

  return (
    <MenuWrapper
      className={`${hoverClassName}`}
      style={containerStyle}
    >
      <ul className={`flex flex-col ${getAlignmentClass(alignment)} gap-6 p-4`}>
        {items.map((item) => (
          <li key={item.id}>
            <MenuItem 
              item={item} 
              textColor={textColor}
            />
          </li>
        ))}
      </ul>
    </MenuWrapper>
  );
};

export default DefaultMenu;
