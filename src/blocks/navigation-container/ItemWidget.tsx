import React from 'react';
import type { NavigationItem, NavigationContainerBlock, NavigationColors, HoverEffect } from './schema';
import BlockItemControl from '@layout/BlockItemControl';
import { ChevronDown } from 'lucide-react';
import Icon from '@components/Icon';
import { useSelection } from '@context/SelectionContext';

interface ItemWidgetProps {
  item: NavigationItem;
  index: number;
  block: NavigationContainerBlock;
  isSubItem?: boolean;
  openDropdowns: Set<string>;
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  toggleDropdown: (id: string) => void;
  handleMoveItemUp: (index: number) => void;
  handleMoveItemDown: (index: number) => void;
  handleRemoveItem: (id: string) => void;
  handleItemClick: (e: React.MouseEvent, id: string) => void;
  handlePreviewClick: (item: NavigationItem) => void;
  colors?: NavigationColors;
  hoverEffect?: HoverEffect;
  disableHover?: boolean;
  hide_icons?: boolean;
  icon_size?: string;
  font_size?: string;
  getFontSizeClass: (size?: string) => string;
  isSelected?: boolean;
  isReadOnly?: boolean;
}

const ItemWidget: React.FC<ItemWidgetProps> = ({
  item,
  index,
  block,
  isSubItem = false,
  openDropdowns,
  hoveredItemId,
  setHoveredItemId,
  toggleDropdown,
  handleMoveItemUp,
  handleMoveItemDown,
  handleRemoveItem,
  handleItemClick,
  handlePreviewClick,
  colors,
  hoverEffect,
  disableHover,
  hide_icons,
  icon_size,
  font_size,
  getFontSizeClass,
  isSelected,
  isReadOnly,
}) => {
  const { isItemSelected } = useSelection();

  const isDropdown = item.type === 'dropdown' && item.items && item.items.length > 0;
  const isOpen = openDropdowns.has(item.id);
  const isHovered = hoveredItemId === item.id;
  const hoverTextColor = colors?.hover_text;

  // Determine color based on hover state and whether this is a sub-item
  // Sub-items use dropdown colors, main items use item colors
  const appliedColor = (isHovered && !disableHover && hoverTextColor)
    ? hoverTextColor
    : isSubItem
    ? item.style?.text_color || colors?.dropdown_text || '#ffffff'
    : item.style?.text_color || colors?.item_text || block.style?.text_color || '#ffffff';

  // Determine background color based on hover state and whether this is a sub-item
  // Sub-items use dropdown background, main items use item background
  const appliedBackgroundColor = (isHovered && !disableHover && colors?.hover_background)
    ? colors.hover_background
    : isSubItem
    ? item.style?.background_color || colors?.dropdown_background || '#1a1a1a'
    : item.style?.background_color || colors?.item_background || 'transparent';

  const itemStyle = {
    color: appliedColor,
    backgroundColor: appliedBackgroundColor,
    paddingTop: item.style?.padding_top,
    paddingRight: item.style?.padding_right,
    paddingBottom: item.style?.padding_bottom,
    paddingLeft: item.style?.padding_left,
    gap: item.appearance?.icon_gap ? `${item.appearance.icon_gap}px` : '8px',
    marginTop: item.style?.margin_top,
    marginRight: item.style?.margin_right,
    marginBottom: item.style?.margin_bottom,
    marginLeft: item.style?.margin_left,
    borderRadius: item.style?.border_radius || '4px', // Default radius for background
  };

  // Check if we have custom colors defined to determine if we should disable default opacity logic
  const hasCustomColors = !!hoverTextColor || !!colors?.hover_background;

  const hoverClass = !disableHover
    ? hoverEffect === 'underline'
      ? 'hover:underline'
      : hoverEffect === 'scale'
      ? 'hover:scale-105'
      : hasCustomColors || hoverEffect === 'none' || hoverEffect === 'color'
      ? ''
      : 'hover:opacity-80' // Default / fallthrough behavior
    : '';

  return (
    <div key={item.id} className={`relative group ${isSubItem ? 'w-full' : ''}`}>
      {/* Item Control (Edit Mode) */}
      {isSelected && !isSubItem && (
        <BlockItemControl
          index={index}
          count={block.props.items?.length || 0}
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
        {!hide_icons && (item.appearance?.icon || item.appearance?.image?.src) && (
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
                  icon_size === 'sm' ? 16 :
                    icon_size === 'lg' ? 24 :
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
            <span className={`${getFontSizeClass(font_size)}`}>
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
            backgroundColor: colors?.dropdown_background || '#1a1a1a',
            paddingTop: item.dropdown?.padding_top !== undefined ? `${item.dropdown.padding_top}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
            paddingRight: item.dropdown?.padding_right !== undefined ? `${item.dropdown.padding_right}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
            paddingBottom: item.dropdown?.padding_bottom !== undefined ? `${item.dropdown.padding_bottom}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
            paddingLeft: item.dropdown?.padding_left !== undefined ? `${item.dropdown.padding_left}px` : (item.dropdown?.layout === 'grid-2x2' ? '8px' : '0px'),
            gap: '0px'
          }}
        >
          {item.items?.map((subItem, subIndex) => (
            <div 
              key={subItem.id}
              style={{
                marginTop: item.dropdown?.item_margin_top !== undefined ? `${item.dropdown.item_margin_top}px` : '0px',
                marginRight: item.dropdown?.item_margin_right !== undefined ? `${item.dropdown.item_margin_right}px` : '0px',
                marginBottom: item.dropdown?.item_margin_bottom !== undefined ? `${item.dropdown.item_margin_bottom}px` : '0px',
                marginLeft: item.dropdown?.item_margin_left !== undefined ? `${item.dropdown.item_margin_left}px` : '0px',
              }}
            >
              <ItemWidget
                item={subItem}
                index={subIndex}
                block={block}
                isSubItem={true}
                openDropdowns={openDropdowns}
                hoveredItemId={hoveredItemId}
                setHoveredItemId={setHoveredItemId}
                toggleDropdown={toggleDropdown}
                handleMoveItemUp={handleMoveItemUp}
                handleMoveItemDown={handleMoveItemDown}
                handleRemoveItem={handleRemoveItem}
                handleItemClick={handleItemClick}
                handlePreviewClick={handlePreviewClick}
                colors={colors}
                hoverEffect={hoverEffect}
                disableHover={disableHover}
                hide_icons={hide_icons}
                icon_size={icon_size}
                font_size={font_size}
                getFontSizeClass={getFontSizeClass}
                isSelected={isSelected}
                isReadOnly={isReadOnly}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemWidget;
