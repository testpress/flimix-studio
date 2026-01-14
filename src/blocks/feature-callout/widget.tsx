import React from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { FeatureCalloutBlock } from './schema';
import { FEATURE_CALLOUT_ITEM_LIMIT } from './schema';
import { useSelection } from '@context/SelectionContext';
import { useBlockEditing } from '@context/BlockEditingContext';
import BlockItemControl from '@layout/BlockItemControl';
import { generateUniqueId } from '@utils/id';
import Icon from '@components/Icon';

interface FeatureCalloutWidgetProps extends Omit<BlockWidgetWrapperProps, 'block'> {
  block: FeatureCalloutBlock;
}

const FeatureCalloutWidget: React.FC<FeatureCalloutWidgetProps> = ({
  block,
  onSelect,
  isSelected = false,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove
}) => {
  const { props, style } = block;
  const { title, subtitle, items, item_size, show_icons, show_descriptions } = props;

  const { selectBlockItem, isItemSelected } = useSelection();
  const { addBlockItem, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useBlockEditing();

  // Function to render icon
  const renderIcon = (iconName: string) => {
    return <Icon name={iconName} size={40} />;
  };

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.text_color && style.text_color.startsWith('#');
  const textColorClass = !isHexColor ? (style?.text_color || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.text_color } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.background_color;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  // Style value mappings for cleaner code
  const borderRadiusMap = {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  };

  const marginMap = {
    none: '0',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  };

  // Handle box shadow - custom CSS values for better visibility on dark backgrounds
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg': return '0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.2)';
      case 'md': return '0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -2px rgba(255, 255, 255, 0.2)';
      case 'sm': return '0 4px 6px -1px rgba(255, 255, 255, 0.3), 0 2px 4px -1px rgba(255, 255, 255, 0.2)';
      default: return undefined;
    }
  };
  const boxShadowStyle = getBoxShadowStyle(style?.box_shadow ?? 'none');

  // Box shadow is now applied to wrapper div for better selection ring visibility

  // Padding is now controlled by itemSize prop for consistent sizing

  // Alignment classes - use style.textAlign from shared StyleForm
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Item size classes
  const itemSizeClasses = {
    small: 'p-3 text-sm',
    medium: 'p-4 text-base',
    large: 'p-6 text-lg'
  };

  // Grid columns based on item count
  const getGridCols = (itemCount: number) => {
    if (itemCount <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (itemCount <= 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  const handleAddItem = () => {
    const currentItemCount = items?.length || 0;

    if (currentItemCount >= FEATURE_CALLOUT_ITEM_LIMIT) {
      return; // Don't add more items if at limit
    }

    const defaultItem = {
      id: generateUniqueId(),
      icon: 'Star',
      label: 'New Feature',
      description: 'Feature description',
      style: {
        background_color: '#1f2937',
        text_color: '#ffffff',
        margin: 'sm' as const,
        border_radius: 'md' as const,
      }
    };
    const newId = addBlockItem(block.id, defaultItem);
    selectBlockItem(block.id, newId);
  };

  const handleItemClick = (itemId: string) => {
    selectBlockItem(block.id, itemId);
  };

  // Check if we're at the item limit
  const isAtItemLimit = (items?.length || 0) >= FEATURE_CALLOUT_ITEM_LIMIT;

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
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
        onAddItem={!isAtItemLimit ? handleAddItem : undefined}
        className={`relative ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.background_color : undefined,
          color: isHexColor ? style.text_color : undefined,
          borderRadius: style?.border_radius ? borderRadiusMap[style.border_radius] : undefined,
          maxWidth: style?.max_width || undefined,
          ...style,
        }}
      >
        <div
          className={`w-full ${alignmentClasses[style?.text_align || 'center']} ${!style?.padding_top ? 'p-6' : ''}`}
          style={{
            paddingTop: style?.padding_top,
            paddingRight: style?.padding_right,
            paddingBottom: style?.padding_bottom,
            paddingLeft: style?.padding_left,
          }}
        >
          {/* Title */}
          {title && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${textColorClass}`} style={textColorStyle}>
              {title}
            </h2>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className={`text-lg md:text-xl mb-8 opacity-80 ${textColorClass}`} style={textColorStyle}>
              {subtitle}
            </p>
          )}

          {/* Feature Items Grid */}
          {items && items.length > 0 ? (
            <div className={`grid ${getGridCols(items.length)} gap-6`}>
              {items.map((item, index) => {
                // Build item-specific styles using mappings
                const itemStyle: React.CSSProperties = {
                  backgroundColor: item.style?.background_color || undefined,
                  color: item.style?.text_color || undefined,
                  // Don't override padding with inline styles - let item_size control it
                  margin: item.style?.margin ? marginMap[item.style.margin] : undefined,
                  borderRadius: item.style?.border_radius ? borderRadiusMap[item.style.border_radius] : undefined,
                  boxShadow: getBoxShadowStyle(item.style?.box_shadow ?? 'none'),
                };

                // Handle item text color
                const isItemHexColor = item.style?.text_color && item.style.text_color.startsWith('#');
                const itemTextColorClass = !isItemHexColor ? '' : '';
                const itemTextColorStyle = isItemHexColor && item.style?.text_color ? { color: item.style.text_color } : {};

                const isSelected = isItemSelected(block.id, item.id);
                return (
                  <div
                    key={item.id}
                    className={`relative rounded-lg ${itemSizeClasses[item_size || 'medium']} text-center transition-transform duration-200 hover:scale-105 cursor-pointer group ${isSelected
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white'
                      : ''
                      }`}
                    style={{
                      ...itemStyle,
                      backgroundColor: item.style?.background_color || '#1f2937',
                      color: item.style?.text_color || '#ffffff',
                      // Remove conflicting styles when selected to let Tailwind ring work
                      boxShadow: isSelected ? undefined : itemStyle.boxShadow,
                      position: 'relative',
                      zIndex: isSelected ? 10 : 0,
                    }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {/* Icon */}
                    {show_icons && item.icon && (
                      <div className="mb-3 flex justify-center">
                        {renderIcon(item.icon)}
                      </div>
                    )}

                    {/* Label */}
                    <h3 className={`font-semibold mb-2 ${itemTextColorClass}`} style={itemTextColorStyle}>
                      {item.label}
                    </h3>

                    {/* Description */}
                    {show_descriptions && item.description && (
                      <p className={`text-sm leading-relaxed ${itemTextColorClass}`} style={textColorStyle}>
                        {item.description}
                      </p>
                    )}

                    {/* Item Controls */}
                    <BlockItemControl
                      index={index}
                      count={items.length}
                      onMoveLeft={() => moveBlockItemLeft(block.id, index)}
                      onMoveRight={() => moveBlockItemRight(block.id, index)}
                      onRemove={() => removeBlockItem(block.id, item.id)}
                      className="absolute top-2 right-2 flex space-x-1 bg-white/95 rounded-lg p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No feature items yet. Click the + button to add items.</p>
            </div>
          )}
        </div>
      </BlockWidgetWrapper>
    </div>
  );
};

export default FeatureCalloutWidget; 