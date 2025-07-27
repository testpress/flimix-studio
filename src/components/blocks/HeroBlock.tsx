import React from 'react';
import type { HeroBlock as HeroBlockType, Theme, Padding, Block } from '../../schema/blockTypes';

interface HeroBlockProps {
  block: HeroBlockType;
  onSelect?: (block: Block) => void;
  isSelected?: boolean;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ block, onSelect, isSelected = false }) => {
  const { props, style } = block;
  const { title, subtitle, backgroundImage, ctaButton } = props;
  
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-12' : 
                      style?.padding === 'md' ? 'p-8' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  const textColor = style?.textColor || (isDark ? 'text-white' : 'text-gray-900');

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent blocks
    onSelect?.(block);
  };

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${paddingClass} ${backgroundClass} cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
      }}
      onClick={handleClick}
    >
      {/* Overlay for better text readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {title && (
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${textColor}`}>
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p className={`text-xl md:text-2xl mb-8 ${textColor} opacity-90`}>
            {subtitle}
          </p>
        )}
        
        {ctaButton && (
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
            {ctaButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroBlock; 