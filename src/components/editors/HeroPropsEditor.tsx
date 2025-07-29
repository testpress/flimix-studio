import React from 'react';
import type { BlockEditorProps } from './types';
import DynamicPropsEditor from './DynamicPropsEditor';
import { heroEditorFields } from './schemas';

const HeroPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsEditor
      block={block}
      schema={heroEditorFields}
      updateProps={updateProps}
    />
  );
};

export default HeroPropsEditor; 