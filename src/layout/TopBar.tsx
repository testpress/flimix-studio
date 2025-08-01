import React from 'react';

const TopBar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Flimix Studio</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            Save
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 