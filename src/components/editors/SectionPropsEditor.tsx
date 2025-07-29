import React from 'react';
import type { BlockEditorProps } from './types';

const SectionPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">Section Properties</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={(block.props as any).title || ''}
            onChange={(e) => updateProps({ title: e.target.value })}
            placeholder="Enter section title..."
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea
            value={(block.props as any).description || ''}
            onChange={(e) => updateProps({ description: e.target.value })}
            placeholder="Enter section description..."
            className="w-full p-2 border border-gray-300 rounded text-sm h-16 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionPropsEditor; 