import React from 'react';
import { MenuWrapper, MenuItem } from '@menu/shared';
import { getAlignmentClass, getBackgroundColorProps, getContainerStyle, getHoverClassName } from '@menu/shared/menuUtils';
import type { MenuItem as MenuItemType } from '@context/MenuSchemaContext';

interface FooterMenuProps {
  items: MenuItemType[];
  textColor: string;
  backgroundColor: string;
  hoverColor?: string;
  alignment: 'left' | 'center' | 'right';
}

const FooterMenu: React.FC<FooterMenuProps> = ({
  items,
  textColor,
  backgroundColor,
  hoverColor,
  alignment
}) => {
  const { backgroundColorClass } = getBackgroundColorProps(backgroundColor);
  const containerStyle = getContainerStyle(backgroundColor, hoverColor);
  const hoverClassName = getHoverClassName(hoverColor);

  return (
    <MenuWrapper
      className={`w-full py-6 px-6 ${backgroundColorClass} ${hoverClassName}`}
      style={containerStyle}
    >
      <ul className={`flex flex-row ${getAlignmentClass(alignment)} gap-6 py-2`}>
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

export default FooterMenu;
