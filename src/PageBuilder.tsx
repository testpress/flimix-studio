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
import { PageSchemaProvider } from '@context/PageSchemaContext';
import { PanelCoordinatorProvider } from '@context/PanelCoordinator';
import { useState } from 'react';
import type { PageSchema } from '@blocks/shared/Page';
import amazonSchemaData from '@fixtures/amazonSchema.json';

export type PageBuilderProps = {
  initialPageSchema?: Record<string, PageSchema>;
  initialPageSlug?: string;
  availablePages?: string[];
  onSavePage?: (pageSlug: string, schema: PageSchema) => Promise<void>;
  onLoadPage?: (slug: string) => Promise<{ slug: string; schema: PageSchema }>;
};

function PageBuilder({ initialPageSchema, initialPageSlug, availablePages, onSavePage, onLoadPage }: PageBuilderProps) {
  const [showDebug, setShowDebug] = useState(false);
  
  // Provide default values if not provided
  const pages = initialPageSchema || {
    'home': amazonSchemaData as PageSchema
  };
  const currentPageSlug = initialPageSlug || 'home';
  
  // Get the initial schema for HistoryProvider (using the default page)
  const initialSchema = pages[currentPageSlug];

  return (
    <PageSchemaProvider 
      initialPage={pages} 
      availablePages={availablePages}
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
    </PageSchemaProvider>
  );
}

export default PageBuilder;
