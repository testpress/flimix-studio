import type { PosterGridBlockProps } from './schema';

// Poster grid block template for library
export const PosterGridLibraryItem = {
  type: 'posterGrid' as const,
  name: 'Poster Grid',
  description: 'Display a grid of poster images with titles',
  icon: 'Grid2x2' as const,
  defaultProps: {
    title: 'Top Picks',
    columns: 3,
    rows: 3,
    itemShape: 'rectangle-landscape',
    items: [
      { id: '1', image: 'https://images.unsplash.com/photo-1754147388611-c0f0179a05b5', title: 'Sample 1', link: '' },
      { id: '2', image: 'https://images.unsplash.com/photo-1754337287566-49550e4512bd', title: 'Sample 2', link: '' },
    ],
  } as PosterGridBlockProps
}; 