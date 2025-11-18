import React from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface HeaderFooterControlsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  canRemove?: boolean;
}

export const HeaderFooterControls: React.FC<HeaderFooterControlsProps> = ({
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp = true,
  canMoveDown = true,
  canRemove = true,
}) => {
  const handleAction = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  return (
    <div className="flex items-center gap-0.5 bg-gray-900 border border-gray-700 rounded">
      <button 
        title="Move Up"
        onClick={(e) => handleAction(e, onMoveUp)}
        disabled={!onMoveUp || !canMoveUp}
        className="p-1.5 text-gray-400 enabled:hover:text-white disabled:opacity-30"
      >
        <ChevronUp size={14} />
      </button>
      <button 
        title="Move Down"
        onClick={(e) => handleAction(e, onMoveDown)}
        disabled={!onMoveDown || !canMoveDown}
        className="p-1.5 text-gray-400 enabled:hover:text-white disabled:opacity-30"
      >
        <ChevronDown size={14} />
      </button>
      {onRemove && (
        <>
          <div className="w-px h-4 bg-gray-700 mx-0.5" />
          <button 
            title="Remove"
            onClick={(e) => handleAction(e, onRemove)}
            disabled={!canRemove}
            className="p-1.5 text-gray-400 enabled:hover:text-red-400 disabled:opacity-30"
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  );
};

