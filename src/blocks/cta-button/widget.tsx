import React from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { CTAButtonBlock } from './schema';

interface CTAButtonWidgetProps extends Omit<BlockWidgetWrapperProps<CTAButtonBlock>, 'block'> {
  block: CTAButtonBlock;
}

const CTAButtonWidget: React.FC<CTAButtonWidgetProps> = ({
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove,
}) => {
  const { label, link, variant = 'solid', size = 'md' } = block.props;
  const { style } = block;

  const getAlignmentClass = () => {
    switch (style?.text_align) {
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
      default: // solid
        return 'shadow-sm';
    }
  };

  const borderRadiusClass = { lg: 'rounded-lg', md: 'rounded-md', sm: 'rounded-sm', none: 'rounded-none' }[style?.border_radius ?? 'none'];
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

  const boxShadowStyle = getBoxShadowStyle(style?.box_shadow);

  return (
    <BlockWidgetWrapper
      block={block}
      onSelect={onSelect}
      isSelected={isSelected}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
      style={{
        paddingTop: style?.padding_top,
        paddingRight: style?.padding_right,
        paddingBottom: style?.padding_bottom,
        paddingLeft: style?.padding_left,
        marginTop: style?.margin_top,
        marginRight: style?.margin_right,
        marginBottom: style?.margin_bottom,
        marginLeft: style?.margin_left,
      }}
    >
      <div className={`flex ${getAlignmentClass()}`}>
        <a
          href={link}
          className={`inline-block ${getSizeClasses()} ${getVariantClasses()} font-medium ${borderRadiusClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          style={{
            backgroundColor: (variant === 'solid' && !style?.background_color) ? '#1f2937' : style?.background_color,
            color: (variant === 'solid' && !style?.text_color) ? '#ffffff' : style?.text_color,
            boxShadow: boxShadowStyle,
          }}
        >
          {label}
        </a>
      </div>
    </BlockWidgetWrapper>
  );
};

export default CTAButtonWidget;
