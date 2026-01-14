import React from 'react';
import type { HeroCTABtn } from './schema';
import { ButtonIcon } from './form-components/ButtonIcons';
import { useSelection } from '@context/SelectionContext';

interface CTAButtonProps {
  cta: HeroCTABtn;
  defaultBackgroundColor: string;
  defaultTextColor: string;
}

// Helper function to get hashtag text size classes
export const getHashtagSizeClass = (size?: string) => {
  switch (size) {
    case 'small': return 'text-sm md:text-base';
    case 'large': return 'text-lg md:text-xl';
    case 'xl': return 'text-xl md:text-2xl';
    default: return 'text-base md:text-lg'; // medium (default)
  }
};

// Helper function to get icon size based on button size
export const getIconSize = (size?: string): number => {
  switch (size) {
    case 'small': return 16;
    case 'large': return 24;
    default: return 20; // medium
  }
};

// Helper function to get fallback text size for circle buttons
export const getCircleFallbackTextSizeClass = (size?: string): string => {
  switch (size) {
    case 'small': return 'text-base';
    case 'large': return 'text-xl';
    default: return 'text-lg'; // medium
  }
};

// Helper function to get button size classes
export const getButtonSizeClass = (size?: string, isCircle?: boolean) => {
  if (isCircle) {
    switch (size) {
      case 'small': return 'w-10 h-10 p-0';
      case 'large': return 'w-14 h-14 p-0';
      default: return 'w-12 h-12 p-0'; // medium (default)
    }
  }

  switch (size) {
    case 'small': return 'py-1.5 px-4 text-sm';
    case 'large': return 'py-3 px-8 text-lg';
    default: return 'py-2.5 px-6 text-base'; // medium (default)
  }
};

// Helper function to get button variant classes
export const getButtonVariantClass = (variant?: string) => {
  switch (variant) {
    case 'outline': return 'border bg-transparent';
    default: return 'border'; // solid variant
  }
};

// Helper function to get border radius classes
export const getBorderRadiusClass = (border_radius?: string) => {
  switch (border_radius) {
    case 'none': return '';
    case 'sm': return 'rounded-sm';
    case 'md': return 'rounded-md';
    case 'lg': return 'rounded-lg';
    case 'full': return 'rounded-full';
    default: return 'rounded-md';
  }
};

const CTAButton: React.FC<CTAButtonProps> = ({
  cta,
  defaultBackgroundColor,
  defaultTextColor,
}) => {
  const { isReadOnly } = useSelection();
  const isCircle = cta.border_radius === 'full';
  const buttonSizeClass = getButtonSizeClass(cta.size, isCircle);
  const variantClass = getButtonVariantClass(cta.variant);
  const borderRadiusClass = getBorderRadiusClass(cta.border_radius);

  const buttonContent = isCircle ? (
    // Circle button: only show icon, no text
    cta.icon && cta.icon !== 'None' ? (
      <ButtonIcon
        icon={cta.icon}
        size={getIconSize(cta.size)}
        thickness={cta.icon_thickness || 'normal'}
      />
    ) : (
      // If no icon, show first letter of label
      <span className={`font-bold ${getCircleFallbackTextSizeClass(cta.size)}`}>
        {cta.label.split('\n')[0].charAt(0).toUpperCase()}
      </span>
    )
  ) : (
    // Regular button: show icon + text
    <>
      {/* Icon on the left */}
      {cta.icon && cta.icon !== 'None' && cta.icon_position === 'left' && (
        <ButtonIcon
          icon={cta.icon}
          size={getIconSize(cta.size)}
          thickness={cta.icon_thickness || 'normal'}
        />
      )}

      {/* Button text */}
      <span className="whitespace-pre-line text-left">{cta.label}</span>

      {/* Icon on the right */}
      {cta.icon && cta.icon !== 'None' && cta.icon_position === 'right' && (
        <ButtonIcon
          icon={cta.icon}
          size={getIconSize(cta.size)}
          thickness={cta.icon_thickness || 'normal'}
        />
      )}
    </>
  );

  const commonClasses = `font-semibold transition-colors duration-200 ${variantClass} flex items-center justify-center gap-2 ${borderRadiusClass} ${buttonSizeClass} cursor-pointer`;
  const commonStyles = {
    backgroundColor: cta.background_color || defaultBackgroundColor,
    color: cta.text_color || defaultTextColor,
    borderColor: cta.variant === 'outline' ? (cta.text_color || defaultTextColor) : 'transparent'
  };

  if (isReadOnly && cta.link) {
    return (
      <a
        href={cta.link}
        className={commonClasses}
        style={commonStyles}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={commonClasses}
      style={commonStyles}
    >
      {buttonContent}
    </button>
  );
};

export default CTAButton;
