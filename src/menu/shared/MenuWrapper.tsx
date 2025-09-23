import React from 'react';

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
  backgroundColor,
  hoverColor,
  navClassName = '',
  navStyle = { backgroundColor: 'transparent' }
}) => {
  const isHexBackgroundColor = backgroundColor && backgroundColor.startsWith('#');
  const backgroundColorStyle = isHexBackgroundColor ? { backgroundColor } : {};

  const containerStyle = {
    ...backgroundColorStyle,
    ...(hoverColor && { '--menu-item-hover-color': hoverColor }),
    ...style,
  };

  const hoverClassName = hoverColor ? 'has-hover-color' : '';

  return (
    <div className={`${className} ${hoverClassName}`} style={containerStyle}>
      <nav className={`menu-bar ${navClassName}`} style={navStyle}>
        {children}
      </nav>
    </div>
  );
};

export default MenuWrapper;