import React from 'react';
import BlockManager from '@domain/BlockManager';
import { PagePreviewProviders } from './PagePreviewProviders';
import type { PageSchema } from '@type/page';
import type { Block } from '@type/block';
import type { VisibilityContext } from '@type/visibility';
import { contentApi, type ContentSearchParams, type Content, type ContentType } from '@api/content';

export interface PagePreviewProps {
  schema: PageSchema;
  visibilityContext?: VisibilityContext;
  onSearchContent?: (params: ContentSearchParams, signal?: AbortSignal) => Promise<Content[]>;
  onFetchContentTypes?: (signal?: AbortSignal) => Promise<ContentType[]>;
}

export const PagePreview: React.FC<PagePreviewProps> = ({
  schema,
  visibilityContext = { isLoggedIn: false },
  onSearchContent,
  onFetchContentTypes
}) => {
  if (onSearchContent) {
    contentApi.setSearchCallback(onSearchContent);
  }
  if (onFetchContentTypes) {
    contentApi.setFetchContentTypesCallback(onFetchContentTypes);
  }

  return (
    <PagePreviewProviders initialSchema={schema}>
      <div className="flimix-preview bg-black min-h-screen relative">
        <div className="space-y-0">
            {schema.blocks.map((block: Block) => (
            <div key={block.id} className="relative transition-opacity duration-500 ease-in-out">
                <BlockManager
                    block={block}
                    visibilityContext={visibilityContext}
                    showDebug={false}
                />
            </div>
            ))}
        </div>
      </div>
    </PagePreviewProviders>
  );
};

export default PagePreview;
