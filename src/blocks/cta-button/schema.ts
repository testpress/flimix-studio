import type { Block } from '@blocks/shared/Block';

export interface CTAButtonBlockProps {
  label: string;
  link: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

export interface CTAButtonBlock extends Omit<Block, 'props'> {
  type: 'cta-button';
  props: CTAButtonBlockProps;
}
