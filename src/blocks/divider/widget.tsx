import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { DividerBlock, DividerThickness, DividerAlignment, DividerStyle } from './schema';

interface DividerWidgetProps extends Omit<BaseWidgetProps<DividerBlock>, 'block'> {
  block: DividerBlock;
}

const DividerWidget: React.FC<DividerWidgetProps> = ({
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
  const { props, style } = block;
  const { thickness, length, percentageValue, alignment, style: dividerStyle } = props;

  const thicknessClasses: Record<DividerThickness, string> = {
    sm: 'border-t',
    md: 'border-t-2',
    lg: 'border-t-4',
  };

  const alignmentClasses: Record<DividerAlignment, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const styleClasses: Record<DividerStyle, string> = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const colorClass = style?.backgroundColor ? `border-[${style.backgroundColor}]` : 'border-gray-300';

  // Handle length styling
  const getLengthStyle = () => {
    if (length === 'percentage') {
      return ''; // We'll use inline style for percentage
    }
    return 'w-full';
  };

  // Get inline styles for percentage width
  const getInlineStyles = () => {
    if (length === 'percentage' && percentageValue) {
      return { width: `${percentageValue}%` };
    }
    return {};
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
      className=""
    >
      <div className={`flex ${alignmentClasses[alignment]}`}>
        <div
          className={`${thicknessClasses[thickness]} ${getLengthStyle()} ${styleClasses[dividerStyle]} ${colorClass}`}
          style={getInlineStyles()}
        />
      </div>
    </BaseWidget>
  );
};

export default DividerWidget; 