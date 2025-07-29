import React from 'react';
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import SectionBlock from './blocks/SectionBlock';
import BlockMoveButtons from './BlockMoveButtons';
import type { Block, HeroBlock as HeroBlockType, TextBlock as TextBlockType, SectionBlock as SectionBlockType } from '../schema/blockTypes';
import type { RenderContext } from '../types/RenderContext';
import { evaluateVisibility } from '../utils/visibility';

interface BlockRendererProps {
  block: Block;
  showDebug?: boolean;
  renderContext: RenderContext;
  onSelect?: (block: Block) => void;
  isSelected?: boolean;
  selectedBlockId?: string | null;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  showDebug = false, 
  renderContext, 
  onSelect, 
  isSelected = false,
  selectedBlockId
}) => {
  // Evaluate visibility before rendering
  if (!evaluateVisibility(block.visibility, renderContext)) {
    if (showDebug) {
      return (
        <div className="p-4 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          ⚠️ Block <code className="font-mono bg-yellow-100 px-1 rounded">{block.type}</code> 
          (ID: <code className="font-mono bg-yellow-100 px-1 rounded">{block.id}</code>) 
          skipped due to visibility rules.
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

  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlock block={block as HeroBlockType} onSelect={onSelect} isSelected={isSelected} />;
      case 'text':
        return <TextBlock block={block as TextBlockType} onSelect={onSelect} isSelected={isSelected} />;
      case 'section':
        // Pass renderContext and showDebug to SectionBlock via a custom prop
        return <SectionBlock block={block as SectionBlockType} renderContext={renderContext} showDebug={showDebug} onSelect={onSelect} isSelected={isSelected} selectedBlockId={selectedBlockId} />;
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
    <div className="relative">
      {renderBlock()}
      <BlockMoveButtons blockId={block.id} />
    </div>
  );
};

export default BlockRenderer; 