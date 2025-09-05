import React from 'react';
import { Undo, Redo, Plus, X, ChevronDown, Layers, Save, Loader2, FileText, Globe } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import { useLibraryPanel } from '@context/LibraryPanelContext';
import { useLayoutPanel } from '@context/LayoutPanelContext';
import { usePanelCoordinator } from '@context/PanelCoordinator';
import { usePageSchema, availablePageSchemas, type PageSchemaKey } from '@context/PageSchemaContext';
import { useOnClickOutside } from '@hooks/useOnClickOutside';
import Notification, { type NotificationType } from '@components/Notification';
import { useSavePage } from '@context/SavePageContext';

const TopBar: React.FC = () => {
  const { undo, canUndo, redo, canRedo, updatePageSchema } = useHistory();
  const { isLibraryOpen } = useLibraryPanel();
  const { isLayoutOpen } = useLayoutPanel();
  const { toggleLibrarySafely, toggleLayoutSafely } = usePanelCoordinator();
  const { currentPageSchemaKey, setCurrentPageSchemaKey } = usePageSchema();
  const { isSaving, savePage, lastError, lastSuccess } = useSavePage();
  
  const [isPageSchemaDropdownOpen, setIsPageSchemaDropdownOpen] = React.useState(false);
  const [isSaveDropdownOpen, setIsSaveDropdownOpen] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    type: NotificationType;
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false
  });
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const saveDropdownRef = React.useRef<HTMLDivElement>(null);
  
  useOnClickOutside(dropdownRef, () => setIsPageSchemaDropdownOpen(false));
  useOnClickOutside(saveDropdownRef, () => setIsSaveDropdownOpen(false));
  
  const handlePageSchemaChange = (pageSchemaKey: PageSchemaKey) => {
    // This logic is moved from the hook - orchestrating both contexts
    const newPageSchema = availablePageSchemas[pageSchemaKey].pageSchema;
    setCurrentPageSchemaKey(pageSchemaKey);
    updatePageSchema(newPageSchema);
    setIsPageSchemaDropdownOpen(false);
  };

  const handleSave = async (status: number = 1) => {
    try {
      await savePage(undefined, undefined, status);
      setNotification({
        type: 'success',
        message: lastSuccess || 'Page saved successfully!',
        isVisible: true
      });
      setIsSaveDropdownOpen(false);
    } catch (error) {
      setNotification({
        type: 'error',
        message: lastError || 'Failed to save page. Please try again.',
        isVisible: true
      });
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (!isSaving) {
          handleSave(1); // Default to draft
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSaving]);

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
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
          {/* Save Dropdown */}
          <div className="relative" ref={saveDropdownRef}>
            <button 
              onClick={() => setIsSaveDropdownOpen(!isSaveDropdownOpen)}
              disabled={isSaving}
              className={`px-4 py-2 rounded flex items-center space-x-2 transition-colors ${
                isSaving 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              title={isSaving ? 'Saving...' : 'Save page (Ctrl+S / Cmd+S)'}
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
              <ChevronDown size={16} className={`transition-transform ${isSaveDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSaveDropdownOpen && !isSaving && (
              <div className="absolute top-full right-0 mt-1 bg-gray-700 rounded shadow-lg w-48 z-50">
                <button
                  onClick={() => handleSave(1)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
                >
                  <FileText size={16} />
                  <span>Save as Draft</span>
                </button>
                <button
                  onClick={() => handleSave(2)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center space-x-2"
                >
                  <Globe size={16} />
                  <span>Publish</span>
                </button>
              </div>
            )}
          </div>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
            Preview
          </button>
        </div>
      </div>
      
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
};

export default TopBar; 