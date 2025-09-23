import React from 'react';
import { MenuItem, MenuWrapper } from '@menu/shared';
import { getAlignmentClass, getBackgroundColorProps, getContainerStyle, getHoverClassName } from '@menu/shared/menuUtils';
import type { MenuItem as MenuItemType } from '@context/MenuSchemaContext';

interface SecondaryFooterMenuProps {
  items: MenuItemType[];
  textColor: string;
  backgroundColor: string;
  hoverColor?: string;
  alignment: 'left' | 'center' | 'right';
}

const SecondaryFooterMenu: React.FC<SecondaryFooterMenuProps> = ({
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
      className={`w-full py-4 px-6 ${backgroundColorClass} ${hoverClassName}`}
      style={containerStyle}
      navClassName=""
    >
      <ul className={`flex flex-row ${getAlignmentClass(alignment)} gap-4 py-2`}>
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

export default SecondaryFooterMenu;
