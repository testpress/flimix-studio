import PageBuilderCanvas from '@layout/PageBuilderCanvas';
import SettingsPanel from '@layout/SettingsPanel';
import PageBuilderTopbar from '@layout/PageBuilderTopbar';
import LibraryPanel from '@layout/LibraryPanel';
import LayoutPanel from '@layout/LayoutPanel';
import { PageBuilderProviders } from './PageBuilderProviders';
import { useState } from 'react';
import type { PageSchema } from '@type/page';
import type { BlockType } from '@type/block';
import amazonSchemaData from '@fixtures/amazonSchema.json';
import { contentApi, type ContentSearchParams, type Content, type ContentType } from '@api/content';

export type PageBuilderProps = {
  schema?: PageSchema;
  allowedBlocks?: BlockType['type'][];
  restrictedBlocks?: BlockType['type'][];
  maxBlockCount?: number;
  onSavePage?: (schema: PageSchema) => Promise<void>;
  onSearchContent?: (params: ContentSearchParams, signal?: AbortSignal) => Promise<Content[]>;
  onFetchContentTypes?: (signal?: AbortSignal) => Promise<ContentType[]>;
};

function PageBuilder({ 
  schema, 
  allowedBlocks,
  restrictedBlocks,
  maxBlockCount,
  onSavePage, 
  onSearchContent, 
  onFetchContentTypes 
}: PageBuilderProps) {
  const [showDebug, setShowDebug] = useState(false);
  const initialSchema = schema || (amazonSchemaData as PageSchema);

  if (onSearchContent) {
    contentApi.setSearchCallback(onSearchContent);
  }
  if (onFetchContentTypes) {
    contentApi.setFetchContentTypesCallback(onFetchContentTypes);
  }

  const builderConfig = {
    allowedBlocks,
    restrictedBlocks,
    maxBlockCount,
  };

  return (
    <PageBuilderProviders initialSchema={initialSchema} builderConfig={builderConfig}>
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
