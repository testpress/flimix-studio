import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { CarouselItem } from './schema';

interface CarouselItemFormProps {
  item: CarouselItem;
  onChange: (updatedItem: CarouselItem) => void;
  title: string;
  progressBarEnabled?: boolean;
}

// Rating options for the select dropdown
const RATING_OPTIONS = [
  { value: "G", label: "G - General Audience" },
  { value: "PG", label: "PG - Parental Guidance" },
  { value: "PG-13", label: "PG-13 - Parental Guidance (13+)" },
  { value: "R", label: "R - Restricted" },
  { value: "NC-17", label: "NC-17 - Adults Only" },
  { value: "TV-Y", label: "TV-Y - All Children" },
  { value: "TV-Y7", label: "TV-Y7 - Children 7+" },
  { value: "TV-G", label: "TV-G - General Audience" },
  { value: "TV-PG", label: "TV-PG - Parental Guidance" },
  { value: "TV-14", label: "TV-14 - Parents Strongly Cautioned" },
  { value: "TV-MA", label: "TV-MA - Mature Audience" },
];

// Badge options for the select dropdown
const BADGE_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Popular", label: "Popular" },
  { value: "Featured", label: "Featured" },
  { value: "Trending", label: "Trending" },
  { value: "Hot", label: "Hot" },
  { value: "Exclusive", label: "Exclusive" },
  { value: "Limited", label: "Limited" },
  { value: "Coming Soon", label: "Coming Soon" },
];

// Move fields array outside the component to prevent recreation on every render
const carouselItemFields = [
  {
    key: 'image' as keyof CarouselItem,
    label: 'Image URL',
    type: 'url' as const,
    placeholder: 'Enter image URL...',
    required: true
  },
  {
    key: 'title' as keyof CarouselItem,
    label: 'Title',
    type: 'text' as const,
    placeholder: 'Enter item title...',
    required: true
  },
  {
    key: 'subtitle' as keyof CarouselItem,
    label: 'Subtitle (optional)',
    type: 'text' as const,
    placeholder: 'Enter subtitle...',
    required: false
  },
  {
    key: 'link' as keyof CarouselItem,
    label: 'Link (optional)',
    type: 'url' as const,
    placeholder: 'Enter link URL...',
    required: false
  }
];

const CarouselItemForm: React.FC<CarouselItemFormProps> = ({ 
  item, 
  onChange, 
  title,
  progressBarEnabled = false
}) => {
  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return '';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  const parseDuration = (duration: string): number => {
    if (!duration) return 0;
    
    // Handle formats like "1h 30m", "2h", "45m"
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    return hours * 60 + minutes;
  };

  const handleMetaChange = (key: string, value: string) => {
    const updatedItem = {
      ...item,
      meta: {
        ...item.meta,
        [key]: value
      }
    };
    onChange(updatedItem);
  };

  const renderMetaFields = () => {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Carousel Meta Information</h3>
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
          <div>
            <label className="block text-sm text-gray-700 mb-1">Rating</label>
            <select
              value={item.meta?.rating || ''}
              onChange={(e) => handleMetaChange('rating', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select rating...</option>
              {RATING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Badge</label>
            <select
              value={item.meta?.badge || ''}
              onChange={(e) => handleMetaChange('badge', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select badge...</option>
              {BADGE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Duration</label>
            <input
              type="number"
              min={0}
              step={1}
              value={item.meta?.duration ? parseDuration(item.meta.duration) || '' : ''}
              onChange={(e) => {
                const minutes = parseInt(e.target.value) || 0;
                const formattedDuration = minutes > 0 ? formatDuration(minutes) : '';
                handleMetaChange('duration', formattedDuration);
              }}
              placeholder="Enter duration in minutes"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter total minutes (e.g., 90 = 1h 30m, 120 = 2h)
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseItemForm<CarouselItem>
      item={item}
      onChange={onChange}
      title={title}
      fields={carouselItemFields}
    >
      {renderMetaFields()}
    </BaseItemForm>
  );
};

export default CarouselItemForm; 