import React from 'react';

const Canvas: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold mb-4">Block Editor Canvas</h2>
          <p className="text-lg">Drag and drop blocks here to build your landing page</p>
          <div className="mt-8 text-sm text-gray-400">
            <p>• Hero Section</p>
            <p>• Content Blocks</p>
            <p>• Media Galleries</p>
            <p>• Call-to-Action</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas; 