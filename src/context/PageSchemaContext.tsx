import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { PageSchema } from '@blocks/shared/Page';
import netflixSchemaData from '@pageSchemas/netflixSchema.json';
import hotstarSchemaData from '@pageSchemas/hotstarSchema.json';
import amazonSchemaData from '@pageSchemas/amazonSchema.json';

// Define available page schemas
export const availablePageSchemas = {
  netflix: {
    name: 'Netflix Page',
    pageSchema: netflixSchemaData as PageSchema
  },
  hotstar: {
    name: 'Hotstar Page',
    pageSchema: hotstarSchemaData as PageSchema
  },
  amazon: {
    name: 'Amazon Prime Page',
    pageSchema: amazonSchemaData as PageSchema
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
  initialPageSchemaKey = 'amazon' as PageSchemaKey
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


export const usePageSchema = (): PageSchemaContextType => {
  const context = useContext(PageSchemaContext);
  if (context === undefined) {
    throw new Error('usePageSchema must be used within a PageSchemaProvider');
  }
  return context;
};
