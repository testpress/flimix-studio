import React from 'react';
import type { HeroBlock, HeroBlockProps, HeroItem } from '../schema';
import { generateUniqueId } from '@utils/id';

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
  const createDefaultHeroItem = (): HeroItem => ({
    id: generateUniqueId(),
    title: 'New Hero Screen',
    subtitle: '',
    backgroundImage: ''
  });

  const addHeroItem = () => {
    const newItems = [...(heroBlock.props.items || [])];
    newItems.push(createDefaultHeroItem());
    updateProps({ ...heroBlock.props, items: newItems });
    setCurrentItemIndex(newItems.length - 1);
  };

  const removeHeroItem = () => {
    const newItems = [...(heroBlock.props.items || [])];
    newItems.splice(currentItemIndex, 1);
    
    updateProps({ ...heroBlock.props, items: newItems });
    
    // Adjust current index if needed
    if (currentItemIndex >= newItems.length && newItems.length > 0) {
      setCurrentItemIndex(newItems.length - 1);
    } else if (newItems.length === 0) {
      setCurrentItemIndex(0);
    }
  };

  if (heroBlock.props.variant !== 'carousel') {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Hero Screens Navigation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Hero Screens</label>
          <button
            type="button"
            onClick={addHeroItem}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Screen
          </button>
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
