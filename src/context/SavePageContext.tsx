import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useHistory } from '@context/HistoryContext';
import { savePage, type SavePageRequest, type SavePageResponse } from '@services/api/page';

interface SavePageContextType {
  isSaving: boolean;
  savePage: (title?: string, description?: string, status?: number, slug?: string) => Promise<SavePageResponse>;
  lastError: string | null;
  lastSuccess: string | null;
}

const SavePageContext = createContext<SavePageContextType | undefined>(undefined);

interface SavePageProviderProps {
  children: ReactNode;
}

export const SavePageProvider: React.FC<SavePageProviderProps> = ({ children }) => {
  const { pageSchema } = useHistory();
  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  const handleSave = useCallback(async (
    title?: string, 
    description?: string,
    status: number = 1,
    slug?: string
  ): Promise<SavePageResponse> => {
    try {
      setIsSaving(true);
      setLastError(null);
      setLastSuccess(null);

      const pageData: SavePageRequest = {
        title: title || pageSchema.title || 'Home Page',
        schema: pageSchema,
        status,
        description: description || `Page saved on ${new Date().toLocaleString()}`,
        slug: slug || "home"  // Default slug for backward compatibility
      };

      const response = await savePage(pageData);
      
      const statusText = status === 1 ? 'draft' : 'published';
      setLastSuccess(`Page saved as ${statusText} successfully!`);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save page. Please try again.';
      setLastError(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [pageSchema]);

  return (
    <SavePageContext.Provider value={{
      isSaving,
      savePage: handleSave,
      lastError,
      lastSuccess
    }}>
      {children}
    </SavePageContext.Provider>
  );
};

export const useSavePage = (): SavePageContextType => {
  const context = useContext(SavePageContext);
  if (context === undefined) {
    throw new Error('useSavePage must be used within a SavePageProvider');
  }
  return context;
};
