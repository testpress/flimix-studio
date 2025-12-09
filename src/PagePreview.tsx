import React from 'react';
import BlockManager from '@domain/BlockManager';
import { PagePreviewProviders } from './PagePreviewProviders';
import type { PageSchema } from '@blocks/shared/Page';
import type { Block } from '@blocks/shared/Block';
import type { VisibilityContext } from '@blocks/shared/Visibility';

export interface PagePreviewProps {
  schema: PageSchema;
  visibilityContext?: VisibilityContext;
}

export const PagePreview: React.FC<PagePreviewProps> = ({
  schema,
  visibilityContext = { isLoggedIn: false } 
}) => {
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
