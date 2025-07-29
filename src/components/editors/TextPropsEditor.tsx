import React from 'react';
import type { BlockEditorProps } from './types';
import DynamicPropsEditor from './DynamicPropsEditor';
import { textEditorFields } from './schemas';

const TextPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsEditor
      block={block}
      schema={textEditorFields}
      updateProps={updateProps}
    />
  );
};

export default TextPropsEditor; 