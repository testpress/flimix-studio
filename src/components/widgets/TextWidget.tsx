import React from 'react';
import BaseWidget from './BaseWidget';
import type { BaseWidgetProps } from './BaseWidget';
import type { TextBlock as TextBlockType } from '../../schema/blockTypes';

interface TextWidgetProps extends Omit<BaseWidgetProps, 'block'> {
  block: TextBlockType;
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
  
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' :
                        style?.textAlign === 'right' ? 'text-right' : 'text-left';

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || (isDark ? 'text-white' : 'text-gray-800')) : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = isDark ? 'bg-gray-800' : 'bg-white';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  if (!content) {
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
        className={`${paddingClass} bg-gray-50 rounded-lg border-2 border-dashed border-gray-300`}
        style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
      >
        <p className="text-gray-500 text-center">No content provided</p>
      </BaseWidget>
    );
  }

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
      className={`${paddingClass} ${backgroundClass} rounded-lg shadow-sm`}
      style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
    >
      <div className={`max-w-4xl mx-auto ${textAlignClass}`}>
        <p className={`text-lg leading-relaxed ${textColorClass}`} style={textColorStyle}>
          {content}
        </p>
      </div>
    </BaseWidget>
  );
};

export default TextWidget; 