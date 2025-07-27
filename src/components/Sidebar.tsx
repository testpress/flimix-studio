import React from 'react';
import { useSelection } from '../context/SelectionContext';
import type { VisibilityProps, Platform } from '../schema/blockTypes';

const Sidebar: React.FC = () => {
  const { selectedBlock, updateSelectedBlockProps } = useSelection();

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

  const renderBlockPropsEditor = () => {
    if (!selectedBlock) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
          <p className="text-sm text-gray-500">Select a block to edit properties</p>
        </div>
      );
    }

    switch (selectedBlock.type) {
      case 'text':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Text Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Content</label>
                <textarea
                  value={(selectedBlock.props as any).content || ''}
                  onChange={(e) => updateSelectedBlockProps({ content: e.target.value })}
                  placeholder="Enter text content..."
                  className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 'section':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Section Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={(selectedBlock.props as any).title || ''}
                  onChange={(e) => updateSelectedBlockProps({ title: e.target.value })}
                  placeholder="Enter section title..."
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea
                  value={(selectedBlock.props as any).description || ''}
                  onChange={(e) => updateSelectedBlockProps({ description: e.target.value })}
                  placeholder="Enter section description..."
                  className="w-full p-2 border border-gray-300 rounded text-sm h-16 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Hero Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={(selectedBlock.props as any).title || ''}
                  onChange={(e) => updateSelectedBlockProps({ title: e.target.value })}
                  placeholder="Enter hero title..."
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={(selectedBlock.props as any).subtitle || ''}
                  onChange={(e) => updateSelectedBlockProps({ subtitle: e.target.value })}
                  placeholder="Enter hero subtitle..."
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Background Image URL</label>
                <input
                  type="text"
                  value={(selectedBlock.props as any).backgroundImage || ''}
                  onChange={(e) => updateSelectedBlockProps({ backgroundImage: e.target.value })}
                  placeholder="Enter image URL..."
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
            <p className="text-sm text-gray-500">No editable props available for this block type</p>
          </div>
        );
    }
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