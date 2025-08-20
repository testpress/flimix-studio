import React, { useState, useRef, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { HeroBlock } from './schema';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ItemWidget from './ItemWidget';

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

  // Determine background styling - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;


  
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
          {props.items && props.items.length > 0 && (
            <ItemWidget
              item={props.items[currentIndex]}
              aspectRatio={props.aspectRatio}
              customHeight={props.customHeight}
              textAlign={style?.textAlign}
              textColor={style?.textColor}
              backgroundColor={style?.backgroundColor}
              autoplay={!isAutoplayPaused}
            />
          )}
          
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
                {props.items.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
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