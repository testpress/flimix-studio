import React from 'react';
import { Undo, Redo, Plus, X, SlidersHorizontal } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';
import { useLibraryPanel } from '@context/LibraryPanelContext';
import { useSettingsPanel } from '@context/SettingsPanelContext';
import { useSelection } from '@context/SelectionContext';

const TopBar: React.FC = () => {
  const { undo, canUndo, redo, canRedo } = useHistory();
  const { isLibraryOpen, toggleLibrary } = useLibraryPanel();
  const { isSettingsOpen, toggleSettings } = useSettingsPanel();
  const { setSelectedBlock, setSelectedBlockId, setSelectedItemId, setSelectedItemBlockId } = useSelection();

  const handleSettingsToggle = () => {
    if (isSettingsOpen) {
      setSelectedBlock(null);
      setSelectedBlockId(null);
      setSelectedItemId(null);
      setSelectedItemBlockId(null);
    }
    toggleSettings();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">Flimix Studio</h1>
          <button 
            onClick={toggleLibrary}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
            title={isLibraryOpen ? "Close block library" : "Open block library"}
          >
            {isLibraryOpen ? <X size={16} /> : <Plus size={16} />}
          </button>
          <button 
            onClick={handleSettingsToggle}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-200"
            title={isSettingsOpen ? "Close settings" : "Open settings"}
          >
            {isSettingsOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
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