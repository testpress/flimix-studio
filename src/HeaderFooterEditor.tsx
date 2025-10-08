import React, { useState, useEffect } from 'react';
import { Settings, EyeOff } from 'lucide-react';
import HeaderPanel from '@layout/HeaderPanel';
import FooterPanel from '@layout/FooterPanel';
import HeaderFooterCanvas from '@layout/HeaderFooterCanvas';
import type { HeaderSchema } from '@header/schema';
import type { FooterSchema } from '@footer/schema';
import headerSchemaData from '@fixtures/headerSchema.json';
import footerSchemaData from '@fixtures/footerSchema.json';
import { Tabs, TabBar, TabButton, TabPanel } from '@components/tabs';

const HeaderFooterEditor: React.FC = () => {
  // Initialize with default schemas
  const [headerSchema, setHeaderSchema] = useState<HeaderSchema>(headerSchemaData as HeaderSchema);
  const [footerSchema, setFooterSchema] = useState<FooterSchema>(footerSchemaData as FooterSchema);
  
  // UI State
  const [activeTab, setActiveTab] = useState<string>('header');
  //toggle customize panel
  const [showCustomizePanel, setShowCustomizePanel] = useState<boolean>(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const updateHeaderSchema = (updatedSchema: HeaderSchema) => {
    setHeaderSchema(updatedSchema);
  };

  const updateFooterSchema = (updatedSchema: FooterSchema) => {
    setFooterSchema(updatedSchema);
  };

  // Handle item selection in preview
  const handleItemSelect = (id: string) => {
    if (!showCustomizePanel) return;
    
    // Find which tab the item belongs to
    const headerItem = headerSchema.items.find(item => 
      item.id === id || (item.items && item.items.some(subItem => subItem.id === id))
    );
    const footerItem = footerSchema.items.find(item => 
      item.id === id || (item.items && item.items.some(subItem => subItem.id === id))
    );
    
    // Switch to the appropriate tab
    if (headerItem) {
      setActiveTab('header');
    } else if (footerItem) {
      setActiveTab('footer');
    }
    
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  // Auto-scroll to selected item editor
  useEffect(() => {
    if (selectedItemId && showCustomizePanel) {
      const timer = setTimeout(() => {
        // Find the element with the selected item ID
        const element = document.querySelector(`[data-item-id="${selectedItemId}"]`);
        if (element) {
          // Scroll to the element with smooth behavior
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [selectedItemId, showCustomizePanel, activeTab]);

  // Toggle customize panel
  const toggleCustomizePanel = () => {
    setShowCustomizePanel(!showCustomizePanel);
    if (showCustomizePanel) {
      setSelectedItemId(null);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Header with controls */}
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Header & Footer Builder</h1>
          
          <div className="flex items-center space-x-4">
            {/* Preview toggle button */}
            <button
              onClick={toggleCustomizePanel}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showCustomizePanel 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {showCustomizePanel ? (
                <><EyeOff size={16} className="inline mr-1" /> Preview</>
              ) : (
                <><Settings size={16} className="inline mr-1" /> Customize</>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left panel - Editor (when customize panel is shown) */}
        {showCustomizePanel && (
          <div className="w-96 bg-gray-900 border-r border-gray-800 overflow-y-auto">
            <Tabs 
              defaultValue="header" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabBar className="grid grid-cols-2 m-4">
                <TabButton value="header" className="py-2">Header</TabButton>
                <TabButton value="footer" className="py-2">Footer</TabButton>
              </TabBar>
              
              <div className="px-4 pb-4">
                <TabPanel value="header" className="mt-0 space-y-4">
                  <HeaderPanel 
                    headerSchema={headerSchema} 
                    updateHeaderSchema={updateHeaderSchema}
                    selectedItemId={selectedItemId}
                    onSelectItem={handleItemSelect}
                  />
                </TabPanel>
                
                <TabPanel value="footer" className="mt-0 space-y-4">
                  <FooterPanel 
                    footerSchema={footerSchema} 
                    updateFooterSchema={updateFooterSchema}
                    selectedItemId={selectedItemId}
                    onSelectItem={handleItemSelect}
                  />
                </TabPanel>
              </div>
            </Tabs>
          </div>
        )}
        
        {/* Right panel - Live Preview */}
        <HeaderFooterCanvas
          headerSchema={headerSchema}
          footerSchema={footerSchema}
          selectedItemId={selectedItemId}
          onItemSelect={handleItemSelect}
          showCustomizePanel={showCustomizePanel}
          onToggleCustomizePanel={toggleCustomizePanel}
        />
      </div>
    </div>
  );
};

export default HeaderFooterEditor;
