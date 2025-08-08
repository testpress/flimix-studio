import React from 'react';
import { PropertiesForm, type BlockFormProps, type Field } from '@blocks/settings';

const spacerFields: Field[] = [
  {
    key: 'height',
    label: 'Height',
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'xs', label: 'Extra Small' },
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
    ],
    required: true,
  },
];

const SpacerForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <PropertiesForm block={block} fieldDefinitions={spacerFields} updateProps={updateProps} />
  );
};

export default SpacerForm; 