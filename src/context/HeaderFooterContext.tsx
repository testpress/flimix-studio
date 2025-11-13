import React, { createContext, useContext, useState, useCallback } from 'react';
import type { HeaderSchema } from '@header/schema';
import type { FooterSchema } from '@footer/schema';
import headerData from '@fixtures/headerSchema.json';
import footerData from '@fixtures/footerSchema.json';

export type ExpansionPath = 
  | []                                    // No parents (header items, root selections)
  | [string]                              // Single parent (footer row, header dropdown parent)
  | [string, string];                     // Two parents (footer column/item: [rowId, colId])

interface HeaderFooterContextType {
  headerSchema: HeaderSchema;
  footerSchema: FooterSchema;
  updateHeaderSchema: (s: HeaderSchema) => void;
  updateFooterSchema: (s: FooterSchema) => void;
  selectedId: string | null;
  activeTab: 'header' | 'footer';
  setActiveTab: (tab: 'header' | 'footer') => void;
  selectItem: (id: string, tab: 'header' | 'footer', path?: ExpansionPath) => void;
  expandedPath: ExpansionPath; 
}

const HeaderFooterContext = createContext<HeaderFooterContextType | undefined>(undefined);

export const HeaderFooterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerSchema, setHeaderSchema] = useState<HeaderSchema>(headerData as HeaderSchema);
  const [footerSchema, setFooterSchema] = useState<FooterSchema>(footerData as FooterSchema);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [expandedPath, setExpandedPath] = useState<ExpansionPath>([]);

  const selectItem = useCallback((id: string, tab: 'header' | 'footer', path: ExpansionPath = []) => {
    setSelectedId(prevSelectedId => {
      // IF clicked item is ALREADY selected -> Deselect (Toggle Off)
      if (prevSelectedId === id) {
        setExpandedPath([]); // Collapse everything
        return null;
      }      
      // ELSE -> Select it (Toggle On)
      setActiveTab(tab);
      setExpandedPath(path);
      return id;
    });
  }, []);

  return (
    <HeaderFooterContext.Provider value={{
      headerSchema,
      footerSchema,
      updateHeaderSchema: setHeaderSchema,
      updateFooterSchema: setFooterSchema,
      selectedId,
      activeTab,
      setActiveTab,
      selectItem,
      expandedPath
    }}>
      {children}
    </HeaderFooterContext.Provider>
  );
};

export const useHeaderFooter = () => {
  const context = useContext(HeaderFooterContext);
  if (!context) throw new Error('useHeaderFooter must be used within a HeaderFooterProvider');
  return context;
};
