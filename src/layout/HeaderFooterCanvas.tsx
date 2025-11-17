import React from 'react';
import HeaderPreview from '@header/preview';
import FooterPreview from '@footer/preview';
import { useHeaderFooter } from '@context/HeaderFooterContext';

const HeaderFooterCanvas: React.FC = () => {
  const { headerSchema } = useHeaderFooter();
  const isVerticalLayout = headerSchema.style?.layout === 'vertical';

  if (isVerticalLayout) {
    const marginMap: Record<string, string> = {
      none: '',
      xs: 'm-1',
      sm: 'm-2',
      base: 'm-3',
      md: 'm-4',
      lg: 'm-6',
      xl: 'm-8',
    };
    const marginClass = marginMap[headerSchema.style?.margin || 'none'] || '';

    return (
      <div className="flex flex-row h-screen bg-black">
        {/* Header Preview (now vertical) */}
        <div className={`relative z-20 shrink-0 self-stretch ${marginClass}`}>
          <HeaderPreview />
        </div>
        
        {/* Page Content Area (Scrollable) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex-1 flex items-center justify-center min-h-[400px] bg-[#0a0a0a]">
            <div className="text-center text-gray-600 select-none">
              <h2 className="text-sm font-semibold mb-1 uppercase tracking-wider opacity-50">Page Content Area</h2>
              <p className="text-xs opacity-30">Content renders here</p>
            </div>
          </div>
          
          {/* Footer Preview (at the bottom of the scrollable content) */}
          <div className="relative z-10">
            <FooterPreview />
          </div>
        </div>
      </div>
    );
  }

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
