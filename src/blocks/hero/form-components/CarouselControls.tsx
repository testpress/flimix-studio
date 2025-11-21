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
    <div className="p-4 bg-neutral-800 rounded-lg">
      <h3 className="font-medium text-white mb-4">Carousel Settings</h3>
      
      <div className="space-y-4">
        {/* Navigation Arrows */}
        <div>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={heroBlock.props.showArrows || false}
              onChange={(e) => updateProps({ ...heroBlock.props, showArrows: e.target.checked })}
              className="rounded border-neutral-600 bg-neutral-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Navigation Arrows</span>
          </label>
        </div>
        
        {/* Autoplay */}
        <div>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={heroBlock.props.autoplay || false}
              onChange={(e) => updateProps({ ...heroBlock.props, autoplay: e.target.checked })}
              className="rounded border-neutral-600 bg-neutral-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Enable Autoplay</span>
          </label>
        </div>
        
        {/* Scroll Speed */}
        {heroBlock.props.autoplay && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Scroll Speed (ms)</label>
            <input
              type="number"
              value={heroBlock.props.scrollSpeed || 5000}
              onChange={(e) => updateProps({ ...heroBlock.props, scrollSpeed: parseInt(e.target.value) })}
              className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1000"
              max="10000"
              step="500"
            />
            <p className="text-xs text-neutral-400 mt-1">Time between automatic slide transitions (1000-10000ms)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselControls;
