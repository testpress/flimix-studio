import React from 'react';
import BaseBlock from './BaseBlock';
import type { BaseBlockProps } from './BaseBlock';
import type { HeroBlock as HeroBlockType, Theme, Padding } from '../../schema/blockTypes';

interface HeroBlockProps extends Omit<BaseBlockProps, 'block'> {
  block: HeroBlockType;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ block, onSelect, isSelected = false }) => {
  const { props, style } = block;
  const { title, subtitle, backgroundImage, ctaButton } = props;
  
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-12' : 
                      style?.padding === 'md' ? 'p-8' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || (isDark ? 'text-white' : 'text-gray-900')) : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  return (
    <BaseBlock 
      block={block} 
      onSelect={onSelect} 
      isSelected={isSelected}
      className={`relative rounded-lg overflow-hidden ${paddingClass} ${backgroundClass}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
      }}
    >
      {/* Overlay for better text readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {title && (
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${textColorClass}`} style={textColorStyle}>
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p className={`text-xl md:text-2xl mb-8 ${textColorClass} opacity-90`} style={textColorStyle}>
            {subtitle}
          </p>
        )}
        
        {ctaButton && (
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
            {ctaButton.label}
          </button>
        )}
      </div>
    </BaseBlock>
  );
};

export default HeroBlock; 