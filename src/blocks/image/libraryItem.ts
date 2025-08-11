import type { ImageBlockProps } from './schema';

export const ImageLibraryItem = {
  type: 'image' as const,
  name: 'Image',
  description: 'Showcase an image with optional link and alt text',
  icon: 'Image' as const,
  defaultProps: {
    src: 'https://images.unsplash.com/photo-1754265222750-687ab87f5549',
    alt: 'Beautiful landscape image',
    link: '',
    size: 'medium' as const,
    aspectRatio: '16:9' as const,
    fit: 'cover' as const,
    alignment: 'center' as const,
  } as ImageBlockProps,
}; 