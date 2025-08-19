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
  
  // Clean object maps for CSS classes (similar to badge-strip approach)
  const paddingClass = { lg: 'p-12', md: 'p-8', sm: 'p-4', none: 'p-0' }[style?.padding ?? 'md'];
  const marginClass = { lg: 'm-8', md: 'm-6', sm: 'm-4', none: 'm-0' }[style?.margin ?? 'none'];
  const borderRadiusClass = { lg: 'rounded-lg', md: 'rounded-md', sm: 'rounded-sm', none: 'rounded-none' }[style?.borderRadius ?? 'none'];
  
  // Custom box shadow styles for better visibility on dark backgrounds
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg':
        return '0 35px 60px -12px rgba(255, 255, 255, 0.25), 0 20px 25px -5px rgba(255, 255, 255, 0.1)';
      case 'md':
        return '0 20px 25px -5px rgba(255, 255, 255, 0.15), 0 10px 10px -5px rgba(255, 255, 255, 0.08)';
      case 'sm':
        return '0 10px 15px -3px rgba(255, 255, 255, 0.12), 0 4px 6px -2px rgba(255, 255, 255, 0.06)';
      case 'none':
      default:
        return 'none';
    }
  };
  
  const boxShadowStyle = getBoxShadowStyle(style?.boxShadow);
  
  // Get text alignment from block style, default to center
  const textAlign = style?.textAlign || 'center';
  const textAlignClass = textAlign === 'left' ? 'text-left' : 
                         textAlign === 'right' ? 'text-right' : 'text-center';
  
  // Handle text color - default to white text
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

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
        className={`relative ${borderRadiusClass} overflow-hidden ${paddingClass} ${marginClass} ${backgroundClass}`}
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
      
      <div className={`relative z-10 max-w-4xl mx-auto ${textAlignClass}`}>
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
    </div>
  );
};

export default HeroWidget; 