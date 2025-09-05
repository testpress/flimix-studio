import React, { useState, useRef, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { HeroBlock } from './schema';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ItemWidget from './ItemWidget';
import ItemsControl from '@blocks/shared/ItemsControl';
import { useSelection } from '@context/SelectionContext';

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
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayIntervalRef = useRef<number | null>(null);
  const previousItemsLengthRef = useRef<number>(0); // Ref to track previous items length
  
  // Local state for display when block is not selected
  const [displayIndex, setDisplayIndex] = useState(0);
  
  const { moveBlockItemLeft, moveBlockItemRight, removeBlockItem, selectArrayItem, isItemSelected, selectedItemId, selectedItemBlockId } = useSelection();
  
  const getCurrentItemIndex = () => {
    if (selectedItemId && selectedItemBlockId === block.id) {
      const selectedIndex = props.items?.findIndex(item => item.id === selectedItemId);
      if (selectedIndex !== -1) {
        return selectedIndex;
      }
    }
    return displayIndex; // Use displayIndex when no item is selected
  };
  
  const currentItemIndex = getCurrentItemIndex();
  
  const marginClass = { lg: 'm-8', md: 'm-6', sm: 'm-4', none: 'm-0' }[style?.margin ?? 'none'];

  // Determine background styling - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const backgroundClass = hasCustomBackground ? '' : 'bg-black';


  
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
        const nextIndex = (currentItemIndex + 1) % props.items!.length;
        
        // Only select item if block is selected
        if (isSelected) {
          selectArrayItem(block.id, props.items![nextIndex].id);
        } else {
          // Just update the display without selecting
          setDisplayIndex(nextIndex);
        }
      }, props.scrollSpeed || 5000);
    }
    
    // Cleanup on unmount or when props change
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };
  }, [props.variant, props.autoplay, props.scrollSpeed, props.items, isAutoplayPaused, currentItemIndex, selectArrayItem, block.id, isSelected]);
  
  useEffect(() => {
    if (previousItemsLengthRef.current > 0 && props.items && props.items.length > previousItemsLengthRef.current) {
      const timer = setTimeout(() => {
        selectArrayItem(block.id, props.items[props.items.length - 1].id);
      }, 100);

      return () => clearTimeout(timer);
    }

    previousItemsLengthRef.current = props.items?.length || 0;
  }, [props.items, selectArrayItem, block.id]);
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
      const nextIndex = (currentItemIndex + 1) % props.items.length;
      
      // Only select item if block is selected
      if (isSelected) {
        selectArrayItem(block.id, props.items[nextIndex].id);
      } else {
        // Just update the display without selecting
        setDisplayIndex(nextIndex);
      }
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
      const prevIndex = (currentItemIndex - 1 + props.items.length) % props.items.length;
      
      // Only select item if block is selected
      if (isSelected) {
        selectArrayItem(block.id, props.items[prevIndex].id);
      } else {
        setDisplayIndex(prevIndex);
      }
    }
  };

  // Handle item movement with conditional selection update
  const handleMoveLeft = () => {
    if (currentItemIndex > 0) {
      moveBlockItemLeft(block.id, currentItemIndex);
      // Only update selection if block is selected
      if (isSelected) {
        const newIndex = currentItemIndex - 1;
        selectArrayItem(block.id, props.items[newIndex].id);
      }
    }
  };

  const handleMoveRight = () => {
    if (currentItemIndex < props.items.length - 1) {
      moveBlockItemRight(block.id, currentItemIndex);
      // Only update selection if block is selected
      if (isSelected) {
        const newIndex = currentItemIndex + 1;
        selectArrayItem(block.id, props.items[newIndex].id);
      }
    }
  };

  // Handle item click for selection
  const handleItemClick = (itemId: string) => {
    selectArrayItem(block.id, itemId);
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
          {props.items && props.items.length > 0 && props.items[currentItemIndex] ? (
            <div className="relative group">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(props.items[currentItemIndex].id);
                }}
                className={`cursor-pointer transition-all duration-200 ${
                  isItemSelected(block.id, props.items[currentItemIndex].id) 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' 
                    : ''
                }`}
              >
                <ItemWidget
                  item={props.items[currentItemIndex]}
                  aspectRatio={props.aspectRatio}
                  customHeight={props.customHeight}
                  textAlign={style?.textAlign}
                  textColor={style?.textColor}
                  backgroundColor={style?.backgroundColor}
                  autoplay={!isAutoplayPaused}
                />
                
                {/* Selection indicator overlay */}
                {isItemSelected(block.id, props.items[currentItemIndex].id) && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    Selected for editing
                  </div>
                )}
              </div>
              
              {/* ItemsControl - positioned at the top, visible on hover */}
              <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ItemsControl
                  index={currentItemIndex}
                  count={props.items.length}
                  onMoveLeft={currentItemIndex > 0 ? handleMoveLeft : undefined}
                  onMoveRight={currentItemIndex < props.items.length - 1 ? handleMoveRight : undefined}
                  onRemove={() => removeBlockItem(block.id, props.items[currentItemIndex].id)}
                  showMoveControls={props.items.length > 1}
                  showRemoveControl={true}
                  className="flex space-x-1 bg-white/95 rounded-lg p-1.5 shadow-lg border border-gray-300"
                />
              </div>
            </div>
                      ) : (
              /* Fallback when no items or current item is undefined */
              <div className="w-full h-full flex items-center justify-center text-gray-500 min-h-[400px]">
                <div className="text-center">
                  <p className="text-lg font-medium">No Hero Items</p>
                  <p className="text-sm">Add items to your hero carousel</p>
                </div>
              </div>
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
                      
                      // Only select item if block is selected
                      if (isSelected) {
                        selectArrayItem(block.id, item.id);
                      } else {
                        // Just update the display without selecting
                        setDisplayIndex(idx);
                      }
                      
                      if (props.autoplay) {
                        setIsAutoplayPaused(true);
                        setTimeout(() => {
                          setIsAutoplayPaused(false);
                        }, 1500);
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      idx === currentItemIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                    } ${
                      isItemSelected(block.id, item.id) ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-black' : ''
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                    title={`Select slide ${idx + 1} for editing`}
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