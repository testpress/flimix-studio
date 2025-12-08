import { getJSON } from '@utils/http';
import type { Content, ContentSearchParams } from './content';
import { generateUniqueInt } from '@/utils/id';

// API base URL
const MOVIE_API_BASE = "https://68b005943b8db1ae9c026d70.mockapi.io/api/studio/";

// Default pagination values
export const DEFAULT_PAGE_SIZE = 20;

// Internal Mock Interface (from external mock API)
interface MockMovie {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  duration?: number;
  rating?: number;
  badges?: Array<{ label: string }>;
  progress?: number;
  titleImage?: string;      
  videoBackground?: string;  
  year?: string;            
  language?: string;        
  hashtag?: string; 
}

/**
 * Movie API service
 * Provides methods to fetch movies from the API and map them to Content
 */
export const mockApi = {
  
  async search(
    params: ContentSearchParams,
    signal?: AbortSignal
  ): Promise<Content[]> {
    const { query, limit = DEFAULT_PAGE_SIZE, offset = 0 } = params;
    
    // Calculate page number from offset and limit
    const page = Math.floor(offset / limit) + 1;
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (query) queryParams.append('search', query);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Build URL
    const url = `${MOVIE_API_BASE}/movies?${queryParams.toString()}`;
    
    // Fetch data
    const mockData = await getJSON<MockMovie[]>(url, signal);

    // Map MockMovie to Content
    return mockData.map(m => ({
      id: generateUniqueInt(),
      title: m.title,
      type: 'Movie',
      status: 'Published',
      subtitle: m.subtitle || '',
      thumbnail: m.image || null,
      poster: m.image || null,
      cover: m.image || null,
      genres: m.badges?.map(b => b.label) || [],
      details: {
        duration: m.duration,
        release_year: m.year,
        imdb_rating: m.rating,
        // Preserve mock fields that might be useful even if not in serializer strictly yet
        videoBackground: m.videoBackground,
        titleImage: m.titleImage,
        hashtag: m.hashtag,
        language: m.language
      }
    }));
  },
  
  /**
   * Get movie by ID
   * @param id Movie ID
   * @param signal AbortSignal for cancellation
   * @returns Promise with content
   */
  async getById(
    id: string,
    signal?: AbortSignal
  ): Promise<Content> {
    const url = `${MOVIE_API_BASE}/movies/${id}`;
    const m = await getJSON<MockMovie>(url, signal);
    
    return {
      id: m.id,
      title: m.title,
      type: 'Movie',
      status: 'Published',
      subtitle: m.subtitle || '',
      thumbnail: m.image || null,
      poster: m.image || null,
      cover: m.image || null,
      genres: m.badges?.map(b => b.label) || [],
      details: {
        duration: m.duration,
        release_year: m.year,
        imdb_rating: m.rating,
        videoBackground: m.videoBackground,
        titleImage: m.titleImage,
        hashtag: m.hashtag,
        language: m.language
      }
    };
  }
};
