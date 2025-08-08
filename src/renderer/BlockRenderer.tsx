import React from 'react';
import HeroWidget from '@blocks/hero/widget';
import TextWidget from '@blocks/text/widget';
import SectionWidget from '@blocks/section/widget';
import PosterGridWidget from '@blocks/poster-grid/widget';
import CarouselWidget from '@blocks/carousel/widget';
import SpacerWidget from '@blocks/spacer/widget';
import type { Block } from '@blocks/shared/Block';
import type { HeroBlock } from '@blocks/hero/schema';
import type { TextBlock } from '@blocks/text/schema';
import type { SectionBlock } from '@blocks/section/schema';
import type { PosterGridBlock } from '@blocks/poster-grid/schema';
import type { CarouselBlock } from '@blocks/carousel/schema';
import type { SpacerBlock } from '@blocks/spacer/schema';
import type { VisibilityContext, VisibilityProps, Platform } from '@blocks/shared/Visibility';
import { useSelection } from '@context/SelectionContext';
import { findBlockPositionForUI } from '@context/domain';
import { AlertTriangle } from 'lucide-react';

/**
 * Evaluate if a block should be visible based on visibility rules and context
 * @param visibility - The visibility rules for the block
 * @param context - The current visibility context
 * @returns true if the block should be visible, false otherwise
 */
function evaluateVisibility(
  visibility?: VisibilityProps,
  context?: VisibilityContext
): boolean {
  if (!visibility) return true;
  if (!context) return false;

  if (
    visibility.isLoggedIn !== undefined &&
    visibility.isLoggedIn !== context.isLoggedIn
  )
    return false;

  if (
    visibility.isSubscribed !== undefined &&
    visibility.isSubscribed !== context.isSubscribed
  )
    return false;

  if (
    visibility.subscriptionTier &&
    context.subscriptionTier && // Only check if context has a specific tier
    visibility.subscriptionTier !== context.subscriptionTier
  )
    return false;

  if (
    visibility.region &&
    context.region && // Only check if context has a specific region
    !visibility.region.includes(context.region)
  )
    return false;

  if (
    visibility.platform &&
    context.platform && // Only check if context has a specific platform
    !visibility.platform.includes(context.platform as Platform)
  )
    return false;

  return true;
}

interface BlockRendererProps {
  block: Block;
  showDebug?: boolean;
  visibilityContext: VisibilityContext;
  onSelect?: (block: Block) => void;
  isSelected?: boolean;
  selectedBlockId?: string | null;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ 
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
        return <HeroWidget block={block as HeroBlock} onSelect={(heroBlock) => onSelect?.(heroBlock as Block)} isSelected={isSelected} {...widgetControlProps} />;
      case 'text':
        return <TextWidget block={block as TextBlock} onSelect={(textBlock) => onSelect?.(textBlock as Block)} isSelected={isSelected} {...widgetControlProps} />;
      case 'section':
        // Pass renderContext and showDebug to SectionWidget via a custom prop
        return <SectionWidget block={block as SectionBlock} visibilityContext={visibilityContext} showDebug={showDebug} onSelect={(sectionBlock) => onSelect?.(sectionBlock as Block)} isSelected={isSelected} selectedBlockId={selectedBlockId} {...widgetControlProps} />;
      case 'posterGrid':
        return <PosterGridWidget block={block as PosterGridBlock} onSelect={(posterGridBlock) => onSelect?.(posterGridBlock as Block)} isSelected={isSelected} {...widgetControlProps} />;
      case 'carousel':
        return <CarouselWidget block={block as CarouselBlock} onSelect={(carouselBlock) => onSelect?.(carouselBlock as Block)} isSelected={isSelected} {...widgetControlProps} />;
      case 'spacer':
        return <SpacerWidget block={block as SpacerBlock} onSelect={(spacerBlock) => onSelect?.(spacerBlock as Block)} isSelected={isSelected} {...widgetControlProps} />;
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

export default BlockRenderer; 