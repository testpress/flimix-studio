/**
 * Get alignment class for menu items
 */
export const getAlignmentClass = (alignment: 'left' | 'center' | 'right'): string => {
  switch (alignment) {
    case 'left': return 'justify-start';
    case 'center': return 'justify-center';
    case 'right': return 'justify-end';
    default: return 'justify-start';
  }
};

/**
 * Get first two letters of a label for initials
 */
export const getInitials = (label: string): string => {
  return label.substring(0, 2).toUpperCase();
};

/**
 * Check if a color value is a hex color
 */
export const isHexColor = (color: string): boolean => {
  return Boolean(color && color.startsWith('#'));
};

/**
 * Get background color class and style
 */
export const getBackgroundColorProps = (backgroundColor: string) => {
  const isHex = isHexColor(backgroundColor);
  return {
    backgroundColorClass: !isHex ? (backgroundColor || '') : '',
    backgroundColorStyle: isHex ? { backgroundColor } : {},
  };
};

/**
 * Get container style with background and hover color
 */
export const getContainerStyle = (backgroundColor: string, hoverColor?: string) => {
  const { backgroundColorStyle } = getBackgroundColorProps(backgroundColor);
  
  return {
    ...backgroundColorStyle,
    ...(hoverColor && { '--menu-item-hover-color': hoverColor }),
  };
};

/**
 * Get hover class name
 */
export const getHoverClassName = (hoverColor?: string): string => {
  return hoverColor ? 'has-hover-color' : '';
};

/**
 * Get text color class and style
 */
export const getTextColorProps = (textColor: string, defaultClass: string = 'text-white') => {
  const isHex = isHexColor(textColor);
  return {
    textColorClass: !isHex ? (textColor || defaultClass) : '',
    textColorStyle: isHex ? { color: textColor } : {},
  };
};
