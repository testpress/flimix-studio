import React, { createContext, useContext, useState } from 'react';

interface PanelContextType {
  // Library Panel (Left)
  isLibraryOpen: boolean;
  openLibrary: () => void;
  closeLibrary: () => void;
  toggleLibrary: () => void;

  // Layout Panel (Left)
  isLayoutOpen: boolean;
  openLayout: () => void;
  closeLayout: () => void;
  toggleLayout: () => void;

  // Settings Panel (Right)
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Library Panel Logic
  const openLibrary = () => {
    setIsLayoutOpen(false); // Close layout if open (mutually exclusive left panels)
    setIsLibraryOpen(true);
  };

  const closeLibrary = () => {
    setIsLibraryOpen(false);
  };

  const toggleLibrary = () => {
    if (isLibraryOpen) {
      closeLibrary();
    } else {
      openLibrary();
    }
  };

  // Layout Panel Logic
  const openLayout = () => {
    setIsLibraryOpen(false); // Close library if open (mutually exclusive left panels)
    setIsLayoutOpen(true);
  };

  const closeLayout = () => {
    setIsLayoutOpen(false);
  };

  const toggleLayout = () => {
    if (isLayoutOpen) {
      closeLayout();
    } else {
      openLayout();
    }
  };

  // Settings Panel Logic (Right side - independent of left panels)
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const toggleSettings = () => setIsSettingsOpen(prev => !prev);

  return (
    <PanelContext.Provider value={{ 
      isLibraryOpen, openLibrary, closeLibrary, toggleLibrary,
      isLayoutOpen, openLayout, closeLayout, toggleLayout,
      isSettingsOpen, openSettings, closeSettings, toggleSettings
    }}>
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = (): PanelContextType => {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
};
