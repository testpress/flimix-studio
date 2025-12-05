import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { PosterGridBlock } from './schema';
import { useSelection } from '@context/SelectionContext';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const { title, columns = 3, itemShape, items, button, progressBar, showTitle, showSubtitle, showRating, showGenre, showDuration } = props;
  const { gridGap = 'md' } = style || {};
  const { selectBlockItem, isItemSelected } = useSelection();
  
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

  // Render button icon based on selected icon type
  const renderButtonIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'ArrowRight':
        return <ArrowRight size={16} />;
      case 'ArrowLeft':
        return <ArrowLeft size={16} />;
      case 'ChevronRight':
        return <ChevronRight size={16} />;
      case 'ChevronLeft':
        return <ChevronLeft size={16} />;
      default:
        return <ArrowRight size={16} />;
    }
  };

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


  const handleItemClick = (itemId: number) => {
    selectBlockItem(block.id, itemId.toString());
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
        className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
        style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
      >
      <div className={`w-full ${textAlignClass}`}>
        {/* Header with title and button */}
        <div className="mb-6">
          {button?.enabled ? (
            button.alignment === 'left' ? (
              /* Left alignment: title and button on same line */
              <div className="flex items-center gap-4">
                {title && title.trim() !== "" && (
                  <h2 className={`text-xl font-semibold ${textColorClass}`} style={textColorStyle}>
                    {title}
                  </h2>
                )}
                <a 
                  href={button.link || '#'} 
                  className="px-4 py-2 rounded-md flex items-center gap-2 transition-all hover:opacity-90"
                  style={{
                    color: button.textColor || '#ffffff'
                  }}
                >
                  {button.iconPosition === 'left' && renderButtonIcon(button.icon)}
                  {button.text || 'View All'}
                  {button.iconPosition === 'right' && renderButtonIcon(button.icon)}
                </a>
              </div>
            ) : (
              /* Right alignment: title on left, button on right */
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  {title && title.trim() !== "" && (
                    <h2 className={`text-xl font-semibold ${textColorClass}`} style={textColorStyle}>
                      {title}
                    </h2>
                  )}
                </div>
                <a 
                  href={button.link || '#'} 
                  className="px-4 py-2 rounded-md flex items-center gap-2 transition-all hover:opacity-90"
                  style={{
                    color: button.textColor || '#ffffff'
                  }}
                >
                  {button.iconPosition === 'left' && renderButtonIcon(button.icon)}
                  {button.text || 'View All'}
                  {button.iconPosition === 'right' && renderButtonIcon(button.icon)}
                </a>
              </div>
            )
          ) : (
            /* No button: just title */
            title && title.trim() !== "" && (
              <h2 className={`text-xl font-semibold ${textColorClass}`} style={textColorStyle}>
                {title}
              </h2>
            )
          )}
        </div>

        <div className={`grid ${getGridColsClass()} ${getGridRowsClass()} ${getGapClass()}`}>
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}
                className={`block transition-all duration-200 hover:scale-105 cursor-pointer ${
                  isItemSelected(block.id, item.id.toString()) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                }`}
              >
                <div className={`${getAspectRatioClass()} overflow-hidden ${
                  itemShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                } shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                  <img
                    src={item.poster || item.cover || item.thumbnail || 'https://placehold.co/300x170/cccccc/666666?text=No+Image'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content section - only render if there's actual content */}
                {(showTitle !== false && item.title && item.title.trim() !== "") || 
                 (showSubtitle && item.subtitle) ||
                 (showRating && item.details?.imdb_rating) ||
                 (showGenre && item.genres && item.genres.length > 0) ||
                 (showDuration && item.details?.duration) ||
                 progressBar?.enabled ? (
                  <div className="mt-3 space-y-1">
                    {/* Title - only render if enabled and not empty */}
                    {showTitle !== false && item.title && item.title.trim() !== "" && (
                      <p className={`text-sm font-semibold ${textColorClass} line-clamp-1`} style={textColorStyle}>
                        {item.title}
                      </p>
                    )}
                    
                    {/* Subtitle - only render if enabled */}
                    {showSubtitle && item.subtitle && (
                      <p className={`text-xs ${textColorClass} line-clamp-1 opacity-80`} style={textColorStyle}>
                        {item.subtitle}
                      </p>
                    )}
                    
                    {/* Meta information row */}
                    {(showRating && item.details?.imdb_rating) ||
                     (showGenre && item.genres && item.genres.length > 0) ||
                     (showDuration && item.details?.duration) ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        {showRating && item.details?.imdb_rating && (
                          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                            {item.details.imdb_rating}
                          </span>
                        )}
                        {showGenre && item.genres && item.genres.length > 0 && (
                          <span className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-white text-gray-700`}>
                            {item.genres[0]}
                          </span>
                        )}
                        {showDuration && item.details?.duration && (
                          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                            {item.details.duration}
                          </span>
                        )}
                      </div>
                    ) : null}
                    
                    {/* Progress Bar - only render if enabled */}
                    {progressBar?.enabled && (
                      <div className="mt-2 mb-2">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full" 
                            style={{ 
                              width: `${item.progress !== undefined ? item.progress : 4}%`,
                              backgroundColor: progressBar.color || '#ff0000'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </a>
            </div>
          ))}
        </div>
      </div>
      </BaseWidget>
    </div>
  );
};

export default PosterGridWidget; 