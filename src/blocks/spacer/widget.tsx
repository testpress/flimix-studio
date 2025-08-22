import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { SpacerBlock, SpacerHeight } from './schema';

interface SpacerWidgetProps extends Omit<BaseWidgetProps<SpacerBlock>, 'block'> {
  block: SpacerBlock;
}

const SpacerWidget: React.FC<SpacerWidgetProps> = ({
  block,
  onSelect,
  isSelected = false,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
}) => {
  const { props } = block;
  const { height } = props;

  const heightClasses: Record<SpacerHeight, string> = {
    none: 'h-0',
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

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
      className="bg-transparent"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className={`${heightClasses[height] || 'h-8'} w-full bg-transparent`} />
    </BaseWidget>
  );
};

export default SpacerWidget; 
