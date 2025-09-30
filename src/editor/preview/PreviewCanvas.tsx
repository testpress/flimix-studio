import React from 'react';
import HeaderPreview from './HeaderPreview';
import FooterPreview from './FooterPreview';
import type { HeaderSchema } from '@editor/header/schema';
import type { FooterSchema } from '@editor/footer/schema';

interface PreviewCanvasProps {
  headerSchema: HeaderSchema;
  footerSchema: FooterSchema;
  selectedItemId: string | null;
  onItemSelect: (id: string) => void;
  showCustomizePanel: boolean;
  onToggleCustomizePanel: () => void;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  headerSchema,
  footerSchema,
  selectedItemId,
  onItemSelect,
  showCustomizePanel,
  onToggleCustomizePanel
}) => {
  return (
    <div className={`${showCustomizePanel ? 'flex-1' : 'w-full'} bg-gray-950 flex flex-col`}>
      {/* Header preview */}
      <HeaderPreview
        headerSchema={headerSchema}
        selectedItemId={selectedItemId}
        onItemSelect={onItemSelect}
      />
      
      {/* Main content area (placeholder) */}
      <div className="flex-1 bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Page Content Area</h2>
          <p>Your page content would appear here.</p>
          {!showCustomizePanel && (
            <button 
              onClick={onToggleCustomizePanel}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Customize Header & Footer
            </button>
          )}
        </div>
      </div>
      
      {/* Footer preview */}
      <FooterPreview
        footerSchema={footerSchema}
        selectedItemId={selectedItemId}
        onItemSelect={onItemSelect}
      />
    </div>
  );
};

export default PreviewCanvas;
