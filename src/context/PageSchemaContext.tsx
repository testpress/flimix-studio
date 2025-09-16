import React, { createContext, useContext, useState, type ReactNode } from 'react';
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
}

const PageSchemaContext = createContext<PageSchemaContextType | undefined>(undefined);

interface PageSchemaProviderProps {
  children: ReactNode;
  initialPages: Record<string, PageSchema>;
  defaultPageSlug: string;
}

export const PageSchemaProvider: React.FC<PageSchemaProviderProps> = ({ 
  children, 
  initialPages,
  defaultPageSlug
}) => {
  const [pages, setPages] = useState<Record<string, PageSchema>>(initialPages);
  const [currentPageSlug, setCurrentPageSlug] = useState<string>(defaultPageSlug);

  // Update specific page helper
  const updateSpecificPage = (slug: string, schema: PageSchema) => {
    setPages(prev => ({
      ...prev,
      [slug]: schema
    }));
  };

  return (
    <PageSchemaContext.Provider value={{
      pages,
      setPages,
      currentPageSlug,
      setCurrentPageSlug,
      updateSpecificPage
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
