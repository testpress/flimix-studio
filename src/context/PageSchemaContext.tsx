import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { PageSchema } from '@blocks/shared/Page';
import netflixSchemaData from '../pageSchemas/netflixSchema.json';
import hotstarSchemaData from '../pageSchemas/hotstarSchema.json';
import { useHistory } from './HistoryContext';

// Define available page schemas
export const availablePageSchemas = {
  netflix: {
    name: 'Netflix Page',
    pageSchema: netflixSchemaData as PageSchema
  },
  hotstar: {
    name: 'Hotstar Page',
    pageSchema: hotstarSchemaData as PageSchema
  }
};

export type PageSchemaKey = keyof typeof availablePageSchemas;

interface PageSchemaContextType {
  currentPageSchemaKey: PageSchemaKey;
  currentPageSchema: PageSchema;
  setCurrentPageSchemaKey: (key: PageSchemaKey) => void;
}

const PageSchemaContext = createContext<PageSchemaContextType | undefined>(undefined);

interface PageSchemaProviderProps {
  children: ReactNode;
  initialPageSchemaKey?: PageSchemaKey;
}

export const PageSchemaProvider: React.FC<PageSchemaProviderProps> = ({ 
  children, 
  initialPageSchemaKey = 'netflix' 
}) => {
  const [currentPageSchemaKey, setCurrentPageSchemaKey] = useState<PageSchemaKey>(initialPageSchemaKey);

  const currentPageSchema = availablePageSchemas[currentPageSchemaKey].pageSchema;

  return (
    <PageSchemaContext.Provider value={{
      currentPageSchemaKey,
      currentPageSchema,
      setCurrentPageSchemaKey
    }}>
      {children}
    </PageSchemaContext.Provider>
  );
};

// Hook to use page schema with history integration
export const usePageSchemaWithHistory = () => {
  const { currentPageSchemaKey, setCurrentPageSchemaKey } = usePageSchema();
  const { updatePageSchema } = useHistory();
  
  const switchPageSchema = (pageSchemaKey: PageSchemaKey) => {
    const newPageSchema = availablePageSchemas[pageSchemaKey].pageSchema;
    setCurrentPageSchemaKey(pageSchemaKey);
    updatePageSchema(newPageSchema);
  };
  
  return {
    currentPageSchemaKey,
    switchPageSchema
  };
};

export const usePageSchema = (): PageSchemaContextType => {
  const context = useContext(PageSchemaContext);
  if (context === undefined) {
    throw new Error('usePageSchema must be used within a PageSchemaProvider');
  }
  return context;
};
