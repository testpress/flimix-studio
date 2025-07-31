import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsEditor from './DynamicPropsEditor';
import { heroEditorFields } from '../../schema/editorSchemas';

const HeroPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsEditor
      block={block}
      fieldDefinitions={heroEditorFields}
      updateProps={updateProps}
    />
  );
};

export default HeroPropsEditor; 