import { SelectionProvider } from '@context/SelectionContext';
import { BlockEditingProvider } from '@context/BlockEditingContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { PanelProvider } from '@context/PanelContext';
import type { PageSchema } from '@type/page';
import type { ReactNode } from 'react';

interface PageBuilderProvidersProps {
  initialSchema: PageSchema;
  children: ReactNode;
}

export function PageBuilderProviders({ 
  initialSchema, 
  children 
}: PageBuilderProvidersProps) {
  return (
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
  );
}
