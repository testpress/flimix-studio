import type { VideoBlockProps } from './schema';

export const VideoLibraryItem = {
  type: 'video' as const,
  name: 'Video',
  description: 'Showcase an embedded video with optional caption and poster',
  icon: 'Video' as const,
  defaultProps: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.unsplash.com/photo-1754875177745-b09fcb123125',
    caption: 'Watch the official trailer',
    autoplay: false,
    muted: false,
    controls: true,
    loop: false,
    aspect_ratio: '16:9' as const,
    alignment: 'center' as const,
    size: 'medium' as const,
  } as VideoBlockProps,
}; 