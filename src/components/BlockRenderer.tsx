import React from 'react';
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import SectionBlock from './blocks/SectionBlock';
import type { Block, HeroBlock as HeroBlockType, TextBlock as TextBlockType, SectionBlock as SectionBlockType } from '../schema/blockTypes';
import type { RenderContext } from '../types/RenderContext';
import { evaluateVisibility } from '../utils/visibility';

// Mock render context for testing visibility rules
const renderContext: RenderContext = {
  isLoggedIn: true,
  isSubscribed: false,
  subscriptionTier: 'basic',
  region: 'IN',
  platform: 'mobile',
};

interface BlockRendererProps {
  block: Block;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  // Evaluate visibility before rendering
  if (!evaluateVisibility(block.visibility, renderContext)) {
    return null; // Skip rendering if not visible
  }

  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block as HeroBlockType} />;
    case 'text':
      return <TextBlock block={block as TextBlockType} />;
    case 'section':
      return <SectionBlock block={block as SectionBlockType} />;
    default:
      return (
        <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">Unknown block type: {block.type}</p>
          <p className="text-red-500 text-sm mt-1">Block ID: {block.id}</p>
        </div>
      );
  }
};

export default BlockRenderer; 