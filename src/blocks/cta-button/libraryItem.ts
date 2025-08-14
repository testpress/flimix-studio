import type { CTAButtonBlockProps } from './schema';

export const CTAButtonLibraryItem = {
  type: 'cta-button' as const,
  name: 'CTA Button',
  description: 'Standalone call-to-action button',
  icon: 'RectangleEllipsis' as const, // Lucide icon representing action
  defaultProps: {
    label: 'Upgrade to Premium',
    link: '/upgrade',
    variant: 'solid' as const,
    size: 'md' as const,
  } as CTAButtonBlockProps,
};
