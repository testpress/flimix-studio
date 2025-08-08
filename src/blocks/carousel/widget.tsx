import React, { useRef, useState, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { CarouselBlock, ItemSize } from './schema';
import { CAROUSEL_ITEM_LIMIT } from './schema';
import { useSelection } from '@context/SelectionContext';
import ItemsControl from '@blocks/shared/ItemsControl';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  const { title, itemShape, showArrows, items, itemSize = 'large', autoplay = false, scrollSpeed = 1000 } = props;
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
  
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' :
                        style?.textAlign === 'right' ? 'text-right' : 'text-left';

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || (isDark ? 'text-white' : 'text-gray-800')) : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = isDark ? 'bg-gray-800' : 'bg-white';
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
    
    return itemWidth + gapSize;
  };

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    // Account for the 4px padding on each side
    const paddingOffset = 8;
    setCanScrollLeft(scrollLeft > paddingOffset);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - paddingOffset);
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
      
      checkScrollPosition();
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      // Update previous items length
      previousItemsLengthRef.current = items?.length || 0;
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [items]);

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

  // Check if we're at the item limit
  const isAtItemLimit = (items?.length || 0) >= CAROUSEL_ITEM_LIMIT;

  if (!items || items.length === 0) {
    return (
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
        className={`${paddingClass} ${backgroundClass} rounded-lg shadow-sm`}
        style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
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
    );
  }

  return (
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
      className={`${paddingClass} ${backgroundClass} rounded-lg shadow-sm`}
      style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
    >
      <div className={`max-w-6xl mx-auto ${textAlignClass}`}>
        {title && (
          <h2 className={`text-xl font-semibold mb-6 ${textColorClass}`} style={textColorStyle}>
            {title}
          </h2>
        )}
        
        <div className="relative">
          <div className="flex items-center">
            {/* Left Arrow */}
            {showArrows && canScrollLeft && (
              <button 
                onClick={handleScrollLeft}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 mr-4 z-10"
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
                {/* Left padding to ensure first item is fully visible */}
                <div className="flex-shrink-0 w-4"></div>
                
                {items.map((item, index) => (
                  <div key={item.id} className={`relative flex-shrink-0 ${getItemSizeClass(itemSize)} group`} data-item-id={item.id}>
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
                        itemShape === 'circle' ? 'rounded-full' : 'rounded-lg'
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
                          <p className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</p>
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
                
                {/* Right padding to ensure last item is fully visible */}
                <div className="flex-shrink-0 w-4"></div>
              </div>
            </div>
            
            {/* Right Arrow */}
            {showArrows && canScrollRight && (
              <button 
                onClick={handleScrollRight}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 text-gray-700 hover:text-gray-900 ml-4 z-10"
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default CarouselWidget; 