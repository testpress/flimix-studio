import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { CTAButtonBlock } from './schema';

interface CTAButtonWidgetProps extends Omit<BaseWidgetProps<CTAButtonBlock>, 'block'> {
  block: CTAButtonBlock;
}

const CTAButtonWidget: React.FC<CTAButtonWidgetProps> = ({
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove,
}) => {
  const { label, link, variant = 'solid', size = 'md' } = block.props;
  const { style } = block;

  const getAlignmentClass = () => {
    switch (style?.textAlign) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'py-2 px-4 text-sm';
      case 'lg': return 'py-4 px-8 text-lg';
      default: return 'py-3 px-6 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline': 
        return 'border-2 border-current bg-transparent';
      case 'ghost': 
        return 'bg-transparent';
      default: // solid
        return 'shadow-sm';
    }
  };

  // Clean object maps for CSS classes
  const paddingClass = { lg: 'p-6', md: 'p-4', sm: 'p-2', none: 'p-0' }[style?.padding ?? 'md'];
  const marginClass = { lg: 'm-8', md: 'm-6', sm: 'm-4', none: 'm-0' }[style?.margin ?? 'none'];
  const borderRadiusClass = { lg: 'rounded-lg', md: 'rounded-md', sm: 'rounded-sm', none: 'rounded-none' }[style?.borderRadius ?? 'none'];
  const boxShadowClass = { lg: 'shadow-lg', md: 'shadow-md', sm: 'shadow-sm', none: 'shadow-none' }[style?.boxShadow ?? 'none'];

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
      className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${boxShadowClass}`}
    >
      <div className={`flex ${getAlignmentClass()}`}>
        <a
          href={link}
          className={`inline-block ${getSizeClasses()} ${getVariantClasses()} font-medium ${borderRadiusClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          style={{
            backgroundColor: (variant === 'solid' && !style?.backgroundColor) ? '#2563eb' : style?.backgroundColor,
            color: (variant === 'solid' && !style?.textColor) ? '#ffffff' : style?.textColor,
          }}
        >
          {label}
        </a>
      </div>
    </BaseWidget>
  );
};

export default CTAButtonWidget;
