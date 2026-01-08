import React from 'react';
import PropertiesForm from '@components/block-settings/PropertiesForm';
import type { BlockFormProps } from '@type/form';
import type { Field } from '@type/field';

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
  },
  { 
    key: 'backgroundImage', 
    label: 'Background Image URL', 
    type: 'image',
    placeholder: 'Enter background image URL...'
  }
];

const SectionForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <PropertiesForm
      block={block}
      fieldDefinitions={sectionEditorFields}
      updateProps={updateProps}
    />
  );
};

export default SectionForm; 