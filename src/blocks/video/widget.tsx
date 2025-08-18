import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { VideoBlock } from './schema';

interface VideoWidgetProps extends Omit<BaseWidgetProps<VideoBlock>, 'block'> {
  block: VideoBlock;
}

export const VideoWidget: React.FC<VideoWidgetProps> = ({
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove,
}) => {
  const { src, poster, caption, autoplay, muted, controls, loop, aspectRatio, alignment, size = 'medium' } = block.props;
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

  // Get size classes for the video container with proper alignment handling
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-sm'; // 24rem (384px) max width
      case 'medium':
        return 'max-w-md'; // 28rem (448px) max width
      case 'large':
        return 'max-w-lg'; // 32rem (512px) max width
      case 'full':
      default:
        return 'w-full'; // 100% width
    }
  };

  // Get background color
  const getBackgroundColor = () => {
    if (style?.backgroundColor && style.backgroundColor.startsWith('#')) {
      return ''; // Return empty string for hex colors, we'll apply via inline style
    }
    return style?.backgroundColor || 'bg-black text-white';
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

  // Get aspect ratio classes
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      case 'auto': return 'h-auto';
      default: return 'aspect-video';
    }
  };

  // Get container alignment classes for proper video positioning
  const getContainerAlignmentClasses = () => {
    switch (alignment) {
      case 'left': return 'flex justify-start';
      case 'right': return 'flex justify-end';
      case 'center':
      default: return 'flex justify-center';
    }
  };

  // Get caption alignment classes from style settings (independent of video positioning)
  const getCaptionAlignmentClasses = () => {
    switch (style?.textAlign) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center':
      default: return 'text-center';
    }
  };

  // Get text color class (Tailwind approach)
  const getTextColorClass = () => {
    if (style?.textColor && style.textColor.startsWith('#')) {
      return ''; // Return empty string for hex colors, we'll apply via inline style
    }
    return style?.textColor || 'text-white'; // Use Tailwind class or default
  };

  // Get text color style (inline style approach)
  const getTextColorStyle = (): React.CSSProperties => {
    if (style?.textColor && style.textColor.startsWith('#')) {
      return { color: style.textColor }; // Apply hex color via inline style
    }
    return {}; // No inline style needed for Tailwind classes
  };

  // Get video container classes (reusable for both empty state and main video)
  const getVideoContainerClasses = () => {
    const minWidthMap = {
      small: 'min-w-[320px]',
      medium: 'min-w-[480px]',
      large: 'min-w-[640px]',
      full: 'min-w-0'
    } as const;

    return [
      'min-h-[200px]', // Ensure minimum height even without content
      minWidthMap[size] || 'min-w-0'
    ].join(' ');
  };

  // Build widget classes - remove margin since it will be handled by wrapper
  const widgetClasses = [
    getBackgroundColor(),
    getBorderRadiusClass(),
    getBoxShadowClass(),
    'w-full'
  ].filter(Boolean).join(' ');
  // Empty state when no video
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
            <div className={`w-full ${getContainerAlignmentClasses()}`}>
              <div 
                className={`${getSizeClasses()} ${getAspectRatioClasses()} ${getBorderRadiusClass()} overflow-hidden bg-black ${getVideoContainerClasses()}`}
              >
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="mb-2 text-lg">No video selected</p>
                  <p className="text-sm">Add a video URL in the settings panel</p>
                </div>
              </div>
            </div>
          </div>
        </BaseWidget>
      </div>
    );
  }

  // Main video rendering
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
          {/* Video container with proper alignment */}
          <div className={`w-full ${getContainerAlignmentClasses()}`}>
            {/* Video wrapper with fixed dimensions and size constraints */}
            <div 
              className={`${getSizeClasses()} ${getAspectRatioClasses()} ${getBorderRadiusClass()} overflow-hidden bg-black ${getVideoContainerClasses()}`}
            >
              {/* Video element that fills the container completely */}
              <video
                src={src}
                autoPlay={autoplay}
                muted={autoplay || muted}
                controls={controls}
                loop={loop}
                className="w-full h-full object-cover"
                poster={poster}
                onError={(e) => {
                  console.error('Video failed to load:', e);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          {/* Caption - alignment controlled by style.textAlign, color by style.textColor */}
          {caption && (
            <div className={`mt-3 ${getCaptionAlignmentClasses()}`}>
              <p 
                className={`text-sm ${getTextColorClass()}`}
                style={getTextColorStyle()}
              >
                {caption}
              </p>
            </div>
          )}
        </div>
      </BaseWidget>
    </div>
  );
};

export default VideoWidget; 