import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsForm from '@blocks/settings/DynamicPropsForm';
import { heroEditorFields } from './schema';

const HeroForm: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsForm
      block={block}
      fieldDefinitions={heroEditorFields}
      updateProps={updateProps}
    />
  );
};

export default HeroForm; 