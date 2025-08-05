import React from 'react';
import BlockPropertiesForm from '@blocks/settings/BlockPropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';

// Text block editor schema
const textEditorFields: Field[] = [
  { 
    key: 'content', 
    label: 'Content', 
    type: 'textarea',
    placeholder: 'Enter text content...',
    required: true
  }
];

const TextForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <BlockPropertiesForm
      block={block}
      fieldDefinitions={textEditorFields}
      updateProps={updateProps}
    />
  );
};

export default TextForm; 