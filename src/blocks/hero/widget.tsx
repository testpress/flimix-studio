import React, { useState, useRef, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { HeroBlock, HeroItem } from './schema';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface HeroWidgetProps extends Omit<BaseWidgetProps<HeroBlock>, 'block'> {
  block: HeroBlock;
}

const HeroWidget: React.FC<HeroWidgetProps> = ({ 
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayIntervalRef = useRef<number | null>(null);
  
  const marginClass = { lg: 'm-8', md: 'm-6', sm: 'm-4', none: 'm-0' }[style?.margin ?? 'none'];
  // Handle text color - default to white text
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  // Handle aspect ratio
  const getAspectRatioClass = (aspectRatio?: string) => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case 'auto': return 'min-h-[600px]';
      case 'custom': return ''; // Custom height will be handled with inline style
      default: return 'aspect-video';
    }
  };
  
  // Get custom height style if specified
  const getCustomHeightStyle = () => {
    if (props.aspectRatio === 'custom') {
      const height = props.customHeight || '600px';
      return { height };
    }
    return {};
  };

  
  // Autoplay functionality for carousel
  useEffect(() => {
    // Clear any existing interval
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
    
    // Start autoplay if enabled and not paused
    if (props.variant === 'carousel' && props.autoplay && !isAutoplayPaused && props.items && props.items.length > 1) {
      autoplayIntervalRef.current = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % props.items!.length);
      }, props.scrollSpeed || 5000);
    }
    
    // Cleanup on unmount or when props change
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };
  }, [props.variant, props.autoplay, props.scrollSpeed, props.items, isAutoplayPaused]);

  // Handle carousel navigation
  const nextSlide = () => {
    if (props.items && props.items.length > 1) {
      // Pause autoplay temporarily when manually navigating
      if (props.autoplay) {
        setIsAutoplayPaused(true);
        setTimeout(() => {
          setIsAutoplayPaused(false);
        }, 1500); // Resume after 1.5 seconds
      }
      setCurrentIndex((prevIndex) => (prevIndex + 1) % props.items.length);
    }
  };

  const prevSlide = () => {
    if (props.items && props.items.length > 1) {
      // Pause autoplay temporarily when manually navigating
      if (props.autoplay) {
        setIsAutoplayPaused(true);
        setTimeout(() => {
          setIsAutoplayPaused(false);
        }, 1500); // Resume after 1.5 seconds
      }
      setCurrentIndex((prevIndex) => (prevIndex - 1 + props.items.length) % props.items.length);
    }
  };

  // Render a single hero item
  const renderHeroItem = (item: HeroItem) => {
    // Get alignment class based on block style
    const alignmentClass = style?.textAlign === 'left' ? 'items-start text-left' : 
                          style?.textAlign === 'right' ? 'items-end text-right' : 'items-center text-center';
    
    const aspectRatioClass = getAspectRatioClass(props.aspectRatio);

    return (
      <div 
        key={item.id} 
        className={`relative w-full ${aspectRatioClass}`}
        style={props.aspectRatio === 'custom' ? getCustomHeightStyle() : {}}
      >
        {/* Video Background (if available) */}
        {item.videoBackground && (
          <div className="absolute inset-0 w-full h-full bg-black">
            <VideoPlayer 
              src={item.videoBackground}
              poster={item.backgroundImage}
              autoplay={!isAutoplayPaused}
              muted={true}
              loop={true}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        
        {/* Image Background (if no video) */}
        {!item.videoBackground && item.backgroundImage && (
          <img 
            src={item.backgroundImage} 
            alt="" 
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
              {item.badges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded"
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          {item.title && (
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
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-2">
            {/* Primary CTA */}
            {item.primaryCTA && (
              <button 
                className="font-semibold py-2.5 px-6 rounded-lg text-base transition-colors duration-200 border"
                style={{
                  backgroundColor: item.primaryCTA.backgroundColor || '#dc2626',
                  color: item.primaryCTA.textColor || '#ffffff',
                  borderColor: item.primaryCTA.variant === 'outline' ? item.primaryCTA.textColor || '#ffffff' : 'transparent'
                }}
              >
                {item.primaryCTA.label}
              </button>
            )}
            
            {/* Secondary CTAs */}
            {item.secondaryCTAs && item.secondaryCTAs.map((btn, idx) => (
              <button 
                key={idx}
                className="font-semibold py-2.5 px-5 rounded-lg text-base transition-colors duration-200 border"
                style={{
                  backgroundColor: btn.backgroundColor || '#ffffff',
                  color: btn.textColor || '#000000',
                  borderColor: btn.variant === 'outline' ? btn.textColor || '#000000' : 'transparent'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
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
        className={`relative overflow-hidden ${marginClass} ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
        }}
      >
        {/* Hero Content */}
        <div className="relative">
          {/* Render current hero item */}
          {props.items && props.items.length > 0 && renderHeroItem(props.items[currentIndex])}
          
          {/* Carousel Navigation (only if multiple items) */}
          {props.variant === 'carousel' && props.items && props.items.length > 1 && (
            <>
              {/* Navigation Arrows - only show if enabled */}
              {props.showArrows && (
                <>
                  {/* Previous Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent block selection
                      prevSlide();
                    }} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 z-20"
                    aria-label="Previous slide"
                    onMouseEnter={() => props.autoplay && setIsAutoplayPaused(true)}
                    onMouseLeave={() => props.autoplay && setIsAutoplayPaused(false)}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  {/* Next Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent block selection
                      nextSlide();
                    }} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 z-20"
                    aria-label="Next slide"
                    onMouseEnter={() => props.autoplay && setIsAutoplayPaused(true)}
                    onMouseLeave={() => props.autoplay && setIsAutoplayPaused(false)}
                  >
                    <ArrowRight size={20} />
                  </button>
                </>
              )}
              
              {/* Dots Indicator */}
              <div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={() => props.autoplay && setIsAutoplayPaused(true)}
                onMouseLeave={() => props.autoplay && setIsAutoplayPaused(false)}
              >
                {props.items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent block selection
                      setCurrentIndex(idx);
                      if (props.autoplay) {
                        setIsAutoplayPaused(true);
                        setTimeout(() => {
                          setIsAutoplayPaused(false);
                        }, 1500);
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      idx === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </BaseWidget>
    </div>
  );
};

export default HeroWidget; 