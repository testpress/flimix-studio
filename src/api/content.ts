import { mockApi, MOCK_CONTENT_TYPES } from './mock';

export const DEFAULT_PAGE_SIZE = 10;
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
  video_background?: string;
  title_image?: string;
  hashtag?: string;
  language?: string;
}

export interface ContentType {
  id: number;
  label: string;
}

// Content interface matching Backend Serializer
export interface Content {
  id: string | number;
  title: string;
  type: string;
  status: string;
  subtitle: string;
  thumbnail_path: string | null;
  poster_path: string | null;
  cover_path: string | null;
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
let fetchContentTypesCallback: ((signal?: AbortSignal) => Promise<ContentType[]>) | null = null;

export const contentApi = {
  setSearchCallback(cb: (params: ContentSearchParams, signal?: AbortSignal) => Promise<Content[]>) {
    searchCallback = cb;
  },

  setFetchContentTypesCallback(cb: (signal?: AbortSignal) => Promise<ContentType[]>) {
    fetchContentTypesCallback = cb;
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
      const existingIds = new Set(existingItems.map(item => String(item.content_id)));
      return results.filter(item => !existingIds.has(String(item.id)));
    };
  },

  async fetchContentTypes(signal?: AbortSignal): Promise<ContentType[]> {
    // If backend callback exists → use it
    if (fetchContentTypesCallback) {
      return fetchContentTypesCallback(signal);
    }

    // Fallback: return mock data with Movie type only
    return MOCK_CONTENT_TYPES;
  }
};
