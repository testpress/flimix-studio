import React from 'react';
import type { HeroBlock, HeroBlockProps } from '../schema';

interface CarouselControlsProps {
  heroBlock: HeroBlock;
  updateProps: (props: Partial<HeroBlockProps>) => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  heroBlock,
  updateProps
}) => {
  if (heroBlock.props.variant !== 'carousel') {
    return null;
  }

  return (
    <div className="space-y-4">
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
