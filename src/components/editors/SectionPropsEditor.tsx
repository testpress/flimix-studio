import React from 'react';
import type { BlockEditorProps } from './types';
import DynamicPropsEditor from './DynamicPropsEditor';
import { sectionEditorFields } from './schemas';

const SectionPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsEditor
      block={block}
      schema={sectionEditorFields}
      updateProps={updateProps}
    />
  );
};

export default SectionPropsEditor; 