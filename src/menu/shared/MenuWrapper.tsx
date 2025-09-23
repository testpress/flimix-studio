import React from 'react';
import { getContainerStyle, getHoverClassName } from './menuUtils';

interface MenuWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  hoverColor?: string;
  navClassName?: string;
  navStyle?: React.CSSProperties;
}

const MenuWrapper: React.FC<MenuWrapperProps> = ({
  children,
  className = '',
  style = {},
  backgroundColor = '',
  hoverColor,
  navClassName = '',
  navStyle = { backgroundColor: 'transparent' }
}) => {
  const containerStyle = {
    ...getContainerStyle(backgroundColor, hoverColor),
    ...style,
  };

  const hoverClassName = getHoverClassName(hoverColor);

  return (
    <div className={`${className} ${hoverClassName}`} style={containerStyle}>
      <nav className={`menu-bar ${navClassName}`} style={navStyle}>
        {children}
      </nav>
    </div>
  );
};

export default MenuWrapper;