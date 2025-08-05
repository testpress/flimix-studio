import React from 'react';
import type { VisibilityProps, Platform } from '@blocks/shared/Visibility';
import type { Block } from '@blocks/shared/Block';

interface VisibilityFormProps {
  block: Block; // Using the proper Block type
  visibility: VisibilityProps;
  onUpdateVisibility: (visibility: VisibilityProps) => void;
}

const VisibilityForm: React.FC<VisibilityFormProps> = ({ 
  visibility, 
  onUpdateVisibility 
}) => {
  const handleBooleanChange = (key: keyof VisibilityProps, value: boolean) => {
    onUpdateVisibility({
      ...visibility,
      [key]: value
    });
  };

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    const currentPlatforms = visibility.platform || [];
    
    let newPlatforms: Platform[];
    if (checked) {
      newPlatforms = [...currentPlatforms, platform];
    } else {
      newPlatforms = currentPlatforms.filter(p => p !== platform);
    }
    
    onUpdateVisibility({
      ...visibility,
      platform: newPlatforms
    });
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    const currentRegions = visibility.region || [];
    
    let newRegions: string[];
    if (checked) {
      newRegions = [...currentRegions, region];
    } else {
      newRegions = currentRegions.filter(r => r !== region);
    }
    
    onUpdateVisibility({
      ...visibility,
      region: newRegions
    });
  };

  const handleSubscriptionTierChange = (tier: string) => {
    onUpdateVisibility({
      ...visibility,
      subscriptionTier: tier || undefined
    });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-4">Visibility Settings</h3>
      
      <div className="space-y-4">
        {/* Authentication */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Authentication</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={visibility.isLoggedIn || false}
                onChange={(e) => handleBooleanChange('isLoggedIn', e.target.checked)}
                className="rounded"
              />
              <span>Require user to be logged in</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={visibility.isSubscribed || false}
                onChange={(e) => handleBooleanChange('isSubscribed', e.target.checked)}
                className="rounded"
              />
              <span>Require user to be subscribed</span>
            </label>
          </div>
        </div>

        {/* Subscription Tier */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Subscription Tier</label>
          <select
            value={visibility.subscriptionTier || ''}
            onChange={(e) => handleSubscriptionTierChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
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
                  checked={visibility.platform?.includes(platform) || false}
                  onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                  className="rounded"
                />
                <span className="capitalize">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Region</label>
          <div className="space-y-1">
            {['US', 'IN', 'UK', 'CA', 'AU'].map((region) => (
              <label key={region} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={visibility.region?.includes(region) || false}
                  onChange={(e) => handleRegionChange(region, e.target.checked)}
                  className="rounded"
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibilityForm; 