import PageBuilderCanvas from '@layout/PageBuilderCanvas';
import SettingsPanel from '@layout/SettingsPanel';
import PageBuilderTopbar from '@layout/PageBuilderTopbar';
import LibraryPanel from '@layout/LibraryPanel';
import LayoutPanel from '@layout/LayoutPanel';
import { SelectionProvider } from '@context/SelectionContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { LibraryPanelProvider } from '@context/LibraryPanelContext';
import { LayoutPanelProvider } from '@context/LayoutPanelContext';
import { SettingsPanelProvider } from '@context/SettingsPanelContext';
import { PanelCoordinatorProvider } from '@context/PanelCoordinator';
import { useState } from 'react';
import type { PageSchema } from '@blocks/shared/Page';
import amazonSchemaData from '@fixtures/amazonSchema.json';

export type PageBuilderProps = {
  schema?: PageSchema;
  onSavePage?: (schema: PageSchema) => Promise<void>;
};

function PageBuilder({ schema, onSavePage }: PageBuilderProps) {
  const [showDebug, setShowDebug] = useState(false);
  const initialSchema = schema || (amazonSchemaData as PageSchema);

  return (
    <HistoryProvider initialSchema={initialSchema}>
      <SelectionProvider>
        <BlockInsertProvider>
          <LibraryPanelProvider>
            <LayoutPanelProvider>
              <SettingsPanelProvider>
                <PanelCoordinatorProvider>
                  <div className="min-h-screen flex flex-col bg-black relative flimix-studio">
                    <PageBuilderTopbar onSavePage={onSavePage} />
                    <div className="flex-1 flex min-h-0">
                      <LibraryPanel />
                      <LayoutPanel />
                      <div className="flex-1 min-w-0">
                        <PageBuilderCanvas showDebug={showDebug} />
                      </div>
                      <SettingsPanel 
                        showDebug={showDebug}
                        onToggleShowDebug={() => setShowDebug(current => !current)}
                      />
                    </div>
                  </div>
                </PanelCoordinatorProvider>
              </SettingsPanelProvider>
            </LayoutPanelProvider>
          </LibraryPanelProvider>
        </BlockInsertProvider>
      </SelectionProvider>
    </HistoryProvider>
  );
}

export default PageBuilder;
