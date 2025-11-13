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
import { HEADER_ROOT_ID, FOOTER_ROOT_ID } from '@footer/constants';


type NestedItem = {
  id?: string;
  items?: NestedItem[];
  rows?: NestedItem[];
  columns?: NestedItem[];
};

// Helper function to recursively search for an ID in nested children
const findIdInChildren = (nestedItem: NestedItem | null | undefined, targetId: string): boolean => {
  if (!nestedItem) return false;
  
  if (nestedItem.id === targetId) return true;
  const children = nestedItem.items || nestedItem.rows || nestedItem.columns || [];
  return children.some((child) => findIdInChildren(child, targetId));
};

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
    
    const isHeader = id === HEADER_ROOT_ID || findIdInChildren({ items: headerSchema.items }, id);
    const isFooter = id === FOOTER_ROOT_ID || findIdInChildren({ rows: footerSchema.rows }, id);

    if (isHeader) {
      setActiveTab('header');
    } else if (isFooter) {
      setActiveTab('footer');
    }
    
    setSelectedItemId(id);
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
    <div className="bg-gray-800 min-h-screen text-white">
      {/* Header with controls */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
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
        {/* Left panel - Live Preview */}
        <HeaderFooterCanvas
          headerSchema={headerSchema}
          footerSchema={footerSchema}
          selectedItemId={selectedItemId}
          onItemSelect={handleItemSelect}
          showCustomizePanel={showCustomizePanel}
          onToggleCustomizePanel={toggleCustomizePanel}
        />
        
        {/* Right panel - Editor (when customize panel is shown) */}
        {showCustomizePanel && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default HeaderFooterEditor;
