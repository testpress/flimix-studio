import PageBuilderCanvas from '@layout/PageBuilderCanvas';
import SettingsPanel from '@layout/SettingsPanel';
import PageBuilderTopbar from '@layout/PageBuilderTopbar';
import LibraryPanel from '@layout/LibraryPanel';
import LayoutPanel from '@layout/LayoutPanel';
import { PageBuilderProviders } from './PageBuilderProviders';
import { useState, useEffect } from 'react';
import type { PageSchema } from '@blocks/shared/Page';
import amazonSchemaData from '@fixtures/amazonSchema.json';
import { contentApi, type ContentSearchParams, type Content, type ContentType } from '@services/api/content';

export type PageBuilderProps = {
  schema?: PageSchema;
  onSavePage?: (schema: PageSchema) => Promise<void>;
  onSearchContent?: (params: ContentSearchParams, signal?: AbortSignal) => Promise<Content[]>;
  onFetchContentTypes?: () => Promise<ContentType[]>;
};

function PageBuilder({ schema, onSavePage, onSearchContent, onFetchContentTypes }: PageBuilderProps) {
  const [showDebug, setShowDebug] = useState(false);
  const initialSchema = schema || (amazonSchemaData as PageSchema);

  useEffect(() => {
    if (onSearchContent) {
      contentApi.setSearchCallback(onSearchContent);
    }
    if (onFetchContentTypes) {
      contentApi.setFetchContentTypesCallback(onFetchContentTypes);
    }
  }, [onSearchContent, onFetchContentTypes]);

  return (
    <PageBuilderProviders initialSchema={initialSchema}>
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
    </PageBuilderProviders>
  );
}

export default PageBuilder;
