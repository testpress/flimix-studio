import React from 'react';
import { MoveLeft, MoveRight, Trash2 } from 'lucide-react';

export interface ItemsControlProps {
  index: number;
  count: number;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRemove: () => void;
  className?: string;
  showMoveControls?: boolean;
  showRemoveControl?: boolean;
}

const ItemsControl: React.FC<ItemsControlProps> = ({
  index,
  count,
  onMoveLeft,
  onMoveRight,
  onRemove,
  className = "absolute top-1 right-1 flex space-x-1 bg-white/80 rounded p-1 shadow-sm",
  showMoveControls = true,
  showRemoveControl = true,
}) => (
  <div className={className}>
    {/* Move Controls */}
    {showMoveControls && (
      <>
        {/* Move Left */}
        <button
          onClick={e => { e.stopPropagation(); onMoveLeft(); }}
          disabled={index === 0}
          className="p-1 disabled:opacity-50 hover:bg-gray-100 rounded text-gray-600"
          title="Move Left"
        >
          <MoveLeft size={12} className="text-gray-600" />
        </button>

        {/* Move Right */}
        <button
          onClick={e => { e.stopPropagation(); onMoveRight(); }}
          disabled={index === count - 1}
          className="p-1 disabled:opacity-50 hover:bg-gray-100 rounded text-gray-600"
          title="Move Right"
        >
          <MoveRight size={12} className="text-gray-600" />
        </button>
      </>
    )}

    {/* Remove */}
    {showRemoveControl && (
      <button
        onClick={e => { e.stopPropagation(); onRemove(); }}
        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
        title="Remove Item"
      >
        <Trash2 size={12} className="text-red-600" />
      </button>
    )}
  </div>
);

export default ItemsControl; 