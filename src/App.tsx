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
import { SavePageProvider } from '@context/SavePageContext';
import { useState, useEffect, useCallback } from 'react';
import amazonSchemaData from '@pageSchemas/amazonSchema.json';
import type { PageSchema } from '@blocks/shared/Page';
import { fetchPage } from '@services/api/page';
import Notification from '@components/Notification';

function App() {
  const [showDebug, setShowDebug] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<{
    schema: PageSchema;
    title: string;
    slug: string;
  } | null>(null);

  const loadPageData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchPage("home");
      
      if (response.success && response.data) {
        // Validate the schema structure before using it
        const schema = response.data.schema;
        if (!schema || typeof schema !== 'object') {
          throw new Error('Invalid schema: schema is not an object');
        }
        
        if (!Array.isArray(schema.blocks)) {
          console.warn('Schema blocks is not an array, using empty array as fallback');
          schema.blocks = [];
        }
        
        // Ensure required properties exist
        if (!schema.title) {
          schema.title = response.data.title || 'Untitled Page';
        }
        
        setPageData({
          schema: schema as PageSchema,
          title: response.data.title,
          slug: response.data.slug
        });
      } else {
        throw new Error(response.message || 'Failed to load page data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load page data';
      setError(errorMessage);
      console.error('Error loading page data:', err);
      
      // For a 404-like error, we can fall back to the default schema and show a warning.
      // For other errors, we'll show the full-page error with a retry option.
      if (errorMessage.includes("not found")) {
        // Fallback to default schema on 404 error
        setPageData({
          schema: amazonSchemaData as PageSchema,
          title: 'Flimix Studio',
          slug: 'home'
        });
      }
      // For other errors (5xx, network, etc.), don't set pageData
      // This will trigger the full-page error screen with retry button
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Flimix Studio...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md">
          <h1 className="text-white text-2xl font-bold mb-2">Failed to Load Page</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={loadPageData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show main app with loaded data
  return (
    <PageSchemaProvider>
      <HistoryProvider initialSchema={pageData?.schema || (amazonSchemaData as PageSchema)}>
      <SavePageProvider>
        <SelectionProvider>
          <BlockInsertProvider>
            <LibraryPanelProvider>
              <LayoutPanelProvider>
                <SettingsPanelProvider>
                  <PanelCoordinatorProvider>
                <div className="min-h-screen flex flex-col bg-black relative flimix-studio">
                  <TopBar />
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
                  
                  {/* Show error notification if there was an error but we have fallback data */}
                  {error && pageData && (
                    <Notification
                      type="warning"
                      message={`Using default schema: ${error}`}
                      isVisible={true}
                      onClose={() => setError(null)}
                      duration={5000}
                    />
                  )}
                </div>
                  </PanelCoordinatorProvider>
                </SettingsPanelProvider>
              </LayoutPanelProvider>
            </LibraryPanelProvider>
          </BlockInsertProvider>
        </SelectionProvider>
        </SavePageProvider>
      </HistoryProvider>
    </PageSchemaProvider>
  );
}

export default App;
