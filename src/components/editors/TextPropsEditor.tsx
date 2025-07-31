import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsEditor from './DynamicPropsEditor';
import { textEditorFields } from '../../schema/editorSchemas';

const TextPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsEditor
      block={block}
      fieldDefinitions={textEditorFields}
      updateProps={updateProps}
    />
  );
};

export default TextPropsEditor; 