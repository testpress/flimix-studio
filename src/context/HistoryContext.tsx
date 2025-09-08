import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { BlockType } from '@blocks/shared/Block';
import type { PageSchema } from '@blocks/shared/Page';

interface HistoryContextType {
  pageSchema: PageSchema;
  updatePageWithHistory: (pageSchema: PageSchema) => void;
  updatePageSchema: (pageSchema: PageSchema) => void;
  undo: () => void;
  canUndo: boolean;
  redo: () => void;
  canRedo: boolean;
  recordState: (currentBlocks: BlockType[]) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

interface HistoryProviderProps {
  children: ReactNode;
  initialSchema: PageSchema;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children, initialSchema }) => {
  // History management constants
  const HISTORY_LIMIT = 50;

  // Validate and sanitize the initial schema
  const sanitizedInitialSchema: PageSchema = {
    title: initialSchema?.title || 'Untitled Page',
    theme: initialSchema?.theme,
    visibility: initialSchema?.visibility,
    blocks: Array.isArray(initialSchema?.blocks) ? initialSchema.blocks : []
  };

  const [pageSchema, setPageSchema] = useState<PageSchema>(sanitizedInitialSchema);
  const [undoStack, setUndoStack] = useState<PageSchema[]>([]);
  const [redoStack, setRedoStack] = useState<PageSchema[]>([]);

  // Exposed function to record state changes
  const recordState = (currentBlocks: BlockType[]) => {
    const currentSchema = {
      ...pageSchema,
      blocks: currentBlocks
    };
    const clonedCurrentSchema = structuredClone(currentSchema);
    setUndoStack(prev => [...prev, clonedCurrentSchema].slice(-HISTORY_LIMIT)); // Limit history to 50 entries
    setRedoStack([]); // Clear redo stack when new changes are made
  };

  // Public function to update page schema with history recording
  const updatePageWithHistory = (newSchema: PageSchema) => {
    recordState(pageSchema.blocks);
    setPageSchema(newSchema);
  };

  // Public function to update page schema without history recording (for page schema switching)
  const updatePageSchema = (newPageSchema: PageSchema) => {
    setPageSchema(newPageSchema);
    // Clear history when switching page schemas
    setUndoStack([]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    // Save current state to redo stack before undoing
    const clonedCurrentSchema = structuredClone(pageSchema);
    setRedoStack(prev => [...prev, clonedCurrentSchema].slice(-HISTORY_LIMIT)); // Limit redo history to 50 entries
    
    const previousSchema = undoStack[undoStack.length - 1];
    setPageSchema(previousSchema);
    setUndoStack(prev => prev.slice(0, -1)); //remove the last item from the undo stack
  };

  const canUndo = undoStack.length > 0;

  const redo = () => {
    if (redoStack.length === 0) return;
    
    // Save current state to undo stack before redoing
    const clonedCurrentSchema = structuredClone(pageSchema);
    setUndoStack(prev => [...prev, clonedCurrentSchema].slice(-HISTORY_LIMIT)); // Limit undo history to 50 entries
    
    const nextSchema = redoStack[redoStack.length - 1];
    setPageSchema(nextSchema);
    setRedoStack(prev => prev.slice(0, -1));
  };

  const canRedo = redoStack.length > 0;

  return (
    <HistoryContext.Provider value={{
      pageSchema,
      updatePageWithHistory,
      updatePageSchema,
      undo,
      canUndo,
      redo,
      canRedo,
      recordState
    }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}; 