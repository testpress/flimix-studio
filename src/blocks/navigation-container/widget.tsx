import React, { useState, useEffect } from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { NavigationContainerBlock, NavigationItem } from './schema';
import { useSelection } from '@context/SelectionContext';
import { useBlockEditing } from '@context/BlockEditingContext';
import BlockItemControl from '@layout/BlockItemControl';
import { ChevronDown, Menu, X } from 'lucide-react';
import Icon from '@components/Icon';

interface NavigationContainerWidgetProps extends Omit<BlockWidgetWrapperProps, 'block'> {
  block: NavigationContainerBlock;
}

const NavigationContainerWidget: React.FC<NavigationContainerWidgetProps> = ({
  block,
  onSelect,
  isSelected = false,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
}) => {
  const { selectBlockItem, isItemSelected, isReadOnly } = useSelection();
  const { moveBlockItemUp, moveBlockItemDown, removeBlockItem } = useBlockEditing();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const { 
    items = [], 
    alignment,
    fontSize,
    iconSize,
    hideIcons,
    hover,
    colors,
  } = block.props;

  // Extract nested configs with defaults
  const hoverEffect = hover?.effect;
  const disableHover = hover?.disabled || false;
  const hoverColor = hover?.color;

  // Auto-open dropdown when a dropdown item is selected
  useEffect(() => {
    if (!isReadOnly) {
      items.forEach(item => {
        if (item.type === 'dropdown' && isItemSelected(block.id, item.id)) {
          setOpenDropdowns(prev => {
            const newSet = new Set(prev);
            newSet.add(item.id);
            return newSet;
          });
        }
      });
    }
  }, [items, isItemSelected, block.id, isReadOnly]);

  // Handle removing an item
  const handleRemoveItem = (itemId: string) => {
    removeBlockItem(block.id, itemId);
  };

  // Handle moving item up
  const handleMoveItemUp = (index: number) => {
    moveBlockItemUp(block.id, index);
  };

  // Handle moving item down
  const handleMoveItemDown = (index: number) => {
    moveBlockItemDown(block.id, index);
  };

  // Handle item click for selection
  const handleItemClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    selectBlockItem(block.id, itemId);
  };

  // Handle preview click (navigation)
  const handlePreviewClick = (item: NavigationItem) => {
    if (item.type === 'dropdown') {
      toggleDropdown(item.id);
      return;
    }

    if (!item.link) return;

    if (item.type === 'anchor') {
      try {
        const targetId = item.link.startsWith('#') ? item.link : `#${item.link}`;
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.error('Invalid anchor selector', err);
      }
    } else if (item.type === 'external') {
      window.open(item.link, '_blank');
    } else {
      // Internal
      window.location.href = item.link;
    }
  };

  // Toggle dropdown
  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Get alignment classes
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      case 'center':
        return 'justify-center';
      default:
        return 'justify-start';
    }
  };

  // Get font size class
  const getFontSizeClass = (size?: string) => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'md':
      default:
        return 'text-base';
    }
  };

  // Get padding class
  const getPaddingClass = (padding?: string) => {
    switch (padding) {
      case 'sm':
        return 'p-2';
      case 'lg':
        return 'p-6';
      case 'md':
      default:
        return 'p-4';
    }
  };

  // Get margin class
  const getMarginClass = (margin?: string) => {
    switch (margin) {
      case 'sm':
        return 'm-2';
      case 'lg':
        return 'm-6';
      case 'md':
      default:
        return 'm-4';
    }
  };


  // Render navigation item
  const renderNavigationItem = (item: NavigationItem, index: number, isSubItem = false) => {

    const isDropdown = item.type === 'dropdown' && item.items && item.items.length > 0;
    const isOpen = openDropdowns.has(item.id);
    const isHovered = hoveredItemId === item.id;

    // Determine color based on hover state and whether this is a sub-item
    // Sub-items use dropdown colors, main items use item colors
    const appliedColor = (isHovered && !disableHover && hoverColor)
      ? hoverColor
      : isSubItem
      ? item.style?.textColor || colors?.dropdownText || '#ffffff'
      : item.style?.textColor || colors?.itemText || block.style?.textColor || '#ffffff';

    // Determine background color based on hover state and whether this is a sub-item
    // Sub-items use dropdown background, main items use item background
    const appliedBackgroundColor = (isHovered && !disableHover && colors?.hoverBackground)
      ? colors.hoverBackground
      : isSubItem
      ? item.style?.backgroundColor || colors?.dropdownBackground || '#1a1a1a'
      : item.style?.backgroundColor || colors?.itemBackground || 'transparent';

    const itemStyle = {
      color: appliedColor,
      backgroundColor: appliedBackgroundColor,
      padding: item.style?.padding,
      gap: item.appearance?.iconGap ? `${item.appearance.iconGap}px` : '8px',
      margin: item.style?.margin,
      borderRadius: item.style?.borderRadius || '4px', // Default radius for background
    };

    // Check if we have custom colors defined to determine if we should disable default opacity logic
    const hasCustomColors = !!hoverColor || !!colors?.hoverBackground;

    const hoverClass = !disableHover
      ? hoverEffect === 'underline'
        ? 'hover:underline'
        : hoverEffect === 'scale'
        ? 'hover:scale-105'
        : hasCustomColors || hoverEffect === 'none' || hoverEffect === 'color' || hoverEffect === 'background'
        ? ''
        : 'hover:opacity-80' // Default / fallthrough behavior
      : '';

    return (
      <div key={item.id} className={`relative group ${isSubItem ? 'w-full' : ''}`}>
        {/* Item Control (Edit Mode) */}
        {isSelected && !isSubItem && (
          <BlockItemControl
            index={index}
            count={items.length}
            onMoveUp={() => handleMoveItemUp(index)}
            onMoveDown={() => handleMoveItemDown(index)}
            onRemove={() => handleRemoveItem(item.id)}
            className={`absolute -top-2 -right-2 flex space-x-1 bg-white/90 rounded p-1 shadow-md z-10 transition-opacity duration-200 ${
              isItemSelected(block.id, item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />
        )}

        {/* Navigation Item */}
        <div
          className={`flex items-center cursor-pointer transition-all ${hoverClass} ${
            isSubItem ? 'px-4 py-2' : 'px-2 py-2'
          } ${
            !isSubItem && isItemSelected(block.id, item.id) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
          }`}
          style={itemStyle}
          onMouseEnter={() => setHoveredItemId(item.id)}
          onMouseLeave={() => setHoveredItemId(null)}
          onClick={(e) => {
            if (isReadOnly) {
              handlePreviewClick(item);
            } else {
              if (isSubItem) {
                return;
              }
              
              if (isDropdown) {
                handleItemClick(e, item.id);
                toggleDropdown(item.id);
              } else {
                handleItemClick(e, item.id);
              }
            }
          }}
        >
          {/* Icon or Image */}
          {!hideIcons && (item.appearance?.icon || item.appearance?.image?.src) && (
            <div className="flex-shrink-0">
              {item.appearance?.image?.src ? (
                <img
                  src={item.appearance.image.src}
                  alt={item.appearance.image.alt || item.label}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <Icon
                  name={item.appearance?.icon || ''}
                  size={
                    iconSize === 'sm' ? 16 :
                      iconSize === 'lg' ? 24 :
                        20
                  }
                  className="text-current"
                />
              )}
            </div>
          )}

          {/* Label and Subtitle */}
          <div className="flex flex-col flex-1">
            {item.label && (
              <span className={`${getFontSizeClass(fontSize)}`}>
                {item.label}
              </span>
            )}
            {item.subtitle && (
              <span className="text-xs opacity-70">{item.subtitle}</span>
            )}
          </div>

          {/* Badge */}
          {item.appearance?.badge && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {item.appearance.badge}
            </span>
          )}

          {/* Dropdown Icon */}
          {isDropdown && (
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>

        {/* Dropdown Menu */}
        {isDropdown && isOpen && (
          <div
            className={`absolute top-full left-0 mt-1 rounded-md shadow-lg z-20 ${
              item.dropdown?.layout === 'grid-2x2' 
                ? 'grid grid-cols-2 min-w-[300px]' 
                : 'flex flex-col min-w-[200px]'
            }`}
            style={{ 
              backgroundColor: colors?.dropdownBackground || '#1a1a1a',
              paddingTop: item.dropdown?.paddingTop !== undefined ? `${item.dropdown.paddingTop}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
              paddingRight: item.dropdown?.paddingRight !== undefined ? `${item.dropdown.paddingRight}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
              paddingBottom: item.dropdown?.paddingBottom !== undefined ? `${item.dropdown.paddingBottom}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
              paddingLeft: item.dropdown?.paddingLeft !== undefined ? `${item.dropdown.paddingLeft}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
              gap: '0px'
            }}
          >
            {item.items?.map((subItem, subIndex) => (
              <div 
                key={subItem.id}
                style={{
                  marginTop: item.dropdown?.itemMarginTop !== undefined ? `${item.dropdown.itemMarginTop}px` : '0px',
                  marginRight: item.dropdown?.itemMarginRight !== undefined ? `${item.dropdown.itemMarginRight}px` : '0px',
                  marginBottom: item.dropdown?.itemMarginBottom !== undefined ? `${item.dropdown.itemMarginBottom}px` : '0px',
                  marginLeft: item.dropdown?.itemMarginLeft !== undefined ? `${item.dropdown.itemMarginLeft}px` : '0px',
                }}
              >
                {renderNavigationItem(subItem, subIndex, true)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <BlockWidgetWrapper
      block={block}
      onSelect={onSelect}
      isSelected={isSelected}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
    >
      <nav
        className={`relative ${getPaddingClass(block.style?.padding)} ${getMarginClass(block.style?.margin)}`}
        style={{ backgroundColor: block.style?.backgroundColor }}
      >
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex justify-between items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div
          className={`hidden md:flex items-center ${getAlignmentClass()}`}
          style={{ gap: `${block.props.itemGap ?? 24}px` }}
        >
          {items.map((item, index) => renderNavigationItem(item, index))}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-2 mt-4">
            {items.map((item, index) => renderNavigationItem(item, index))}
          </div>
        )}
      </nav>
    </BlockWidgetWrapper>
  );
};

export default NavigationContainerWidget;
