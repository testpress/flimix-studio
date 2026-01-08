import React, { type ReactNode } from 'react';
import { SelectionContext } from '@context/SelectionContext';
import { BlockEditingContext } from '@context/BlockEditingContext';
import { HistoryContext } from '@context/HistoryContext';
import { BlockInsertContext } from '@context/BlockInsertContext';
import { PanelContext } from '@context/PanelContext';
import type { PageSchema } from '@type/page';


export const PagePreviewProviders: React.FC<{
  initialSchema: PageSchema;
  children: ReactNode;
}> = ({ initialSchema, children }) => {
  // Memoize noop functions
  const noop = React.useCallback(() => {}, []);
  const noopReturnsEmptyString = React.useCallback(() => '', []);
  const noopReturnsFalse = React.useCallback(() => false, []);

  const historyValue = React.useMemo(() => ({
    pageSchema: initialSchema,
    updatePageWithHistory: noop,
    undo: noop,
    canUndo: false,
    redo: noop,
    canRedo: false,
    recordState: noop
  }), [initialSchema, noop]);

  const selectionValue = React.useMemo(() => ({
    selectedBlock: null,
    setSelectedBlock: noop,
    selectedBlockId: null,
    setSelectedBlockId: noop,
    selectedBlockParentId: null,
    setSelectedBlockParentId: noop,
    selectedItemId: null,
    setSelectedItemId: noop,
    selectedItemBlockId: null,
    setSelectedItemBlockId: noop,
    activeTabId: null,
    setActiveTabId: noop,
    selectBlockItem: noop,
    isItemSelected: noopReturnsFalse,
    isReadOnly: true
  }), [noop, noopReturnsFalse]);

  const blockEditingValue = React.useMemo(() => ({
    updateSelectedBlockProps: noop,
    updateSelectedBlockStyle: noop,
    updateSelectedBlockVisibility: noop,
    moveBlockUp: noop,
    moveBlockDown: noop,
    deleteSelectedBlock: noop,
    duplicateSelectedBlock: noop,
    addBlockItem: noopReturnsEmptyString,
    updateBlockItem: noop,
    removeBlockItem: noop,
    moveBlockItemLeft: noop,
    moveBlockItemRight: noop,
    moveBlockItemUp: noop,
    moveBlockItemDown: noop,
    modifyRowColumnCount: noop
  }), [noop, noopReturnsEmptyString]);

  const blockInsertValue = React.useMemo(() => ({
    insertBlockAfter: noop,
    insertBlockBefore: noop,
    insertBlockAtEnd: noop,
    insertBlockInsideSection: noop,
    insertBlockIntoTabs: noop
  }), [noop]);

  const panelValue = React.useMemo(() => ({
    isLibraryOpen: false, openLibrary: noop, closeLibrary: noop, toggleLibrary: noop,
    isLayoutOpen: false, openLayout: noop, closeLayout: noop, toggleLayout: noop,
    isSettingsOpen: false, openSettings: noop, closeSettings: noop, toggleSettings: noop
  }), [noop]);

  return (
    <HistoryContext.Provider value={historyValue}>
      <SelectionContext.Provider value={selectionValue}>
        <BlockEditingContext.Provider value={blockEditingValue}>
            <BlockInsertContext.Provider value={blockInsertValue}>
                <PanelContext.Provider value={panelValue}>
                    {children}
                </PanelContext.Provider>
            </BlockInsertContext.Provider>
        </BlockEditingContext.Provider>
      </SelectionContext.Provider>
    </HistoryContext.Provider>
  );
};
