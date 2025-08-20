import React, { useRef, useState, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { TestimonialBlock, ItemSize, TestimonialItem } from './schema';
import { TESTIMONIAL_ITEM_LIMIT } from './schema';
import { useSelection } from '@context/SelectionContext';
import ItemsControl from '@blocks/shared/ItemsControl';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { generateUniqueId } from '@utils/id';

interface TestimonialWidgetProps extends Omit<BaseWidgetProps<TestimonialBlock>, 'block'> {
  block: TestimonialBlock;
}

const TestimonialWidget: React.FC<TestimonialWidgetProps> = ({ 
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
  const { 
    title, 
    layout = 'carousel', 
    items = [], 
    autoplay = false, 
    scrollSpeed = 1000,
    showArrows = true,
    itemSize = 'large',
    columns = 3,
    rows = 3,
    itemShape = 'circle'
  } = props;
  
  const { addBlockItem, selectArrayItem, isItemSelected, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useSelection();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const previousItemsLengthRef = useRef<number>(0);
  const autoplayIntervalRef = useRef<number | null>(null);
  const manualScrollPauseTimeoutRef = useRef<number | null>(null);
  
  // Map abstract item size values to Tailwind classes for carousel - now responsive
  const getItemSizeClass = (size: ItemSize): string => {
    switch (size) {
      case 'small':
        return 'w-full sm:w-64 md:w-72 lg:w-80';
      case 'medium':
        return 'w-full sm:w-72 md:w-80 lg:w-96';
      case 'large':
        return 'w-full sm:w-80 md:w-96 lg:w-[28rem]';
      case 'extra-large':
        return 'w-full sm:w-96 md:w-[28rem] lg:w-[32rem]';
      default:
        return 'w-full sm:w-80 md:w-96 lg:w-[28rem]'; // fallback to large
    }
  };
  
  const paddingClass = style?.padding === 'lg' ? 'p-4 sm:p-6 md:p-8' : 
                      style?.padding === 'md' ? 'p-3 sm:p-4 md:p-6' : 
                      style?.padding === 'sm' ? 'p-2 sm:p-3 md:p-4' : 'p-3 sm:p-4 md:p-6';
  
  const marginClass = style?.margin === 'lg' ? 'm-8' : 
                     style?.margin === 'md' ? 'm-6' : 
                     style?.margin === 'sm' ? 'm-4' : 'm-0';
  
  const borderRadiusClass = style?.borderRadius === 'lg' ? 'rounded-lg' : 
                           style?.borderRadius === 'md' ? 'rounded-md' : 
                           style?.borderRadius === 'sm' ? 'rounded-sm' : '';
  
  // Handle box shadow - custom CSS values for better visibility
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg': return '0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.2)';
      case 'md': return '0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -2px rgba(255, 255, 255, 0.2)';
      case 'sm': return '0 4px 6px -1px rgba(255, 255, 255, 0.3), 0 2px 4px -1px rgba(255, 255, 255, 0.2)';
      default: return undefined;
    }
  };
  const boxShadowStyle = getBoxShadowStyle(style?.boxShadow);
  
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' :
                        style?.textAlign === 'right' ? 'text-right' : 'text-left';

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  // Gap class mapping for better maintainability - reduced sizes
  const GAP_CLASSES: Record<string, string> = {
    'sm': 'space-x-2 sm:space-x-3',
    'md': 'space-x-3 sm:space-x-4',
    'lg': 'space-x-4 sm:space-x-6',
  };

  const getGapClass = () => {
    return GAP_CLASSES[style?.gridGap || 'md'] || GAP_CLASSES['md'];
  };


  // Calculate dynamic scroll amount based on item width and gap
  const getScrollAmount = (): number => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !items || items.length < 2) return 400; // Fallback, requires at least 2 items to measure gap.

    // children[0] is a padding div, so we start from index 1.
    const firstItem = scrollContainer.children[1] as HTMLElement;
    const secondItem = scrollContainer.children[2] as HTMLElement;
    if (!firstItem || !secondItem) return 400; // Fallback

    // This dynamically calculates the scroll distance including item width and responsive gap.
    const scrollAmount = secondItem.offsetLeft - firstItem.offsetLeft;
    
    // Ensure we scroll at least one full item width
    return Math.max(scrollAmount, firstItem.offsetWidth);
  };

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    // Add a small tolerance to prevent edge cases
    const tolerance = 5;
    
    // Check if we can scroll left
    setCanScrollLeft(scrollLeft > tolerance);
    
    // Check if we can scroll right - be more generous with the calculation
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - tolerance;
    
    // Also check if we have more items than can fit in the visible area
    const hasOverflow = scrollWidth > clientWidth;
    
    setCanScrollRight(canScrollRight && hasOverflow);
  };

  // Handle scroll events
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Store current scroll position before items change
      const currentScrollLeft = scrollContainer.scrollLeft;
      
      // Only reset scroll position if this is the initial load or items were added/removed
      const isInitialLoad = previousItemsLengthRef.current === 0;
      const itemsChanged = previousItemsLengthRef.current !== (items?.length || 0);
      
      if (isInitialLoad) {
        scrollContainer.scrollLeft = 0;
      } else if (!itemsChanged) {
        // If items were just reordered (same count), preserve scroll position
        scrollContainer.scrollLeft = currentScrollLeft;
      }
      
      // Always check scroll position after items change
      checkScrollPosition();
      
      // Add a small delay to ensure layout is stable after items change
      const delayedCheck = setTimeout(() => {
        checkScrollPosition();
      }, 150);
      
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      // Update previous items length
      previousItemsLengthRef.current = items?.length || 0;
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
        clearTimeout(delayedCheck);
      };
    }
  }, [items]);

  // Add effect to handle layout changes (like settings panel opening/closing)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Use ResizeObserver to detect when the carousel container size changes
      const resizeObserver = new ResizeObserver(() => {
        // Small delay to ensure layout is stable
        setTimeout(() => {
          checkScrollPosition();
        }, 100);
      });
      
      resizeObserver.observe(scrollContainer);
      
      // Also listen for window resize events
      const handleResize = () => {
        setTimeout(() => {
          checkScrollPosition();
        }, 100);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Initial check after a short delay to ensure layout is stable
      const initialCheck = setTimeout(() => {
        checkScrollPosition();
      }, 200);
      
      // Periodic check to ensure accuracy (especially after layout changes)
      const periodicCheck = setInterval(() => {
        checkScrollPosition();
      }, 1000); // Check every second
      
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleResize);
        clearTimeout(initialCheck);
        clearInterval(periodicCheck);
      };
    }
  }, []); // Empty dependency array - only run once on mount

  // Autoplay functionality for carousel layout
  useEffect(() => {
    if (layout !== 'carousel') return;
    
    const scrollContainer = scrollContainerRef.current;
    
    // Clear any existing interval
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
    
    // Start autoplay if enabled and we have items and not paused
    if (autoplay && !isAutoplayPaused && scrollContainer && items && items.length > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        if (scrollContainer) {
          // Check if we're at the end of the carousel
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
          const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10; // 10px tolerance
          
          if (isAtEnd) {
            // Reset to beginning for infinite loop
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll to next item using dynamic scroll amount
            const scrollAmount = getScrollAmount();
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, scrollSpeed);
    }
    
    // Cleanup on unmount or when autoplay/scrollSpeed/pause state changes
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
      if (manualScrollPauseTimeoutRef.current) {
        clearTimeout(manualScrollPauseTimeoutRef.current);
        manualScrollPauseTimeoutRef.current = null;
      }
    };
  }, [autoplay, scrollSpeed, items, isAutoplayPaused, layout]);

  // Handle arrow clicks for carousel
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      // Pause autoplay temporarily when user manually navigates
      if (autoplay) {
        setIsAutoplayPaused(true);
        if (manualScrollPauseTimeoutRef.current) {
          clearTimeout(manualScrollPauseTimeoutRef.current);
        }
        manualScrollPauseTimeoutRef.current = window.setTimeout(() => {
          setIsAutoplayPaused(false);
        }, 1000); // Resume after 1 second
      }
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      // Pause autoplay temporarily when user manually navigates
      if (autoplay) {
        setIsAutoplayPaused(true);
        if (manualScrollPauseTimeoutRef.current) {
          clearTimeout(manualScrollPauseTimeoutRef.current);
        }
        manualScrollPauseTimeoutRef.current = window.setTimeout(() => {
          setIsAutoplayPaused(false);
        }, 1000); // Resume after 1 second
      }
      const scrollAmount = getScrollAmount();
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddItem = () => {
    let currentItemCount = items?.length || 0;
    let maxItems: number;
    
    if (layout === 'carousel') {
      maxItems = TESTIMONIAL_ITEM_LIMIT;
    } else if (layout === 'grid') {
      maxItems = (columns || 3) * (rows || 3);
    } else {
      // single layout - only allow 1 item
      maxItems = 1;
    }
    
    if (currentItemCount >= maxItems) {
      return; // Don't add more items if at limit
    }
    
    // Create a default item that matches the library item structure
    const defaultItem = {
      id: generateUniqueId(),
      quote: 'Amazing platform! Highly recommended.',
      name: 'John Doe',
      designation: 'Customer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5
    };
    const newId = addBlockItem(block.id, defaultItem);
    selectArrayItem(block.id, newId);
  };

  const handleItemClick = (itemId: string) => {
    selectArrayItem(block.id, itemId);
  };

  // Handle manual scroll to pause autoplay
  const handleManualScroll = () => {
    if (autoplay) {
      setIsAutoplayPaused(true);
      if (manualScrollPauseTimeoutRef.current) {
        clearTimeout(manualScrollPauseTimeoutRef.current);
      }
      manualScrollPauseTimeoutRef.current = window.setTimeout(() => {
        setIsAutoplayPaused(false);
      }, 1000); // Resume after 1 second of inactivity
    }
  };

  // Check if we're at the item limit
  const getMaxItems = () => {
    if (layout === 'carousel') {
      return TESTIMONIAL_ITEM_LIMIT;
    } else if (layout === 'grid') {
      return (columns || 3) * (rows || 3);
    } else {
      return 1; // single layout
    }
  };

  const maxItems = getMaxItems();
  const isAtItemLimit = (items?.length || 0) >= maxItems;

  // Render star rating
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5 sm:gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`sm:w-4 sm:h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Render testimonial item
  const renderTestimonialItem = (item: TestimonialItem, index: number) => (
    <div key={item.id} className="relative group">
      <div 
        className={`bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer min-h-[12rem] sm:min-h-[14rem] md:min-h-[16rem] min-w-[280px] sm:min-w-[320px] flex flex-col overflow-hidden ${
          isItemSelected(block.id, item.id) ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' : ''
        }`}
        onClick={() => handleItemClick(item.id)}
      >
        {/* Quote - flex-grow to take available space */}
        <blockquote className="text-sm sm:text-base md:text-lg font-medium text-white mb-3 sm:mb-4 italic flex-grow leading-relaxed break-words overflow-visible hyphens-auto whitespace-normal">
          "{item.quote}"
        </blockquote>
        
        {/* Rating */}
        {item.rating && (
          <div className="mb-3">
            {renderStars(item.rating)}
          </div>
        )}
        
        {/* Author info - fixed at bottom */}
        <div className="flex items-center mt-auto">
          {item.image && (
            <img 
              src={item.image} 
              alt={item.name || 'Customer'} 
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover mr-3 sm:mr-4 ${
                itemShape === 'circle' ? 'rounded-full' : 
                itemShape === 'square' ? 'rounded-md' : 
                itemShape === 'rectangle-portrait' ? 'rounded-md' : 
                'rounded-md'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
              }}
            />
          )}
          <div className="min-w-0 flex-1">
            {item.name && (
              <p className="font-semibold text-white text-sm sm:text-base truncate">{item.name}</p>
            )}
            {item.designation && (
              <p className="text-xs sm:text-sm text-gray-300 truncate">{item.designation}</p>
            )}
          </div>
        </div>
      </div>
      
      <ItemsControl 
        index={index}
        count={items.length}
        onMoveLeft={() => moveBlockItemLeft(block.id, index)}
        onMoveRight={() => moveBlockItemRight(block.id, index)}
        onRemove={() => removeBlockItem(block.id, item.id)}
        className="absolute top-2 right-2 flex space-x-1 bg-white/95 rounded-lg p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </div>
  );

  // Render carousel layout
  const renderCarousel = () => (
    <div className="relative">
      <div className="flex items-center">
        {/* Left Arrow */}
        {showArrows && canScrollLeft && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleScrollLeft();
            }}
            className="hidden sm:flex flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 mr-2 sm:mr-4 z-10"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          </button>
        )}
        
        {/* Carousel Container */}
        <div className="flex-1 overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className={`flex overflow-x-auto ${getGapClass()} pb-4 scrollbar-hide`}
            onMouseEnter={() => autoplay && setIsAutoplayPaused(true)}
            onMouseLeave={() => autoplay && setIsAutoplayPaused(false)}
            onScroll={handleManualScroll}
          >
            {/* Left padding to ensure first item is fully visible */}
            <div className="flex-shrink-0 w-2 sm:w-4"></div>
            
            {items.map((item, index) => (
              <div key={item.id} className={`relative flex-shrink-0 ${getItemSizeClass(itemSize)} px-2`}>
                {renderTestimonialItem(item, index)}
              </div>
            ))}
            
            {/* Right padding to ensure last item is fully visible */}
            <div className="flex-shrink-0 w-2 sm:w-4"></div>
          </div>
        </div>
        
        {/* Right Arrow */}
        {showArrows && canScrollRight && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleScrollRight();
            }}
            className="hidden sm:flex flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 ml-2 sm:ml-4 z-10"
          >
            <ArrowRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
      
      {/* Mobile scroll indicators */}
      {showArrows && (canScrollLeft || canScrollRight) && (
        <div className="sm:hidden flex justify-center mt-4 space-x-2">
          {canScrollLeft && (
            <button 
              onClick={handleScrollLeft}
              className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          {canScrollRight && (
            <button 
              onClick={handleScrollRight}
              className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900"
            >
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Render grid layout
  const renderGrid = () => {
    const getGridColsClass = () => {
      switch (columns) {
        case 2:
          return 'grid-cols-1 sm:grid-cols-2';
        case 3:
          return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        case 4:
          return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
        default:
          return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      }
    };

    const getGapClass = () => {
      switch (style?.gridGap) {
        case 'sm':
          return 'gap-2 sm:gap-3';
        case 'lg':
          return 'gap-4 sm:gap-6';
        default: // md
          return 'gap-3 sm:gap-4';
      }
    };

    return (
      <div className={`grid ${getGridColsClass()} ${getGapClass()}`}>
        {items.map((item, index) => renderTestimonialItem(item, index))}
      </div>
    );
  };

  // Render single layout
  const renderSingle = () => {
    if (items.length === 0) return null;
    return (
      <div className="w-full">
        {renderTestimonialItem(items[0], 0)}
      </div>
    );
  };

  if (!items || items.length === 0) {
    return (
      <div className={marginClass}>
        <div style={{ boxShadow: boxShadowStyle }}>
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
            onAddItem={!isAtItemLimit ? handleAddItem : undefined}
            className={`${paddingClass} ${borderRadiusClass} ${backgroundClass}`}
            style={{
              backgroundColor: hasCustomBackground ? style.backgroundColor : undefined
            }}
          >
            <div className={`${textAlignClass}`}>
              {title && (
                <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-4 ${textColorClass}`} style={textColorStyle}>
                  {title}
                </h2>
              )}
              <p className="text-gray-500 text-center text-sm sm:text-base">No testimonials added</p>
            </div>
          </BaseWidget>
        </div>
      </div>
    );
  }

  return (
    <div className={marginClass}>
      <div style={{ boxShadow: boxShadowStyle }}>
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
          onAddItem={!isAtItemLimit ? handleAddItem : undefined}
          className={`${paddingClass} ${borderRadiusClass} ${backgroundClass}`}
          style={{
            backgroundColor: hasCustomBackground ? style.backgroundColor : undefined
          }}
        >
      <div className={`w-full ${textAlignClass}`}>
        {title && (
          <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 ${textColorClass}`} style={textColorStyle}>
            {title}
          </h2>
        )}
        
        {layout === 'carousel' && renderCarousel()}
        {layout === 'grid' && renderGrid()}
        {layout === 'single' && renderSingle()}
      </div>
        </BaseWidget>
      </div>
    </div>
  );
};

export default TestimonialWidget; 