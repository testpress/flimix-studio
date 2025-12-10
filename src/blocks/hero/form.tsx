import React, { useState, useEffect, useMemo } from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { HeroBlock, HeroCTABtn, HeroItem } from './schema';
import CTAsTab from './form-components/CTAsTab';
import CarouselControls from './form-components/CarouselControls';
import { ApiSearchDropdown } from '@components/ApiSearchDropdown';
import { contentApi, type Content } from '@services/api/content';
import { generateUniqueInt } from '@utils/id';
import { AlertCircle } from 'lucide-react';
import { getHashtagSizeClass } from './CTAButton';
import { useSelection } from '@context/SelectionContext';

const HeroForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const heroBlock = block as HeroBlock;
  
  const { selectedItemId, selectedItemBlockId } = useSelection();
  
  // Warning state for duplicate items
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  // Memoized editing item index calculation
  const editingItemIndex = useMemo(() => {
    if (selectedItemId && selectedItemBlockId === heroBlock.id) {
      const selectedIndex = heroBlock.props.items?.findIndex(item => item.id === parseInt(selectedItemId, 10));
      if (selectedIndex !== -1) {
        return selectedIndex;
      }
    }
    return 0;
  }, [selectedItemId, selectedItemBlockId, heroBlock.id, heroBlock.props.items]);
  
  const currentItem = heroBlock.props.items?.[editingItemIndex] || {
    id: generateUniqueInt(),
    content_id: 0,  
    title: '',
    subtitle: '',
    backgroundImage: ''
  };
  
  const currentItemImage = currentItem.poster || currentItem.cover || currentItem.thumbnail;
  
  // Helper function to create a default hero item
  const createDefaultHeroItem = () => ({
    id: generateUniqueInt(),
    content_id: 0,
    titleType: 'text' as const,
    title: '',
    titleImage: '',
    subtitle: '',
    thumbnail: null,
    poster: null,
    cover: null,
    hashtag: undefined,
    showTitle: true,
    showSubtitle: true,
    showGenres: true,
    showMeta: true,
    showHashtag: true
  });

  const updateHeroItemPrimaryCTA = (primaryCTA: HeroCTABtn) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[editingItemIndex]) {
      newItems[editingItemIndex] = createDefaultHeroItem();
    }
    
    newItems[editingItemIndex].primaryCTA = primaryCTA;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemSecondaryCTA = (secondaryCTA: HeroCTABtn | undefined) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[editingItemIndex]) {
      newItems[editingItemIndex] = createDefaultHeroItem();
    }
    
    newItems[editingItemIndex].secondaryCTA = secondaryCTA;
    updateProps({ ...heroBlock.props, items: newItems });
  };
  
  const updateHeroItemTertiaryCTA = (tertiaryCTA: HeroCTABtn | undefined) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[editingItemIndex]) {
      newItems[editingItemIndex] = createDefaultHeroItem();
    }
    
    newItems[editingItemIndex].tertiaryCTA = tertiaryCTA;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  // Helper function to update the current hero item with new properties
  const updateCurrentHeroItem = (updatedProps: Partial<HeroItem>) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (newItems[editingItemIndex]) {
      newItems[editingItemIndex] = {
        ...newItems[editingItemIndex],
        ...updatedProps,
      };
      updateProps({ ...heroBlock.props, items: newItems });
    }
  };
  
  // Content picker functionality
  const handleSelectContent = (content: Content) => {
    const numericId = typeof content.id === 'number' ? content.id : parseInt(content.id, 10);
    
    const heroItem = {
      id: numericId,
      content_id: numericId,
      title: content.title,
      subtitle: content.subtitle,
      url: content.url || undefined,
      thumbnail: content.thumbnail || null,
      poster: content.poster || null,
      cover: content.cover || null,
      videoBackground: content.details?.videoBackground,
      titleType: content.details?.titleImage ? 'image' as const : 'text' as const,
      titleImage: content.details?.titleImage,
      details: {
        release_year: content.details?.release_year,
        language: content.details?.language,
        duration: content.details?.duration,
        imdb_rating: content.details?.imdb_rating,
      },
      genres: content.genres || [],
      hashtag: content.details?.hashtag ? { text: content.details.hashtag, color: '#dc2626', size: 'medium' as const } : undefined,
      showTitle: true,
      showSubtitle: true,
      showGenres: true,
      showMeta: true,
      showHashtag: true,
      primaryCTA: {
        label: 'Watch Now',
        link: content.url || '#',
        variant: 'solid' as const,
        backgroundColor: '#dc2626',
        textColor: '#ffffff',
        icon: 'Play' as const,
        iconPosition: 'left' as const,
        iconThickness: 'normal' as const,
        borderRadius: 'md' as const,
        size: 'medium' as const
      }
    };
    
    // Check if item with this ID already exists
    const existingItems = heroBlock.props.items || [];
    if (existingItems.some(item => item.id === heroItem.id)) {
      setDuplicateWarning(`"${content.title}" is already in your hero`);
      return; 
    }
    
    setDuplicateWarning(null);
    updateProps({
      ...heroBlock.props,
      items: [...existingItems, heroItem]
    });
  };
  
  // This useEffect will manage the warning visibility and cleanup
  useEffect(() => {
    if (duplicateWarning) {
      const timer = setTimeout(() => {
        setDuplicateWarning(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [duplicateWarning]);
  
  return (
    <div>
      
      {/* Carousel Controls */}
      <CarouselControls
        heroBlock={heroBlock}
        updateProps={updateProps}
      />
      
      {/* Content Picker Section */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h3 className="font-medium text-gray-700 mb-4">Content Picker</h3>
        <p className="text-sm text-gray-600 mb-3">
          Search for Content and add them to your hero. Content will be added to the end of your hero items list.
        </p>
        
        {/* Duplicate item warning */}
        {duplicateWarning && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                {duplicateWarning}
              </span>
            </div>
          </div>
        )}
        
        {/* Generic API Search Dropdown */}
        <ApiSearchDropdown<Content>
          searchFunction={contentApi.search}
          placeholder="Search for Content..."
          onSelect={handleSelectContent}
          getItemId={(content) => content.id}
          renderItem={React.useCallback((content, onSelect) => (
            <div 
              className="px-4 py-2 cursor-pointer hover:bg-blue-50 flex items-start gap-3"
              onClick={() => onSelect(content)}
            >
              {(content.thumbnail || content.poster || content.cover) && (
                <img 
                  src={content.thumbnail || content.poster || content.cover || ''} 
                  alt={content.title}
                  className="w-12 h-8 object-cover rounded flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm line-clamp-1">{content.title}</div>
                {content.subtitle && (
                  <div className="text-xs text-gray-500 line-clamp-2">{content.subtitle}</div>
                )}
              </div>
            </div>
          ), [])}
          noResultsMessage="No Content found. Try a different search."
        />
      </div>
      
      {/* Consolidated Content Section */}
      <div className="space-y-4">
        {/* Block Configuration Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-4">Block Configuration</h3>
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
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Height</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={heroBlock.props.customHeight ? parseInt(heroBlock.props.customHeight) : 600}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 600 && value <= 1000) {
                      updateProps({ ...heroBlock.props, customHeight: `${value}px` });
                    }
                  }}
                  onBlur={(e) => {
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
        
        {/* Conditional rendering for item-dependent sections */}
        {heroBlock.props.items && heroBlock.props.items.length > 0 ? (
          <>
            {/* Current Item Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Current Item Preview</h3>
                {selectedItemId && selectedItemBlockId === heroBlock.id ? (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Editing Item {editingItemIndex + 1}
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Carousel Item {editingItemIndex + 1}
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Title Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <div className="p-3 bg-gray-100 rounded">
                    {currentItem.titleType === 'image' && currentItem.titleImage ? (
                      <div className="flex justify-center">
                        <img 
                          src={currentItem.titleImage} 
                          alt="Title" 
                          className="max-h-16"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/300x50/cccccc/666666?text=Title+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="font-bold text-lg">{currentItem.title || 'No title'}</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Title is automatically populated from the Content API
                  </p>
                </div>
                
                {/* Subtitle Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <div className="p-3 bg-gray-100 rounded">
                    <div className="text-sm">{currentItem.subtitle || 'No subtitle'}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Subtitle is automatically populated from the Content API
                  </p>
                </div>
                
                {/* Background Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                  <div className="p-3 bg-gray-100 rounded">
                    {currentItem.videoBackground ? (
                      <div className="text-sm">Video Background: {currentItem.videoBackground}</div>
                    ) : currentItemImage ? (
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <img 
                          src={currentItemImage} 
                          alt="Background" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/600x340/cccccc/666666?text=Background+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-sm">No background</div>
                    )}
                  </div>
                </div>
                
                {/* Metadata Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metadata</label>
                  <div className="p-3 bg-gray-100 rounded">
                    <div className="text-sm">
                      {currentItem.details?.release_year && <span className="mr-2">Year: {currentItem.details.release_year}</span>}
                      {currentItem.details?.language && <span>Language: {currentItem.details.language}</span>}
                      {!currentItem.details?.release_year && !currentItem.details?.language && <span>No metadata</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Metadata is automatically populated from the Content API
                  </p>
                </div>
              </div>
            </div>
            
            {/* Item Display Options */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-4">Display Options</h3>
              <p className="text-sm text-gray-600 mb-3">
                Control which elements are displayed for the current hero item.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showTitle"
                    checked={currentItem.showTitle !== false}
                    onChange={e => updateCurrentHeroItem({ showTitle: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="showTitle" className="text-sm text-gray-700">
                    Show Title
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showSubtitle"
                    checked={currentItem.showSubtitle !== false}
                    onChange={e => updateCurrentHeroItem({ showSubtitle: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="showSubtitle" className="text-sm text-gray-700">
                    Show Subtitle
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showGenres"
                    checked={currentItem.showGenres !== false}
                    onChange={e => updateCurrentHeroItem({ showGenres: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="showGenres" className="text-sm text-gray-700">
                    Show Genres
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showMeta"
                    checked={currentItem.showMeta !== false}
                    onChange={e => updateCurrentHeroItem({ showMeta: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="showMeta" className="text-sm text-gray-700">
                    Show Metadata (Year, Language)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showHashtag"
                    checked={currentItem.showHashtag !== false}
                    onChange={e => updateCurrentHeroItem({ showHashtag: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="showHashtag" className="text-sm text-gray-700">
                    Show Hashtag
                  </label>
                </div>
              </div>
            </div>
            
            {/* Hashtag Customization Section */}
            {currentItem.hashtag && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-4">Hashtag Customization</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Customize the appearance of your hashtag. The hashtag text comes from the API.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Hashtag Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hashtag Color</label>
                    <input
                      type="color"
                      value={currentItem.hashtag.color || '#dc2626'}
                      onChange={(e) => {
                        if (currentItem.hashtag) {
                          updateCurrentHeroItem({
                            hashtag: {
                              ...currentItem.hashtag,
                              color: e.target.value
                            }
                          });
                        }
                      }}
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  
                  {/* Hashtag Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hashtag Size</label>
                    <select
                      value={currentItem.hashtag.size || 'medium'}
                      onChange={(e) => {
                        if (currentItem.hashtag) {
                          updateCurrentHeroItem({
                            hashtag: {
                              ...currentItem.hashtag,
                              size: e.target.value as 'small' | 'medium' | 'large' | 'xl'
                            }
                          });
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>
                </div>
                
                {/* Hashtag Preview */}
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <span 
                    className={`font-bold ${getHashtagSizeClass(currentItem.hashtag.size)}`}
                    style={{ color: currentItem.hashtag.color || '#dc2626' }}
                  >
                    {currentItem.hashtag.text.startsWith('#') ? currentItem.hashtag.text : `#${currentItem.hashtag.text}`}
                  </span>
                </div>
              </div>
            )}
            
            {/* CTAs Section */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-4">Call-to-Action Buttons</h3>
              <CTAsTab
                currentItem={currentItem}
                updateHeroItemPrimaryCTA={updateHeroItemPrimaryCTA}
                updateHeroItemSecondaryCTA={updateHeroItemSecondaryCTA}
                updateHeroItemTertiaryCTA={updateHeroItemTertiaryCTA}
              />
            </div>
          </>
        ) : (
          /* Message when no hero items exist */
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <h3 className="font-medium text-blue-700 mb-2">No Hero Items Added Yet</h3>
              <p className="text-sm text-blue-600 mb-3">
                Use the Content Picker above to search for and add Content to your hero. Once you add items, you'll be able to configure their display options, customize hashtags, and set up call-to-action buttons.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroForm;