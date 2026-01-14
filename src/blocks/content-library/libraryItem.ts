import type { BlockLibraryItem } from '@type/library';
import type { ContentLibraryBlockProps } from './schema';

export const ContentLibraryLibraryItem: BlockLibraryItem = {
  type: 'contentLibrary',
  name: 'Content Library',
  description: 'Full-page infinite scroll catalog of movies or series.',
  icon: 'Grid2x2',
  defaultProps: {
    title: '',
    title_alignment: 'left',
    content_type_id: 1, // Default to Movies (usually ID 1)
    item_size: 'medium',
    item_gap: 'medium',
    item_shape: 'landscape',
    show_title: true,
    show_subtitle: true,
    show_genres: true,
    show_rating: true,
    show_year: true,
    empty_state_message: 'No content found.',
    loading_state_message: 'Loading content...',
  } as ContentLibraryBlockProps,
};
