import React from 'react';
import type { BlockEditorProps } from './types';

const HeroPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">Hero Properties</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={(block.props as any).title || ''}
            onChange={(e) => updateProps({ title: e.target.value })}
            placeholder="Enter hero title..."
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={(block.props as any).subtitle || ''}
            onChange={(e) => updateProps({ subtitle: e.target.value })}
            placeholder="Enter hero subtitle..."
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Background Image URL</label>
          <input
            type="text"
            value={(block.props as any).backgroundImage || ''}
            onChange={(e) => updateProps({ backgroundImage: e.target.value })}
            placeholder="Enter image URL..."
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroPropsEditor; 