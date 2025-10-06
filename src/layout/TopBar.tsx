import { Undo, Redo, Plus, X, Layers } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import { useLibraryPanel } from '@context/LibraryPanelContext';
import { useLayoutPanel } from '@context/LayoutPanelContext';
import { usePanelCoordinator } from '@context/PanelCoordinator';
import { usePageSchema } from '@context/PageSchemaContext';
import type { PageSchema } from '@blocks/shared/Page';

type TopBarProps = {
  onSavePage?: (pageSlug: string, schema: PageSchema) => Promise<void>;
};

const TopBar = ({ onSavePage }: TopBarProps) => {
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
    <div className="sticky top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Page Switcher - Switch between different pages */}
          <div className="relative">
            <select
              value={currentPageSlug}
              onChange={e => loadPage(e.target.value)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-white text-sm"
            >
              {pagesList.map(slug => (
                <option key={slug} value={slug} className="bg-gray-700 text-white">
                  {slug.charAt(0).toUpperCase() + slug.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={toggleLibrarySafely}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
            title={isLibraryOpen ? "Close block library" : "Open block library"}
          >
            {isLibraryOpen ? <X size={16} /> : <Plus size={16} />}
          </button>
          
          <button 
            onClick={toggleLayoutSafely}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
            title={isLayoutOpen ? "Close layout panel" : "Open layout panel"}
          >
            <Layers size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={undo}
            disabled={!canUndo}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              canUndo 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            title={canUndo ? 'Undo last action' : 'Nothing to undo'}
          >
            <Undo className="w-4 h-4" />
            <span>Undo</span>
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              canRedo 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            title={canRedo ? 'Redo last undone action' : 'Nothing to redo'}
          >
            <span>Redo</span>
            <Redo className="w-4 h-4" />
          </button>
          <button 
            onClick={handleSave}
            disabled={!onSavePage}
            className={`px-4 py-2 rounded ${
              onSavePage 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
            title={onSavePage ? 'Save page' : 'Save functionality not available'}
          >
            Save
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 