import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PageSchema } from '@blocks/shared/Page';

// Multi-page context interface
interface PageSchemaContextType {
  pages: Record<string, PageSchema>;

  // setPages: React's setState function - can update all pages at once
  // Usage: setPages(newPages) or setPages(prevPages => newPages)
  // Example: setPages(prev => ({ ...prev, 'movies': updatedMoviesPage })) - updates specific page in the map
  setPages: React.Dispatch<React.SetStateAction<Record<string, PageSchema>>>;
  currentPageSlug: string;
  setCurrentPageSlug: (slug: string) => void;
  updateSpecificPage: (slug: string, schema: PageSchema) => void;
  loadPage: (slug: string) => Promise<void>;
  pagesList: string[];
}

const PageSchemaContext = createContext<PageSchemaContextType | undefined>(undefined);

interface PageSchemaProviderProps {
  children: ReactNode;
  initialPage: Record<string, PageSchema>;
  defaultPageSlug: string;
  pagesList?: string[];
  onLoadPage?: (slug: string) => Promise<{ slug: string; schema: PageSchema }>;
}

export const PageSchemaProvider: React.FC<PageSchemaProviderProps> = ({ 
  children, 
  initialPage,
  defaultPageSlug,
  pagesList = [],
  onLoadPage
}) => {
  const [pages, setPages] = useState<Record<string, PageSchema>>(initialPage);
  const [currentPageSlug, setCurrentPageSlug] = useState<string>(defaultPageSlug);

  // Update specific page helper
  const updateSpecificPage = useCallback((slug: string, schema: PageSchema) => {
    setPages(prev => ({
      ...prev,
      [slug]: schema
    }));
  }, []);
  
  // Load page function that uses external onLoadPage callback
  const loadPage = useCallback(async (slug: string) => {
    // If page is already loaded, just switch to it
    if (pages[slug]) {
      setCurrentPageSlug(slug);
      return;
    }
    
    // If onLoadPage is provided, use it to load the page
    if (onLoadPage) {
      try {
        // onLoadPage callback is provided by backend integration (Django template)
        // It makes API call to fetch page data: GET /api/v1/page/{slug}/
        // Returns: { slug: string, schema: PageSchema }
        const data = await onLoadPage(slug);
        setPages(prev => ({ ...prev, [slug]: data.schema }));
        setCurrentPageSlug(slug);
      } catch (error) {
        console.error(`Failed to load page ${slug}:`, error);
      }
    } else {
      console.warn(`No onLoadPage callback provided to load page ${slug}`);
      setCurrentPageSlug(slug);
    }
  }, [pages, onLoadPage]);

  return (
    <PageSchemaContext.Provider value={{
      pages,
      setPages,
      currentPageSlug,
      setCurrentPageSlug,
      updateSpecificPage,
      loadPage,
      pagesList: pagesList.length > 0 ? pagesList : Object.keys(pages)
    }}>
      {children}
    </PageSchemaContext.Provider>
  );
};


export const usePageSchema = (): PageSchemaContextType => {
  const context = useContext(PageSchemaContext);
  if (context === undefined) {
    throw new Error('usePageSchema must be used within a PageSchemaProvider');
  }
  return context;
};
