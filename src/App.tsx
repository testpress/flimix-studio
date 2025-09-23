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
import defaultMenuSchema from '@pageSchemas/defaultMenuSchema.json';
import { MenuSchemaProvider, useMenuSchema, type MenuInitialData } from '@context/MenuSchemaContext';
import MenuRenderer from '@renderer/MenuRenderer';

export type AppProps = {
  initialPage?: Record<string, PageSchema>;
  defaultPageSlug?: string;
  pagesList?: string[];
  initialMenu?: MenuInitialData;
  menuSlug?: string;
  defaultLocation?: string;
  onSave?: (pageSlug: string, schema: PageSchema) => Promise<any>;
  onLoadPage?: (slug: string) => Promise<{ slug: string; schema: PageSchema }>;
};

function App({ initialPage, defaultPageSlug, pagesList, initialMenu, menuSlug, defaultLocation, onSave, onLoadPage }: AppProps) {
  const [showDebug, setShowDebug] = useState(false);
  
  // Provide default values if not provided
  const pages = initialPage || {
    'home': amazonSchemaData as PageSchema
  };
  const currentPageSlug = defaultPageSlug || 'home';
  const menus = initialMenu || (defaultMenuSchema as MenuInitialData);
  const menuLocation = defaultLocation || 'header';
  
  // Get the initial schema for HistoryProvider (using the default page)
  const initialSchema = pages[currentPageSlug];

  return (
    <MenuSchemaProvider 
      initialMenu={menus}
      menuSlug={menuSlug}
      defaultLocation={menuLocation}
    >
      <PageSchemaProvider 
        initialPage={pages} 
        pagesList={pagesList}
        defaultPageSlug={currentPageSlug}
        onLoadPage={onLoadPage}
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
                        
                        {/* Header menu - directly below TopBar */}
                        <MenuRenderer 
                          location="header" 
                        />
                        
                        {/* Secondary header menu - below main header */}
                        <MenuRenderer 
                          location="secondary-header" 
                        />
                        
                        {/* Sidebar menu - floating on the left side */}
                        <MenuRenderer 
                          location="sidebar" 
                        />
                        
                        {/* Main content with conditional margin */}
                        <MainContentWrapper>
                          <LibraryPanel />
                          <LayoutPanel />
                          <div className="flex-1 min-w-0">
                            <Canvas showDebug={showDebug} />
                          </div>
                          <SettingsPanel 
                            showDebug={showDebug}
                            onToggleShowDebug={() => setShowDebug(current => !current)}
                          />
                        </MainContentWrapper>
                        
                        {/* Footer menu - at bottom */}
                        <MenuRenderer 
                          location="footer" 
                        />
                        
                        {/* Secondary footer menu - below main footer */}
                        <MenuRenderer 
                          location="secondary-footer" 
                        />
                      </div>
                    </PanelCoordinatorProvider>
                  </SettingsPanelProvider>
                </LayoutPanelProvider>
              </LibraryPanelProvider>
            </BlockInsertProvider>
          </SelectionProvider>
        </HistoryProvider>
      </PageSchemaProvider>
    </MenuSchemaProvider>
  );
}

// Simple wrapper that checks sidebar and applies margin
const MainContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { menus } = useMenuSchema();
  const hasSidebar = menus['sidebar']?.props?.enabled;
  
  return (
    <div className={`flex-1 flex min-h-0 ${hasSidebar ? 'lg:ml-24' : ''}`}>
      {children}
    </div>
  );
}

export default App;
