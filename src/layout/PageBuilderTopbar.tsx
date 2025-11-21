import { Undo, Redo, Plus, Eye, Layers, Menu, Save } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import { useLibraryPanel } from '@context/LibraryPanelContext';
import { useLayoutPanel } from '@context/LayoutPanelContext';
import { usePanelCoordinator } from '@context/PanelCoordinator';
import { usePageSchema } from '@context/PageSchemaContext';
import type { PageSchema } from '@blocks/shared/Page';

type PageBuilderTopbarProps = {
  onSavePage?: (pageSlug: string, schema: PageSchema) => Promise<void>;
};

const PageBuilderTopbar = ({ onSavePage }: PageBuilderTopbarProps) => {
  const { undo, canUndo, redo, canRedo, pageSchema } = useHistory();
  const { isLibraryOpen } = useLibraryPanel();
  const { isLayoutOpen } = useLayoutPanel();
  const { toggleLibrarySafely, toggleLayoutSafely } = usePanelCoordinator();
  const { 
    currentPageSlug, 
    loadPage,
    pagesList 
  } = usePageSchema();

  const handleSave = async () => {
    if (onSavePage) {
      try {
        await onSavePage(currentPageSlug, pageSchema);
      } catch (error) {
        console.error('Failed to save page:', error);
      }
    }
  };

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-neutral-900 border-b border-neutral-700">
      <nav className="w-full py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-x-1 sm:gap-x-3">
            {/* Page Switcher - Switch between different pages */}
            <button 
              type="button" 
              className="py-1.5 px-2 sm:px-3 inline-flex items-center gap-x-1.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-2xs hover:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-neutral-900"
            >
              <Menu className="shrink-0 size-3 sm:size-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button 
              type="button"   
              onClick={toggleLibrarySafely} 
              className="py-1.5 px-2 sm:px-3 inline-flex items-center gap-x-1.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-2xs hover:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-neutral-900"
            >
              <Plus className="shrink-0 size-3 sm:size-3.5" />
              <span className="hidden sm:inline">Blocks</span>
            </button>

            <button 
              type="button"   
              onClick={toggleLayoutSafely}
              className="py-1.5 px-2 sm:px-3 inline-flex items-center gap-x-1.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-2xs hover:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-neutral-900"
            >
              <Layers className="shrink-0 size-3 sm:size-3.5" />
              <span className="hidden sm:inline">Layout</span>
            </button>
          </div>
          
          <div className="flex items-center gap-x-1 sm:gap-x-3">
            <button 
              type="button"             
              onClick={undo}
              disabled={!canUndo} 
              className="py-1.5 px-2 sm:px-3 inline-flex items-center gap-x-1.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-2xs hover:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-neutral-900"
            >
              <Undo className="shrink-0 size-3 sm:size-3.5" />
              <span className="hidden md:inline">Undo</span>
            </button>
            
            <button 
              type="button"             
              onClick={redo}
              disabled={!canRedo} 
              className="py-1.5 px-2 sm:px-3 inline-flex items-center gap-x-1.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-2xs hover:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-neutral-900"
            >
              <span className="hidden md:inline">Redo</span>
              <Redo className="shrink-0 size-3 sm:size-3.5" />
            </button>
            
            <div className="hidden sm:block h-6 w-px bg-neutral-900"></div>
            
            <button 
              type="button" 
              onClick={handleSave}
              disabled={!onSavePage} 
              className="py-1.5 px-2 sm:px-3 inline-flex items-center gap-x-1.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-2xs hover:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-neutral-900"
            >
              <Save className="shrink-0 size-3 sm:size-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
            
            <button 
              type="button"  
              className="py-1.5 px-2 sm:px-3 inline-flex items-center gap-x-1.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-2xs hover:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-neutral-900"
            >
              <Eye className="shrink-0 size-3 sm:size-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default PageBuilderTopbar;