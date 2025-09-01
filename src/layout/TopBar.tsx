import React from 'react';
import { Undo, Redo, Plus, X, ChevronDown,Layers } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import { useLibraryPanel } from '@context/LibraryPanelContext';
import { useLayoutPanel } from '@context/LayoutPanelContext';
import { usePanelCoordinator } from '@context/PanelCoordinator';
import { usePageSchema, availablePageSchemas, type PageSchemaKey } from '@context/PageSchemaContext';
import { useOnClickOutside } from '@hooks/useOnClickOutside';

const TopBar: React.FC = () => {
  const { undo, canUndo, redo, canRedo, updatePageSchema } = useHistory();
  const { isLibraryOpen, toggleLibrary } = useLibraryPanel();
  const { isLayoutOpen, toggleLayout } = useLayoutPanel();
  const { openLibrarySafely, openLayoutSafely } = usePanelCoordinator();
  const { currentPageSchemaKey, setCurrentPageSchemaKey } = usePageSchema();
  
  const [isPageSchemaDropdownOpen, setIsPageSchemaDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  useOnClickOutside(dropdownRef, () => setIsPageSchemaDropdownOpen(false));
  
  const handlePageSchemaChange = (pageSchemaKey: PageSchemaKey) => {
    // This logic is moved from the hook - orchestrating both contexts
    const newPageSchema = availablePageSchemas[pageSchemaKey].pageSchema;
    setCurrentPageSchemaKey(pageSchemaKey);
    updatePageSchema(newPageSchema);
    setIsPageSchemaDropdownOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">Flimix Studio</h1>
          
          {/* Page Schema Selector - Choose between Netflix and Hotstar page layouts */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsPageSchemaDropdownOpen(!isPageSchemaDropdownOpen)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center space-x-2"
            >
              <span>{availablePageSchemas[currentPageSchemaKey].name}</span>
              <ChevronDown size={16} className={`transition-transform ${isPageSchemaDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isPageSchemaDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded shadow-lg w-48 z-50">
                {Object.entries(availablePageSchemas).map(([key, { name }]) => (
                  <button
                    key={key}
                    onClick={() => handlePageSchemaChange(key as PageSchemaKey)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-600 ${
                      currentPageSchemaKey === key ? 'bg-blue-600' : ''
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={isLibraryOpen ? toggleLibrary : openLibrarySafely}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
            title={isLibraryOpen ? "Close block library" : "Open block library"}
          >
            {isLibraryOpen ? <X size={16} /> : <Plus size={16} />}
          </button>
          
          <button 
            onClick={isLayoutOpen ? toggleLayout : openLayoutSafely}
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
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
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