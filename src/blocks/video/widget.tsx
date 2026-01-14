import React from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { VideoBlock } from './schema';

interface VideoWidgetProps extends Omit<BlockWidgetWrapperProps<VideoBlock>, 'block'> {
  block: VideoBlock;
}

export const VideoWidget: React.FC<VideoWidgetProps> = ({
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove,
}) => {
  const { src, poster, caption, autoplay, muted, controls, loop, aspect_ratio, alignment, size = 'medium' } = block.props;
  const { style } = block;



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
    if (style?.background_color && style.background_color.startsWith('#')) {
      return ''; // Return empty string for hex colors, we'll apply via inline style
    }
    return style?.background_color || 'bg-black text-white';
  };

  // Get background color as inline style for hex colors
  const getBackgroundColorStyle = (): React.CSSProperties => {
    if (style?.background_color && style.background_color.startsWith('#')) {
      return { backgroundColor: style.background_color };
    }
    return {};
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

  // Get aspect ratio classes
  const getAspectRatioClasses = () => {
    switch (aspect_ratio) {
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
    switch (style?.text_align) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center':
      default: return 'text-center';
    }
  };

  // Get text color class (Tailwind approach)
  const getTextColorClass = () => {
    if (style?.text_color && style.text_color.startsWith('#')) {
      return ''; // Return empty string for hex colors, we'll apply via inline style
    }
    return style?.text_color || 'text-white'; // Use Tailwind class or default
  };

  // Get text color style (inline style approach)
  const getTextColorStyle = (): React.CSSProperties => {
    if (style?.text_color && style.text_color.startsWith('#')) {
      return { color: style.text_color }; // Apply hex color via inline style
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
    'w-full'
  ].filter(Boolean).join(' ');
  // Empty state when no video
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
          className={widgetClasses}
          style={getBackgroundColorStyle()}
        >
          <div className="w-full" style={{
            paddingTop: style?.padding_top,
            paddingRight: style?.padding_right,
            paddingBottom: style?.padding_bottom,
            paddingLeft: style?.padding_left
          }}>
            <div className={`w-full ${getContainerAlignmentClasses()}`}>
              <div
                className={`${getSizeClasses()} ${getAspectRatioClasses()} ${getBorderRadiusClass()} overflow-hidden bg-black ${getVideoContainerClasses()}`}
                style={{ boxShadow: boxShadowStyle }}
              >
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="mb-2 text-lg">No video selected</p>
                  <p className="text-sm">Add a video URL in the settings panel</p>
                </div>
              </div>
            </div>
          </div>
        </BlockWidgetWrapper>
      </div>
    );
  }

  // Main video rendering
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
        className={widgetClasses}
        style={getBackgroundColorStyle()}
      >
        {/* Apply padding from style settings */}
        <div className="w-full" style={{
          paddingTop: style?.padding_top,
          paddingRight: style?.padding_right,
          paddingBottom: style?.padding_bottom,
          paddingLeft: style?.padding_left
        }}>
          {/* Video container with proper alignment */}
          <div className={`w-full ${getContainerAlignmentClasses()}`}>
            {/* Video wrapper with fixed dimensions and size constraints */}
            <div
              className={`${getSizeClasses()} ${getAspectRatioClasses()} ${getBorderRadiusClass()} overflow-hidden bg-black ${getVideoContainerClasses()}`}
              style={{ boxShadow: boxShadowStyle }}
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
      </BlockWidgetWrapper>
    </div>
  );
};

export default VideoWidget; 