import React, { useState, useEffect } from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@type/form';
import type { Field } from '@type/field';
import type { ButtonAlignment, ButtonIconPosition, CarouselBlockProps, CarouselItem, ItemShape, ItemSize, ButtonProps, ProgressBarProps } from './schema';
import { CAROUSEL_ITEM_LIMIT } from './schema';
import type { GridGap, StyleProps, StyleValue } from '@type/style';
import { AlertCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { contentApi, type Content } from '@api/content';
import { ApiSearchDropdown } from '@components/ApiSearchDropdown';

// Carousel block editor schema - only basic properties
const carouselEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Carousel Title', 
    type: 'text',
    placeholder: 'Enter carousel title (e.g., "Trending Now", "Featured Content")...'
  }
];

const CarouselForm: React.FC<BlockFormProps> = ({ block, updateProps, updateStyle }) => {
  const { props, style } = block;
  const carouselProps = props as CarouselBlockProps;
  const itemCount = carouselProps.items?.length || 0;
  const isAtLimit = itemCount >= CAROUSEL_ITEM_LIMIT;
  
  // Warning state for duplicate items
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  // Cleanup warning timeout on unmount
  useEffect(() => {
    return () => {
      if (duplicateWarning) {
        setDuplicateWarning(null);
      }
    };
  }, [duplicateWarning]);

  const handleSelectContent = (content: Content) => {
    const numericId = typeof content.id === 'number' ? content.id : parseInt(content.id, 10);
    
    const carouselItem: CarouselItem = {
      id: numericId,
      content_id: numericId,
      title: content.title,
      subtitle: content.subtitle,
      url: content.url || undefined,
      type: content.type,
      status: content.status,
      thumbnail: content.thumbnail || null,
      poster: content.poster || null,
      cover: content.cover || null,
      genres: content.genres || [],
      details: {
        imdb_rating: content.details?.imdb_rating,
        duration: content.details?.duration,
        release_year: content.details?.release_year
      },
      progress: 0
    };
    
    // Check if item with this ID already exists
    const existingItems = carouselProps.items || [];
    if (existingItems.some(item => item.id === carouselItem.id)) {
      setDuplicateWarning(`"${content.title}" is already in your carousel`);
      
      // Clear warning after 3 seconds
      setTimeout(() => setDuplicateWarning(null), 3000);
      return; // Skip if duplicate
    }
    
    // Clear any existing warnings
    setDuplicateWarning(null);
    
    // Add the new item
    updateProps({
      ...carouselProps,
      items: [...existingItems, carouselItem]
    });
    
  };

  const handleStyleChange = (key: keyof StyleProps, value: StyleValue) => {
    if (updateStyle) {
      updateStyle({ [key]: value });
    }
  };

  // Initialize button props if they don't exist
  const initializeButtonProps = () => {
    if (!carouselProps.button) {
      updateProps({
        ...carouselProps,
        button: {
          text: 'View All',
          enabled: false,
          alignment: 'right',
          icon: 'ArrowRight',
          iconPosition: 'right',
          textColor: '#ffffff',
          link: ''
        }
      });
    }
  };
  // Initialize progress bar props if they don't exist
  const initializeProgressBarProps = () => {
    if (!carouselProps.progressBar) {
      updateProps({
        ...carouselProps,
        progressBar: {
          enabled: false,
          color: '#ff0000'
        }
      });
    }
  };

  // Handle button property changes
  const handleButtonChange = (key: keyof ButtonProps, value: string | boolean) => {
    if (!carouselProps.button) {
      initializeButtonProps();
      return;
    }
    
    updateProps({
      ...carouselProps,
      button: {
        ...carouselProps.button,
        [key]: value
      }
    });
  };
  // Handle progress bar property changes
  const handleProgressBarChange = (key: keyof ProgressBarProps, value: string | boolean) => {
    if (!carouselProps.progressBar) {
      initializeProgressBarProps();
      return;
    }
    
    updateProps({
      ...carouselProps,
      progressBar: {
        ...carouselProps.progressBar,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Basic Properties */}
      <PropertiesForm
        block={block}
        fieldDefinitions={carouselEditorFields}
        updateProps={updateProps}
      />
      
      {/* Carousel Layout Settings */}
      {/* Content Picker Section */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h3 className="font-medium text-gray-700 mb-4">Content Picker</h3>
        <p className="text-sm text-gray-600 mb-3">
          Search for Content and add them to your carousel. Content will be added to the end of your carousel.
        </p>
        
        {/* Warning when over limit */}
        {isAtLimit && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
               Item Limit
              </span>
            </div>
          </div>
        )}
        
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
          searchFunction={
              React.useMemo(() => 
                  contentApi.searchExcludingItems(carouselProps.items || []), [carouselProps.items])
              }
          disabled={isAtLimit}
          placeholder="Search for Content..."
          onSelect={handleSelectContent}
          getItemId={(content) => content.id}
          filterOptions={{
            label: 'Content Type'
          }}
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
      
      {/* Display Options Section */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h3 className="font-medium text-gray-700 mb-4">Display Options</h3>
        <p className="text-sm text-gray-600 mb-3">
          Control which elements are displayed for carousel items. These settings apply to all items.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showTitle"
              checked={carouselProps.showTitle !== false}
              onChange={e => updateProps({ ...carouselProps, showTitle: e.target.checked })}
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
              checked={carouselProps.showSubtitle === true}
              onChange={e => updateProps({ ...carouselProps, showSubtitle: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="showSubtitle" className="text-sm text-gray-700">
              Show Subtitle
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showRating"
              checked={carouselProps.showRating === true}
              onChange={e => updateProps({ ...carouselProps, showRating: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="showRating" className="text-sm text-gray-700">
              Show Rating
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showGenre"
              checked={carouselProps.showGenre === true}
              onChange={e => updateProps({ ...carouselProps, showGenre: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="showGenre" className="text-sm text-gray-700">
              Show Genre
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showDuration"
              checked={carouselProps.showDuration === true}
              onChange={e => updateProps({ ...carouselProps, showDuration: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="showDuration" className="text-sm text-gray-700">
              Show Duration
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showProgress"
              checked={carouselProps.progressBar?.enabled || false}
              onChange={e => {
                if (!carouselProps.progressBar && e.target.checked) {
                  initializeProgressBarProps();
                } else if (carouselProps.progressBar) {
                  handleProgressBarChange('enabled', e.target.checked);
                }
              }}
              className="rounded"
            />
            <label htmlFor="showProgress" className="text-sm text-gray-700">
              Show Progress Bar
            </label>
          </div>
          
                    <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showButton"
              checked={carouselProps.button?.enabled || false}
              onChange={e => {
                if (!carouselProps.button && e.target.checked) {
                  initializeButtonProps();
                } else if (carouselProps.button) {
                  handleButtonChange('enabled', e.target.checked);
                }
              }}
              className="rounded"
            />
            <label htmlFor="showButton" className="text-sm text-gray-700">
              Show Button
            </label>
          </div>
          
          {/* Progress Bar Color */}
          {carouselProps.progressBar?.enabled && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <label className="block text-sm text-gray-700 mb-2">Progress Bar Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={carouselProps.progressBar?.color || '#ff0000'}
                  onChange={e => handleProgressBarChange('color', e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
                <input
                  type="text"
                  value={carouselProps.progressBar?.color || '#ff0000'}
                  onChange={e => handleProgressBarChange('color', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  placeholder="#ff0000"
                />
              </div>
            </div>
          )}
          
          {/* Button Configuration */}
          {carouselProps.button?.enabled && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Button Configuration</h4>
              
              {/* Button Text */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={carouselProps.button?.text || 'View All'}
                  onChange={e => handleButtonChange('text', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="View All"
                />
              </div>

              {/* Button Link */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  value={carouselProps.button?.link || ''}
                  onChange={e => handleButtonChange('link', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="https://example.com"
                />
              </div>

              {/* Button Alignment */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Button Alignment</label>
                <select
                  value={carouselProps.button?.alignment || 'right'}
                  onChange={e => handleButtonChange('alignment', e.target.value as ButtonAlignment)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* Button Icon */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Button Icon</label>
                <select
                  value={carouselProps.button?.icon || 'ArrowRight'}
                  onChange={e => handleButtonChange('icon', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="ArrowRight">Arrow Right</option>
                  <option value="ArrowLeft">Arrow Left</option>
                  <option value="ChevronRight">Chevron Right</option>
                  <option value="ChevronLeft">Chevron Left</option>
                </select>
                <div className="mt-2 flex items-center gap-4 p-2 bg-gray-100 rounded">
                  <div className="flex items-center gap-2">
                    <ArrowRight size={16} /> <span className="text-xs">Arrow Right</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowLeft size={16} /> <span className="text-xs">Arrow Left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight size={16} /> <span className="text-xs">Chevron Right</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronLeft size={16} /> <span className="text-xs">Chevron Left</span>
                  </div>
                </div>
              </div>

              {/* Icon Position */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Icon Position</label>
                <select
                  value={carouselProps.button?.iconPosition || 'right'}
                  onChange={e => handleButtonChange('iconPosition', e.target.value as ButtonIconPosition)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="none">No Icon</option>
                </select>
              </div>

              {/* Button Text Color */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={carouselProps.button?.textColor || '#ffffff'}
                    onChange={e => handleButtonChange('textColor', e.target.value)}
                    className="w-8 h-8 p-0 border-0"
                  />
                  <input
                    type="text"
                    value={carouselProps.button?.textColor || '#ffffff'}
                    onChange={e => handleButtonChange('textColor', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Carousel Layout Settings</h3>
        
        {/* Item Count and Limit Warning */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Items: {itemCount}/{CAROUSEL_ITEM_LIMIT}
              </span>
            </div>
            {isAtLimit && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">Limit Reached</span>
              </div>
            )}
          </div>
          {isAtLimit && (
            <p className="text-xs text-yellow-700 mt-1">
              Maximum of {CAROUSEL_ITEM_LIMIT} items allowed. Remove some items before adding more.
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Item Size */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Size</label>
            <select
              value={carouselProps.itemSize || 'large'}
              onChange={e => updateProps({ ...carouselProps, itemSize: e.target.value as ItemSize })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>

          {/* Carousel Gap */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Gap</label>
            <select
              value={style?.gridGap || 'md'}
              onChange={e => handleStyleChange('gridGap', e.target.value as GridGap)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          {/* Item Shape */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Shape</label>
            <select
              value={carouselProps.itemShape || 'rectangle-landscape'}
              onChange={e => updateProps({ ...carouselProps, itemShape: e.target.value as ItemShape })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="rectangle-landscape">Landscape</option>
              <option value="rectangle-portrait">Portrait</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          {/* Show Navigation Arrows */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Navigation</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showArrows"
                checked={carouselProps.showArrows !== false}
                onChange={e => updateProps({ ...carouselProps, showArrows: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="showArrows" className="text-sm text-gray-700">
                Show Navigation Arrows
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Display left/right arrow buttons for carousel navigation
            </p>
          </div>

          {/* Autoplay Settings */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Autoplay</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoplay"
                checked={carouselProps.autoplay || false}
                onChange={e => updateProps({ ...carouselProps, autoplay: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="autoplay" className="text-sm text-gray-700">
                Enable Autoplay
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Automatically scroll through carousel items
            </p>
          </div>

          {/* Scroll Speed */}
          {carouselProps.autoplay && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Scroll Speed (ms)</label>
              <input
                type="number"
                min={1000}
                max={10000}
                step={500}
                value={carouselProps.scrollSpeed || 1000}
                onChange={e => updateProps({ 
                  ...carouselProps, 
                  scrollSpeed: Math.max(1000, Math.min(10000, parseInt(e.target.value) || 1000))
                })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="3000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Time between scroll actions in milliseconds (1000-10000ms)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselForm; 