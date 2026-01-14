import React from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { ImageBlock } from './schema';

interface ImageWidgetProps extends Omit<BlockWidgetWrapperProps<ImageBlock>, 'block'> {
  block: ImageBlock;
}

export const ImageWidget: React.FC<ImageWidgetProps> = ({
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove,
}) => {
  const { src, alt, link, size, aspect_ratio, fit, alignment } = block.props;
  const { style } = block;



  // Get background color
  const getBackgroundColor = () => {
    if (style?.background_color && style.background_color.startsWith('#')) {
      return ''; // Return empty string for hex colors, we'll apply via inline style
    }
    return style?.background_color || 'bg-transparent';
  };

  const getBackgroundColorStyle = (): React.CSSProperties => {
    if (style?.background_color) {
      if (style.background_color.startsWith('rgba')) {
        return { backgroundColor: style.background_color };
      }
      if (style.background_color.startsWith('#')) {
        return { backgroundColor: style.background_color };
      }
      return {};
    }
    return { backgroundColor: 'transparent' };
  };

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (style?.border_radius) {
      case 'lg': return 'rounded-xl';
      case 'md': return 'rounded-lg';
      case 'sm': return 'rounded-md';
      case 'none': return 'rounded-none';
      default: return 'rounded-lg';
    }
  };

  // Custom box shadow styles for better visibility on dark backgrounds
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg':
        return '0 35px 60px -12px rgba(255, 255, 255, 0.25), 0 20px 25px -5px rgba(255, 255, 255, 0.1)';
      case 'md':
        return '0 20px 25px -5px rgba(255, 255, 255, 0.15), 0 10px 10px -5px rgba(255, 255, 255, 0.08)';
      case 'sm':
        return '0 10px 15px -3px rgba(255, 255, 255, 0.12), 0 4px 6px -2px rgba(255, 255, 255, 0.06)';
      case 'none':
      default:
        return 'none';
    }
  };

  const boxShadowStyle = getBoxShadowStyle(style?.box_shadow);

  // Get image size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'max-w-xs';
      case 'large': return 'max-w-2xl';
      case 'full': return 'w-full';
      default: return 'max-w-md'; // medium
    }
  };

  // Get aspect ratio classes
  const getAspectRatioClasses = () => {
    switch (aspect_ratio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      case '3:4': return 'aspect-[3/4]';
      case 'auto': return 'h-auto';
      default: return 'aspect-video';
    }
  };

  // Get alignment classes - control horizontal position of image within container
  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      case 'center':
      default: return 'justify-center';
    }
  };

  // Get image fit styles
  const getImageFitStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      objectPosition: 'center',
      width: '100%',
      height: '100%',
    };

    switch (fit) {
      case 'contain': return { ...baseStyles, objectFit: 'contain' as const };
      case 'fill': return { ...baseStyles, objectFit: 'fill' as const };
      case 'cover':
      default: return { ...baseStyles, objectFit: 'cover' as const };
    }
  };

  // Build widget classes - remove margin since it will be handled by wrapper
  const widgetClasses = [
    getBackgroundColor(),
    getBorderRadiusClass(),
    'w-full'
  ].filter(Boolean).join(' ');

  // Build image container classes
  const imageContainerClasses = [
    getSizeClasses(),
    getAspectRatioClasses(),
    getBorderRadiusClass(),
    'overflow-hidden'
  ].filter(Boolean).join(' ');

  // Empty state when no image
  if (!src) {
    return (
      <div style={{
        marginTop: style?.margin_top,
        marginRight: style?.margin_right,
        marginBottom: style?.margin_bottom,
        marginLeft: style?.margin_left
      }}>
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
          className={`${widgetClasses} ${style?.background_color && style.background_color.startsWith('rgba') ? '!bg-transparent' : ''}`}
          style={getBackgroundColorStyle()}
        >
          <div className="w-full" style={{
            paddingTop: style?.padding_top,
            paddingRight: style?.padding_right,
            paddingBottom: style?.padding_bottom,
            paddingLeft: style?.padding_left
          }}>
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="mb-2 text-lg">No image selected</p>
              <p className="text-sm">Add an image URL in the settings panel</p>
            </div>
          </div>
        </BlockWidgetWrapper>
      </div>
    );
  }

  // Main image rendering
  return (
    <div style={{
      marginTop: style?.margin_top,
      marginRight: style?.margin_right,
      marginBottom: style?.margin_bottom,
      marginLeft: style?.margin_left
    }}>
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
        className={`${widgetClasses} ${style?.background_color && style.background_color.startsWith('rgba') ? '!bg-transparent' : ''}`}
        style={getBackgroundColorStyle()}
      >
        {/* Apply padding from style settings */}
        <div className="w-full" style={{
          paddingTop: style?.padding_top,
          paddingRight: style?.padding_right,
          paddingBottom: style?.padding_bottom,
          paddingLeft: style?.padding_left
        }}>
          {/* Use flexbox with proper alignment to position the image */}
          <div className={`flex ${getAlignmentClasses()} w-full`}>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="block">
                <div
                  className={`${imageContainerClasses} transition-transform duration-200 hover:scale-105`}
                  style={{ boxShadow: boxShadowStyle }}
                >
                  <img
                    src={src}
                    alt={alt || ''}
                    style={getImageFitStyles()}
                    className="w-full h-full"
                  />
                </div>
              </a>
            ) : (
              <div
                className={imageContainerClasses}
                style={{ boxShadow: boxShadowStyle }}
              >
                <img
                  src={src}
                  alt={alt || ''}
                  style={getImageFitStyles()}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
        </div>
      </BlockWidgetWrapper>
    </div>
  );
};

export default ImageWidget; 