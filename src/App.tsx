import Canvas from '@layout/Canvas';
import SettingsPanel from '@layout/SettingsPanel';
import TopBar from '@layout/TopBar';
import MenuBar from '@layout/MenuBar';
import LibraryPanel from '@layout/LibraryPanel';
import LayoutPanel from '@layout/LayoutPanel';
import { SelectionProvider } from '@context/SelectionContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { LibraryPanelProvider } from '@context/LibraryPanelContext';
import { LayoutPanelProvider } from '@context/LayoutPanelContext';
import { SettingsPanelProvider } from '@context/SettingsPanelContext';
import { PageSchemaProvider } from '@context/PageSchemaContext';
import { MenuSchemaProvider } from '@context/MenuSchemaContext';
import type { MenuSchema } from '@context/MenuSchemaContext';
import { PanelCoordinatorProvider } from '@context/PanelCoordinator';
import { useState } from 'react';
import type { PageSchema } from '@blocks/shared/Page';
import { DEFAULT_MENU_STYLE, DEFAULT_MENU_PROPS } from './constants/theme';
import amazonSchemaData from '@pageSchemas/amazonSchema.json';

export type AppProps = {
  initialPage?: Record<string, PageSchema>;
  defaultPageSlug?: string;
  pagesList?: string[];
  onSave?: (pageSlug: string, schema: PageSchema) => Promise<any>;
  onLoadPage?: (slug: string) => Promise<{ slug: string; schema: PageSchema }>;
  initialMenuSchema?: MenuSchema; 
};

function App({ initialPage, defaultPageSlug, pagesList, onSave, onLoadPage, initialMenuSchema }: AppProps) {
  const [showDebug, setShowDebug] = useState(false);
  
  // Provide default values if not provided
  const pages = initialPage || {
    'home': amazonSchemaData as PageSchema
  };
  const currentPageSlug = defaultPageSlug || 'home';
  
  // Get the initial schema for HistoryProvider (using the default page)
  const initialSchema = pages[currentPageSlug];
  
  // Default menu schema if not provided
  const menuSchema = initialMenuSchema || {
    type: "menu",
    props: {
      ...DEFAULT_MENU_PROPS,
      items: pagesList?.map(slug => ({
        id: `menu-${slug}`,
        label: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug
      })) || [
        { id: "menu-home", label: "Home", slug: "home" }
      ]
    },
    style: DEFAULT_MENU_STYLE
  };

  return (
    <PageSchemaProvider 
      initialPage={pages} 
      pagesList={pagesList}
      defaultPageSlug={currentPageSlug}
      onLoadPage={onLoadPage}
    >
      <HistoryProvider initialSchema={initialSchema}>
        <MenuSchemaProvider initialSchema={menuSchema}>
          <SelectionProvider>
            <BlockInsertProvider>
              <LibraryPanelProvider>
                <LayoutPanelProvider>
                  <SettingsPanelProvider>
                    <PanelCoordinatorProvider>
                      <div className="min-h-screen flex flex-col bg-black relative flimix-studio">
                        <TopBar onSave={onSave} />
                        <MenuBar />
                        <div className="flex-1 flex min-h-0">
                        <LibraryPanel />
                        <LayoutPanel />
                        <div className="flex-1 min-w-0">
                          <Canvas showDebug={showDebug} />
                        </div>
                        <SettingsPanel 
                          showDebug={showDebug}
                          onToggleShowDebug={() => setShowDebug(current => !current)}
                          pagesList={pagesList || []}
                        />
                      </div>
                    </div>
                  </PanelCoordinatorProvider>
                </SettingsPanelProvider>
              </LayoutPanelProvider>
            </LibraryPanelProvider>
          </BlockInsertProvider>
        </SelectionProvider>
        </MenuSchemaProvider>
      </HistoryProvider>
    </PageSchemaProvider>
  );
}

export default App;
