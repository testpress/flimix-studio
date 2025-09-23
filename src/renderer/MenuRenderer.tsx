import React from 'react';
import { useMenuSchema } from '@context/MenuSchemaContext';
import {
  SidebarMenu,
  HeaderMenu,
  FooterMenu,
  SecondaryHeaderMenu,
  SecondaryFooterMenu,
  DefaultMenu
} from '@menu/variants';

interface MenuRendererProps {
  location?: string;
}

/**
 * Get the appropriate menu component based on location
 * @param location - The menu location
 * @returns The corresponding menu component
 */
const getMenuComponent = (location: string) => {
  switch (location) {
    case 'sidebar':
      return SidebarMenu;
    case 'header':
      return HeaderMenu;
    case 'footer':
      return FooterMenu;
    case 'secondary-header':
      return SecondaryHeaderMenu;
    case 'secondary-footer':
      return SecondaryFooterMenu;
    default:
      return DefaultMenu;
  }
};

const MenuRenderer: React.FC<MenuRendererProps> = ({ location }) => {
  const { menus, defaultLocation } = useMenuSchema();
  const actualLocation = location || defaultLocation || 'header';
  const menu = menus[actualLocation];
  
  // If menu doesn't exist or is disabled, render nothing
  if (!menu || !menu.props.enabled) return null;

  const { alignment, items } = menu.props;
  // Default to empty strings to avoid breaking type safety and CSS logic
  const { backgroundColor = '', textColor = '', hoverColor = '' } = menu.style;

  // Get the appropriate component for the location
  const MenuComponent = getMenuComponent(actualLocation);

  // Common props for all menu components
  const commonProps = {
    items,
    textColor,
    backgroundColor,
    hoverColor,
    alignment,
  };

  return <MenuComponent {...commonProps} />;
};

export default MenuRenderer;