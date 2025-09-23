import React, { useState } from 'react';
import { useMenuSchema } from './MenuSchemaContext';
import MenuItemComponent from './MenuItemComponent';

interface MenuBarProps {
  location?: string;
  className?: string;
  containerClassName?: string;
}

const MenuBar: React.FC<MenuBarProps> = ({ location, className = '', containerClassName = '' }) => {
  const { menus, defaultLocation } = useMenuSchema();
  const actualLocation = location || defaultLocation || 'header';
  const menu = menus[actualLocation];
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  
  // If menu doesn't exist or is disabled, render nothing
  if (!menu || !menu.props.enabled) return null;

  const { alignment, items } = menu.props;
  const { backgroundColor, textColor, hoverColor } = menu.style;

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-start';
    }
  };

  const isHexBackgroundColor = backgroundColor && backgroundColor.startsWith('#');
  const backgroundColorClass = !isHexBackgroundColor ? (backgroundColor || '') : '';
  const backgroundColorStyle = isHexBackgroundColor ? { backgroundColor } : {};

  const containerStyle = {
    ...backgroundColorStyle,
    ...(hoverColor && { '--menu-item-hover-color': hoverColor }),
  };

  // Add class to container when hoverColor is provided
  const hoverClassName = hoverColor ? 'has-hover-color' : '';

  // Get first two letters of the label
  const getInitials = (label: string) => {
    return label.substring(0, 2).toUpperCase();
  };

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Special styling for sidebar
  if (actualLocation === 'sidebar') {
    return (
      <div className={`hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-30 ${containerClassName} ${hoverClassName}`}>
        <div 
          className={`rounded-2xl shadow-2xl opacity-95 w-16 ${backgroundColorClass}`}
          style={containerStyle}
        >
          <nav 
            className={`menu-bar p-3 ${className}`}
            style={{ backgroundColor: 'transparent' }}
          >
            <ul className={`flex flex-col items-start justify-center gap-2`}>
              {items.map((item) => (
                <li key={item.id} className="relative group w-full">
                  <div className="rounded-lg p-2 hover:bg-opacity-70 transition-all duration-200 flex items-center">
                      <div 
                        className="flex items-center justify-center w-10 h-10 cursor-pointer border rounded-full text-sm font-semibold tracking-wider" 
                        style={{ 
                          color: textColor,
                          borderColor: backgroundColor || '#6b7280'
                        }}
                        onClick={() => item.children && item.children.length > 0 ? toggleDropdown(item.id) : null}
                      >
                      {getInitials(item.label)}
                    </div>
                    <div className="absolute left-12 bg-black bg-opacity-90 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                      {item.label}
                    </div>
                  </div>
                  {item.children && item.children.length > 0 && openDropdowns.has(item.id) && (
                    <div 
                      className="absolute left-full top-0 pt-0 z-50 ml-2"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-black bg-opacity-90 py-2 px-4 rounded shadow-lg min-w-48">
                        {item.children.map((child) => (
                          <div key={child.id} className="py-2">
                            <MenuItemComponent
                              item={child}
                              textColor={textColor}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  }
  
  // Special styling for header
  if (actualLocation === 'header') {
    return (
      <div className={`z-40 ${containerClassName} ${hoverClassName}`} style={containerStyle}>
        <nav 
          className={`menu-bar w-full ${className}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <ul className={`flex flex-row ${getAlignmentClass()} gap-8 py-2`}>
            {items.map((item) => (
              <li key={item.id} className="relative group">
                <MenuItemComponent 
                  key={item.id} 
                  item={item} 
                  textColor={textColor}
                />
                {item.children && item.children.length > 0 && (
                  <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-50">
                    <div className="bg-black bg-opacity-90 py-2 px-4 rounded shadow-lg min-w-48">
                      {item.children.map((child) => (
                        <div key={child.id} className="py-2">
                          <MenuItemComponent
                            item={child}
                            textColor={textColor}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  // Special styling for footer
  if (actualLocation === 'footer') {
    return (
      <div 
        className={`w-full py-6 px-6 ${backgroundColorClass} ${containerClassName} ${hoverClassName}`}
        style={containerStyle}
      >
        <nav 
          className={`menu-bar ${className}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <ul className={`flex flex-row ${getAlignmentClass()} gap-6 py-2`}>
            {items.map((item) => (
              <MenuItemComponent 
                key={item.id} 
                item={item} 
                textColor={textColor}
              />
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  // Special styling for secondary-header
  if (actualLocation === 'secondary-header') {
    return (
      <div 
        className={`w-full py-4 px-6 ${backgroundColorClass} ${containerClassName} ${hoverClassName}`}
        style={containerStyle}
      >
        <nav 
          className={`menu-bar ${className}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <ul className={`flex flex-row ${getAlignmentClass()} gap-6 py-2`}>
            {items.map((item) => (
              <MenuItemComponent 
                key={item.id} 
                item={item} 
                textColor={textColor}
              />
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  // Special styling for secondary-footer
  if (actualLocation === 'secondary-footer') {
    return (
      <div 
        className={`w-full py-4 px-6 ${backgroundColorClass} ${containerClassName} ${hoverClassName}`}
        style={containerStyle}
      >
        <nav 
          className={`menu-bar ${className}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <ul className={`flex flex-row ${getAlignmentClass()} gap-4 py-2`}>
            {items.map((item) => (
              <MenuItemComponent 
                key={item.id} 
                item={item} 
                textColor={textColor}
              />
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  // Default styling for other menus
  return (
    <div className={`${containerClassName} ${hoverClassName}`} style={containerStyle}>
      <nav 
        className={`menu-bar ${className}`}
        style={{ backgroundColor: 'transparent' }}
      >
        <ul className={`flex flex-col ${getAlignmentClass()} gap-6 p-4`}>
          {items.map((item) => (
            <MenuItemComponent 
              key={item.id} 
                item={item} 
                textColor={textColor}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MenuBar;