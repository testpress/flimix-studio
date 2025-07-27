import React from 'react';
import BaseBlock from './BaseBlock';
import type { BaseBlockProps } from './BaseBlock';
import type { TextBlock as TextBlockType, Theme, Padding } from '../../schema/blockTypes';

interface TextBlockProps extends Omit<BaseBlockProps, 'block'> {
  block: TextBlockType;
}

const TextBlock: React.FC<TextBlockProps> = ({ block, onSelect, isSelected = false }) => {
  const { props, style } = block;
  const { content } = props;
  
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  
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
      <BaseBlock 
        block={block} 
        onSelect={onSelect} 
        isSelected={isSelected}
        className={`${paddingClass} bg-gray-50 rounded-lg border-2 border-dashed border-gray-300`}
        style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
      >
        <p className="text-gray-500 text-center">No content provided</p>
      </BaseBlock>
    );
  }

  return (
    <BaseBlock 
      block={block} 
      onSelect={onSelect} 
      isSelected={isSelected}
      className={`${paddingClass} ${backgroundClass} rounded-lg`}
      style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
    >
      <div className={`max-w-4xl mx-auto ${textColorClass}`} style={textColorStyle}>
        <p className="text-lg leading-relaxed">
          {content}
        </p>
      </div>
    </BaseBlock>
  );
};

export default TextBlock; 