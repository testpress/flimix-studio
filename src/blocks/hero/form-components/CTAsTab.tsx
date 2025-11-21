import React from 'react';
import type { HeroItem, HeroCTABtn } from '../schema';
import { ButtonIcon, AVAILABLE_ICONS } from './ButtonIcons';
import type { ButtonIconPosition } from './ButtonIcons';

interface CTAsTabProps {
  currentItem: HeroItem;
  updateHeroItemPrimaryCTA: (primaryCTA: HeroCTABtn) => void;
  updateHeroItemSecondaryCTA: (secondaryCTA: HeroCTABtn | undefined) => void;
  updateHeroItemTertiaryCTA?: (tertiaryCTA: HeroCTABtn | undefined) => void;
}

const CTAsTab: React.FC<CTAsTabProps> = ({
  currentItem,
  updateHeroItemPrimaryCTA,
  updateHeroItemSecondaryCTA,
  updateHeroItemTertiaryCTA
}) => {
  const secondaryCTA = currentItem.secondaryCTA;
  const tertiaryCTA = currentItem.tertiaryCTA;

  // Generic handler for primary CTA changes
  const handlePrimaryCTAChange = (field: keyof HeroCTABtn, value: string | boolean) => {
    const newCTA = {
      ...(currentItem.primaryCTA || {}),
      label: currentItem.primaryCTA?.label ?? 'CTA',
      link: currentItem.primaryCTA?.link ?? '#',
      variant: currentItem.primaryCTA?.variant ?? 'solid',
      backgroundColor: currentItem.primaryCTA?.backgroundColor ?? '#dc2626',
      textColor: currentItem.primaryCTA?.textColor ?? '#ffffff',
      icon: currentItem.primaryCTA?.icon ?? 'None',
      iconPosition: currentItem.primaryCTA?.iconPosition ?? 'left',
      iconThickness: currentItem.primaryCTA?.iconThickness ?? 'normal',
      borderRadius: currentItem.primaryCTA?.borderRadius ?? 'md',
      size: currentItem.primaryCTA?.size ?? 'medium',
      [field]: value
    };
    updateHeroItemPrimaryCTA(newCTA as HeroCTABtn);
  };

  // Generic handler for secondary CTA changes
  const handleSecondaryCTAChange = (field: keyof HeroCTABtn, value: string | boolean) => {
    if (!secondaryCTA) return;
    
    const newCTA = {
      ...secondaryCTA,
      icon: secondaryCTA.icon ?? 'None',
      iconPosition: secondaryCTA.iconPosition ?? 'left',
      iconThickness: secondaryCTA.iconThickness ?? 'normal',
      borderRadius: secondaryCTA.borderRadius ?? 'md',
      size: secondaryCTA.size ?? 'medium',
      [field]: value
    };
    updateHeroItemSecondaryCTA(newCTA);
  };

  // Generic handler for tertiary CTA changes
  const handleTertiaryCTAChange = (field: keyof HeroCTABtn, value: string | boolean) => {
    if (!tertiaryCTA || !updateHeroItemTertiaryCTA) return;
    
    const newCTA = {
      ...tertiaryCTA,
      icon: tertiaryCTA.icon ?? 'None',
      iconPosition: tertiaryCTA.iconPosition ?? 'left',
      iconThickness: tertiaryCTA.iconThickness ?? 'normal',
      borderRadius: tertiaryCTA.borderRadius ?? 'md',
      size: tertiaryCTA.size ?? 'medium',
      [field]: value
    };
    updateHeroItemTertiaryCTA(newCTA);
  };

  const addSecondaryCTA = () => {
    const newCTA = { 
      label: 'New CTA', 
      link: '#', 
      variant: 'outline' as const, 
      backgroundColor: '#ffffff', 
      textColor: '#000000',
      icon: 'None' as const,
      iconPosition: 'right' as const,
      iconThickness: 'normal' as const,
      borderRadius: 'md' as const,
      size: 'medium' as const
    };
    updateHeroItemSecondaryCTA(newCTA);
  };

  const removeSecondaryCTA = () => {
    updateHeroItemSecondaryCTA(undefined);
  };
  
  const addTertiaryCTA = () => {
    if (!updateHeroItemTertiaryCTA) return;
    
    const newCTA = { 
      label: 'Third CTA', 
      link: '#', 
      variant: 'outline' as const, 
      backgroundColor: '#333333', 
      textColor: '#ffffff',
      icon: 'None' as const,
      iconPosition: 'right' as const,
      iconThickness: 'normal' as const,
      borderRadius: 'md' as const,
      size: 'medium' as const
    };
    updateHeroItemTertiaryCTA(newCTA);
  };

  const removeTertiaryCTA = () => {
    updateHeroItemTertiaryCTA!(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Primary CTA Section */}
      <div className="border border-neutral-700 bg-neutral-800 p-3 rounded">
        <h4 className="text-xs font-medium text-white mb-3">Primary CTA</h4>
        
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Label</label>
            <textarea
              value={currentItem.primaryCTA?.label ?? ''}
              onChange={(e) => handlePrimaryCTAChange('label', e.target.value)}
              className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter CTA text... (Press Enter for new lines)"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Link</label>
              <input
                type="text"
                value={currentItem.primaryCTA?.link ?? ''}
                onChange={(e) => handlePrimaryCTAChange('link', e.target.value)}
                className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter CTA link..."
              />
          </div>
          
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Style</label>
            <select
              value={currentItem.primaryCTA?.variant || 'solid'}
              onChange={(e) => handlePrimaryCTAChange('variant', e.target.value as 'solid' | 'outline')}
              className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="solid">Solid</option>
              <option value="outline">Outline</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Background Color</label>
            <input
              type="color"
              value={currentItem.primaryCTA?.backgroundColor || '#dc2626'}
              onChange={(e) => handlePrimaryCTAChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-neutral-700 rounded"
            />
          </div>
          
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Text Color</label>
            <input
              type="color"
              value={currentItem.primaryCTA?.textColor || '#ffffff'}
              onChange={(e) => handlePrimaryCTAChange('textColor', e.target.value)}
              className="w-full h-10 border border-neutral-700 rounded"
            />
          </div>
          
          {/* Icon Selection */}
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Button Icon</label>
            <select
              value={currentItem.primaryCTA?.icon ?? 'None'}
              onChange={(e) => handlePrimaryCTAChange('icon', e.target.value)}
              className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AVAILABLE_ICONS.map(icon => (
                <option key={icon.type} value={icon.type}>{icon.label}</option>
              ))}
            </select>
            
                            {/* Icon Preview */}
                {currentItem.primaryCTA?.icon && currentItem.primaryCTA.icon !== 'None' && (
                  <div className="mt-2 p-2 bg-neutral-900 rounded flex items-center gap-2">
                    <ButtonIcon icon={currentItem.primaryCTA.icon} />
                    <span className="text-xs text-neutral-300">{currentItem.primaryCTA.icon}</span>
                  </div>
                )}
          </div>
          
          {/* Icon Position - only show if an icon is selected */}
          {currentItem.primaryCTA?.icon && currentItem.primaryCTA.icon !== 'None' && (
            <div>
              <label className="block text-xs text-neutral-300 mb-1">Icon Position</label>
              <select
                value={currentItem.primaryCTA?.iconPosition ?? 'left'}
                onChange={(e) => handlePrimaryCTAChange('iconPosition', e.target.value as ButtonIconPosition)}
                className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}
          
          {/* Icon Thickness - only show if an icon is selected */}
          {currentItem.primaryCTA?.icon && currentItem.primaryCTA.icon !== 'None' && (
            <div>
              <label className="block text-xs text-neutral-300 mb-1">Icon Thickness</label>
              <select
                value={currentItem.primaryCTA?.iconThickness ?? 'normal'}
                onChange={(e) => handlePrimaryCTAChange('iconThickness', e.target.value as 'thin' | 'normal' | 'thick')}
                className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="thin">Thin</option>
                <option value="normal">Normal</option>
                <option value="thick">Thick</option>
              </select>
            </div>
          )}
          
          {/* Border Radius */}
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Border Radius</label>
            <select
              value={currentItem.primaryCTA?.borderRadius ?? 'md'}
              onChange={(e) => handlePrimaryCTAChange('borderRadius', e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'full')}
              className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="full">Full (Circle)</option>
            </select>
          </div>
          {/* Button Size */}
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Button Size</label>
            <select
              value={currentItem.primaryCTA?.size ?? 'medium'}
              onChange={(e) => handlePrimaryCTAChange('size', e.target.value as 'small' | 'medium' | 'large')}
              className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Secondary CTA Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-neutral-300">Secondary CTA</label>
          <button
            type="button"
            onClick={addSecondaryCTA}
            disabled={!!secondaryCTA}
            className={`px-2 py-1 text-xs rounded ${
              secondaryCTA 
                ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Add CTA
          </button>
        </div>
        
        {!secondaryCTA ? (
          <p className="text-sm text-neutral-400">No secondary CTA added yet. Click "Add CTA" to create one.</p>
        ) : (
          <div className="border border-neutral-700 bg-neutral-800 p-3 rounded mb-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-white">Secondary CTA</h4>
              <button
                type="button"
                onClick={removeSecondaryCTA}
                className="p-1 text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Label</label>
                <textarea
                  value={secondaryCTA.label ?? ''}
                  onChange={(e) => handleSecondaryCTAChange('label', e.target.value)}
                  className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter CTA text... (Press Enter for new lines)"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Link</label>
                <input
                  type="text"
                  value={secondaryCTA.link ?? ''}
                  onChange={(e) => handleSecondaryCTAChange('link', e.target.value)}
                  className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter CTA link..."
                />
              </div>
              
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Style</label>
                <select
                  value={secondaryCTA.variant || 'outline'}
                  onChange={(e) => handleSecondaryCTAChange('variant', e.target.value as 'solid' | 'outline')}
                  className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="solid">Solid</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Background Color</label>
                <input
                  type="color"
                  value={secondaryCTA.backgroundColor || '#ffffff'}
                  onChange={(e) => handleSecondaryCTAChange('backgroundColor', e.target.value)}
                  className="w-full h-10 border border-neutral-700 rounded"
                />
              </div>
              
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Text Color</label>
                <input
                  type="color"
                  value={secondaryCTA.textColor || '#000000'}
                  onChange={(e) => handleSecondaryCTAChange('textColor', e.target.value)}
                  className="w-full h-10 border border-neutral-700 rounded"
                />
              </div>
              
              {/* Icon Selection */}
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Button Icon</label>
                <select
                  value={secondaryCTA.icon ?? 'None'}
                  onChange={(e) => handleSecondaryCTAChange('icon', e.target.value)}
                  className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon.type} value={icon.type}>{icon.label}</option>
                  ))}
                </select>
                
                {/* Icon Preview */}
                {secondaryCTA.icon && secondaryCTA.icon !== 'None' && (
                  <div className="mt-2 p-2 bg-neutral-900 rounded flex items-center gap-2">
                    <ButtonIcon icon={secondaryCTA.icon} />
                    <span className="text-xs text-neutral-300">{secondaryCTA.icon}</span>
                  </div>
                )}
              </div>
              
                            {/* Icon Position - only show if an icon is selected */}
              {secondaryCTA.icon && secondaryCTA.icon !== 'None' && (
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Icon Position</label>
                  <select
                    value={secondaryCTA.iconPosition ?? 'left'}
                    onChange={(e) => handleSecondaryCTAChange('iconPosition', e.target.value as ButtonIconPosition)}
                    className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              )}
              
              {/* Icon Thickness - only show if an icon is selected */}
              {secondaryCTA.icon && secondaryCTA.icon !== 'None' && (
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Icon Thickness</label>
                  <select
                    value={secondaryCTA.iconThickness ?? 'normal'}
                    onChange={(e) => handleSecondaryCTAChange('iconThickness', e.target.value as 'thin' | 'normal' | 'thick')}
                    className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="thin">Thin</option>
                    <option value="normal">Normal</option>
                    <option value="thick">Thick</option>
                  </select>
                </div>
              )}
              
              {/* Border Radius */}
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Border Radius</label>
                <select
                  value={secondaryCTA.borderRadius ?? 'md'}
                  onChange={(e) => handleSecondaryCTAChange('borderRadius', e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'full')}
                  className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="none">None</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="full">Full (Circle)</option>
                </select>
              </div>
              {/* Button Size */}
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Button Size</label>
                <select
                  value={secondaryCTA.size ?? 'medium'}
                  onChange={(e) => handleSecondaryCTAChange('size', e.target.value as 'small' | 'medium' | 'large')}
                  className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Tertiary CTA Section */}
      {updateHeroItemTertiaryCTA && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-300">Tertiary CTA</label>
            <button
              type="button"
              onClick={addTertiaryCTA}
              disabled={!!tertiaryCTA}
              className={`px-2 py-1 text-xs rounded ${
                tertiaryCTA 
                  ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Add Third CTA
            </button>
          </div>
          
          {!tertiaryCTA ? (
            <p className="text-sm text-neutral-400">No tertiary CTA added yet. Click "Add Third CTA" to create one.</p>
          ) : (
            <div className="border border-neutral-700 bg-neutral-800 p-3 rounded mb-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-white">Tertiary CTA</h4>
                <button
                  type="button"
                  onClick={removeTertiaryCTA}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Label</label>
                  <textarea
                    value={tertiaryCTA.label ?? ''}
                    onChange={(e) => handleTertiaryCTAChange('label', e.target.value)}
                    className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter CTA text... (Press Enter for new lines)"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Link</label>
                  <input
                    type="text"
                    value={tertiaryCTA.link ?? ''}
                    onChange={(e) => handleTertiaryCTAChange('link', e.target.value)}
                    className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter CTA link..."
                  />
                </div>
                
                <div>
               <label className="block text-xs text-neutral-300 mb-1">Style</label>
                <select
                  value={tertiaryCTA.variant || 'outline'}
                  onChange={(e) => handleTertiaryCTAChange('variant', e.target.value as 'solid' | 'outline')}
                  className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="solid">Solid</option>
                  <option value="outline">Outline</option>
                </select>
                </div>
                
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={tertiaryCTA.backgroundColor || '#333333'}
                    onChange={(e) => handleTertiaryCTAChange('backgroundColor', e.target.value)}
                    className="w-full h-10 border border-neutral-700 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={tertiaryCTA.textColor || '#ffffff'}
                    onChange={(e) => handleTertiaryCTAChange('textColor', e.target.value)}
                    className="w-full h-10 border border-neutral-700 rounded"
                  />
                </div>
                
                {/* Icon Selection */}
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Button Icon</label>
                  <select
                    value={tertiaryCTA.icon ?? 'None'}
                    onChange={(e) => handleTertiaryCTAChange('icon', e.target.value)}
                    className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {AVAILABLE_ICONS.map(icon => (
                      <option key={icon.type} value={icon.type}>{icon.label}</option>
                    ))}
                  </select>
                  
                  {/* Icon Preview */}
                  {tertiaryCTA.icon && tertiaryCTA.icon !== 'None' && (
                    <div className="mt-2 p-2 bg-neutral-900 rounded flex items-center gap-2">
                      <ButtonIcon icon={tertiaryCTA.icon} />
                      <span className="text-xs text-neutral-300">{tertiaryCTA.icon}</span>
                    </div>
                  )}
                </div>
                
                {/* Icon Position - only show if an icon is selected */}
                {tertiaryCTA.icon && tertiaryCTA.icon !== 'None' && (
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Icon Position</label>
                    <select
                      value={tertiaryCTA.iconPosition ?? 'left'}
                      onChange={(e) => handleTertiaryCTAChange('iconPosition', e.target.value as ButtonIconPosition)}
                      className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                )}
                
                {/* Icon Thickness - only show if an icon is selected */}
                {tertiaryCTA.icon && tertiaryCTA.icon !== 'None' && (
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Icon Thickness</label>
                    <select
                      value={tertiaryCTA.iconThickness ?? 'normal'}
                      onChange={(e) => handleTertiaryCTAChange('iconThickness', e.target.value as 'thin' | 'normal' | 'thick')}
                      className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="thin">Thin</option>
                      <option value="normal">Normal</option>
                      <option value="thick">Thick</option>
                    </select>
                  </div>
                )}
                
                {/* Border Radius */}
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Border Radius</label>
                  <select
                    value={tertiaryCTA.borderRadius ?? 'md'}
                    onChange={(e) => handleTertiaryCTAChange('borderRadius', e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'full')}
                    className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="full">Full (Circle)</option>
                  </select>
                </div>
                
                {/* Button Size */}
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Button Size</label>
                  <select
                    value={tertiaryCTA.size ?? 'medium'}
                    onChange={(e) => handleTertiaryCTAChange('size', e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full p-2 border border-neutral-700 bg-neutral-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CTAsTab;
