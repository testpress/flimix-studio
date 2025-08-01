import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsForm from '@blocks/settings/DynamicPropsForm';
import { textEditorFields } from './schema';

const TextForm: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsForm
      block={block}
      fieldDefinitions={textEditorFields}
      updateProps={updateProps}
    />
  );
};

export default TextForm; 