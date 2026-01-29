import { SelectionProvider } from '@context/SelectionContext';
import { BlockEditingProvider } from '@context/BlockEditingContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { PanelProvider } from '@context/PanelContext';
import { BuilderConfigProvider } from '@context/BuilderConfigContext';
import type { PageSchema } from '@type/page';
import type { BlockType } from '@type/block';
import type { ReactNode } from 'react';

interface BuilderConfig {
  allowedBlocks?: BlockType['type'][];
  restrictedBlocks?: BlockType['type'][];
  maxBlockCount?: number;
}

interface PageBuilderProvidersProps {
  initialSchema: PageSchema;
  builderConfig?: BuilderConfig;
  children: ReactNode;
}

export function PageBuilderProviders({ 
  initialSchema,
  builderConfig,
  children 
}: PageBuilderProvidersProps) {
  return (
    <BuilderConfigProvider config={builderConfig}>
      <HistoryProvider initialSchema={initialSchema}>
        <SelectionProvider>
          <BlockEditingProvider>
            <BlockInsertProvider>
              <PanelProvider>
                {children}
              </PanelProvider>
            </BlockInsertProvider>
          </BlockEditingProvider>
        </SelectionProvider>
      </HistoryProvider>
    </BuilderConfigProvider>
  );
}
