import type { PageSchema } from '@blocks/shared/Page';

// Request payload for saving a page
export interface SavePageRequest {
  title: string;
  schema: PageSchema;
  status: number;
  description: string;
  slug: string;
}

// Response from the Django API for saving a page
export interface SavePageResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    slug: string;
    schema: PageSchema;
    status: number;
    version: number;
    description: string;
  };
}

// Response from the Django API for fetching page data
export interface FetchPageResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    slug: string;
    schema: PageSchema;
    status: number;
    version: number;
    description: string;
  };
}

// Error response from the Django API
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
}

// Global Django data interface
declare global {
  interface Window {
    DJANGO_DATA: {
      csrf_token: string;
      base_url: string;
    };
  }
}


/**
 * Saves a page to the Django backend API
 * @param pageData - The page data to save
 * @returns Promise<SavePageResponse> - The API response
 * @throws Error if the API request fails
 */
export async function savePage(pageData: SavePageRequest): Promise<SavePageResponse> {
  // Get CSRF token and base URL from Django data
  const { csrf_token: csrfToken, base_url: baseUrl } = window.DJANGO_DATA || {};
  if (!csrfToken || !baseUrl) {
    throw new Error('CSRF token or base URL not found. Please refresh the page and try again.');
  }
  
  const slug = pageData.slug;
  if (!slug) {
    throw new Error('A slug must be provided to save the page.');
  }

  const response = await fetch(`${baseUrl}/api/v1/page/${slug}/save/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify(pageData)
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.message || `HTTP ${response.status}: Failed to save page`);
  }

  return response.json() as Promise<SavePageResponse>;
}

/**
 * Fetches page data from the Django backend API
 * @param slug - The page slug to fetch (defaults to "home")
 * @returns Promise<FetchPageResponse> - The API response
 * @throws Error if the API request fails
 */
export async function fetchPage(slug: string = "home"): Promise<FetchPageResponse> {
  // Get base URL from Django data
  const { base_url: baseUrl } = window.DJANGO_DATA || {};
  
  if (!baseUrl) {
    throw new Error('Base URL not found. Please refresh the page and try again.');
  }

  const response = await fetch(`${baseUrl}/api/v1/page/${slug}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Page with slug "${slug}" not found.`);
    }
    
    try {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch page`);
    } catch (parseError) {
      throw new Error(`HTTP ${response.status}: Failed to fetch page`);
    }
  }

  return response.json() as Promise<FetchPageResponse>;
}
