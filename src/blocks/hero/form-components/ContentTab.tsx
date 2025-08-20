import React from 'react';
import type { HeroBlock, HeroItem, HeroHashtag } from '../schema';

interface ContentTabProps {
  heroBlock: HeroBlock;
  currentItem: HeroItem;
  updateProps: (props: any) => void;
  updateHeroItemTitle: (title: string) => void;
  updateHeroItemSubtitle: (subtitle: string) => void;
  updateHeroItemBackgroundImage: (backgroundImage: string) => void;
  updateHeroItemVideoBackground: (videoBackground: string) => void;
  updateHeroItemHashtag: (hashtag: HeroHashtag | undefined) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({
  heroBlock,
  currentItem,
  updateProps,
  updateHeroItemTitle,
  updateHeroItemSubtitle,
  updateHeroItemBackgroundImage,
  updateHeroItemVideoBackground,
  updateHeroItemHashtag
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Variant</label>
          <select
            value={heroBlock.props.variant || 'single'}
            onChange={(e) => updateProps({ ...heroBlock.props, variant: e.target.value as 'single' | 'carousel' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="single">Single</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
          <select
            value={heroBlock.props.aspectRatio || '16:9'}
            onChange={(e) => updateProps({ ...heroBlock.props, aspectRatio: e.target.value as '16:9' | 'auto' | 'custom' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="16:9">16:9</option>
            <option value="auto">Auto</option>
            <option value="custom">Custom Height</option>
          </select>
        </div>
      </div>
      
      {heroBlock.props.aspectRatio === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Height</label>
          <div className="flex items-center">
            <input
              type="number"
              value={heroBlock.props.customHeight ? parseInt(heroBlock.props.customHeight) : 600}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                // Allow transient invalid states during typing, only update if value is valid
                if (!isNaN(value) && value >= 600 && value <= 1000) {
                  updateProps({ ...heroBlock.props, customHeight: `${value}px` });
                }
                // Don't reset on empty input - let user type freely
              }}
              onBlur={(e) => {
                // Validate and reset to valid value only when user leaves the field
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 600 || value > 1000) {
                  updateProps({ ...heroBlock.props, customHeight: '600px' });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter height in pixels"
              min="600"
              max="1000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter a custom height value in pixels (min: 600px, max: 1000px)
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={currentItem.title || ''}
            onChange={(e) => updateHeroItemTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter hero title..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            value={currentItem.subtitle || ''}
            onChange={(e) => updateHeroItemSubtitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter hero subtitle..."
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
        <input
          type="url"
          value={currentItem.backgroundImage || ''}
          onChange={(e) => updateHeroItemBackgroundImage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter image URL..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Video Background URL</label>
        <input
          type="url"
          value={currentItem.videoBackground || ''}
          onChange={(e) => updateHeroItemVideoBackground(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter video URL (MP4 or M3U8/HLS streaming format)..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Video will take priority over background image if both are provided
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hashtag Text</label>
          <input
            type="text"
            value={currentItem.hashtag?.text || ''}
            onChange={(e) => {
              const text = e.target.value;
              if (text) {
                updateHeroItemHashtag({
                  ...currentItem.hashtag,
                  text: text.startsWith('#') ? text : `#${text}`
                });
              } else {
                updateHeroItemHashtag(undefined);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter hashtag text (e.g. trending)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hashtag Color</label>
          <input
            type="color"
            value={currentItem.hashtag?.color || '#dc2626'}
            onChange={(e) => {
              if (currentItem.hashtag) {
                updateHeroItemHashtag({
                  ...currentItem.hashtag,
                  color: e.target.value
                });
              } else {
                updateHeroItemHashtag({
                  text: '#trending',
                  color: e.target.value
                });
              }
            }}
            className="w-10 h-10 border-0 p-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
