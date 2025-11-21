import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { TextBlock } from './schema';

interface TextWidgetProps extends Omit<BaseWidgetProps<TextBlock>, 'block'> {
  block: TextBlock;
}

const TextWidget: React.FC<TextWidgetProps> = ({ 
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
  const { content, fontFamily, fontSize, fontWeight, fontStyle, textDecoration, lineHeight, letterSpacing } = props;
  
  // Clean object maps for CSS classes (similar to other blocks)
  const paddingClass = { lg: 'p-8', md: 'p-6', sm: 'p-4', none: 'p-0' }[style?.padding ?? 'md'];
  const marginClass = { lg: 'm-8', md: 'm-6', sm: 'm-4', none: 'm-0' }[style?.margin ?? 'none'];
  const borderRadiusClass = { lg: 'rounded-lg', md: 'rounded-md', sm: 'rounded-sm', none: 'rounded-none' }[style?.borderRadius ?? 'none'];
  
  // Font family classes
  const fontFamilyClass = {
    sans: 'font-sans',
    serif: 'font-serif', 
    mono: 'font-mono',
    display: 'font-serif' // Using serif as fallback for display since font-display might not be available
  }[fontFamily || 'sans'];

  // Font size classes
  const fontSizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  }[fontSize || 'base'];

  // Font weight classes
  const fontWeightClass = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  }[fontWeight || 'normal'];

  // Font style classes
  const fontStyleClass = {
    normal: '',
    italic: 'italic'
  }[fontStyle || 'normal'];

  // Text decoration classes
  const textDecorationClass = {
    none: '',
    underline: 'underline',
    'line-through': 'line-through',
    overline: '' // Will be handled with custom style
  }[textDecoration || 'none'];

  // Custom text decoration style for overline
  const textDecorationStyle = textDecoration === 'overline' ? { textDecoration: 'overline' } : {};

  // Line height classes
  const lineHeightClass = {
    none: 'leading-none',
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  }[lineHeight || 'normal'];

  // Letter spacing classes
  const letterSpacingClass = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: '',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    widest: 'tracking-widest'
  }[letterSpacing || 'normal'];


  
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
  
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' :
                        style?.textAlign === 'right' ? 'text-right' : 'text-left';

  // Handle text color - default to white text
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  if (!content) {
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
          className={`${paddingClass} ${marginClass} ${borderRadiusClass} bg-neutral-50 border-2 border-dashed border-neutral-300`}
          style={{
            backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
          }}
        >
          <p className={`${fontFamilyClass} ${fontSizeClass} ${fontWeightClass} ${fontStyleClass} ${textDecorationClass} ${lineHeightClass} ${letterSpacingClass} text-neutral-500 text-center`} style={textDecorationStyle}>No content provided</p>
        </BaseWidget>
      </div>
    );
  }

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
        className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
        }}
      >
        <div className={`${textAlignClass}`}>
          <div className={`${fontFamilyClass} ${fontSizeClass} ${fontWeightClass} ${fontStyleClass} ${textDecorationClass} ${lineHeightClass} ${letterSpacingClass} whitespace-pre-line ${textColorClass}`} style={{ ...textColorStyle, ...textDecorationStyle }}>
            {content}
          </div>
        </div>
      </BaseWidget>
    </div>
  );
};

export default TextWidget; 