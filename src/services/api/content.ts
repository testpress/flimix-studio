import { mockApi } from './mock';

export interface ContentDetails {
  duration?: number | string;
  release_year?: number | string;
  imdb_rating?: number | string;
  total_seasons?: number;
  total_episodes?: number;
  finale_year?: number;
  published_year?: number;
  isbn?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  total_viewers?: number;
  chat_enabled?: boolean;
  meeting_id?: string;
  status?: string;
  
  // Frontend specific or legacy fields (feature)
  videoBackground?: string;
  titleImage?: string;
  hashtag?: string;
  language?: string;
}

// Content interface matching Backend Serializer
export interface Content {
  id: string | number;
  title: string;
  type: string;
  status: string;
  subtitle: string;
  thumbnail: string | null;
  poster: string | null;
  cover: string | null;
  genres: string[];
  url?: string | null;
  details: ContentDetails;
}


export interface ContentSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
  contentType?: number; // e.g., 1 = Movie, 2 = Series
}

let searchCallback: ((params: ContentSearchParams, signal?: AbortSignal) => Promise<Content[]>) | null = null;

export const contentApi = {
  setSearchCallback(cb: (params: ContentSearchParams, signal?: AbortSignal) => Promise<Content[]>) {
    searchCallback = cb;
  },

  async search(params: ContentSearchParams, signal?: AbortSignal): Promise<Content[]> {
    // If backend callback exists → use it
    if (searchCallback) {
      return searchCallback(params, signal);
    }

    // Fallback: use existing mock movie API
    // Map ContentSearchParams to MovieSearchParams if necessary
    return mockApi.search({
        query: params.query,
        limit: params.limit,
        offset: params.offset
    }, signal);
  },

  searchExcludingItems(existingItems: { content_id: number | string }[] = []) {
    return async (params: ContentSearchParams, signal?: AbortSignal) => {
        const results = await this.search(params, signal);
        const existingIds = new Set(existingItems.map(item => item.content_id));
        return results.filter(item => {
            const itemId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
            return !existingIds.has(itemId);
        });
    };
  }
};
