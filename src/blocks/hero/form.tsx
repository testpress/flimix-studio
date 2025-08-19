import React, { useState } from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { HeroBlock, HeroMetadata, HeroBadge, HeroCTABtn } from './schema';
import { generateUniqueId } from '@utils/id';

const HeroForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const heroBlock = block as HeroBlock;
  const [activeTab, setActiveTab] = useState('content');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  // Get the current hero item
  const currentItem = heroBlock.props.items?.[currentItemIndex] || {
    id: generateUniqueId(),
    title: '',
    subtitle: '',
    backgroundImage: ''
  };
  
  // Helper function to create a default hero item
  const createDefaultHeroItem = () => ({
    id: generateUniqueId(),
    title: '',
    subtitle: '',
    backgroundImage: ''
  });

  // Specific update functions for better type safety and maintainability
  const updateHeroItemTitle = (title: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].title = title;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemSubtitle = (subtitle: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].subtitle = subtitle;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemBackgroundImage = (backgroundImage: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].backgroundImage = backgroundImage;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemVideoBackground = (videoBackground: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].videoBackground = videoBackground;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemMetadata = (metadata: HeroMetadata) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].metadata = metadata;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemBadges = (badges: HeroBadge[]) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].badges = badges;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemPrimaryCTA = (primaryCTA: HeroCTABtn) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].primaryCTA = primaryCTA;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemSecondaryCTAs = (secondaryCTAs: HeroCTABtn[]) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].secondaryCTAs = secondaryCTAs;
    updateProps({ ...heroBlock.props, items: newItems });
  };
  
  // Add a new badge (limit to 3)
  const addBadge = () => {
    const currentBadges = currentItem.badges || [];
    if (currentBadges.length >= 3) {
      return; 
    }
    
    const newBadges = [
      ...currentBadges,
      { label: 'New Badge' }
    ];
    
    updateHeroItemBadges(newBadges);
  };
  
  // Remove a badge
  const removeBadge = (index: number) => {
    const currentBadges = currentItem.badges || [];
    const newBadges = [...currentBadges];
    newBadges.splice(index, 1);
    
    updateHeroItemBadges(newBadges);
  };
  
  // Add a secondary CTA (limit to 1)
  const addSecondaryCTA = () => {
    const currentCTAs = currentItem.secondaryCTAs || [];
    if (currentCTAs.length >= 1) {
      return;
    }
    
    const newCTAs = [
      ...currentCTAs,
      { label: 'New CTA', link: '#', variant: 'outline' as const, backgroundColor: '#ffffff', textColor: '#000000' }
    ];
    
    updateHeroItemSecondaryCTAs(newCTAs);
  };
  
  // Remove a secondary CTA
  const removeSecondaryCTA = (index: number) => {
    const currentCTAs = currentItem.secondaryCTAs || [];
    const newCTAs = [...currentCTAs];
    newCTAs.splice(index, 1);
    
    updateHeroItemSecondaryCTAs(newCTAs);
  };
  
  // Add a new hero item (for carousel)
  const addHeroItem = () => {
    const newItems = [...(heroBlock.props.items || [])];
    newItems.push({
      id: generateUniqueId(),
      title: 'New Hero Screen',
      subtitle: 'Add your content here',
      backgroundImage: ''
    });
    
    updateProps({
      ...heroBlock.props,
      items: newItems
    });
    
    // Switch to the new item
    setCurrentItemIndex(newItems.length - 1);
  };
  
  // Remove the current hero item
  const removeHeroItem = () => {
    if (heroBlock.props.items?.length <= 1) {
      // Don't remove the last item
      return;
    }
    
    const newItems = [...(heroBlock.props.items || [])];
    newItems.splice(currentItemIndex, 1);
    
    updateProps({
      ...heroBlock.props,
      items: newItems
    });
    
    // Adjust current index if needed
    if (currentItemIndex >= newItems.length) {
      setCurrentItemIndex(Math.max(0, newItems.length - 1));
    }
  };
  
  // Get badges from the current item
  const badges = currentItem.badges || [];
  
  // Get secondary CTAs from the current item
  const secondaryCTAs = currentItem.secondaryCTAs || [];
  
  return (
    <div>
      {/* Tabs navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('metadata')}
        >
          Metadata
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'badges' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'ctas' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('ctas')}
        >
          CTAs
        </button>
      </div>
      
      {/* Hero items navigation (only for carousel variant) */}
      {heroBlock.props.variant === 'carousel' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Hero Screens</label>
            <button
              type="button"
              onClick={addHeroItem}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Screen
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {heroBlock.props.items?.map((item, index) => (
              <button
                key={item.id}
                className={`px-3 py-1 text-sm rounded ${
                  index === currentItemIndex ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setCurrentItemIndex(index)}
              >
                Screen {index + 1}
              </button>
            ))}
          </div>
          
          {heroBlock.props.items && heroBlock.props.items.length > 1 && (
            <button
              type="button"
              onClick={removeHeroItem}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove Current Screen
            </button>
          )}
        </div>
      )}
      
      {/* Content tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Variant</label>
            <select
              value={heroBlock.props.variant || 'single'}
              onChange={(e) => updateProps({ ...heroBlock.props, variant: e.target.value as 'single' | 'carousel' })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="single">Single Hero</option>
              <option value="carousel">Carousel</option>
            </select>
          </div>
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
              <textarea
                value={currentItem.subtitle || ''}
                onChange={(e) => updateHeroItemSubtitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
                placeholder="Enter hero subtitle..."
              />
           </div>       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
            <input
              type="text"
              value={currentItem.backgroundImage || ''}
              onChange={(e) => updateHeroItemBackgroundImage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter image URL..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Background URL</label>
            <input
              type="text"
              value={currentItem.videoBackground || ''}
              onChange={(e) => updateHeroItemVideoBackground(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter video URL..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Add a video URL to create an autoplay background (MP4 or M3U8/HLS streaming format)
            </p>
          </div>
          
          {heroBlock.props.variant === 'carousel' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Show Navigation Arrows</label>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="showArrows"
                    checked={heroBlock.props.showArrows || false}
                    onChange={(e) => updateProps({ ...heroBlock.props, showArrows: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="showArrows" className="ml-2 text-sm text-gray-700">
                    Enable navigation arrows
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autoplay</label>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="autoplay"
                    checked={heroBlock.props.autoplay || false}
                    onChange={(e) => updateProps({ ...heroBlock.props, autoplay: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="autoplay" className="ml-2 text-sm text-gray-700">
                    Enable autoplay
                  </label>
                </div>
              </div>
              


              {heroBlock.props.autoplay && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scroll Speed (ms)</label>
                  <select
                    value={heroBlock.props.scrollSpeed || 5000}
                    onChange={(e) => updateProps({ ...heroBlock.props, scrollSpeed: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value={3000}>Fast (3 seconds)</option>
                    <option value={5000}>Normal (5 seconds)</option>
                    <option value={8000}>Slow (8 seconds)</option>
                  </select>
                </div>
              )}
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
            <select
              value={heroBlock.props.aspectRatio || '16:9'}
              onChange={(e) => updateProps({ ...heroBlock.props, aspectRatio: e.target.value as '16:9' | 'auto' | 'custom' })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="16:9">16:9 (Widescreen)</option>
              <option value="auto">Auto (Flexible Height)</option>
              <option value="custom">Custom Height</option>
            </select>
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
                    // Only update if value is valid and within range
                    if (!isNaN(value) && value >= 600 && value <= 1000) {
                      updateProps({ ...heroBlock.props, customHeight: `${value}px` });
                    } else if (e.target.value === '') {
                      // If input is cleared, reset to minimum value
                      updateProps({ ...heroBlock.props, customHeight: '600px' });
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure valid value on blur (when user leaves the field)
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
        </div>
      )}
      
      {/* Metadata tab */}
      {activeTab === 'metadata' && (
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
      )}
      {/* Badges tab */}
      {activeTab === 'badges' && (
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
            badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={badge.label}
                  onChange={(e) => {
                    const newBadges = [...badges];
                    newBadges[index] = { label: e.target.value };
                    updateHeroItemBadges(newBadges);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Badge text..."
                />
                <button
                  type="button"
                  onClick={() => removeBadge(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {/* CTAs tab */}
      {activeTab === 'ctas' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Primary CTA</h3>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Label</label>
                <input
                  type="text"
                  value={currentItem.primaryCTA?.label || ''}
                  onChange={(e) => updateHeroItemPrimaryCTA({
                    label: e.target.value,
                    link: currentItem.primaryCTA?.link || '#',
                    variant: currentItem.primaryCTA?.variant || 'solid',
                    backgroundColor: currentItem.primaryCTA?.backgroundColor || '#dc2626',
                    textColor: currentItem.primaryCTA?.textColor || '#ffffff'
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter CTA text..."
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Link</label>
                <input
                  type="text"
                  value={currentItem.primaryCTA?.link || ''}
                  onChange={(e) => updateHeroItemPrimaryCTA({
                    label: currentItem.primaryCTA?.label || '',
                    link: e.target.value,
                    variant: currentItem.primaryCTA?.variant || 'solid',
                    backgroundColor: currentItem.primaryCTA?.backgroundColor || '#dc2626',
                    textColor: currentItem.primaryCTA?.textColor || '#ffffff'
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter CTA link..."
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Style</label>
                <select
                  value={currentItem.primaryCTA?.variant || 'solid'}
                  onChange={(e) => updateHeroItemPrimaryCTA({
                    label: currentItem.primaryCTA?.label || '',
                    link: currentItem.primaryCTA?.link || '#',
                    variant: e.target.value as 'solid' | 'outline',
                    backgroundColor: currentItem.primaryCTA?.backgroundColor || '#dc2626',
                    textColor: currentItem.primaryCTA?.textColor || '#ffffff'
                  })}
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
                  onChange={(e) => updateHeroItemPrimaryCTA({
                    label: currentItem.primaryCTA?.label || '',
                    link: currentItem.primaryCTA?.link || '#',
                    variant: currentItem.primaryCTA?.variant || 'solid',
                    backgroundColor: e.target.value,
                    textColor: currentItem.primaryCTA?.textColor || '#ffffff'
                  })}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                <input
                  type="color"
                  value={currentItem.primaryCTA?.textColor || '#ffffff'}
                  onChange={(e) => updateHeroItemPrimaryCTA({
                    label: currentItem.primaryCTA?.label || '',
                    link: currentItem.primaryCTA?.link || '#',
                    variant: currentItem.primaryCTA?.variant || 'solid',
                    backgroundColor: currentItem.primaryCTA?.backgroundColor || '#dc2626',
                    textColor: e.target.value
                  })}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Secondary CTA</h3>
              <button
                type="button"
                onClick={addSecondaryCTA}
                disabled={secondaryCTAs.length >= 1}
                className={`px-2 py-1 text-xs rounded ${
                  secondaryCTAs.length >= 1 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Add CTA
              </button>
            </div>
            
            {secondaryCTAs.length === 0 ? (
              <p className="text-sm text-gray-500">No secondary CTAs added yet. Click "Add CTA" to create one.</p>
            ) : (
              secondaryCTAs.map((cta, index) => (
                <div key={index} className="border p-3 rounded mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium">Secondary CTA {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeSecondaryCTA(index)}
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
                        value={cta.label || ''}
                        onChange={(e) => {
                          const newCTAs = [...secondaryCTAs];
                          newCTAs[index] = { ...cta, label: e.target.value };
                          updateHeroItemSecondaryCTAs(newCTAs);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter CTA text..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Link</label>
                      <input
                        type="text"
                        value={cta.link || ''}
                        onChange={(e) => {
                          const newCTAs = [...secondaryCTAs];
                          newCTAs[index] = { ...cta, link: e.target.value };
                          updateHeroItemSecondaryCTAs(newCTAs);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter CTA link..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Style</label>
                      <select
                        value={cta.variant || 'outline'}
                        onChange={(e) => {
                          const newCTAs = [...secondaryCTAs];
                          newCTAs[index] = { 
                            ...cta, 
                            variant: e.target.value as 'solid' | 'outline' 
                          };
                          updateHeroItemSecondaryCTAs(newCTAs);
                        }}
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
                        value={cta.backgroundColor || '#ffffff'}
                        onChange={(e) => {
                          const newCTAs = [...secondaryCTAs];
                          newCTAs[index] = { ...cta, backgroundColor: e.target.value };
                          updateHeroItemSecondaryCTAs(newCTAs);
                        }}
                        className="w-full h-10 border border-gray-300 rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                      <input
                        type="color"
                        value={cta.textColor || '#000000'}
                        onChange={(e) => {
                          const newCTAs = [...secondaryCTAs];
                          newCTAs[index] = { ...cta, textColor: e.target.value };
                          updateHeroItemSecondaryCTAs(newCTAs);
                        }}
                        className="w-full h-10 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default HeroForm; 