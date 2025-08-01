import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsForm from './DynamicPropsForm';
import { heroEditorFields } from '@schema/editorSchemas';

const HeroPropsForm: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsForm
      block={block}
      fieldDefinitions={heroEditorFields}
      updateProps={updateProps}
    />
  );
};

export default HeroPropsForm; 