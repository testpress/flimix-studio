import React, { useEffect } from 'react';
import { Settings, EyeOff } from 'lucide-react';
import HeaderPanel from '@layout/HeaderPanel';
import FooterPanel from '@layout/FooterPanel';
import HeaderFooterCanvas from '@layout/HeaderFooterCanvas';
import { Tabs, TabBar, TabButton, TabPanel } from '@components/tabs';
import { HeaderFooterProvider, useHeaderFooter } from '@context/HeaderFooterContext';

// Separate component for the Scroll Logic to ensure it has access to Context
const AutoScroller = () => {
  const { selectedId } = useHeaderFooter();

  useEffect(() => {
    if (!selectedId) return;

    // 1. Scroll Canvas Element
    const canvasEl = document.getElementById(`canvas-item-${selectedId}`);
    if (canvasEl) {
      canvasEl.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center' 
      });
    }

    // 2. Scroll Panel Element
    // We use a small timeout to allow the Accordions/Tabs to open first
    const timer = setTimeout(() => {
      const panelEl = document.getElementById(`panel-item-${selectedId}`);
      if (panelEl) {
        panelEl.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 150); // 150ms delay for UI expansion

    return () => clearTimeout(timer);
  }, [selectedId]);

  return null; // This component renders nothing, just handles logic
};

const BuilderLayout = () => {
  const { activeTab, setActiveTab } = useHeaderFooter();
  const [showCustomizePanel, setShowCustomizePanel] = React.useState(true);

  return (
    <div className="bg-gray-900 h-screen text-white flex flex-col overflow-hidden">
      <AutoScroller /> 
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center shrink-0 h-16 z-30 relative">
        <h1 className="font-bold text-lg">Header & Footer Builder</h1>
        
        <button 
          onClick={() => setShowCustomizePanel(!showCustomizePanel)}
          className="px-4 py-2 bg-blue-600 rounded text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          {showCustomizePanel ? <><EyeOff size={14}/> Preview</> : <><Settings size={14}/> Customize</>}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto bg-black relative custom-scrollbar">
          <div className="w-full min-h-full bg-black">
            <HeaderFooterCanvas />
          </div>
        </div>

        {showCustomizePanel && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col shrink-0 h-full z-20 shadow-xl">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'header' | 'footer')} className="flex flex-col h-full">
              
              <div className="p-4 pb-0 shrink-0">
                <TabBar className="grid grid-cols-2 bg-gray-900 p-1 rounded-lg">
                  <TabButton value="header">Header</TabButton>
                  <TabButton value="footer">Footer</TabButton>
                </TabBar>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <TabPanel value="header"><HeaderPanel /></TabPanel>
                <TabPanel value="footer"><FooterPanel /></TabPanel>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

const HeaderFooterBuilder = () => (
  <HeaderFooterProvider>
    <BuilderLayout />
  </HeaderFooterProvider>
);

export default HeaderFooterBuilder;

