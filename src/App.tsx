import Canvas from '@layout/Canvas';
import SettingsPanel from '@layout/SettingsPanel';
import TopBar from '@layout/TopBar';
import LibraryPanel from '@layout/LibraryPanel';
import { SelectionProvider } from '@context/SelectionContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { LibraryPanelProvider } from '@context/LibraryPanelContext';
import { SettingsPanelProvider } from '@context/SettingsPanelContext';
import { PageSchemaProvider } from '@context/PageSchemaContext';
import { useState } from 'react';
import netflixSchemaData from './pageSchemas/netflixSchema.json';
import type { PageSchema } from '@blocks/shared/Page';

function App() {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <PageSchemaProvider>
      <HistoryProvider initialSchema={netflixSchemaData as PageSchema}>
        <SelectionProvider>
          <BlockInsertProvider>
            <LibraryPanelProvider>
              <SettingsPanelProvider>
                <div className="min-h-screen flex flex-col bg-black">
                  <TopBar />
                  <div className="flex-1 flex pt-16 min-h-0">
                    <LibraryPanel />
                    <div className="flex-1 min-w-0">
                      <Canvas showDebug={showDebug} />
                    </div>
                    <SettingsPanel 
                      showDebug={showDebug}
                      onToggleShowDebug={() => setShowDebug(current => !current)}
                    />
                  </div>
                </div>
              </SettingsPanelProvider>
            </LibraryPanelProvider>
          </BlockInsertProvider>
        </SelectionProvider>
      </HistoryProvider>
    </PageSchemaProvider>
  );
}

export default App;
