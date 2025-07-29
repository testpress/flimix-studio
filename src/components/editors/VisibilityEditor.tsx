import React from 'react';
import type { VisibilityProps, Platform } from '../../schema/blockTypes';

interface VisibilityEditorProps {
  visibility: VisibilityProps;
  onChange: (newVisibility: VisibilityProps) => void;
}

const VisibilityEditor: React.FC<VisibilityEditorProps> = ({ visibility, onChange }) => {
  const handleVisibilityChange = (field: keyof VisibilityProps, value: any) => {
    const newVisibility = {
      ...visibility,
      [field]: value
    };
    onChange(newVisibility);
  };

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    const currentPlatforms = visibility.platform || [];
    
    let newPlatforms: Platform[];
    if (checked) {
      newPlatforms = [...currentPlatforms, platform];
    } else {
      newPlatforms = currentPlatforms.filter(p => p !== platform);
    }
    
    handleVisibilityChange('platform', newPlatforms);
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    const currentRegions = visibility.region || [];
    
    let newRegions: string[];
    if (checked) {
      newRegions = [...currentRegions, region];
    } else {
      newRegions = currentRegions.filter(r => r !== region);
    }
    
    handleVisibilityChange('region', newRegions);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">Visibility Rules</h3>
      <div className="space-y-3">
        {/* User State */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={visibility.isLoggedIn ?? false}
              onChange={(e) => handleVisibilityChange('isLoggedIn', e.target.checked)}
              className="rounded"
            />
            Require Logged In
          </label>
          
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={visibility.isSubscribed ?? false}
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
            value={visibility.subscriptionTier || ''}
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
                  checked={visibility.platform?.includes(platform) ?? false}
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
                  checked={visibility.region?.includes(region) ?? false}
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
  );
};

export default VisibilityEditor; 