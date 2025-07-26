import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Block Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Selected Block</h3>
            <p className="text-sm text-gray-500">No block selected</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
            <p className="text-sm text-gray-500">Select a block to edit properties</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Styling</h3>
            <p className="text-sm text-gray-500">Customize colors, spacing, and layout</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Page Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Page Title</h3>
            <input 
              type="text" 
              placeholder="Enter page title"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Meta Description</h3>
            <textarea 
              placeholder="Enter meta description"
              className="w-full p-2 border border-gray-300 rounded text-sm h-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 