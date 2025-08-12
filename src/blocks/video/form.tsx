import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';

const videoEditorFields: Field[] = [
  {
    key: 'src',
    label: 'Video URL',
    type: 'text',
    placeholder: 'Enter video URL...',
    required: true,
  },
  {
    key: 'poster',
    label: 'Poster URL',
    type: 'text',
    placeholder: 'Enter poster URL (optional)',
    required: false,
  },
  {
    key: 'caption',
    label: 'Caption',
    type: 'text',
    placeholder: 'Enter caption for video (optional)',
    required: false,
  },
  {
    key: 'autoplay',
    label: 'Autoplay',
    type: 'boolean',
    required: false,
  },
  {
    key: 'muted',
    label: 'Muted',
    type: 'boolean',
    required: false,
  },
  {
    key: 'controls',
    label: 'Controls',
    type: 'boolean',
    required: false,
  },
  {
    key: 'loop',
    label: 'Loop',
    type: 'boolean',
    required: false,
  },
  {
    key: 'aspectRatio',
    label: 'Aspect Ratio',
    type: 'select',
    options: [
      { value: '16:9', label: '16:9 (Widescreen)' },
      { value: '4:3', label: '4:3 (Standard)' },
      { value: '1:1', label: '1:1 (Square)' },
      { value: 'auto', label: 'Auto (Natural)' },
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
  {
    key: 'size',
    label: 'Size',
    type: 'select',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'full', label: 'Full Width' },
    ],
  },
];

const VideoForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  return (
    <PropertiesForm
      block={block}
      fieldDefinitions={videoEditorFields}
      updateProps={updateProps}
    />
  );
};

export default VideoForm; 