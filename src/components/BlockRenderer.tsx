import React from 'react';
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';

interface BlockProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaButton?: {
    label: string;
    link: string;
  };
  content?: string;
}

interface BlockStyle {
  theme?: string;
  padding?: string;
  textColor?: string;
}

interface Block {
  type: string;
  id: string;
  props: BlockProps;
  style?: BlockStyle;
}

interface BlockRendererProps {
  block: Block;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'hero':
      return <HeroBlock props={block.props} style={block.style} />;
    case 'text':
      return <TextBlock props={block.props} style={block.style} />;
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