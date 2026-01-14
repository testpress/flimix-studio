import React from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { PosterGridBlock, PosterGridItem } from './schema';
import { useSelection } from '@context/SelectionContext';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface PosterGridWidgetProps extends Omit<BlockWidgetWrapperProps<PosterGridBlock>, 'block'> {
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
  const { title, columns = 3, item_shape: itemShape, items, button, progress_bar: progressBar, show_title: showTitle, show_subtitle: showSubtitle, show_rating: showRating, show_genre: showGenre, show_duration: showDuration } = props;
  const { grid_gap = 'md' } = style || {};
  const { selectBlockItem, isItemSelected, isReadOnly } = useSelection();

  const borderRadiusClass = style?.border_radius === 'lg' ? 'rounded-lg' :
    style?.border_radius === 'md' ? 'rounded-md' :
      style?.border_radius === 'sm' ? 'rounded-sm' : '';

  // Handle box shadow - custom CSS values for better visibility
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg': return '0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.2)';
      case 'md': return '0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -2px rgba(255, 255, 255, 0.2)';
      case 'sm': return '0 4px 6px -1px rgba(255, 255, 255, 0.3), 0 2px 4px -1px rgba(255, 255, 255, 0.2)';
      default: return undefined;
    }
  };
  const boxShadowStyle = getBoxShadowStyle(style?.box_shadow);

  const textAlignClass = style?.text_align === 'center' ? 'text-center' :
    style?.text_align === 'right' ? 'text-right' : 'text-left';

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.text_color && style.text_color.startsWith('#');
  const textColorClass = !isHexColor ? (style?.text_color || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.text_color } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.background_color;
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
    switch (grid_gap) {
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


  const handleItemClick = (item: PosterGridItem) => {
    if (isReadOnly && item.url) {
      window.location.href = item.url;
      return;
    }
    selectBlockItem(block.id, item.id.toString());
  };

  if (!items || items.length === 0) {
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
          className={`${borderRadiusClass} ${backgroundClass}`}
          style={{
            ...(hasCustomBackground ? { backgroundColor: style.background_color } : {}),
            paddingTop: style?.padding_top,
            paddingRight: style?.padding_right,
            paddingBottom: style?.padding_bottom,
            paddingLeft: style?.padding_left,
            marginTop: style?.margin_top,
            marginRight: style?.margin_right,
            marginBottom: style?.margin_bottom,
            marginLeft: style?.margin_left,
          }}
        >
          <div className={`${textAlignClass}`}>
            {title && (
              <h2 className={`text-xl font-semibold mb-4 ${textColorClass}`} style={textColorStyle}>
                {title}
              </h2>
            )}
            <p className="text-gray-500 text-center">No posters added</p>
          </div>
        </BlockWidgetWrapper>
      </div>
    );
  }

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
        className={`${borderRadiusClass} ${backgroundClass}`}
        style={{
          ...(hasCustomBackground ? { backgroundColor: style.background_color } : {}),
          paddingTop: style?.padding_top,
          paddingRight: style?.padding_right,
          paddingBottom: style?.padding_bottom,
          paddingLeft: style?.padding_left,
          marginTop: style?.margin_top,
          marginRight: style?.margin_right,
          marginBottom: style?.margin_bottom,
          marginLeft: style?.margin_left,
        }}
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
                      color: button.text_color || '#ffffff'
                    }}
                  >
                    {button.icon_position === 'left' && renderButtonIcon(button.icon)}
                    {button.text || 'View All'}
                    {button.icon_position === 'right' && renderButtonIcon(button.icon)}
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
                      color: button.text_color || '#ffffff'
                    }}
                  >
                    {button.icon_position === 'left' && renderButtonIcon(button.icon)}
                    {button.text || 'View All'}
                    {button.icon_position === 'right' && renderButtonIcon(button.icon)}
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
                    handleItemClick(item);
                  }}
                  className={`block transition-all duration-200 hover:scale-105 cursor-pointer ${isItemSelected(block.id, item.id.toString()) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                    }`}
                >
                  <div className={`${getAspectRatioClass()} overflow-hidden ${itemShape === 'circle' ? 'rounded-full' : 'rounded-lg'
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
      </BlockWidgetWrapper>
    </div>
  );
};

export default PosterGridWidget; 