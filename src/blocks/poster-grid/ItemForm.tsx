import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { PosterGridItem } from './schema';

interface PosterGridItemFormProps {
  item: PosterGridItem;
  onChange: (updatedItem: PosterGridItem) => void;
  title: string;
}

const PosterGridItemForm: React.FC<PosterGridItemFormProps> = ({ 
  item, 
  onChange, 
  title
}) => {
  const fields = [
    {
      key: 'image' as keyof PosterGridItem,
      label: 'Image URL',
      type: 'url' as const,
      placeholder: 'Enter image URL...',
      required: true
    },
    {
      key: 'title' as keyof PosterGridItem,
      label: 'Title',
      type: 'text' as const,
      placeholder: 'Enter item title...',
      required: true
    },
    {
      key: 'link' as keyof PosterGridItem,
      label: 'Link (optional)',
      type: 'url' as const,
      placeholder: 'Enter link URL...',
      required: false
    }
  ];

  return (
    <BaseItemForm<PosterGridItem>
      item={item}
      onChange={onChange}
      title={title}
      fields={fields}
    />
  );
};

export default PosterGridItemForm; 