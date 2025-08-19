import type { Block } from '@blocks/shared/Block';

export interface CTAButtonBlockProps {
  label: string;
  link: string;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export interface CTAButtonBlock extends Omit<Block, 'props'> {
  type: 'cta-button';
  props: CTAButtonBlockProps;
}
