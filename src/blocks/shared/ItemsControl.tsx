import React from 'react';
import { MoveLeft, MoveRight, MoveUp, MoveDown, Trash2 } from 'lucide-react';

export interface ItemsControlProps {
  index: number;
  count: number;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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
  onMoveUp,
  onMoveDown,
  onRemove,
  className = "absolute top-1 right-1 flex space-x-1 bg-white/80 rounded p-1 shadow-sm",
  showMoveControls = true,
  showRemoveControl = true,
}) => {
  // Determine which move controls to show based on provided functions
  const hasHorizontalMoves = onMoveLeft || onMoveRight;
  const hasVerticalMoves = onMoveUp || onMoveDown;

  return (
    <div className={className}>
      {/* Move Controls */}
      {showMoveControls && (
        <>
          {/* Horizontal Movement Controls */}
          {hasHorizontalMoves && (
            <>
              {/* Move Left */}
              {onMoveLeft && (
                <button
                  onClick={e => { e.stopPropagation(); onMoveLeft(); }}
                  disabled={index === 0}
                  className="p-1 disabled:opacity-50 hover:bg-neutral-100 rounded text-neutral-600"
                  title="Move Left"
                >
                  <MoveLeft size={12} className="text-neutral-600" />
                </button>
              )}

              {/* Move Right */}
              {onMoveRight && (
                <button
                  onClick={e => { e.stopPropagation(); onMoveRight(); }}
                  disabled={index === count - 1}
                  className="p-1 disabled:opacity-50 hover:bg-neutral-100 rounded text-neutral-600"
                  title="Move Right"
                >
                  <MoveRight size={12} className="text-neutral-600" />
                </button>
              )}
            </>
          )}

          {/* Vertical Movement Controls */}
          {hasVerticalMoves && (
            <>
              {/* Move Up */}
              {onMoveUp && (
                <button
                  onClick={e => { e.stopPropagation(); onMoveUp(); }}
                  disabled={index === 0}
                  className="p-1 disabled:opacity-50 hover:bg-neutral-100 rounded text-neutral-600"
                  title="Move Up"
                >
                  <MoveUp size={12} className="text-neutral-600" />
                </button>
              )}

              {/* Move Down */}
              {onMoveDown && (
                <button
                  onClick={e => { e.stopPropagation(); onMoveDown(); }}
                  disabled={index === count - 1}
                  className="p-1 disabled:opacity-50 hover:bg-neutral-100 rounded text-neutral-600"
                  title="Move Down"
                >
                  <MoveDown size={12} className="text-neutral-600" />
                </button>
              )}
            </>
          )}
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
};

export default ItemsControl; 