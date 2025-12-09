import React, { type ReactNode } from 'react';
import { SelectionContext } from '@context/SelectionContext';
import { BlockEditingContext } from '@context/BlockEditingContext';
import { HistoryContext } from '@context/HistoryContext';
import { BlockInsertContext } from '@context/BlockInsertContext';
import { PanelContext } from '@context/PanelContext';
import type { PageSchema } from '@blocks/shared/Page';


export const PagePreviewProviders: React.FC<{
  initialSchema: PageSchema;
  children: ReactNode;
}> = ({ initialSchema, children }) => {
  // No-op function
  const noop = () => {};

  return (
    <HistoryContext.Provider value={{
      pageSchema: initialSchema,
      updatePageWithHistory: noop,
      undo: noop,
      canUndo: false,
      redo: noop,
      canRedo: false,
      recordState: noop
    }}>
      <SelectionContext.Provider value={{
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
        isItemSelected: () => false,
        isReadOnly: true
      }}>
        <BlockEditingContext.Provider value={{
          updateSelectedBlockProps: noop,
          updateSelectedBlockStyle: noop,
          updateSelectedBlockVisibility: noop,
          moveBlockUp: noop,
          moveBlockDown: noop,
          deleteSelectedBlock: noop,
          duplicateSelectedBlock: noop,
          addBlockItem: () => '',
          updateBlockItem: noop,
          removeBlockItem: noop,
          moveBlockItemLeft: noop,
          moveBlockItemRight: noop,
          moveBlockItemUp: noop,
          moveBlockItemDown: noop,
          modifyRowColumnCount: noop
        }}>
            <BlockInsertContext.Provider value={{
                insertBlockAfter: noop,
                insertBlockBefore: noop,
                insertBlockAtEnd: noop,
                insertBlockInsideSection: noop,
                insertBlockIntoTabs: noop
            }}>
                <PanelContext.Provider value={{
                    isLibraryOpen: false, openLibrary: noop, closeLibrary: noop, toggleLibrary: noop,
                    isLayoutOpen: false, openLayout: noop, closeLayout: noop, toggleLayout: noop,
                    isSettingsOpen: false, openSettings: noop, closeSettings: noop, toggleSettings: noop
                }}>
                    {children}
                </PanelContext.Provider>
            </BlockInsertContext.Provider>
        </BlockEditingContext.Provider>
      </SelectionContext.Provider>
    </HistoryContext.Provider>
  );
};
