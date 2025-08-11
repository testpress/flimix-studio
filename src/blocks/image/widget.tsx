import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { ImageBlock } from './schema';

interface ImageWidgetProps extends Omit<BaseWidgetProps<ImageBlock>, 'block'> {
  block: ImageBlock;
}

export const ImageWidget: React.FC<ImageWidgetProps> = ({
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove,
}) => {
  const { src, alt, link, size, aspectRatio, fit, alignment } = block.props;
  const { style } = block;

  // Get padding class from style settings
  const getPaddingClass = () => {
    switch (style?.padding) {
      case 'lg': return 'p-6';
      case 'sm': return 'p-2';
      case 'none': return 'p-0';
      default: return 'p-4'; // md
    }
  };

  // Get margin class from style settings
  const getMarginClass = () => {
    switch (style?.margin) {
      case 'lg': return 'm-6';
      case 'md': return 'm-4';
      case 'sm': return 'm-2';
      case 'none': return 'm-0';
      default: return 'm-4';
    }
  };

  // Get background color
  const getBackgroundColor = () => {
    if (style?.backgroundColor && style.backgroundColor.startsWith('#')) {
      return ''; // Return empty string for hex colors, we'll apply via inline style
    }
    return style?.backgroundColor || 'bg-gray-50';
  };

  // Get background color as inline style for hex colors
  const getBackgroundColorStyle = (): React.CSSProperties => {
    if (style?.backgroundColor && style.backgroundColor.startsWith('#')) {
      return { backgroundColor: style.backgroundColor };
    }
    return {};
  };

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (style?.borderRadius) {
      case 'lg': return 'rounded-xl';
      case 'md': return 'rounded-lg';
      case 'sm': return 'rounded-md';
      case 'none': return 'rounded-none';
      default: return 'rounded-lg';
    }
  };

  // Get box shadow class
  const getBoxShadowClass = () => {
    switch (style?.boxShadow) {
      case 'lg': return 'shadow-xl';
      case 'md': return 'shadow-lg';
      case 'sm': return 'shadow-md';
      case 'none': return 'shadow-none';
      default: return 'shadow-none';
    }
  };

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
    switch (aspectRatio) {
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
    getBoxShadowClass(),
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
      <div className={getMarginClass()}>
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
          className={widgetClasses}
          style={getBackgroundColorStyle()}
        >
          <div className={`w-full ${getPaddingClass()}`}>
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="mb-2 text-lg">No image selected</p>
              <p className="text-sm">Add an image URL in the settings panel</p>
            </div>
          </div>
        </BaseWidget>
      </div>
    );
  }

  // Main image rendering
  return (
    <div className={getMarginClass()}>
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
        className={widgetClasses}
        style={getBackgroundColorStyle()}
      >
        {/* Apply padding from style settings */}
        <div className={`w-full ${getPaddingClass()}`}>
          {/* Use flexbox with proper alignment to position the image */}
          <div className={`flex ${getAlignmentClasses()} w-full`}>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="block">
                <div className={`${imageContainerClasses} transition-transform duration-200 hover:scale-105`}>
                  <img
                    src={src}
                    alt={alt || ''}
                    style={getImageFitStyles()}
                    className="w-full h-full"
                  />
                </div>
              </a>
            ) : (
              <div className={imageContainerClasses}>
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
      </BaseWidget>
    </div>
  );
};

export default ImageWidget; 