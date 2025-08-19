import React from 'react';
import type { HeroItem, HeroCTABtn } from '../schema';

interface CTAsTabProps {
  currentItem: HeroItem;
  updateHeroItemPrimaryCTA: (primaryCTA: HeroCTABtn) => void;
  updateHeroItemSecondaryCTA: (secondaryCTA: HeroCTABtn | undefined) => void;
}

const CTAsTab: React.FC<CTAsTabProps> = ({
  currentItem,
  updateHeroItemPrimaryCTA,
  updateHeroItemSecondaryCTA
}) => {
  const secondaryCTA = currentItem.secondaryCTA;

  // Generic handler for primary CTA changes
  const handlePrimaryCTAChange = (field: keyof HeroCTABtn, value: any) => {
    const newCTA = {
      ...(currentItem.primaryCTA || {}),
      label: currentItem.primaryCTA?.label || 'CTA',
      link: currentItem.primaryCTA?.link || '#',
      variant: currentItem.primaryCTA?.variant || 'solid',
      backgroundColor: currentItem.primaryCTA?.backgroundColor || '#dc2626',
      textColor: currentItem.primaryCTA?.textColor || '#ffffff',
      [field]: value
    };
    updateHeroItemPrimaryCTA(newCTA as HeroCTABtn);
  };

  // Generic handler for secondary CTA changes
  const handleSecondaryCTAChange = (field: keyof HeroCTABtn, value: any) => {
    if (!secondaryCTA) return;
    
    const newCTA = {
      ...secondaryCTA,
      [field]: value
    };
    updateHeroItemSecondaryCTA(newCTA);
  };

  const addSecondaryCTA = () => {
    const newCTA = { 
      label: 'New CTA', 
      link: '#', 
      variant: 'outline' as const, 
      backgroundColor: '#ffffff', 
      textColor: '#000000' 
    };
    updateHeroItemSecondaryCTA(newCTA);
  };

  const removeSecondaryCTA = () => {
    updateHeroItemSecondaryCTA(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Primary CTA Section */}
      <div className="border p-3 rounded">
        <h4 className="text-xs font-medium mb-3">Primary CTA</h4>
        
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Label</label>
            <input
              type="text"
              value={currentItem.primaryCTA?.label || ''}
              onChange={(e) => handlePrimaryCTAChange('label', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter CTA text..."
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Link</label>
            <input
              type="text"
              value={currentItem.primaryCTA?.link || ''}
              onChange={(e) => handlePrimaryCTAChange('link', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter CTA link..."
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Style</label>
            <select
              value={currentItem.primaryCTA?.variant || 'solid'}
              onChange={(e) => handlePrimaryCTAChange('variant', e.target.value as 'solid' | 'outline')}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="solid">Solid</option>
              <option value="outline">Outline</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Background Color</label>
            <input
              type="color"
              value={currentItem.primaryCTA?.backgroundColor || '#dc2626'}
              onChange={(e) => handlePrimaryCTAChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
            <input
              type="color"
              value={currentItem.primaryCTA?.textColor || '#ffffff'}
              onChange={(e) => handlePrimaryCTAChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      {/* Secondary CTA Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Secondary CTA</label>
          <button
            type="button"
            onClick={addSecondaryCTA}
            disabled={!!secondaryCTA}
            className={`px-2 py-1 text-xs rounded ${
              secondaryCTA 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Add CTA
          </button>
        </div>
        
        {!secondaryCTA ? (
          <p className="text-sm text-gray-500">No secondary CTA added yet. Click "Add CTA" to create one.</p>
        ) : (
          <div className="border p-3 rounded mb-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium">Secondary CTA</h4>
              <button
                type="button"
                onClick={removeSecondaryCTA}
                className="p-1 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Label</label>
                <input
                  type="text"
                  value={secondaryCTA.label || ''}
                  onChange={(e) => handleSecondaryCTAChange('label', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter CTA text..."
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Link</label>
                <input
                  type="text"
                  value={secondaryCTA.link || ''}
                  onChange={(e) => handleSecondaryCTAChange('link', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter CTA link..."
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Style</label>
                <select
                  value={secondaryCTA.variant || 'outline'}
                  onChange={(e) => handleSecondaryCTAChange('variant', e.target.value as 'solid' | 'outline')}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="solid">Solid</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                <input
                  type="color"
                  value={secondaryCTA.backgroundColor || '#ffffff'}
                  onChange={(e) => handleSecondaryCTAChange('backgroundColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                <input
                  type="color"
                  value={secondaryCTA.textColor || '#000000'}
                  onChange={(e) => handleSecondaryCTAChange('textColor', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CTAsTab;
