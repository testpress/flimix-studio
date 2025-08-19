import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { PosterGridBlock } from './schema';
import { useSelection } from '@context/SelectionContext';
import ItemsControl from '@blocks/shared/ItemsControl';

interface PosterGridWidgetProps extends Omit<BaseWidgetProps<PosterGridBlock>, 'block'> {
  block: PosterGridBlock;
}

const PosterGridWidget: React.FC<PosterGridWidgetProps> = ({ 
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
  const { title, columns = 3, rows = 3, itemShape, items } = props;
  const { gridGap = 'md' } = style || {};
  const { addBlockItem, selectArrayItem, isItemSelected, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useSelection();
  
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
  const marginClass = style?.margin === 'lg' ? 'm-8' : 
                     style?.margin === 'md' ? 'm-6' : 
                     style?.margin === 'sm' ? 'm-4' : 'm-0';
  
  const borderRadiusClass = style?.borderRadius === 'lg' ? 'rounded-lg' : 
                           style?.borderRadius === 'md' ? 'rounded-md' : 
                           style?.borderRadius === 'sm' ? 'rounded-sm' : '';
  
  // Handle box shadow - custom CSS values for better visibility
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg': return '0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.2)';
      case 'md': return '0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -2px rgba(255, 255, 255, 0.2)';
      case 'sm': return '0 4px 6px -1px rgba(255, 255, 255, 0.3), 0 2px 4px -1px rgba(255, 255, 255, 0.2)';
      default: return undefined;
    }
  };
  const boxShadowStyle = getBoxShadowStyle(style?.boxShadow);
  
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' :
                        style?.textAlign === 'right' ? 'text-right' : 'text-left';

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  const getAspectRatioClass = () => {
    switch (itemShape) {
      case 'rectangle-portrait':
        return 'aspect-[2/3]';
      case 'square':
        return 'aspect-square';
      case 'circle':
        return 'aspect-square'; 
      default: // rectangle-landscape
        return 'aspect-[16/9]';
    }
  };

  const getGapClass = () => {
    switch (gridGap) {
      case 'sm':
        return 'gap-2';
      case 'lg':
        return 'gap-6';
      default: // md
        return 'gap-4';
    }
  };

  const getGridColsClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      default:
        return 'grid-cols-3';
    }
  };

  const getGridRowsClass = () => {
    // Calculate how many rows we actually need based on items count
    const actualRows = Math.ceil((items?.length || 0) / (columns || 3));
    
    switch (actualRows) {
      case 0:
      case 1:
        return 'grid-rows-1';
      case 2:
        return 'grid-rows-2';
      case 3:
        return 'grid-rows-3';
      case 4:
        return 'grid-rows-4';
      default:
        return 'grid-rows-4'; // Cap at 4 rows max
    }
  };

  const handleAddItem = () => {
    // Calculate max items based on grid size
    const maxItems = (columns || 3) * (rows || 3);
    
    // Don't add more items if we're at the limit
    if (items && items.length >= maxItems) {
      console.log(`Maximum ${maxItems} items allowed. Cannot add more.`);
      return;
    }
    
    const defaultItem = {
      image: 'https://plus.unsplash.com/premium_photo-1754392582865-6902ee69cdb9',
      title: 'New Item',
      link: ''
    };
    const newId = addBlockItem(block.id, defaultItem);
    selectArrayItem(block.id, newId);
  };

  const handleItemClick = (itemId: string) => {
    selectArrayItem(block.id, itemId);
  };

  if (!items || items.length === 0) {
    return (
      <div style={{ boxShadow: boxShadowStyle }}>
        <BaseWidget 
          block={block} 
          onSelect={onSelect} 
          isSelected={isSelected}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onRemove={onRemove}
          onAddItem={handleAddItem}
          className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
          style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
        >
          <div className={`${textAlignClass}`}>
            {title && (
              <h2 className={`text-xl font-semibold mb-4 ${textColorClass}`} style={textColorStyle}>
                {title}
              </h2>
            )}
            <p className="text-gray-500 text-center">No posters added</p>
          </div>
        </BaseWidget>
      </div>
    );
  }

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
      <BaseWidget 
        block={block} 
        onSelect={onSelect} 
        isSelected={isSelected}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onAddItem={handleAddItem}
        className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
        style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
      >
      <div className={`max-w-6xl mx-auto ${textAlignClass}`}>
        {title && (
          <h2 className={`text-xl font-semibold mb-4 ${textColorClass}`} style={textColorStyle}>
            {title}
          </h2>
        )}
        <div className={`grid ${getGridColsClass()} ${getGridRowsClass()} ${getGapClass()}`}>
          {items.map((item, index) => (
            <div key={item.id} className="relative group">
              <a
                href={item.link || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}
                className={`block transition-all duration-200 hover:scale-105 cursor-pointer ${
                  isItemSelected(block.id, item.id) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                }`}
              >
                <div className={`${getAspectRatioClass()} overflow-hidden ${
                  itemShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                } shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {item.title && (
                  <div className="mt-3 space-y-1">
                    <p className={`text-sm font-semibold ${textColorClass} line-clamp-1`} style={textColorStyle}>
                      {item.title}
                    </p>
                  </div>
                )}
              </a>
              <ItemsControl 
                index={index}
                count={items.length}
                onMoveLeft={() => moveBlockItemLeft(block.id, index)}
                onMoveRight={() => moveBlockItemRight(block.id, index)}
                onRemove={() => removeBlockItem(block.id, item.id)}
                className="absolute top-2 right-2 flex space-x-1 bg-white/95 rounded-lg p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          ))}
        </div>
      </div>
      </BaseWidget>
    </div>
  );
};

export default PosterGridWidget; 