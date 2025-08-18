import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { HeroBlock } from './schema';

interface HeroWidgetProps extends Omit<BaseWidgetProps, 'block'> {
  block: HeroBlock;
}

const HeroWidget: React.FC<HeroWidgetProps> = ({ 
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
  const { title, subtitle, backgroundImage, ctaButton } = props;
  
  const paddingClass = style?.padding === 'lg' ? 'p-12' : 
                      style?.padding === 'md' ? 'p-8' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
  // Handle text color - default to white text
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

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
        <div className="absolute inset-0 bg-opacity-40"></div>
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
    </BaseWidget>
  );
};

export default HeroWidget; 