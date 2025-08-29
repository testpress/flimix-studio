import React, { useEffect, useRef } from 'react';
import type { HeroBlock, HeroBlockProps } from '../schema';

interface CarouselControlsProps {
  heroBlock: HeroBlock;
  currentItemIndex: number;
  setCurrentItemIndex: (index: number) => void;
  updateProps: (props: Partial<HeroBlockProps>) => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  heroBlock,
  currentItemIndex,
  setCurrentItemIndex,
  updateProps
}) => {
  const previousItemsLengthRef = useRef<number>(0);
  
  // Effect to detect when new items are added and select the last item
  useEffect(() => {
    const currentItemsLength = heroBlock.props.items?.length || 0;
    
    if (previousItemsLengthRef.current > 0 && currentItemsLength > previousItemsLengthRef.current) {
      setCurrentItemIndex(currentItemsLength - 1);
    }
    
    previousItemsLengthRef.current = currentItemsLength;
  }, [heroBlock.props.items, setCurrentItemIndex]);

  // Update block props when currentItemIndex changes
  useEffect(() => {
    if (heroBlock.props.currentIndex !== currentItemIndex) {
      updateProps({
        ...heroBlock.props,
        currentIndex: currentItemIndex
      });
    }
  }, [currentItemIndex, heroBlock.props, updateProps]);
  const removeHeroItem = () => {
    const newItems = [...(heroBlock.props.items || [])];    
    newItems.splice(currentItemIndex, 1);
    
    updateProps({ ...heroBlock.props, items: newItems });
    let newIndex = currentItemIndex;
    
    if (newItems.length === 0) {
      newIndex = 0;
    } else if (currentItemIndex >= newItems.length) {
      newIndex = newItems.length - 1;
    }
    
    setCurrentItemIndex(newIndex);
  };

  if (heroBlock.props.variant !== 'carousel') {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Hero Screens Navigation */}
      <div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Hero Screens</label>
        </div>
        
        <div className="flex gap-2 mb-2">
          {heroBlock.props.items?.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentItemIndex(index)}
              className={`px-3 py-1 text-xs rounded ${
                index === currentItemIndex 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Screen {index + 1}
            </button>
          ))}
        </div>
        
        {heroBlock.props.items && heroBlock.props.items.length > 1 && (
          <button
            type="button"
            onClick={removeHeroItem}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove Current Screen
          </button>
        )}
      </div>
      
      {/* Carousel Settings */}
      <div className="space-y-3">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={heroBlock.props.showArrows || false}
              onChange={(e) => updateProps({ ...heroBlock.props, showArrows: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Show Navigation Arrows</span>
          </label>
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={heroBlock.props.autoplay || false}
              onChange={(e) => updateProps({ ...heroBlock.props, autoplay: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Enable Autoplay</span>
          </label>
        </div>
        
        {heroBlock.props.autoplay && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Scroll Speed (ms)</label>
            <input
              type="number"
              value={heroBlock.props.scrollSpeed || 5000}
              onChange={(e) => updateProps({ ...heroBlock.props, scrollSpeed: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded"
              min="1000"
              max="10000"
              step="500"
            />
            <p className="text-xs text-gray-500 mt-1">Time between automatic slide changes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselControls;
