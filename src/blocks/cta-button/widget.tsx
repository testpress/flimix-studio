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
      default: 
        return 'bg-blue-600 text-white shadow-sm';
    }
  };

  const paddingClass = style?.padding === 'lg' ? 'p-6' : style?.padding === 'md' ? 'p-4' : style?.padding === 'sm' ? 'p-2' : 'p-4';
  const marginClass = style?.margin === 'lg' ? 'm-8' : style?.margin === 'md' ? 'm-6' : style?.margin === 'sm' ? 'm-4' : 'm-0';
  const borderRadiusClass = style?.borderRadius === 'lg' ? 'rounded-lg' : style?.borderRadius === 'md' ? 'rounded-md' : style?.borderRadius === 'sm' ? 'rounded-sm' : 'rounded';
  const boxShadowClass = style?.boxShadow === 'lg' ? 'shadow-lg' : style?.boxShadow === 'md' ? 'shadow-md' : style?.boxShadow === 'sm' ? 'shadow-sm' : '';

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
            backgroundColor: style?.backgroundColor,
            color: style?.textColor,
          }}
        >
          {label}
        </a>
      </div>
    </BaseWidget>
  );
};

export default CTAButtonWidget;
