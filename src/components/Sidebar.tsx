import React from 'react';
import { useSelection } from '../context/SelectionContext';
import type { VisibilityProps, Platform, StyleProps } from '../schema/blockTypes';
import { HeroPropsEditor, TextPropsEditor, SectionPropsEditor, type BlockEditorProps } from './editors';

const Sidebar: React.FC = () => {
  const { selectedBlock, updateSelectedBlockProps, updateSelectedBlockStyle } = useSelection();

  // Block editor registry for dynamic lookup
  const BlockPropEditors: Record<string, React.FC<BlockEditorProps>> = {
    hero: HeroPropsEditor,
    text: TextPropsEditor,
    section: SectionPropsEditor,
  };

  const handleVisibilityChange = (field: keyof VisibilityProps, value: any) => {
    if (!selectedBlock) return;
    
    const currentVisibility = selectedBlock.visibility || {};
    const newVisibility = {
      ...currentVisibility,
      [field]: value
    };
    
    // For now, we'll just log the visibility change
    // In a real app, this would update the block in the schema
    console.log('Updating visibility for block:', selectedBlock.id, newVisibility);
  };

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    if (!selectedBlock) return;
    
    const currentVisibility = selectedBlock.visibility || {};
    const currentPlatforms = currentVisibility.platform || [];
    
    let newPlatforms: Platform[];
    if (checked) {
      newPlatforms = [...currentPlatforms, platform];
    } else {
      newPlatforms = currentPlatforms.filter(p => p !== platform);
    }
    
    handleVisibilityChange('platform', newPlatforms);
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    if (!selectedBlock) return;
    
    const currentVisibility = selectedBlock.visibility || {};
    const currentRegions = currentVisibility.region || [];
    
    let newRegions: string[];
    if (checked) {
      newRegions = [...currentRegions, region];
    } else {
      newRegions = currentRegions.filter(r => r !== region);
    }
    
    handleVisibilityChange('region', newRegions);
  };

  const handleStyleChange = (field: keyof StyleProps, value: any) => {
    if (!selectedBlock) return;
    
    updateSelectedBlockStyle({ [field]: value });
  };

  const renderBlockPropsEditor = () => {
    if (!selectedBlock) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
          <p className="text-sm text-gray-500">Select a block to edit properties</p>
        </div>
      );
    }

    const EditorComponent = BlockPropEditors[selectedBlock.type];
    
    if (EditorComponent) {
      return (
        <EditorComponent 
          block={selectedBlock} 
          updateProps={updateSelectedBlockProps} 
        />
      );
    }

    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
        <p className="text-sm text-gray-500">No editable props available for this block type</p>
      </div>
    );
  };

  const renderStyleEditor = () => {
    if (!selectedBlock) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">🧩 Style Editor</h3>
          <p className="text-sm text-gray-500">Select a block to edit styling</p>
        </div>
      );
    }

    const currentStyle = selectedBlock.style || {};

    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">🧩 Style Editor</h3>
        <div className="space-y-3">
          {/* Spacing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Padding</label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-sm"
                value={currentStyle.padding || ''}
                onChange={(e) => handleStyleChange('padding', e.target.value || undefined)}
              >
                <option value="">Default</option>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Margin</label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-sm"
                value={currentStyle.margin || ''}
                onChange={(e) => handleStyleChange('margin', e.target.value || undefined)}
              >
                <option value="">Default</option>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Text Alignment</label>
            <select
              className="w-full p-2 border border-gray-300 rounded text-sm"
              value={currentStyle.textAlign || ''}
              onChange={(e) => handleStyleChange('textAlign', e.target.value || undefined)}
            >
              <option value="">Default</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={currentStyle.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Text Color</label>
              <input
                type="color"
                value={currentStyle.textColor || '#000000'}
                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Border and Shadow */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Border Radius</label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-sm"
                value={currentStyle.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value || undefined)}
              >
                <option value="">Default</option>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Box Shadow</label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-sm"
                value={currentStyle.boxShadow || ''}
                onChange={(e) => handleStyleChange('boxShadow', e.target.value || undefined)}
              >
                <option value="">Default</option>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>

          {/* Max Width */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Max Width</label>
            <input
              type="text"
              value={currentStyle.maxWidth || ''}
              onChange={(e) => handleStyleChange('maxWidth', e.target.value || undefined)}
              placeholder="e.g., 1024px, 80%, 50rem"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Block Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Selected Block</h3>
            {selectedBlock ? (
              <div className="text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Type:</span> {selectedBlock.type}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">ID:</span> {selectedBlock.id}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No block selected</p>
            )}
          </div>
          
          {selectedBlock && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Visibility Rules</h3>
              <div className="space-y-3">
                {/* User State */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedBlock.visibility?.isLoggedIn ?? false}
                      onChange={(e) => handleVisibilityChange('isLoggedIn', e.target.checked)}
                      className="rounded"
                    />
                    Require Logged In
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedBlock.visibility?.isSubscribed ?? false}
                      onChange={(e) => handleVisibilityChange('isSubscribed', e.target.checked)}
                      className="rounded"
                    />
                    Require Subscribed
                  </label>
                </div>

                {/* Subscription Tier */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Subscription Tier</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={selectedBlock.visibility?.subscriptionTier || ''}
                    onChange={(e) => handleVisibilityChange('subscriptionTier', e.target.value || undefined)}
                  >
                    <option value="">Any tier</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Platform</label>
                  <div className="space-y-1">
                    {(['mobile', 'desktop', 'tv'] as Platform[]).map((platform) => (
                      <label key={platform} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedBlock.visibility?.platform?.includes(platform) ?? false}
                          onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                          className="rounded"
                        />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Region</label>
                  <div className="space-y-1">
                    {(['IN', 'US', 'UK', 'CA', 'AU']).map((region) => (
                      <label key={region} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedBlock.visibility?.region?.includes(region) ?? false}
                          onChange={(e) => handleRegionChange(region, e.target.checked)}
                          className="rounded"
                        />
                        {region === 'IN' ? 'India' : 
                         region === 'US' ? 'United States' : 
                         region === 'UK' ? 'United Kingdom' : 
                         region === 'CA' ? 'Canada' : 'Australia'}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {renderBlockPropsEditor()}
          
          {renderStyleEditor()}
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