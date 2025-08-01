import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsForm from './DynamicPropsForm';
import { textEditorFields } from '@schema/editorSchemas';

const TextPropsForm: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsForm
      block={block}
      fieldDefinitions={textEditorFields}
      updateProps={updateProps}
    />
  );
};

export default TextPropsForm; 