import { getJSON } from '@utils/http';

// API base URL
const MOVIE_API_BASE = "https://68b005943b8db1ae9c026d70.mockapi.io/api/studio/";

// Movie content interface
export interface Movie {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  duration?: number;
  rating?: number;
  badge?: string;
  progress?: number;
}

// Search params interface
export interface MovieSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}

/**
 * Movie API service
 * Provides methods to fetch movies from the API
 */
export const movieApi = {
  /**
   * Search for movies
   * @param params Search parameters
   * @param signal AbortSignal for cancellation
   * @returns Promise with movie results
   */
  async search(
    params: MovieSearchParams,
    signal?: AbortSignal
  ): Promise<Movie[]> {
    const { query, limit = 10, offset = 0 } = params;
    
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
    return await getJSON<Movie[]>(url, signal);
  },
  
  /**
   * Get movie by ID
   * @param id Movie ID
   * @param signal AbortSignal for cancellation
   * @returns Promise with movie
   */
  async getById(
    id: string,
    signal?: AbortSignal
  ): Promise<Movie> {
    const url = `${MOVIE_API_BASE}/movies/${id}`;
    return await getJSON<Movie>(url, signal);
  }
};
