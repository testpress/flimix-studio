import React from 'react';
import { Copy, Trash2, MoveUp, MoveDown, Plus } from 'lucide-react';

interface ControlsProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onAddItem?: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onAddItem
}) => {
  return (
    <div className="absolute top-2 right-2 z-50 flex flex-row gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-1">
      {onAddItem && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem();
          }}
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Add Item"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}
      
      {canMoveUp && onMoveUp && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Move Up"
        >
          <MoveUp className="w-3.5 h-3.5" />
        </button>
      )}
      
      {canMoveDown && onMoveDown && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Move Down"
        >
          <MoveDown className="w-3.5 h-3.5" />
        </button>
      )}
      
      {onDuplicate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Duplicate"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
      
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Controls; 