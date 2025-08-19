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
  const { content } = props;
  
  // Clean object maps for CSS classes (similar to other blocks)
  const paddingClass = { lg: 'p-8', md: 'p-6', sm: 'p-4', none: 'p-0' }[style?.padding ?? 'md'];
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
          className={`${paddingClass} ${marginClass} ${borderRadiusClass} bg-gray-50 border-2 border-dashed border-gray-300`}
          style={{
            backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
          }}
        >
          <p className="text-gray-500 text-center">No content provided</p>
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
          <p className={`text-lg ${textColorClass}`} style={textColorStyle}>
            {content}
          </p>
        </div>
      </BaseWidget>
    </div>
  );
};

export default TextWidget; 