import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@type/form';
import type { Field } from '@type/field';

const ctaButtonFields: Field[] = [
  { key: 'label', label: 'Label', type: 'text', placeholder: 'Enter button text', required: true },
  { key: 'link', label: 'Link', type: 'text', placeholder: 'Enter target URL', required: true },
  {
    key: 'variant',
    label: 'Variant',
    type: 'select',
    options: [
      { value: 'solid', label: 'Solid' },
      { value: 'outline', label: 'Outline' },
    ],
  },
  {
    key: 'size',
    label: 'Size',
    type: 'select',
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
    ],
  },
];

const CTAButtonForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return <PropertiesForm block={block} fieldDefinitions={ctaButtonFields} updateProps={updateProps} />;
};

export default CTAButtonForm;
