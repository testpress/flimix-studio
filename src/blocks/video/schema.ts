import type { Block } from '@blocks/shared/Block';

export interface VideoBlockProps {
  src: string;
  poster?: string;
  caption?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large' | 'full';
}

export interface VideoBlock extends Omit<Block, 'props'> {
  type: 'video';
  props: VideoBlockProps;
} 