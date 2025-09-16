import Canvas from '@layout/Canvas';
import SettingsPanel from '@layout/SettingsPanel';
import TopBar from '@layout/TopBar';
import LibraryPanel from '@layout/LibraryPanel';
import LayoutPanel from '@layout/LayoutPanel';
import { SelectionProvider } from '@context/SelectionContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { LibraryPanelProvider } from '@context/LibraryPanelContext';
import { LayoutPanelProvider } from '@context/LayoutPanelContext';
import { SettingsPanelProvider } from '@context/SettingsPanelContext';
import { PageSchemaProvider } from '@context/PageSchemaContext';
import { PanelCoordinatorProvider } from '@context/PanelCoordinator';
import { useState } from 'react';
import type { PageSchema } from '@blocks/shared/Page';
import amazonSchemaData from '@pageSchemas/amazonSchema.json';

export type AppProps = {
  initialPages?: Record<string, PageSchema>;
  defaultPageSlug?: string;
  onSave?: (pageSlug: string, schema: PageSchema) => void;
};

function App({ initialPages, defaultPageSlug, onSave }: AppProps) {
  const [showDebug, setShowDebug] = useState(false);
  
  // Provide default values if not provided
  const pages = initialPages || {
    'home': amazonSchemaData as PageSchema
  };
  const currentPageSlug = defaultPageSlug || 'home';
  
  // Get the initial schema for HistoryProvider (using the default page)
  const initialSchema = pages[currentPageSlug];

  return (
    <PageSchemaProvider 
      initialPages={pages} 
      defaultPageSlug={currentPageSlug}
    >
      <HistoryProvider initialSchema={initialSchema}>
        <SelectionProvider>
          <BlockInsertProvider>
            <LibraryPanelProvider>
              <LayoutPanelProvider>
                <SettingsPanelProvider>
                  <PanelCoordinatorProvider>
                    <div className="min-h-screen flex flex-col bg-black relative flimix-studio">
                      <TopBar onSave={onSave} />
                      <div className="flex-1 flex min-h-0">
                        <LibraryPanel />
                        <LayoutPanel />
                        <div className="flex-1 min-w-0">
                          <Canvas showDebug={showDebug} />
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
    </PageSchemaProvider>
  );
}

export default App;
