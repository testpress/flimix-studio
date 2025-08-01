import React from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import DynamicPropsForm from '@blocks/settings/DynamicPropsForm';
import type { Field } from '@blocks/shared/Field';

// Hero block editor schema
const heroEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter hero title...',
    required: true
  },
  { 
    key: 'subtitle', 
    label: 'Subtitle', 
    type: 'text',
    placeholder: 'Enter hero subtitle...'
  },
  { 
    key: 'backgroundImage', 
    label: 'Background Image URL', 
    type: 'image',
    placeholder: 'Enter image URL...'
  },
  { 
    key: 'ctaButton.label', 
    label: 'CTA Label', 
    type: 'text',
    placeholder: 'Enter CTA button text...'
  },
  { 
    key: 'ctaButton.link', 
    label: 'CTA Link', 
    type: 'text',
    placeholder: 'Enter CTA button link...'
  }
];

const HeroForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <DynamicPropsForm
      block={block}
      fieldDefinitions={heroEditorFields}
      updateProps={updateProps}
    />
  );
};

export default HeroForm; 