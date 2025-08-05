import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { useHistory } from '@context/HistoryContext';

const TopBar: React.FC = () => {
  const { undo, canUndo, redo, canRedo } = useHistory();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Flimix Studio</h1>
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