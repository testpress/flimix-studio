import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { PosterGridBlock } from './schema';
import { useSelection } from '@context/SelectionContext';

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
  const { title, layout, itemShape, items } = props;
  const { addItemToBlock, selectArrayItem, isItemSelected } = useSelection();
  
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' :
                        style?.textAlign === 'right' ? 'text-right' : 'text-left';

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || (isDark ? 'text-white' : 'text-gray-800')) : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = isDark ? 'bg-gray-800' : 'bg-white';
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

  const getLayoutClass = () => {
    if (layout === 'carousel') {
      return 'flex overflow-x-auto space-x-4 pb-4';
    }
    return 'grid grid-cols-2 md:grid-cols-4 gap-4';
  };

  const handleAddItem = () => {
    const defaultItem = {
      image: 'https://plus.unsplash.com/premium_photo-1754392582865-6902ee69cdb9',
      title: 'New Item',
      link: ''
    };
    const newId = addItemToBlock(block.id, defaultItem);
    selectArrayItem(block.id, newId);
  };

  const handleItemClick = (itemId: string) => {
    selectArrayItem(block.id, itemId);
  };

  if (!items || items.length === 0) {
    return (
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
        className={`${paddingClass} ${backgroundClass} rounded-lg shadow-sm`}
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
    );
  }

  return (
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
      className={`${paddingClass} ${backgroundClass} rounded-lg shadow-sm`}
      style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
    >
      <div className={`max-w-6xl mx-auto ${textAlignClass}`}>
        {title && (
          <h2 className={`text-xl font-semibold mb-4 ${textColorClass}`} style={textColorStyle}>
            {title}
          </h2>
        )}
        <div className={getLayoutClass()}>
          {items.map(item => (
            <div key={item.id} className="relative">
              <a
                href={item.link || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}
                className="block transition-transform hover:scale-105 cursor-pointer"
              >
                <div className={`${getAspectRatioClass()} ${
                  itemShape === 'circle' ? 'rounded-full' : ''
                } overflow-hidden ${
                  isItemSelected(block.id, item.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {item.title && (
                  <p className={`mt-2 text-sm ${textColorClass}`} style={textColorStyle}>
                    {item.title}
                  </p>
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
    </BaseWidget>
  );
};

export default PosterGridWidget; 