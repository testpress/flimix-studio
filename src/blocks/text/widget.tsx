import React from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { TextBlock } from './schema';

interface TextWidgetProps extends Omit<BlockWidgetWrapperProps<TextBlock>, 'block'> {
  block: TextBlock;
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
  const { content, font_family, font_size, font_weight, font_style, text_decoration, line_height, letter_spacing } = props;

  // Border radius class
  const borderRadiusClass = { lg: 'rounded-lg', md: 'rounded-md', sm: 'rounded-sm', none: 'rounded-none' }[style?.border_radius ?? 'none'];

  // Font family classes
  const fontFamilyClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    display: 'font-serif' // Using serif as fallback for display since font-display might not be available
  }[font_family || 'sans'];

  // Font size classes
  const fontSizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  }[font_size || 'base'];

  // Font weight classes
  const fontWeightClass = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  }[font_weight || 'normal'];

  // Font style classes
  const fontStyleClass = {
    normal: '',
    italic: 'italic'
  }[font_style || 'normal'];

  // Text decoration classes
  const textDecorationClass = {
    none: '',
    underline: 'underline',
    'line-through': 'line-through',
    overline: '' // Will be handled with custom style
  }[text_decoration || 'none'];

  // Custom text decoration style for overline
  const textDecorationStyle = text_decoration === 'overline' ? { textDecoration: 'overline' } : {};

  // Line height classes
  const lineHeightClass = {
    none: 'leading-none',
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  }[line_height || 'normal'];

  // Letter spacing classes
  const letterSpacingClass = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: '',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    widest: 'tracking-widest'
  }[letter_spacing || 'normal'];



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

  const textAlignClass = style?.text_align === 'center' ? 'text-center' :
    style?.text_align === 'right' ? 'text-right' : 'text-left';

  // Handle text color - default to white text
  const isHexColor = style?.text_color && style.text_color.startsWith('#');
  const textColorClass = !isHexColor ? (style?.text_color || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.text_color } : {};

  // Determine background styling - default to black
  const hasCustomBackground = !!style?.background_color;
  const defaultBackgroundClass = 'bg-black';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  if (!content) {
    return (
      <div style={{ boxShadow: boxShadowStyle }}>
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
          className={`${borderRadiusClass} bg-gray-50 border-2 border-dashed border-gray-300`}
          style={{
            backgroundColor: hasCustomBackground ? style.background_color : undefined,
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
          <p className={`${fontFamilyClass} ${fontSizeClass} ${fontWeightClass} ${fontStyleClass} ${textDecorationClass} ${lineHeightClass} ${letterSpacingClass} text-gray-500 text-center`} style={textDecorationStyle}>No content provided</p>
        </BlockWidgetWrapper>
      </div>
    );
  }

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
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
        className={`${borderRadiusClass} ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.background_color : undefined,
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
        <div className={`${textAlignClass}`}>
          <div className={`${fontFamilyClass} ${fontSizeClass} ${fontWeightClass} ${fontStyleClass} ${textDecorationClass} ${lineHeightClass} ${letterSpacingClass} whitespace-pre-line ${textColorClass}`} style={{ ...textColorStyle, ...textDecorationStyle }}>
            {content}
          </div>
        </div>
      </BlockWidgetWrapper>
    </div>
  );
};

export default TextWidget; 