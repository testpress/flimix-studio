import React from 'react';
import type { HeroItem } from './schema';
import VideoPlayer from './VideoPlayer';
import CTAButton, { getHashtagSizeClass } from './CTAButton';

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

  const backgroundImageSrc = item.poster || item.cover || item.thumbnail;

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
              poster={backgroundImageSrc || undefined}
              autoplay={autoplay}
              muted={true}
              loop={true}
              className="w-full h-full object-cover"
            />
        </div>
      )}
      
      {/* Image Background (if no video) */}
      {!item.videoBackground && backgroundImageSrc && (
        <img 
          src={backgroundImageSrc} 
          alt={item.title || 'Hero background'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Dark Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
      
      {/* Content Container - Positioned at bottom with padding */}
      <div className={`absolute inset-x-0 bottom-0 flex flex-col justify-end ${alignmentClass} z-10 pb-16 pt-32 px-8`}>
        
        {/* Category Genres */}
        {item.showGenres !== false && item.genres && item.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.genres.map((genre, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        {/* Title - either text or image */}
        {item.showTitle !== false && (
          item.titleType === 'image' && item.titleImage ? (
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
          )
        )}
        
        {/* Metadata Row */}
        {item.showMeta !== false && item.details && Object.values(item.details).some(value => !!value) && (
          <div className="flex flex-wrap items-center gap-x-3 text-sm text-white/80 mb-2">
            {item.details.release_year && <span>{item.details.release_year}</span>}
            {item.details.language && (
              <>
                {item.details.release_year && <span className="text-gray-400">•</span>}
                <span>{item.details.language}</span>
              </>
            )}
          </div>
        )}
          {/* Hashtag - Display after subtitle and before buttons */}
          {item.showHashtag !== false && item.hashtag && item.hashtag.text && (
            <div className="mb-4">
              <span 
                className={`font-bold ${getHashtagSizeClass(item.hashtag.size)}`}
                style={{ color: item.hashtag.color || '#dc2626' }}
              >
                {item.hashtag.text.startsWith('#') ? item.hashtag.text : `#${item.hashtag.text}`}
              </span>
            </div>
          )}
        {/* Subtitle */}
        {item.showSubtitle !== false && item.subtitle && (
          <p className={`text-base md:text-lg mb-4 max-w-xl ${textColorClass} opacity-90 line-clamp-3`} style={textColorStyle}>
            {item.subtitle}
          </p>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 mt-2">
          {/* Primary CTA */}
          {item.primaryCTA && (
            <CTAButton 
              cta={item.primaryCTA}
              defaultBackgroundColor="#dc2626"
              defaultTextColor="#ffffff"
            />
          )}
          
          {/* Secondary CTA */}
          {item.secondaryCTA && (
            <CTAButton 
              cta={item.secondaryCTA}
              defaultBackgroundColor="#ffffff"
              defaultTextColor="#000000"
            />
          )}
          
          {/* Tertiary CTA */}
          {item.tertiaryCTA && (
            <CTAButton 
              cta={item.tertiaryCTA}
              defaultBackgroundColor="#333333"
              defaultTextColor="#ffffff"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemWidget;
