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
    items: [],
  } as PosterGridBlockProps
}; 