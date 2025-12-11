import React from 'react';
import HeaderPreview from '@header/preview';
import FooterPreview from '@footer/preview';

const HeaderFooterCanvas: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header Preview */}
      <div className="relative z-20">
        <HeaderPreview />
      </div>
      
      {/* Page Content Area - Fills remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-[400px] bg-[#0a0a0a]">
        <div className="text-center text-gray-600 select-none">
          <h2 className="text-sm font-semibold mb-1 uppercase tracking-wider opacity-50">Page Content Area</h2>
          <p className="text-xs opacity-30">Content renders here</p>
        </div>
      </div>
      
      {/* Footer Preview */}
      <div className="relative z-10">
        <FooterPreview />
      </div>
    </div>
  );
};

export default HeaderFooterCanvas;
