import React from 'react';
import type { MenuItem as MenuItemType } from '@context/MenuSchemaContext';
import { usePageSchema } from '@context/PageSchemaContext';
import { ChevronDown } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
  textColor: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, textColor }) => {
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

  const hasChildren = item.children && item.children.length > 0;
  const commonProps = {
    style: {
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      ...textColorStyle,
    },
    className: `menu-item ${textColorClass}`,
  };
  
  const getLabel = () => (
    <>
      {item.label}
      {hasChildren && <ChevronDown className="w-4 h-4 ml-1 inline" />}
    </>
  );
  
  if (item.type === 'internal' && item.slug) {
    return (
      <button
        onClick={() => loadPage(item.slug!)}
        {...commonProps}
      >
        {getLabel()}
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
        {getLabel()}
      </a>
    );
  } else if (item.type === 'anchor' && item.anchor) {
    return (
      <button
        onClick={() => handleAnchorLink(item.anchor!)}
        {...commonProps}
      >
        {getLabel()}
      </button>
    );
  } else {
    return (
      <span 
        className={textColorClass}
        style={textColorStyle}
      >
        {getLabel()}
      </span>
    );
  }
};

export default MenuItem;
