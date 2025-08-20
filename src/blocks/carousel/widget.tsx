import React, { useRef, useState, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { CarouselBlock, ItemSize } from './schema';
import { CAROUSEL_ITEM_LIMIT } from './schema';
import { useSelection } from '@context/SelectionContext';
import ItemsControl from '@blocks/shared/ItemsControl';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateUniqueId } from '@utils/id';

interface CarouselWidgetProps extends Omit<BaseWidgetProps<CarouselBlock>, 'block'> {
  block: CarouselBlock;
}

const CarouselWidget: React.FC<CarouselWidgetProps> = ({ 
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
  const { title, itemShape, showArrows, items, itemSize = 'large', autoplay = false, scrollSpeed = 1000, button } = props;
  const { addBlockItem, selectArrayItem, isItemSelected, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useSelection();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const previousItemsLengthRef = useRef<number>(0);
  const autoplayIntervalRef = useRef<number | null>(null);
  const manualScrollPauseTimeoutRef = useRef<number | null>(null);
  
  // Map abstract item size values to Tailwind classes
  const getItemSizeClass = (size: ItemSize): string => {
    switch (size) {
      case 'small':
        return 'w-48';
      case 'medium':
        return 'w-64';
      case 'large':
        return 'w-72';
      case 'extra-large':
        return 'w-80';
      default:
        return 'w-72'; // fallback to large
    }
  };
  
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
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

  // Gap class mapping for better maintainability
  const GAP_CLASSES: Record<string, string> = {
    'sm': 'space-x-4',
    'md': 'space-x-6',
    'lg': 'space-x-8',
  };

  const getGapClass = () => {
    return GAP_CLASSES[style?.gridGap || 'md'] || GAP_CLASSES['md'];
  };

  // Item shape class mapping for better maintainability
  const ITEM_SHAPE_CLASSES: Record<string, string> = {
    'rectangle-landscape': 'aspect-[16/9]',
    'rectangle-portrait': 'aspect-[2/3]',
    'square': 'aspect-square',
    'circle': 'aspect-square rounded-full',
  };

  const getItemShapeClass = () => {
    return ITEM_SHAPE_CLASSES[itemShape] || ITEM_SHAPE_CLASSES['rectangle-landscape'];
  };

  // Badge color mapping for better maintainability
  const BADGE_COLORS: Record<string, string> = {
    'new': 'bg-green-100 text-green-800',
    'popular': 'bg-red-100 text-red-800',
    'featured': 'bg-blue-100 text-blue-800',
    'trending': 'bg-orange-100 text-orange-800',
    'hot': 'bg-pink-100 text-pink-800',
    'exclusive': 'bg-purple-100 text-purple-800',
    'limited': 'bg-yellow-100 text-yellow-800',
    'coming soon': 'bg-indigo-100 text-indigo-800',
  };

  const getBadgeColor = (badge: string) => {
    return BADGE_COLORS[badge.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Calculate dynamic scroll amount based on item width and gap
  const getScrollAmount = (): number => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !items || items.length === 0) return 300; // fallback
    
    // Get the first actual item (skip the padding div)
    const firstItem = scrollContainer.children[1] as HTMLElement;
    if (!firstItem) return 300; // fallback
    
    const itemWidth = firstItem.getBoundingClientRect().width;
    
    // Get gap size from CSS classes
    const gapSize = style?.gridGap === 'sm' ? 16 : // space-x-4 = 1rem = 16px
                   style?.gridGap === 'lg' ? 32 : // space-x-8 = 2rem = 32px
                   24; // space-x-6 = 1.5rem = 24px (default md)
    
    // Ensure we scroll at least one full item width
    return Math.max(itemWidth + gapSize, itemWidth);
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

  // Autoplay functionality
  useEffect(() => {
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
  }, [autoplay, scrollSpeed, items, isAutoplayPaused]);

  // Handle arrow clicks
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
    const currentItemCount = items?.length || 0;
    
    if (currentItemCount >= CAROUSEL_ITEM_LIMIT) {
      return; // Don't add more items if at limit
    }
    
    const defaultItem = {
      id: generateUniqueId(),
      title: 'New Carousel Item',
      subtitle: 'Subtitle',
      image: 'https://images.unsplash.com/photo-1534840641466-b1cdb8fb155e',
      link: '',
      meta: {}
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

  // Render button icon based on selected icon type
  const renderButtonIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'ArrowRight':
        return <ArrowRight size={16} />;
      case 'ArrowLeft':
        return <ArrowLeft size={16} />;
      case 'ChevronRight':
        return <ChevronRight size={16} />;
      case 'ChevronLeft':
        return <ChevronLeft size={16} />;
      default:
        return <ArrowRight size={16} />;
    }
  };

  // Check if we're at the item limit
  const isAtItemLimit = (items?.length || 0) >= CAROUSEL_ITEM_LIMIT;

  if (!items || items.length === 0) {
    return (
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
          className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
          style={{
            backgroundColor: hasCustomBackground ? style.backgroundColor : undefined
          }}
        >
          <div className={`${textAlignClass}`}>
            {title && (
              <h2 className={`text-xl font-semibold mb-4 ${textColorClass}`} style={textColorStyle}>
                {title}
              </h2>
            )}
            <p className="text-gray-500 text-center">No carousel items added</p>
          </div>
        </BaseWidget>
      </div>
    );
  }

  return (
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
        className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.backgroundColor : undefined
        }}
      >
      <div className={`w-full ${textAlignClass}`}>
        {/* Header with title and button */}
        <div className="mb-6">
          {button?.enabled ? (
            button.alignment === 'left' ? (
              /* Left alignment: title and button on same line */
              <div className="flex items-center gap-4">
                {title && title.trim() !== "" && (
                  <h2 className={`text-xl font-semibold ${textColorClass}`} style={textColorStyle}>
                    {title}
                  </h2>
                )}
                <a 
                  href={button.link || '#'} 
                  className="px-4 py-2 rounded-md flex items-center gap-2 transition-all hover:opacity-90"
                  style={{
                    color: button.textColor || '#ffffff'
                  }}
                >
                  {button.iconPosition === 'left' && renderButtonIcon(button.icon)}
                  {button.text || 'View All'}
                  {button.iconPosition === 'right' && renderButtonIcon(button.icon)}
                </a>
              </div>
            ) : (
              /* Right alignment: title on left, button on right */
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  {title && title.trim() !== "" && (
                    <h2 className={`text-xl font-semibold ${textColorClass}`} style={textColorStyle}>
                      {title}
                    </h2>
                  )}
                </div>
                <a 
                  href={button.link || '#'} 
                  className="px-4 py-2 rounded-md flex items-center gap-2 transition-all hover:opacity-90"
                  style={{
                    color: button.textColor || '#ffffff'
                  }}
                >
                  {button.iconPosition === 'left' && renderButtonIcon(button.icon)}
                  {button.text || 'View All'}
                  {button.iconPosition === 'right' && renderButtonIcon(button.icon)}
                </a>
              </div>
            )
          ) : (
            /* No button: just title (if exists) */
            title && title.trim() !== "" && (
              <h2 className={`text-xl font-semibold ${textColorClass}`} style={textColorStyle}>
                {title}
              </h2>
            )
          )}
        </div>
        
        <div className="relative w-full">
          <div className="flex items-center w-full">
            {/* Left Arrow */}
            {showArrows && canScrollLeft && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrollLeft();
                }}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 ml-2 mr-2 z-10"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            
            {/* Carousel Container with proper padding */}
            <div className="flex-1 overflow-hidden">
              <div 
                ref={scrollContainerRef}
                className={`flex overflow-x-auto ${getGapClass()} pb-4 scrollbar-hide`}
                onMouseEnter={() => autoplay && setIsAutoplayPaused(true)}
                onMouseLeave={() => autoplay && setIsAutoplayPaused(false)}
                onScroll={handleManualScroll}
              >
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`relative flex-shrink-0 ${getItemSizeClass(itemSize)} group`} 
                    data-item-id={item.id}
                  >
                    <a 
                      href={item.link || '#'} 
                      onClick={(e) => {
                        e.preventDefault();
                        handleItemClick(item.id);
                      }}
                      className={`block transition-all duration-200 hover:scale-105 cursor-pointer ${
                        isItemSelected(block.id, item.id) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                      }`}
                    >
                      <div className={`${getItemShapeClass()} overflow-hidden ${
                        itemShape === 'circle' ? 'rounded-full' : 
                        style?.borderRadius === 'none' ? '' : 
                        style?.borderRadius === 'lg' ? 'rounded-2xl' : 
                        style?.borderRadius === 'md' ? 'rounded-lg' : 
                        style?.borderRadius === 'sm' ? 'rounded-md' : 'rounded-lg'
                      } shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x170?text=Image+Not+Found';
                          }}
                        />
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className={`text-sm font-semibold ${textColorClass} line-clamp-1`} style={textColorStyle}>
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className={`text-xs ${textColorClass} opacity-80`} style={textColorStyle}>
                            {item.subtitle}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.meta?.badge && (
                            <span className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full ${getBadgeColor(item.meta.badge)}`}>
                              {item.meta.badge}
                            </span>
                          )}
                          {item.meta?.rating && (
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                              {item.meta.rating}
                            </span>
                          )}
                          {item.meta?.duration && (
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                              {item.meta.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                    <ItemsControl 
                      index={index}
                      count={items.length}
                      onMoveLeft={() => moveBlockItemLeft(block.id, index)}
                      onMoveRight={() => moveBlockItemRight(block.id, index)}
                      onRemove={() => removeBlockItem(block.id, item.id)}
                      className="absolute top-2 right-2 flex space-x-1 bg-white/95 rounded-lg p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Arrow */}
            {showArrows && canScrollRight && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrollRight();
                }}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 mr-2 ml-2 z-10"
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
      </BaseWidget>
    </div>
  );
};

export default CarouselWidget; 