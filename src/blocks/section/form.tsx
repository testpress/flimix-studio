import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsForm from '@blocks/settings/DynamicPropsForm';
import { sectionEditorFields } from './schema';

const SectionForm: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsForm
      block={block}
      fieldDefinitions={sectionEditorFields}
      updateProps={updateProps}
    />
  );
};

export default SectionForm; 