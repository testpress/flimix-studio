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
      { value: 'small', label: 'Small (300px)' },
      { value: 'medium', label: 'Medium (500px)' },
      { value: 'large', label: 'Large (800px)' },
      { value: 'full', label: 'Full Width' },
    ],
  },
  {
    key: 'aspectRatio',
    label: 'Aspect Ratio',
    type: 'select',
    options: [
      { value: '16:9', label: '16:9 (Widescreen)' },
      { value: '4:3', label: '4:3 (Standard)' },
      { value: '1:1', label: '1:1 (Square)' },
      { value: '3:4', label: '3:4 (Portrait)' },
      { value: 'auto', label: 'Auto (Natural)' },
    ],
  },
  {
    key: 'fit',
    label: 'Image Fit',
    type: 'select',
    options: [
      { value: 'cover', label: 'Cover (Fill container, may crop)' },
      { value: 'contain', label: 'Contain (Show full image, may have padding)' },
      { value: 'fill', label: 'Fill (Stretch to fit, may distort)' },
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