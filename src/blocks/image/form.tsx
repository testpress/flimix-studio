import React from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { ImageBlockProps } from './schema';

const ImageForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const imageProps = block.props as ImageBlockProps;
  
  const handlePropChange = (key: keyof ImageBlockProps, value: any) => {
    if (updateProps) {
      updateProps({
        ...imageProps,
        [key]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Image Properties</h3>
        
        <div className="space-y-4">
          {/* Image URL */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={imageProps.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              placeholder="Enter image URL..."
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Alt Text</label>
            <input
              type="text"
              value={imageProps.alt || ''}
              onChange={(e) => handlePropChange('alt', e.target.value)}
              placeholder="Enter alt text for accessibility..."
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Link (optional)</label>
            <input
              type="text"
              value={imageProps.link || ''}
              onChange={(e) => handlePropChange('link', e.target.value)}
              placeholder="Enter link URL..."
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Image Size */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Image Size</label>
            <select
              value={imageProps.size || 'medium'}
              onChange={(e) => handlePropChange('size', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="full">Full Width</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Aspect Ratio</label>
            <select
              value={imageProps.aspectRatio || '16:9'}
              onChange={(e) => handlePropChange('aspectRatio', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
              <option value="3:4">3:4</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          {/* Image Fit */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Image Fit</label>
            <select
              value={imageProps.fit || 'cover'}
              onChange={(e) => handlePropChange('fit', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>

          {/* Alignment */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Alignment</label>
            <select
              value={imageProps.alignment || 'center'}
              onChange={(e) => handlePropChange('alignment', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageForm; 