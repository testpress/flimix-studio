import React from 'react';
import type { BlockEditorProps } from '../../types/editorTypes';
import DynamicPropsEditor from './DynamicPropsEditor';
import { sectionEditorFields } from '../../schema/editorSchemas';

const SectionPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsEditor
      block={block}
      fieldDefinitions={sectionEditorFields}
      updateProps={updateProps}
    />
  );
};

export default SectionPropsEditor; 