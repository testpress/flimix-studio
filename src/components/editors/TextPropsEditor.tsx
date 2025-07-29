import React from 'react';
import type { BlockEditorProps } from './types';

const TextPropsEditor: React.FC<BlockEditorProps> = ({ block, updateProps }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">Text Properties</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Content</label>
          <textarea
            value={(block.props as any).content || ''}
            onChange={(e) => updateProps({ content: e.target.value })}
            placeholder="Enter text content..."
            className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TextPropsEditor; 