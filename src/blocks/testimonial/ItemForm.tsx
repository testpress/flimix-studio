import React from 'react';
import BaseItemForm from '@blocks/settings/BaseItemForm';
import type { TestimonialItem } from './schema';

interface TestimonialItemFormProps {
  item: TestimonialItem;
  onChange: (updatedItem: TestimonialItem) => void;
  title: string;
}

// Move fields array outside the component to prevent recreation on every render
const testimonialItemFields = [
  {
    key: 'quote' as keyof TestimonialItem,
    label: 'Quote',
    type: 'textarea' as const,
    placeholder: 'Enter testimonial quote...',
    required: true,
    maxLength: 50,
  },
  {
    key: 'name' as keyof TestimonialItem,
    label: 'Name (optional)',
    type: 'text' as const,
    placeholder: 'Enter customer name...',
    required: false
  },
  {
    key: 'designation' as keyof TestimonialItem,
    label: 'Designation (optional)',
    type: 'text' as const,
    placeholder: 'Enter customer designation...',
    required: false
  },
  {
    key: 'image' as keyof TestimonialItem,
    label: 'Image URL (optional)',
    type: 'url' as const,
    placeholder: 'Enter image URL...',
    required: false
  },
  {
    key: 'rating' as keyof TestimonialItem,
    label: 'Rating (optional)',
    type: 'select' as const,
    required: false,
    description: 'Select a rating from 1 to 5 stars, or choose "No Rating" to hide the rating',
    options: [
      { value: 0, label: 'No Rating' },
      { value: 1, label: '1 Star' },
      { value: 2, label: '2 Stars' },
      { value: 3, label: '3 Stars' },
      { value: 4, label: '4 Stars' },
      { value: 5, label: '5 Stars' }
    ]
  }
];

const TestimonialItemForm: React.FC<TestimonialItemFormProps> = ({ 
  item, 
  onChange, 
  title
}) => {
  const handleFieldChange = (field: keyof TestimonialItem, value: string) => {
    if (field === 'rating') {
      // Handle rating conversion - if rating is 0, convert to undefined
      const ratingValue = parseInt(value, 10);
      onChange({
        ...item,
        [field]: ratingValue === 0 ? undefined : ratingValue
      });
    } else {
      // Handle other fields normally
      onChange({
        ...item,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-neutral-700">{title}</h3>
      
      {/* Use BaseItemForm for all fields including rating */}
      <BaseItemForm<TestimonialItem>
        item={item}
        onChange={onChange}
        title={title}
        fields={testimonialItemFields}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
};

export default TestimonialItemForm; 