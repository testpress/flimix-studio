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
  const secondaryCTA = currentItem.secondary_cta;
  const tertiaryCTA = currentItem.tertiary_cta;

  // Generic handler for primary CTA changes
  const handlePrimaryCTAChange = (field: keyof HeroCTABtn, value: string | boolean) => {
    const newCTA = {
      ...(currentItem.primary_cta || {}),
      label: currentItem.primary_cta?.label ?? 'CTA',
      link: currentItem.primary_cta?.link ?? '#',
      variant: currentItem.primary_cta?.variant ?? 'solid',
      background_color: currentItem.primary_cta?.background_color ?? '#dc2626',
      text_color: currentItem.primary_cta?.text_color ?? '#ffffff',
      icon: currentItem.primary_cta?.icon ?? 'None',
      icon_position: currentItem.primary_cta?.icon_position ?? 'left',
      icon_thickness: currentItem.primary_cta?.icon_thickness ?? 'normal',
      border_radius: currentItem.primary_cta?.border_radius ?? 'md',
      size: currentItem.primary_cta?.size ?? 'medium',
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
      icon_position: secondaryCTA.icon_position ?? 'left',
      icon_thickness: secondaryCTA.icon_thickness ?? 'normal',
      border_radius: secondaryCTA.border_radius ?? 'md',
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
      icon_position: tertiaryCTA.icon_position ?? 'left',
      icon_thickness: tertiaryCTA.icon_thickness ?? 'normal',
      border_radius: tertiaryCTA.border_radius ?? 'md',
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
      background_color: '#ffffff',
      text_color: '#000000',
      icon: 'None' as const,
      icon_position: 'right' as const,
      icon_thickness: 'normal' as const,
      border_radius: 'md' as const,
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
      background_color: '#333333',
      text_color: '#ffffff',
      icon: 'None' as const,
      icon_position: 'right' as const,
      icon_thickness: 'normal' as const,
      border_radius: 'md' as const,
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
      <div className="border p-3 rounded">
        <h4 className="text-xs font-medium mb-3">Primary CTA</h4>

        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Label</label>
            <textarea
              value={currentItem.primary_cta?.label ?? ''}
              onChange={(e) => handlePrimaryCTAChange('label', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded resize-none"
              placeholder="Enter CTA text... (Press Enter for new lines)"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Link</label>
            <input
              type="text"
              value={currentItem.primary_cta?.link ?? ''}
              onChange={(e) => handlePrimaryCTAChange('link', e.target.value)}
              className={`w-full p-2 border border-gray-300 rounded ${currentItem.content_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
              placeholder="Enter CTA link..."
              disabled={!!currentItem.content_id}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Style</label>
            <select
              value={currentItem.primary_cta?.variant || 'solid'}
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
              value={currentItem.primary_cta?.background_color || '#dc2626'}
              onChange={(e) => handlePrimaryCTAChange('background_color', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
            <input
              type="color"
              value={currentItem.primary_cta?.text_color || '#ffffff'}
              onChange={(e) => handlePrimaryCTAChange('text_color', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Button Icon</label>
            <select
              value={currentItem.primary_cta?.icon ?? 'None'}
              onChange={(e) => handlePrimaryCTAChange('icon', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {AVAILABLE_ICONS.map(icon => (
                <option key={icon.type} value={icon.type}>{icon.label}</option>
              ))}
            </select>

            {/* Icon Preview */}
            {currentItem.primary_cta?.icon && currentItem.primary_cta.icon !== 'None' && (
              <div className="mt-2 p-2 bg-gray-100 rounded flex items-center gap-2">
                <ButtonIcon icon={currentItem.primary_cta.icon} />
                <span className="text-xs">{currentItem.primary_cta.icon}</span>
              </div>
            )}
          </div>

          {/* Icon Position - only show if an icon is selected */}
          {currentItem.primary_cta?.icon && currentItem.primary_cta.icon !== 'None' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">Icon Position</label>
              <select
                value={currentItem.primary_cta?.icon_position ?? 'left'}
                onChange={(e) => handlePrimaryCTAChange('icon_position', e.target.value as ButtonIconPosition)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}

          {/* Icon Thickness - only show if an icon is selected */}
          {currentItem.primary_cta?.icon && currentItem.primary_cta.icon !== 'None' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">Icon Thickness</label>
              <select
                value={currentItem.primary_cta?.icon_thickness ?? 'normal'}
                onChange={(e) => handlePrimaryCTAChange('icon_thickness', e.target.value as 'thin' | 'normal' | 'thick')}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="thin">Thin</option>
                <option value="normal">Normal</option>
                <option value="thick">Thick</option>
              </select>
            </div>
          )}

          {/* Border Radius */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
            <select
              value={currentItem.primary_cta?.border_radius ?? 'md'}
              onChange={(e) => handlePrimaryCTAChange('border_radius', e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'full')}
              className="w-full p-2 border border-gray-300 rounded"
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
            <label className="block text-xs text-gray-600 mb-1">Button Size</label>
            <select
              value={currentItem.primary_cta?.size ?? 'medium'}
              onChange={(e) => handlePrimaryCTAChange('size', e.target.value as 'small' | 'medium' | 'large')}
              className="w-full p-2 border border-gray-300 rounded"
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
          <label className="block text-sm font-medium text-gray-700">Secondary CTA</label>
          <button
            type="button"
            onClick={addSecondaryCTA}
            disabled={!!secondaryCTA}
            className={`px-2 py-1 text-xs rounded ${secondaryCTA
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
                <textarea
                  value={secondaryCTA.label ?? ''}
                  onChange={(e) => handleSecondaryCTAChange('label', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded resize-none"
                  placeholder="Enter CTA text... (Press Enter for new lines)"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Link</label>
                <input
                  type="text"
                  value={secondaryCTA.link ?? ''}
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
                  value={secondaryCTA.background_color || '#ffffff'}
                  onChange={(e) => handleSecondaryCTAChange('background_color', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                <input
                  type="color"
                  value={secondaryCTA.text_color || '#000000'}
                  onChange={(e) => handleSecondaryCTAChange('text_color', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Button Icon</label>
                <select
                  value={secondaryCTA.icon ?? 'None'}
                  onChange={(e) => handleSecondaryCTAChange('icon', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon.type} value={icon.type}>{icon.label}</option>
                  ))}
                </select>

                {/* Icon Preview */}
                {secondaryCTA.icon && secondaryCTA.icon !== 'None' && (
                  <div className="mt-2 p-2 bg-gray-100 rounded flex items-center gap-2">
                    <ButtonIcon icon={secondaryCTA.icon} />
                    <span className="text-xs">{secondaryCTA.icon}</span>
                  </div>
                )}
              </div>

              {/* Icon Position - only show if an icon is selected */}
              {secondaryCTA.icon && secondaryCTA.icon !== 'None' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Icon Position</label>
                  <select
                    value={secondaryCTA.icon_position ?? 'left'}
                    onChange={(e) => handleSecondaryCTAChange('icon_position', e.target.value as ButtonIconPosition)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              )}

              {/* Icon Thickness - only show if an icon is selected */}
              {secondaryCTA.icon && secondaryCTA.icon !== 'None' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Icon Thickness</label>
                  <select
                    value={secondaryCTA.icon_thickness ?? 'normal'}
                    onChange={(e) => handleSecondaryCTAChange('icon_thickness', e.target.value as 'thin' | 'normal' | 'thick')}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="thin">Thin</option>
                    <option value="normal">Normal</option>
                    <option value="thick">Thick</option>
                  </select>
                </div>
              )}

              {/* Border Radius */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                <select
                  value={secondaryCTA.border_radius ?? 'md'}
                  onChange={(e) => handleSecondaryCTAChange('border_radius', e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'full')}
                  className="w-full p-2 border border-gray-300 rounded"
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
                <label className="block text-xs text-gray-600 mb-1">Button Size</label>
                <select
                  value={secondaryCTA.size ?? 'medium'}
                  onChange={(e) => handleSecondaryCTAChange('size', e.target.value as 'small' | 'medium' | 'large')}
                  className="w-full p-2 border border-gray-300 rounded"
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
            <label className="block text-sm font-medium text-gray-700">Tertiary CTA</label>
            <button
              type="button"
              onClick={addTertiaryCTA}
              disabled={!!tertiaryCTA}
              className={`px-2 py-1 text-xs rounded ${tertiaryCTA
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              Add Third CTA
            </button>
          </div>

          {!tertiaryCTA ? (
            <p className="text-sm text-gray-500">No tertiary CTA added yet. Click "Add Third CTA" to create one.</p>
          ) : (
            <div className="border p-3 rounded mb-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium">Tertiary CTA</h4>
                <button
                  type="button"
                  onClick={removeTertiaryCTA}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Label</label>
                  <textarea
                    value={tertiaryCTA.label ?? ''}
                    onChange={(e) => handleTertiaryCTAChange('label', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                    placeholder="Enter CTA text... (Press Enter for new lines)"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Link</label>
                  <input
                    type="text"
                    value={tertiaryCTA.link ?? ''}
                    onChange={(e) => handleTertiaryCTAChange('link', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter CTA link..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Style</label>
                  <select
                    value={tertiaryCTA.variant || 'outline'}
                    onChange={(e) => handleTertiaryCTAChange('variant', e.target.value as 'solid' | 'outline')}
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
                    value={tertiaryCTA.background_color || '#333333'}
                    onChange={(e) => handleTertiaryCTAChange('background_color', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={tertiaryCTA.text_color || '#ffffff'}
                    onChange={(e) => handleTertiaryCTAChange('text_color', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Button Icon</label>
                  <select
                    value={tertiaryCTA.icon ?? 'None'}
                    onChange={(e) => handleTertiaryCTAChange('icon', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {AVAILABLE_ICONS.map(icon => (
                      <option key={icon.type} value={icon.type}>{icon.label}</option>
                    ))}
                  </select>

                  {/* Icon Preview */}
                  {tertiaryCTA.icon && tertiaryCTA.icon !== 'None' && (
                    <div className="mt-2 p-2 bg-gray-100 rounded flex items-center gap-2">
                      <ButtonIcon icon={tertiaryCTA.icon} />
                      <span className="text-xs">{tertiaryCTA.icon}</span>
                    </div>
                  )}
                </div>

                {/* Icon Position - only show if an icon is selected */}
                {tertiaryCTA.icon && tertiaryCTA.icon !== 'None' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Icon Position</label>
                    <select
                      value={tertiaryCTA.icon_position ?? 'left'}
                      onChange={(e) => handleTertiaryCTAChange('icon_position', e.target.value as ButtonIconPosition)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                )}

                {/* Icon Thickness - only show if an icon is selected */}
                {tertiaryCTA.icon && tertiaryCTA.icon !== 'None' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Icon Thickness</label>
                    <select
                      value={tertiaryCTA.icon_thickness ?? 'normal'}
                      onChange={(e) => handleTertiaryCTAChange('icon_thickness', e.target.value as 'thin' | 'normal' | 'thick')}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="thin">Thin</option>
                      <option value="normal">Normal</option>
                      <option value="thick">Thick</option>
                    </select>
                  </div>
                )}

                {/* Border Radius */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                  <select
                    value={tertiaryCTA.border_radius ?? 'md'}
                    onChange={(e) => handleTertiaryCTAChange('border_radius', e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'full')}
                    className="w-full p-2 border border-gray-300 rounded"
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
                  <label className="block text-xs text-gray-600 mb-1">Button Size</label>
                  <select
                    value={tertiaryCTA.size ?? 'medium'}
                    onChange={(e) => handleTertiaryCTAChange('size', e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full p-2 border border-gray-300 rounded"
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
