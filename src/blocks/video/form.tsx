import React from 'react';
import PropertiesForm from '@components/block-settings/PropertiesForm';
import type { BlockFormProps } from '@type/form';
import type { Field } from '@type/field';

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
    label: 'Autoplay (auto-mutes for browser compliance)',
    type: 'boolean',
    required: false,
  },
  {
    key: 'muted',
    label: 'Muted (always enabled when autoplay is on)',
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
      { value: '16:9', label: '16:9' },
      { value: '4:3', label: '4:3' },
      { value: '1:1', label: '1:1' },
      { value: 'auto', label: 'Auto' },
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