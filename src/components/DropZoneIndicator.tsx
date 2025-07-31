import React from 'react';

interface DropZoneIndicatorProps {
  isOver: boolean;
}

const DropZoneIndicator: React.FC<DropZoneIndicatorProps> = ({ isOver }) => {
  // Only show when dragging over
  if (!isOver) {
    return null;
  }

  return (
    <div className="my-6 p-8 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg text-center shadow-lg transition-all duration-200">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-blue-700">
            Drop Here!
          </h3>
          <p className="text-sm mt-1 text-blue-600">
            Release to add block to the end of the page
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropZoneIndicator; 