import { SelectionProvider } from '@context/SelectionContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { LibraryPanelProvider } from '@context/LibraryPanelContext';
import { LayoutPanelProvider } from '@context/LayoutPanelContext';
import { SettingsPanelProvider } from '@context/SettingsPanelContext';
import { PanelCoordinatorProvider } from '@context/PanelCoordinator';
import type { PageSchema } from '@blocks/shared/Page';
import type { ReactNode } from 'react';

interface PageBuilderProvidersProps {
  initialSchema: PageSchema;
  children: ReactNode;
}

export function PageBuilderProviders({ 
  initialSchema, 
  children 
}: PageBuilderProvidersProps) {
  return (
    <HistoryProvider initialSchema={initialSchema}>
      <SelectionProvider>
        <BlockInsertProvider>
          <LibraryPanelProvider>
            <LayoutPanelProvider>
              <SettingsPanelProvider>
                <PanelCoordinatorProvider>
                  {children}
                </PanelCoordinatorProvider>
              </SettingsPanelProvider>
            </LayoutPanelProvider>
          </LibraryPanelProvider>
        </BlockInsertProvider>
      </SelectionProvider>
    </HistoryProvider>
  );
}
