import React from 'react';
import type { HeroItem, HeroMetadata } from '../schema';

interface MetadataTabProps {
  currentItem: HeroItem;
  updateHeroItemMetadata: (metadata: HeroMetadata) => void;
}

const MetadataTab: React.FC<MetadataTabProps> = ({
  currentItem,
  updateHeroItemMetadata
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="text"
            value={currentItem.metadata?.year || ''}
            onChange={(e) => updateHeroItemMetadata({
              ...currentItem.metadata,
              year: e.target.value
            })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter year..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seasons</label>
          <input
            type="text"
            value={currentItem.metadata?.seasons || ''}
            onChange={(e) => updateHeroItemMetadata({
              ...currentItem.metadata,
              seasons: e.target.value
            })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter seasons..."
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
        <input
          type="text"
          value={currentItem.metadata?.language || ''}
          onChange={(e) => updateHeroItemMetadata({
            ...currentItem.metadata,
            language: e.target.value
          })}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter language..."
        />
      </div>
    </div>
  );
};

export default MetadataTab;
