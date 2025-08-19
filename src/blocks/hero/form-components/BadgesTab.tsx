import React from 'react';
import type { HeroItem, HeroBadge } from '../schema';
import { generateUniqueId } from '@utils/id';

interface BadgesTabProps {
  currentItem: HeroItem;
  updateHeroItemBadges: (badges: HeroBadge[]) => void;
}

const BadgesTab: React.FC<BadgesTabProps> = ({
  currentItem,
  updateHeroItemBadges
}) => {
  // Ensure all badges have IDs (migration for existing data)
  const badges = (currentItem.badges || []).map(badge => 
    badge.id ? badge : { ...badge, id: generateUniqueId() }
  );
  
  // Update badges if any were missing IDs
  React.useEffect(() => {
    if (currentItem.badges && currentItem.badges.some(badge => !badge.id)) {
      updateHeroItemBadges(badges);
    }
  }, [currentItem.badges, updateHeroItemBadges]);

  const addBadge = () => {
    if (badges.length >= 3) {
      return;
    }
    
    const newBadges = [
      ...badges,
      { id: generateUniqueId(), label: 'New Badge' }
    ];
    
    updateHeroItemBadges(newBadges);
  };

  const removeBadge = (badgeId: string) => {
    const newBadges = badges.filter(badge => badge.id !== badgeId);
    updateHeroItemBadges(newBadges);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">Badges (Max 3)</label>
        <button
          type="button"
          onClick={addBadge}
          disabled={badges.length >= 3}
          className={`px-2 py-1 text-xs rounded ${
            badges.length >= 3 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Add Badge
        </button>
      </div>
      
      {badges.length === 0 ? (
        <p className="text-sm text-gray-500">No badges added yet. Click "Add Badge" to create one.</p>
      ) : (
        badges.map((badge) => (
          <div key={badge.id} className="flex items-center gap-2">
            <input
              type="text"
              value={badge.label}
              onChange={(e) => {
                const newBadges = badges.map(b => 
                  b.id === badge.id ? { ...b, label: e.target.value } : b
                );
                updateHeroItemBadges(newBadges);
              }}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="Enter badge text..."
            />
            <button
              type="button"
              onClick={() => removeBadge(badge.id)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BadgesTab;
