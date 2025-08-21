import React from 'react';
import type { HeroItem } from './schema';
import VideoPlayer from './VideoPlayer';
import { ButtonIcon } from './form-components/ButtonIcons';

interface ItemWidgetProps {
  item: HeroItem;
  aspectRatio?: string;
  customHeight?: string;
  textAlign?: string;
  textColor?: string;
  backgroundColor?: string;
  autoplay?: boolean;
}

const ItemWidget: React.FC<ItemWidgetProps> = ({
  item,
  aspectRatio = '16:9',
  customHeight = '600px',
  textAlign = 'center',
  textColor,
  autoplay = true
}) => {
  // Get alignment class based on block style
  const alignmentClass = textAlign === 'left' ? 'items-start text-left' : 
                        textAlign === 'right' ? 'items-end text-right' : 'items-center text-center';
  
  // Handle text color - default to white text
  const isHexColor = textColor && textColor.startsWith('#');
  const textColorClass = !isHexColor ? (textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: textColor } : {};

  // Handle aspect ratio
  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case 'auto': return 'min-h-[600px]';
      case 'custom': return ''; // Custom height will be handled with inline style
      default: return 'aspect-video';
    }
  };
  
  // Get custom height style if specified
  const getCustomHeightStyle = () => {
    if (aspectRatio === 'custom') {
      return { height: customHeight };
    }
    return {};
  };

  const aspectRatioClass = getAspectRatioClass(aspectRatio);

  // Helper function to get border radius classes
  const getBorderRadiusClass = (borderRadius?: string) => {
    switch (borderRadius) {
      case 'none': return '';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-full';
      default: return 'rounded-md';
    }
  };

  // Helper function to get hashtag text size classes
  const getHashtagSizeClass = (size?: string) => {
    switch (size) {
      case 'small': return 'text-sm md:text-base';
      case 'large': return 'text-lg md:text-xl';
      case 'xl': return 'text-xl md:text-2xl';
      default: return 'text-base md:text-lg'; // medium (default)
    }
  };

  // Helper function to get button size classes
  const getButtonSizeClass = (size?: string, isCircle?: boolean) => {
    if (isCircle) return 'w-12 h-12 p-0';
    
    switch (size) {
      case 'small': return 'py-1.5 px-4 text-sm';
      case 'large': return 'py-3 px-8 text-lg';
      default: return 'py-2.5 px-6 text-base'; // medium (default)
    }
  };

  // Helper function to get button variant classes
  const getButtonVariantClass = (variant?: string) => {
    switch (variant) {
      case 'outline': return 'border bg-transparent';
      default: return 'border'; // solid variant
    }
  };

  return (
    <div 
      className={`relative w-full ${aspectRatioClass}`}
      style={aspectRatio === 'custom' ? getCustomHeightStyle() : {}}
    >
      {/* Video Background (if available) */}
      {item.videoBackground && (
        <div className="absolute inset-0 w-full h-full bg-black">
                      <VideoPlayer 
              src={item.videoBackground}
              poster={item.backgroundImage}
              autoplay={autoplay}
              muted={true}
              loop={true}
              className="w-full h-full object-cover"
            />
        </div>
      )}
      
      {/* Image Background (if no video) */}
      {!item.videoBackground && item.backgroundImage && (
        <img 
          src={item.backgroundImage} 
          alt={item.title || 'Hero background'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Dark Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
      
      {/* Content Container - Positioned at bottom with padding */}
      <div className={`absolute inset-x-0 bottom-0 flex flex-col justify-end ${alignmentClass} z-10 pb-16 pt-32 px-8`}>
        
        {/* Category Badges */}
        {item.badges && item.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.badges.map((badge) => (
              <span 
                key={badge.id} 
                className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded"
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
        
        {/* Title - either text or image */}
        {item.titleType === 'image' && item.titleImage ? (
          <div className="mb-3">
            <img 
              src={item.titleImage} 
              alt="Title" 
              className="max-w-full h-auto max-h-24 md:max-h-32"
            />
          </div>
        ) : item.title && (
          <h1 className={`text-4xl md:text-5xl font-bold mb-1 ${textColorClass}`} style={textColorStyle}>
            {item.title}
          </h1>
        )}
        
        {/* Metadata Row */}
        {item.metadata && Object.values(item.metadata).some(value => !!value) && (
          <div className="flex flex-wrap items-center gap-x-3 text-sm text-white/80 mb-2">
            {item.metadata.year && <span>{item.metadata.year}</span>}
            {item.metadata.seasons && (
              <>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span>{item.metadata.seasons} Seasons</span>
              </>
            )}
            {item.metadata.language && (
              <>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span>{item.metadata.language}</span>
              </>
            )}
          </div>
        )}
        
        {/* Subtitle */}
        {item.subtitle && (
          <p className={`text-base md:text-lg mb-4 max-w-xl ${textColorClass} opacity-90`} style={textColorStyle}>
            {item.subtitle}
          </p>
        )}
        
        {/* Hashtag - Display after subtitle and before buttons */}
        {item.hashtag && item.hashtag.text && (
          <div className="mb-4">
            <span 
              className={`font-bold ${getHashtagSizeClass(item.hashtag.size)}`}
              style={{ color: item.hashtag.color || '#dc2626' }}
            >
              {item.hashtag.text.startsWith('#') ? item.hashtag.text : `#${item.hashtag.text}`}
            </span>
          </div>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 mt-2">
          {/* Primary CTA */}
          {item.primaryCTA && (
            <button 
              className={`font-semibold transition-colors duration-200 ${getButtonVariantClass(item.primaryCTA.variant)} flex items-center justify-center gap-2 ${getBorderRadiusClass(item.primaryCTA.borderRadius)} ${getButtonSizeClass(item.primaryCTA.size, item.primaryCTA.borderRadius === 'full')}`}
              style={{
                backgroundColor: item.primaryCTA.backgroundColor || '#dc2626',
                color: item.primaryCTA.textColor || '#ffffff',
                borderColor: item.primaryCTA.variant === 'outline' ? item.primaryCTA.textColor || '#ffffff' : 'transparent'
              }}
            >
              {item.primaryCTA.borderRadius === 'full' ? (
                // Circle button: only show icon, no text
                item.primaryCTA.icon && item.primaryCTA.icon !== 'None' ? (
                  <ButtonIcon 
                    icon={item.primaryCTA.icon} 
                    size={item.primaryCTA.size === 'small' ? 16 : item.primaryCTA.size === 'large' ? 24 : 20} 
                    thickness={item.primaryCTA.iconThickness}
                  />
                ) : (
                  // If no icon, show first letter of label
                  <span className={`font-bold ${
                    item.primaryCTA.size === 'small' ? 'text-base' : 
                    item.primaryCTA.size === 'large' ? 'text-xl' : 
                    'text-lg'
                  }`}>
                    {item.primaryCTA.label.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                // Regular button: show icon + text
                <>
                  {/* Left Icon */}
                  {item.primaryCTA.icon && item.primaryCTA.icon !== 'None' && item.primaryCTA.iconPosition === 'left' && (
                    <ButtonIcon 
                      icon={item.primaryCTA.icon} 
                      size={item.primaryCTA.size === 'small' ? 16 : item.primaryCTA.size === 'large' ? 24 : 20}
                      thickness={item.primaryCTA.iconThickness}
                    />
                  )}
                  
                  {/* Label */}
                  <span>{item.primaryCTA.label}</span>
                  
                  {/* Right Icon */}
                  {item.primaryCTA.icon && item.primaryCTA.icon !== 'None' && item.primaryCTA.iconPosition === 'right' && (
                    <ButtonIcon 
                      icon={item.primaryCTA.icon} 
                      size={item.primaryCTA.size === 'small' ? 16 : item.primaryCTA.size === 'large' ? 24 : 20}
                      thickness={item.primaryCTA.iconThickness}
                    />
                  )}
                </>
              )}
            </button>
          )}
          
          {/* Secondary CTA */}
          {item.secondaryCTA && (
            <button 
              className={`font-semibold transition-colors duration-200 ${getButtonVariantClass(item.secondaryCTA.variant)} flex items-center justify-center gap-2 ${getBorderRadiusClass(item.secondaryCTA.borderRadius)} ${getButtonSizeClass(item.secondaryCTA.size, item.secondaryCTA.borderRadius === 'full')}`}
              style={{
                backgroundColor: item.secondaryCTA.backgroundColor || '#ffffff',
                color: item.secondaryCTA.textColor || '#000000',
                borderColor: item.secondaryCTA.variant === 'outline' ? item.secondaryCTA.textColor || '#000000' : 'transparent'
              }}
            >
              {item.secondaryCTA.borderRadius === 'full' ? (
                // Circle button: only show icon, no text
                item.secondaryCTA.icon && item.secondaryCTA.icon !== 'None' ? (
                  <ButtonIcon 
                    icon={item.secondaryCTA.icon} 
                    size={item.secondaryCTA.size === 'small' ? 16 : item.secondaryCTA.size === 'large' ? 24 : 20}
                    thickness={item.secondaryCTA.iconThickness}
                  />
                ) : (
                  // If no icon, show first letter of label
                  <span className={`font-bold ${
                    item.secondaryCTA.size === 'small' ? 'text-base' : 
                    item.secondaryCTA.size === 'large' ? 'text-xl' : 
                    'text-lg'
                  }`}>
                    {item.secondaryCTA.label.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                // Regular button: show icon + text
                <>
                  {/* Left Icon */}
                  {item.secondaryCTA.icon && item.secondaryCTA.icon !== 'None' && item.secondaryCTA.iconPosition === 'left' && (
                    <ButtonIcon 
                      icon={item.secondaryCTA.icon} 
                      size={item.secondaryCTA.size === 'small' ? 16 : item.secondaryCTA.size === 'large' ? 24 : 20}
                      thickness={item.secondaryCTA.iconThickness}
                    />
                  )}
                  
                  {/* Label */}
                  <span>{item.secondaryCTA.label}</span>
                  
                  {/* Right Icon */}
                  {item.secondaryCTA.icon && item.secondaryCTA.icon !== 'None' && item.secondaryCTA.iconPosition === 'right' && (
                    <ButtonIcon 
                      icon={item.secondaryCTA.icon} 
                      size={item.secondaryCTA.size === 'small' ? 16 : item.secondaryCTA.size === 'large' ? 24 : 20}
                      thickness={item.secondaryCTA.iconThickness}
                    />
                  )}
                </>
              )}
            </button>
          )}
          
          {/* Tertiary CTA */}
          {item.tertiaryCTA && (
            <button 
              className={`font-semibold transition-colors duration-200 ${getButtonVariantClass(item.tertiaryCTA.variant)} flex items-center justify-center gap-2 ${getBorderRadiusClass(item.tertiaryCTA.borderRadius)} ${getButtonSizeClass(item.tertiaryCTA.size, item.tertiaryCTA.borderRadius === 'full')}`}
              style={{
                backgroundColor: item.tertiaryCTA.backgroundColor || '#333333',
                color: item.tertiaryCTA.textColor || '#ffffff',
                borderColor: item.tertiaryCTA.variant === 'outline' ? item.tertiaryCTA.textColor || '#ffffff' : 'transparent'
              }}
            >
              {item.tertiaryCTA.borderRadius === 'full' ? (
                // Circle button: only show icon, no text
                item.tertiaryCTA.icon && item.tertiaryCTA.icon !== 'None' ? (
                  <ButtonIcon 
                    icon={item.tertiaryCTA.icon} 
                    size={item.tertiaryCTA.size === 'small' ? 16 : item.tertiaryCTA.size === 'large' ? 24 : 20}
                    thickness={item.tertiaryCTA.iconThickness}
                  />
                ) : (
                  // If no icon, show first letter of label
                  <span className={`font-bold ${
                    item.tertiaryCTA.size === 'small' ? 'text-base' : 
                    item.tertiaryCTA.size === 'large' ? 'text-xl' : 
                    'text-lg'
                  }`}>
                    {item.tertiaryCTA.label.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                // Regular button: show icon + text
                <>
                  {/* Left Icon */}
                  {item.tertiaryCTA.icon && item.tertiaryCTA.icon !== 'None' && item.tertiaryCTA.iconPosition === 'left' && (
                    <ButtonIcon 
                      icon={item.tertiaryCTA.icon} 
                      size={item.tertiaryCTA.size === 'small' ? 16 : item.tertiaryCTA.size === 'large' ? 24 : 20}
                      thickness={item.tertiaryCTA.iconThickness}
                    />
                  )}
                  
                  {/* Label */}
                  <span>{item.tertiaryCTA.label}</span>
                  
                  {/* Right Icon */}
                  {item.tertiaryCTA.icon && item.tertiaryCTA.icon !== 'None' && item.tertiaryCTA.iconPosition === 'right' && (
                    <ButtonIcon 
                      icon={item.tertiaryCTA.icon} 
                      size={item.tertiaryCTA.size === 'small' ? 16 : item.tertiaryCTA.size === 'large' ? 24 : 20}
                      thickness={item.tertiaryCTA.iconThickness}
                    />
                  )}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemWidget;
