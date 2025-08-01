import React from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import DynamicPropsForm from '@blocks/settings/DynamicPropsForm';
import type { Field } from '@blocks/shared/Field';

// Section block editor schema
const sectionEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter section title...'
  },
  { 
    key: 'description', 
    label: 'Description', 
    type: 'textarea',
    placeholder: 'Enter section description...'
  }
];

const SectionForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsForm
      block={block}
      fieldDefinitions={sectionEditorFields}
      updateProps={updateProps}
    />
  );
};

export default SectionForm; 