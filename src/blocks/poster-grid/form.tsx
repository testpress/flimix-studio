import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';

// Poster grid block editor schema
const posterGridEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter grid title...'
  },
  { 
    key: 'itemShape', 
    label: 'Item Shape', 
    type: 'select',
    options: [
      { value: 'rectangle-landscape', label: 'Landscape' },
      { value: 'rectangle-portrait', label: 'Portrait' },
      { value: 'square', label: 'Square' },
      { value: 'circle', label: 'Circle' }
    ]
  }
];

const PosterGridForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <PropertiesForm
      block={block}
      fieldDefinitions={posterGridEditorFields}
      updateProps={updateProps}
    />
  );
};

export default PosterGridForm; 