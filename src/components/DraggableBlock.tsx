import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BlockRenderer from './BlockRenderer';
import type { Block } from '../schema/blockTypes';
import type { RenderContext } from '../types/RenderContext';

interface DraggableBlockProps {
  block: Block;
  showDebug: boolean;
  renderContext: RenderContext;
  onSelect: (block: Block) => void;
  isSelected: boolean;
  selectedBlockId: string | null;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  showDebug,
  renderContext,
  onSelect,
  isSelected,
  selectedBlockId
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-move ${isDragging ? 'z-50' : ''}`}
    >
      <BlockRenderer
        block={block}
        showDebug={showDebug}
        renderContext={renderContext}
        onSelect={onSelect}
        isSelected={isSelected}
        selectedBlockId={selectedBlockId}
      />
    </div>
  );
};

export default DraggableBlock; 