import React from 'react';
import HeroWidget from '@blocks/hero/widget';
import TextWidget from '@blocks/text/widget';
import SectionWidget from '@blocks/section/widget';
import type { Block, HeroBlock as HeroBlockType, TextBlock as TextBlockType, SectionBlock as SectionBlockType } from '@schema/blockTypes';
import type { VisibilityContext } from '@schema/blockVisibility';
import { evaluateVisibility } from '@utils/visibility';
import { useSelection } from '@context/SelectionContext';
import { findBlockPositionForUI } from '@utils/blockUtils';
import { AlertTriangle } from 'lucide-react';

interface WidgetRendererProps {
  block: Block;
  showDebug?: boolean;
  visibilityContext: VisibilityContext;
  onSelect?: (block: Block) => void;
  isSelected?: boolean;
  selectedBlockId?: string | null;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ 
  block, 
  showDebug = false, 
  visibilityContext, 
  onSelect, 
  isSelected = false,
  selectedBlockId
}) => {
  const { 
    moveBlockUp, 
    moveBlockDown, 
    duplicateSelectedBlock, 
    deleteSelectedBlock,
    pageSchema 
  } = useSelection();

  // Get position information for the current block
  const position = findBlockPositionForUI(block.id, pageSchema.blocks);
  const canMoveUp = position && position.index > 0;
  const canMoveDown = position && position.index < position.totalSiblings - 1;

  // Block control handlers
  const handleMoveUp = () => {
    moveBlockUp();
  };

  const handleMoveDown = () => {
    moveBlockDown();
  };

  const handleDuplicate = () => {
    duplicateSelectedBlock();
  };

  const handleRemove = () => {
    deleteSelectedBlock();
  };

  // Evaluate visibility before rendering
  if (!evaluateVisibility(block.visibility, visibilityContext)) {
    if (showDebug) {
      return (
        <div className="p-4 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>
              Block <code className="font-mono bg-yellow-100 px-1 rounded">{block.type}</code> 
              (ID: <code className="font-mono bg-yellow-100 px-1 rounded">{block.id}</code>) 
              skipped due to visibility rules.
            </span>
          </div>
          {block.visibility && (
            <div className="mt-2 text-xs">
              <strong>Visibility rules:</strong>
              <ul className="mt-1 space-y-1">
                {block.visibility.isLoggedIn !== undefined && (
                  <li>• isLoggedIn: {block.visibility.isLoggedIn.toString()}</li>
                )}
                {block.visibility.isSubscribed !== undefined && (
                  <li>• isSubscribed: {block.visibility.isSubscribed.toString()}</li>
                )}
                {block.visibility.subscriptionTier && (
                  <li>• subscriptionTier: {block.visibility.subscriptionTier}</li>
                )}
                {block.visibility.region && (
                  <li>• region: {block.visibility.region.join(', ')}</li>
                )}
                {block.visibility.platform && (
                  <li>• platform: {block.visibility.platform.join(', ')}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }

  const widgetControlProps = {
    canMoveUp,
    canMoveDown,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
    onDuplicate: handleDuplicate,
    onRemove: handleRemove
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return <HeroWidget block={block as HeroBlockType} onSelect={onSelect} isSelected={isSelected} {...widgetControlProps} />;
      case 'text':
        return <TextWidget block={block as TextBlockType} onSelect={onSelect} isSelected={isSelected} {...widgetControlProps} />;
      case 'section':
        // Pass renderContext and showDebug to SectionWidget via a custom prop
        return <SectionWidget block={block as SectionBlockType} visibilityContext={visibilityContext} showDebug={showDebug} onSelect={onSelect} isSelected={isSelected} selectedBlockId={selectedBlockId} {...widgetControlProps} />;
      default:
        return (
          <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">Unknown block type: {block.type}</p>
            <p className="text-red-500 text-sm mt-1">Block ID: {block.id}</p>
          </div>
        );
    }
  };

  return (
    <div>
      {renderBlock()}
    </div>
  );
};

export default WidgetRenderer; 