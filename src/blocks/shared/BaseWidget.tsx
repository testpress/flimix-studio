import React from 'react';
import Controls from '@layout/Controls';
import type { Block } from './Block';

export interface BaseWidgetProps<T extends Block = Block> {
  block: T;
  onSelect?: (block: T) => void;
  isSelected?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // Block control props
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onAddItem?: () => void;
}

/**
 * BaseWidget - A base component that provides common selection functionality
 * for all block components. Implements:
 * - Click handling with event bubbling prevention
 * - Selection state management
 * - Common styling for selected state
 * - Extensible render method
 * - Inline block controls when selected
 */
const BaseWidget = <T extends Block = Block>({ 
  block, 
  onSelect, 
  isSelected = false, 
  children,
  className = '',
  style = {},
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onAddItem
}: BaseWidgetProps<T>) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent blocks
    onSelect?.(block);
  };

  const baseClasses = [
    'cursor-pointer',
    'transition-all',
    'duration-200',
    'relative', // Added for absolute positioning of controls
    'overflow-visible', // Ensure controls are visible even if they extend beyond block bounds
    isSelected ? 'ring-2 ring-blue-500' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={baseClasses}
      style={{
        ...style,
        // Add padding when selected to prevent content overlap with controls
        paddingRight: isSelected ? '3rem' : undefined
      }}
      onClick={handleClick}
    >
      {children}
      
      {/* Show block controls when selected */}
      {isSelected && (onMoveUp || onMoveDown || onDuplicate || onRemove) && (
        <Controls
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onRemove={onRemove}
          onAddItem={onAddItem}
        />
      )}
    </div>
  );
};

export default BaseWidget; 