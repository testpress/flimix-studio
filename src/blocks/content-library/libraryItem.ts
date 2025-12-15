import type { BlockLibraryItem } from '@blocks/shared/Library';
import type { ContentLibraryBlockProps } from './schema';

export const ContentLibraryLibraryItem: BlockLibraryItem = {
  type: 'contentLibrary',
  name: 'Content Library',
  description: 'Full-page infinite scroll catalog of movies or series.',
  icon: 'Grid2x2',
  defaultProps: {
    title: '',
    titleAlignment: 'left',
    contentTypeId: 1, // Default to Movies (usually ID 1)
    itemSize: 'medium',
    itemGap: 'medium',
    itemShape: 'landscape',
    showTitle: true,
    showSubtitle: true,
    showGenres: true,
    showRating: true,
    showYear: true,
    emptyStateMessage: 'No content found.',
    loadingStateMessage: 'Loading content...',
  } as ContentLibraryBlockProps,
};
