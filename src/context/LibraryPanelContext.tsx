import React, { createContext, useState, useContext } from 'react';

interface LibraryPanelContextType {
  isLibraryOpen: boolean;
  toggleLibrary: () => void;
  openLibrary: () => void;
  closeLibrary: () => void;
}

const LibraryPanelContext = createContext<LibraryPanelContextType | undefined>(undefined);

export const LibraryPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const toggleLibrary = () => setIsLibraryOpen(prev => !prev);
  const openLibrary = () => setIsLibraryOpen(true);
  const closeLibrary = () => setIsLibraryOpen(false);

  return (
    <LibraryPanelContext.Provider value={{ isLibraryOpen, toggleLibrary, openLibrary, closeLibrary }}>
      {children}
    </LibraryPanelContext.Provider>
  );
};

export const useLibraryPanel = (): LibraryPanelContextType => {
  const context = useContext(LibraryPanelContext);
  if (context === undefined) {
    throw new Error('useLibraryPanel must be used within a LibraryPanelProvider');
  }
  return context;
};
