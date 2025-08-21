import Canvas from '@layout/Canvas';
import SettingsPanel from '@layout/SettingsPanel';
import TopBar from '@layout/TopBar';
import type { PageSchema } from '@blocks/shared/Page';
import LibraryPanel from '@layout/LibraryPanel';
import { SelectionProvider } from '@context/SelectionContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { LibraryPanelProvider } from '@context/LibraryPanelContext';
import { SettingsPanelProvider } from '@context/SettingsPanelContext';
import { useState } from 'react';
import netflixSchemaData from './pageSchemas/netflixSchema.json';
import hotstarSchemaData from './pageSchemas/hotstarSchema.json';

// Use the imported Hotstar schema
const hotstarSchema: PageSchema = hotstarSchemaData as PageSchema;

const netflixSchema: PageSchema = netflixSchemaData as PageSchema;

function App() {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <HistoryProvider initialSchema={netflixSchema}>
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
  );
}

export default App;
