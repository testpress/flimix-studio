import React from 'react';
import type { MenuItem } from './MenuSchemaContext';
import { usePageSchema } from '@context/PageSchemaContext';
import { ChevronDown } from 'lucide-react';

interface MenuItemComponentProps {
  item: MenuItem;
  textColor: string;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ item, textColor }) => {
  const { loadPage } = usePageSchema();

  const handleAnchorLink = (anchor: string) => {
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle text color - use Tailwind class for predefined values, inline style for custom hex colors
  const isHexTextColor = textColor && textColor.startsWith('#');
  const textColorClass = !isHexTextColor ? (textColor || 'text-white') : '';
  const textColorStyle = isHexTextColor ? { color: textColor } : {};

  const getItemStyle = () => {
    return {
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      ...textColorStyle,
    };
  };

  const getLinkProps = () => {
    return {
      style: getItemStyle(),
      className: `menu-item ${textColorClass}`,
    };
  };

  const renderMenuItem = () => {
    const hasChildren = item.children && item.children.length > 0;
    const commonProps = {
      ...getLinkProps(),
      className: getLinkProps().className
    };
    
    const renderContent = () => (
      <>
        {item.label}
        {hasChildren && <ChevronDown className="w-4 h-4 ml-1 inline" />}
      </>
    );
    
    if (item.type === 'internal' && item.slug) {
      return (
        <button
          onClick={() => item.slug && loadPage(item.slug)}
          {...commonProps}
        >
          {renderContent()}
        </button>
      );
    } else if (item.type === 'external' && item.url) {
      return (
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          {...commonProps}
        >
          {renderContent()}
        </a>
      );
    } else if (item.type === 'anchor' && item.anchor) {
      return (
        <button
          onClick={() => handleAnchorLink(item.anchor!)}
          {...commonProps}
        >
          {renderContent()}
        </button>
      );
    } else {
      return (
        <span 
          className={textColorClass}
          style={textColorStyle}
        >
          {renderContent()}
        </span>
      );
    }
  };

  return <>{renderMenuItem()}</>;
};

export default MenuItemComponent;
