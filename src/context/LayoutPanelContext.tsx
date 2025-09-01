import React, { createContext, useState, useContext } from 'react';

interface LayoutPanelContextType {
  isLayoutOpen: boolean;
  toggleLayout: () => void;
  openLayout: () => void;
  closeLayout: () => void;
}

const LayoutPanelContext = createContext<LayoutPanelContextType | undefined>(undefined);

export const LayoutPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);

  const toggleLayout = () => setIsLayoutOpen(prev => !prev);
  const openLayout = () => setIsLayoutOpen(true);
  const closeLayout = () => setIsLayoutOpen(false);

  return (
    <LayoutPanelContext.Provider value={{ isLayoutOpen, toggleLayout, openLayout, closeLayout }}>
      {children}
    </LayoutPanelContext.Provider>
  );
};

export const useLayoutPanel = (): LayoutPanelContextType => {
  const context = useContext(LayoutPanelContext);
  if (context === undefined) {
    throw new Error('useLayoutPanel must be used within a LayoutPanelProvider');
  }
  return context;
};
