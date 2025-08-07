import React, { useRef, useState, useEffect } from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { CarouselBlock } from './schema';
import { useSelection } from '@context/SelectionContext';
import ItemsControl from '@blocks/shared/ItemsControl';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  const { title, itemShape, showArrows, items, itemSize = 'w-72' } = props;
  const { addBlockItem, selectArrayItem, isItemSelected, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useSelection();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [previousItemsLength, setPreviousItemsLength] = useState(items?.length || 0);
  
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

  // Get gap class based on style
  const getGapClass = () => {
    switch (style?.gridGap) {
      case 'sm':
        return 'space-x-4';
      case 'lg':
        return 'space-x-8';
      default: // md
        return 'space-x-6';
    }
  };

  const getItemShapeClass = () => {
    switch (itemShape) {
      case 'rectangle-portrait':
        return 'aspect-[2/3]';
      case 'square':
        return 'aspect-square';
      case 'circle':
        return 'aspect-square rounded-full';
      default:
        return 'aspect-[16/9]';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'popular':
        return 'bg-red-100 text-red-800';
      case 'featured':
        return 'bg-blue-100 text-blue-800';
      case 'trending':
        return 'bg-orange-100 text-orange-800';
      case 'hot':
        return 'bg-pink-100 text-pink-800';
      case 'exclusive':
        return 'bg-purple-100 text-purple-800';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'coming soon':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      const isInitialLoad = previousItemsLength === 0;
      const itemsChanged = previousItemsLength !== (items?.length || 0);
      
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
      setPreviousItemsLength(items?.length || 0);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [items, previousItemsLength]);

  // Handle arrow clicks
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleAddItem = () => {
    const currentItemCount = items?.length || 0;
    
    if (currentItemCount >= 12) {
      return; // Don't add more items if at limit
    }
    
    const defaultItem = {
      id: `item-${Date.now()}`,
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

  // Check if we're at the item limit
  const isAtItemLimit = (items?.length || 0) >= 12;

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
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Left padding to ensure first item is fully visible */}
                <div className="flex-shrink-0 w-4"></div>
                
                {items.map((item, index) => (
                  <div key={item.id} className={`relative flex-shrink-0 ${itemSize} group`} data-item-id={item.id}>
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