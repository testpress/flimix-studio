import React, { createContext, useContext } from 'react';
import { useLibraryPanel } from './LibraryPanelContext';
import { useLayoutPanel } from './LayoutPanelContext';

// This is a coordinator context that provides functions to safely toggle panels
// ensuring Library and Layout panels don't open simultaneously
interface PanelCoordinatorContextType {
  toggleLibrarySafely: () => void;
  toggleLayoutSafely: () => void;
}

const PanelCoordinatorContext = createContext<PanelCoordinatorContextType | undefined>(undefined);

export const PanelCoordinatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLibraryOpen, closeLibrary, openLibrary } = useLibraryPanel();
  const { isLayoutOpen, closeLayout, openLayout } = useLayoutPanel();



  // Safely toggle library panel, closing layout panel if it's open
  const toggleLibrarySafely = () => {
    if (isLibraryOpen) {
      closeLibrary();
    } else {
      if (isLayoutOpen) closeLayout();
      openLibrary();
    }
  };

  // Safely toggle layout panel, closing library panel if it's open
  const toggleLayoutSafely = () => {
    if (isLayoutOpen) {
      closeLayout();
    } else {
      if (isLibraryOpen) closeLibrary();
      openLayout();
    }
  };

  return (
    <PanelCoordinatorContext.Provider value={{ 
      toggleLibrarySafely, 
      toggleLayoutSafely 
    }}>
      {children}
    </PanelCoordinatorContext.Provider>
  );
};

export const usePanelCoordinator = (): PanelCoordinatorContextType => {
  const context = useContext(PanelCoordinatorContext);
  if (context === undefined) {
    throw new Error('usePanelCoordinator must be used within a PanelCoordinatorProvider');
  }
  return context;
};
