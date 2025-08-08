import React from 'react';
import { PropertiesForm, type BlockFormProps, type Field } from '@blocks/settings';
import type { BlockProps } from '@blocks/shared/FormTypes';
import type { DividerBlockProps } from './schema';

const DividerForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const { props } = block;
  const dividerProps = props as DividerBlockProps;
  const { length } = dividerProps;

  const dividerFields: Field[] = [
    {
      key: 'thickness',
      label: 'Thickness',
      type: 'select',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
      required: true,
    },
    {
      key: 'length',
      label: 'Length',
      type: 'select',
      options: [
        { value: 'full', label: 'Full Width' },
        { value: 'percentage', label: 'Percentage' },
      ],
      required: true,
    },
    // Show percentage input only when length is 'percentage'
    ...(length === 'percentage' ? [{
      key: 'percentageValue',
      label: 'Percentage (%)',
      type: 'number' as const,
      placeholder: 'Enter percentage (1-100)',
      min: 1,
      max: 100,
      required: true,
    }] : []),
    {
      key: 'alignment',
      label: 'Alignment',
      type: 'select',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      required: true,
    },
    {
      key: 'style',
      label: 'Line Style',
      type: 'select',
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ],
      required: true,
    },
  ];

  return (
    <PropertiesForm block={block} fieldDefinitions={dividerFields} updateProps={updateProps} />
  );
};

export default DividerForm; 