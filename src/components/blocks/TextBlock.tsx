import React from 'react';
import type { TextBlock as TextBlockType, Theme, Padding, Block } from '../../schema/blockTypes';

interface TextBlockProps {
  block: TextBlockType;
  onSelect?: (block: Block) => void;
  isSelected?: boolean;
}

const TextBlock: React.FC<TextBlockProps> = ({ block, onSelect, isSelected = false }) => {
  const { props, style } = block;
  const { content } = props;
  
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  const textColor = style?.textColor || (isDark ? 'text-white' : 'text-gray-800');

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = isDark ? 'bg-gray-800' : 'bg-white';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent blocks
    onSelect?.(block);
  };

  if (!content) {
    return (
      <div 
        className={`${paddingClass} bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
        onClick={handleClick}
      >
        <p className="text-gray-500 text-center">No content provided</p>
      </div>
    );
  }

  return (
    <div 
      className={`${paddingClass} ${backgroundClass} rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={hasCustomBackground ? { backgroundColor: style.backgroundColor } : undefined}
      onClick={handleClick}
    >
      <div className={`max-w-4xl mx-auto ${textColor}`}>
        <p className="text-lg leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default TextBlock; 