import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { PosterGridItem } from './schema';

interface PosterGridItemFormProps {
  item: PosterGridItem;
  onChange: (updatedItem: PosterGridItem) => void;
  title: string;
  progressBarEnabled?: boolean;
}

// Move fields array outside the component to prevent recreation on every render
const posterGridItemFields = [
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

const PosterGridItemForm: React.FC<PosterGridItemFormProps> = ({ 
  item, 
  onChange, 
  title,
  progressBarEnabled = false
}) => {
  const renderMetaFields = () => {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Poster Grid Meta Information</h3>
        <div className="space-y-3">
          {/* Progress Percentage - only show when progress bar is enabled */}
          {progressBarEnabled && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Progress Percentage</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={item.progress || 4}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    onChange({
                      ...item,
                      progress: value
                    });
                  }}
                  className="w-full"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {item.progress || 4}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <BaseItemForm<PosterGridItem>
      item={item}
      onChange={onChange}
      title={title}
      fields={posterGridItemFields}
    >
      {renderMetaFields()}
    </BaseItemForm>
  );
};

export default PosterGridItemForm; 