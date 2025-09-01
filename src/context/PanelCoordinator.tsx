import React, { createContext, useContext } from 'react';
import { useLibraryPanel } from './LibraryPanelContext';
import { useLayoutPanel } from './LayoutPanelContext';

// This is a coordinator context that provides functions to safely open panels
// ensuring Library and Layout panels don't open simultaneously
interface PanelCoordinatorContextType {
  openLibrarySafely: () => void;
  openLayoutSafely: () => void;
}

const PanelCoordinatorContext = createContext<PanelCoordinatorContextType | undefined>(undefined);

export const PanelCoordinatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLibraryOpen, closeLibrary, openLibrary } = useLibraryPanel();
  const { isLayoutOpen, closeLayout, openLayout } = useLayoutPanel();

  // Safely open library panel, closing layout panel if it's open
  const openLibrarySafely = () => {
    if (isLayoutOpen) {
      closeLayout();
    }
    openLibrary();
  };

  // Safely open layout panel, closing library panel if it's open
  const openLayoutSafely = () => {
    if (isLibraryOpen) {
      closeLibrary();
    }
    openLayout();
  };

  return (
    <PanelCoordinatorContext.Provider value={{ openLibrarySafely, openLayoutSafely }}>
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
