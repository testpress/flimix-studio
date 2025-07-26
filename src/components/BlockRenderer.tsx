import React from 'react';
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import type { Block, BlockType } from '../schema/blockTypes';

interface BlockRendererProps {
  block: Block;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block as BlockType} />;
    case 'text':
      return <TextBlock block={block as BlockType} />;
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