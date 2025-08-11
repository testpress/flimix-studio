import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';

// Image block editor schema
const imageEditorFields: Field[] = [
  {
    key: 'src',
    label: 'Image URL',
    type: 'text',
    placeholder: 'Enter image URL...',
    required: true,
  },
  {
    key: 'alt',
    label: 'Alt Text',
    type: 'text',
    placeholder: 'Enter alt text for accessibility...',
    required: false,
  },
  {
    key: 'link',
    label: 'Link (optional)',
    type: 'text',
    placeholder: 'Enter link URL...',
    required: false,
  },
  {
    key: 'size',
    label: 'Image Size',
    type: 'select',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'full', label: 'Full Width' },
    ],
  },
  {
    key: 'aspectRatio',
    label: 'Aspect Ratio',
    type: 'select',
    options: [
      { value: '16:9', label: '16:9' },
      { value: '4:3', label: '4:3' },
      { value: '1:1', label: '1:1' },
      { value: '3:4', label: '3:4' },
      { value: 'auto', label: 'Auto' },
    ],
  },
  {
    key: 'fit',
    label: 'Image Fit',
    type: 'select',
    options: [
      { value: 'cover', label: 'Cover' },
      { value: 'contain', label: 'Contain' },
      { value: 'fill', label: 'Fill' },
    ],
  },
  {
    key: 'alignment',
    label: 'Alignment',
    type: 'select',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
];

const ImageForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <PropertiesForm
      block={block}
      fieldDefinitions={imageEditorFields}
      updateProps={updateProps}
    />
  );
};

export default ImageForm; 