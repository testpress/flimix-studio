import React, { createContext, useContext, useState, useCallback } from 'react';
import type { HeaderSchema } from '@header/schema';
import type { FooterSchema, FooterColumn } from '@footer/schema';
import headerData from '@fixtures/headerSchema.json';
import footerData from '@fixtures/footerSchema.json';
import { swap } from '@utils/array';  

export type ExpansionPath = 
  | []                                    // No parents (header items, root selections)
  | [string]                              // Single parent (footer row, header dropdown parent)
  | [string, string];                     // Two parents (footer column/item: [rowId, colId])

const HISTORY_LIMIT = 50;

interface HistorySnapshot {
  header: HeaderSchema;
  footer: FooterSchema;
}

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
  moveHeaderItem: (itemId: string, direction: 'up' | 'down') => void;
  moveDropdownItem: (parentId: string, itemId: string, direction: 'up' | 'down') => void;
  moveFooterRow: (rowId: string, direction: 'up' | 'down') => void;
  moveFooterColumn: (rowId: string, columnId: string, direction: 'up' | 'down') => void;
  moveFooterItem: (rowId: string, columnId: string, itemId: string, direction: 'up' | 'down') => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const HeaderFooterContext = createContext<HeaderFooterContextType | undefined>(undefined);

// Recursive helper to find and update item in any nested column
const updateColumnRecursive = (column: FooterColumn, targetColumnId: string, itemId: string, direction: 'up' | 'down'): FooterColumn | null => {
  // If this is the target column, update its items
  if (column.id === targetColumnId) {
    const itemIndex = column.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;
    
    const newItemIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    return {
      ...column,
      items: swap(column.items, itemIndex, newItemIndex)
    };
  }
  
  // Otherwise, recursively search nested columns
  let hasUpdate = false;
  const updatedItems = column.items.map(item => {
    if (item.type === 'column') {
      const updatedNested = updateColumnRecursive(item, targetColumnId, itemId, direction);
      if (updatedNested) {
        hasUpdate = true;
        return updatedNested;
      }
    }
    return item;
  });
  
  // If any nested column was updated, return updated column
  return hasUpdate ? { ...column, items: updatedItems } : null;
};

export const HeaderFooterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerSchema, setHeaderSchema] = useState<HeaderSchema>(headerData as HeaderSchema);
  const [footerSchema, setFooterSchema] = useState<FooterSchema>(footerData as FooterSchema);
  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<HistorySnapshot[]>([]);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [expandedPath, setExpandedPath] = useState<ExpansionPath>([]);

  // Helper to record state before a change
  const recordState = useCallback(() => {
    setUndoStack(prev => {
      const newUndoStack = [...prev, { header: headerSchema, footer: footerSchema }];
      if (newUndoStack.length > HISTORY_LIMIT) return newUndoStack.slice(newUndoStack.length - HISTORY_LIMIT);
      return newUndoStack;
    });
    setRedoStack([]); // Clear redo stack on new change
  }, [headerSchema, footerSchema]);

  // Undo Action
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    setRedoStack(prev => [{ header: headerSchema, footer: footerSchema }, ...prev]);
    setHeaderSchema(previous.header);
    setFooterSchema(previous.footer);
    setUndoStack(newUndoStack);
  }, [undoStack, headerSchema, footerSchema]);

  // Redo Action
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const next = redoStack[0];
    const newRedoStack = redoStack.slice(1);

    setUndoStack(prev => [...prev, { header: headerSchema, footer: footerSchema }]);
    setHeaderSchema(next.header);
    setFooterSchema(next.footer);
    setRedoStack(newRedoStack);
  }, [redoStack, headerSchema, footerSchema]);

  // Wrapped setters to record history
  const updateHeaderSchema = useCallback((newSchema: HeaderSchema) => {
    recordState();
    setHeaderSchema(newSchema);
  }, [recordState]);

  const updateFooterSchema = useCallback((newSchema: FooterSchema) => {
    recordState();
    setFooterSchema(newSchema);
  }, [recordState]);

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

  // Move functions
  const moveHeaderItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    recordState(); // Record before change
    setHeaderSchema(prev => {
      const items = prev.items.filter(i => i.type !== 'logo' && i.type !== 'title');
      const nonNavItems = prev.items.filter(i => i.type === 'logo' || i.type === 'title');
      
      const index = items.findIndex(item => item.id === itemId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newItems = swap(items, index, newIndex);
      
      return { ...prev, items: [...nonNavItems, ...newItems] };
    });
  }, [recordState]);

  const moveDropdownItem = useCallback((parentId: string, itemId: string, direction: 'up' | 'down') => {
    recordState();
    setHeaderSchema(prev => {
      const parentIndex = prev.items.findIndex(item => item.id === parentId);
      if (parentIndex === -1 || !prev.items[parentIndex].items) return prev;

      const parentItem = { ...prev.items[parentIndex] }; // Copy the parent item
      const subItems = parentItem.items || [];
      const itemIndex = subItems.findIndex(sub => sub.id === itemId);
      if (itemIndex === -1) return prev;

      const newItemIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
      parentItem.items = swap(subItems, itemIndex, newItemIndex);
      
      const newItems = [...prev.items]; 
      newItems[parentIndex] = parentItem; // Update the parent item with the new items array
      
      return { ...prev, items: newItems };
    });
  }, [recordState]);

  const moveFooterRow = useCallback((rowId: string, direction: 'up' | 'down') => {
    recordState();
    setFooterSchema(prev => {
      const index = prev.rows.findIndex(row => row.id === rowId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newRows = swap(prev.rows, index, newIndex);
      
      return { ...prev, rows: newRows };
    });
  }, [recordState]);

  const moveFooterColumn = useCallback((rowId: string, columnId: string, direction: 'up' | 'down') => {
    recordState();
    setFooterSchema(prev => {
      const rowIndex = prev.rows.findIndex(row => row.id === rowId);
      if (rowIndex === -1) return prev;

      const row = { ...prev.rows[rowIndex] }; // Copy the row
      const colIndex = row.columns.findIndex(col => col.id === columnId);
      if (colIndex === -1) return prev;
      
      const newColIndex = direction === 'up' ? colIndex - 1 : colIndex + 1;
      row.columns = swap(row.columns, colIndex, newColIndex);
      
      const newRows = [...prev.rows];
      newRows[rowIndex] = row; // Update the row with the new columns array
      
      return { ...prev, rows: newRows };
    });
  }, [recordState]);

  const moveFooterItem = useCallback((rowId: string, columnId: string, itemId: string, direction: 'up' | 'down') => {
    recordState();
    setFooterSchema(prev => {
      const rowIndex = prev.rows.findIndex(row => row.id === rowId);
      if (rowIndex === -1) return prev;
      
      const row = { ...prev.rows[rowIndex] };
      
      // Try to find and update the column (could be top-level or nested)
      let updated = false;
      const updatedColumns = row.columns.map(col => {
        const updatedCol = updateColumnRecursive(col, columnId, itemId, direction);
        if (updatedCol) {
          updated = true;
          return updatedCol;
        }
        return col;
      });
      
      if (!updated) return prev;
      
      const newRows = [...prev.rows];
      newRows[rowIndex] = { ...row, columns: updatedColumns };
      
      return { ...prev, rows: newRows };
    });
  }, [recordState]);

  return (
    <HeaderFooterContext.Provider value={{
      headerSchema,
      footerSchema,
      updateHeaderSchema: updateHeaderSchema,
      updateFooterSchema: updateFooterSchema,
      selectedId,
      activeTab,
      setActiveTab,
      selectItem,
      expandedPath,
      moveHeaderItem,
      moveDropdownItem,
      moveFooterRow,
      moveFooterColumn,
      moveFooterItem,
      undo,
      redo,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
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
