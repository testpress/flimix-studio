import React from 'react';
import type { Block } from '../../schema/blockTypes';

export interface BaseBlockProps {
  block: Block;
  onSelect?: (block: Block) => void;
  isSelected?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BaseBlock - A base component that provides common selection functionality
 * for all block components. Implements:
 * - Click handling with event bubbling prevention
 * - Selection state management
 * - Common styling for selected state
 * - Extensible render method
 */
const BaseBlock: React.FC<BaseBlockProps> = ({ 
  block, 
  onSelect, 
  isSelected = false, 
  children,
  className = '',
  style = {}
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent blocks
    onSelect?.(block);
  };

  const baseClasses = [
    'cursor-pointer',
    'transition-all',
    'duration-200',
    isSelected ? 'ring-2 ring-blue-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={baseClasses}
      style={style}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default BaseBlock; 