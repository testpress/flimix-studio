import type { Block } from '@blocks/shared/Block';

export interface ImageBlockProps {
  src: string;
  alt?: string;
  link?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | 'auto';
  fit?: 'cover' | 'contain' | 'fill';
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageBlock extends Omit<Block, 'props'> {
  type: 'image';
  props: ImageBlockProps;
} 