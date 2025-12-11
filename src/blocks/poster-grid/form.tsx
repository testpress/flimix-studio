import React, { useState, useEffect } from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';
import type { ButtonAlignment, ButtonIconPosition, PosterGridBlockProps, PosterGridItem, ItemShape, GridDimension, ButtonProps, ProgressBarProps } from './schema';
import type { GridGap, StyleProps, StyleValue } from '@blocks/shared/Style';
import { AlertCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { contentApi, type Content } from '@services/api/content';
import { ApiSearchDropdown } from '@components/ApiSearchDropdown';

// Poster grid block editor schema - only basic properties
const posterGridEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter grid title...'
  }
];

const PosterGridForm: React.FC<BlockFormProps> = ({ block, updateProps, updateStyle }) => {
  const { props, style } = block;
  const posterGridProps = props as PosterGridBlockProps;

  // Calculate max items based on grid size
  const maxItems = (posterGridProps.columns || 3) * (posterGridProps.rows || 3);
  const currentItems = posterGridProps.items?.length || 0;
  const isAtItemLimit = currentItems >= maxItems;
  
  // Warning state for duplicate items
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  // Clear warning after a delay
  useEffect(() => {
    if (duplicateWarning) {
      const timerId = setTimeout(() => {
        setDuplicateWarning(null);
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [duplicateWarning]);

  const handleSelectContent = (content: Content) => {
    const numericId = typeof content.id === 'number' ? content.id : parseInt(content.id, 10);
    
    const posterGridItem: PosterGridItem = {
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
    const existingItems = posterGridProps.items || [];
    if (existingItems.some(item => item.id === posterGridItem.id)) {
      // Show warning for duplicate item
      setDuplicateWarning(`"${content.title}" is already in your poster grid`);
      return; // Skip if duplicate
    }
    
    // Clear any existing warnings
    setDuplicateWarning(null);
    
    // Add the new item
    updateProps({
      ...posterGridProps,
      items: [...existingItems, posterGridItem]
    });
  };

  const handleStyleChange = (key: keyof StyleProps, value: StyleValue) => {
    if (updateStyle) {
      updateStyle({ [key]: value });
    }
  };

  // Initialize button props if they don't exist
  const initializeButtonProps = () => {
    if (!posterGridProps.button) {
      updateProps({
        ...posterGridProps,
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
    if (!posterGridProps.progressBar) {
      updateProps({
        ...posterGridProps,
        progressBar: {
          enabled: false,
          color: '#ff0000'
        }
      });
    }
  };

  // Handle button property changes
  const handleButtonChange = (key: keyof ButtonProps, value: string | boolean) => {
    if (!posterGridProps.button) {
      initializeButtonProps();
      return;
    }
    
    updateProps({
      ...posterGridProps,
      button: {
        ...posterGridProps.button,
        [key]: value
      }
    });
  };
  
  // Handle progress bar property changes
  const handleProgressBarChange = (key: keyof ProgressBarProps, value: string | boolean) => {
    if (!posterGridProps.progressBar) {
      initializeProgressBarProps();
      return;
    }
    
    updateProps({
      ...posterGridProps,
      progressBar: {
        ...posterGridProps.progressBar,
        [key]: value
      }
    });
  };

  const handleGridSizeChange = (newColumns: GridDimension, newRows: GridDimension) => {
    const newMaxItems = newColumns * newRows;
    const currentItems = posterGridProps.items || [];
    
    // Remove extra items if the new grid is smaller
    const updatedItems = currentItems.slice(0, newMaxItems);
    
    // Log if items were removed
    if (currentItems.length > newMaxItems) {
      console.log(`${currentItems.length - newMaxItems} items removed due to grid size change from ${posterGridProps.columns}×${posterGridProps.rows} to ${newColumns}×${newRows}`);
    }
    
    updateProps({
      ...posterGridProps,
      columns: newColumns,
      rows: newRows,
      items: updatedItems
    });
  };

  return (
    <div className="space-y-4">
      {/* Basic Properties */}
      <PropertiesForm
        block={block}
        fieldDefinitions={posterGridEditorFields}
        updateProps={updateProps}
      />
      
      {/* Grid Layout Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Grid Layout Settings</h3>
        
        {/* Item Limit Warning Message */}
        {isAtItemLimit && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs text-red-600">
              Maximum {maxItems} items allowed. Cannot add more items.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Grid Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Columns</label>
              <select
                value={posterGridProps.columns || 3}
                onChange={e => handleGridSizeChange(+e.target.value as GridDimension, posterGridProps.rows || 3)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Rows</label>
              <select
                value={posterGridProps.rows || 3}
                onChange={e => handleGridSizeChange(posterGridProps.columns || 3, +e.target.value as GridDimension)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>

          {/* Grid Gap */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Grid Gap</label>
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
              value={posterGridProps.itemShape || 'rectangle-landscape'}
              onChange={e => updateProps({ ...posterGridProps, itemShape: e.target.value as ItemShape })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="rectangle-landscape">Landscape</option>
              <option value="rectangle-portrait">Portrait</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Picker Section */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h3 className="font-medium text-gray-700 mb-4">Content Picker</h3>
        <p className="text-sm text-gray-600 mb-3">
          Search for Content and add them to your poster grid. Content will be added to the end of your grid.
        </p>
        
        {/* Warning when over limit */}
        {isAtItemLimit && (
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
            React.useMemo(() => contentApi.searchExcludingItems(posterGridProps.items || []), [posterGridProps.items])
          }
          disabled={isAtItemLimit}
          placeholder="Search for Content..."
          onSelect={(content: Content) => handleSelectContent(content)}
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
      
      {/* Display Options Section */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h3 className="font-medium text-gray-700 mb-4">Display Options</h3>
        <p className="text-sm text-gray-600 mb-3">
          Control which elements are displayed for poster grid items. These settings apply to all items.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showTitle"
              checked={posterGridProps.showTitle ?? true}
              onChange={e => updateProps({ ...posterGridProps, showTitle: e.target.checked })}
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
              checked={posterGridProps.showSubtitle ?? false}
              onChange={e => updateProps({ ...posterGridProps, showSubtitle: e.target.checked })}
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
              checked={posterGridProps.showRating ?? false}
              onChange={e => updateProps({ ...posterGridProps, showRating: e.target.checked })}
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
              checked={posterGridProps.showGenre ?? false}
              onChange={e => updateProps({ ...posterGridProps, showGenre: e.target.checked })}
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
              checked={posterGridProps.showDuration ?? false}
              onChange={e => updateProps({ ...posterGridProps, showDuration: e.target.checked })}
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
              checked={posterGridProps.progressBar?.enabled || false}
              onChange={e => {
                if (!posterGridProps.progressBar && e.target.checked) {
                  initializeProgressBarProps();
                } else if (posterGridProps.progressBar) {
                  handleProgressBarChange('enabled', e.target.checked);
                }
              }}
              className="rounded"
            />
            <label htmlFor="showProgress" className="text-sm text-gray-700">
              Show Progress Bar
            </label>
          </div>
        </div>
      </div>

      {/* Button Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Button Settings</h3>
        
        {/* Enable Button */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="buttonEnabled"
              checked={posterGridProps.button?.enabled || false}
              onChange={e => {
                if (!posterGridProps.button && e.target.checked) {
                  initializeButtonProps();
                } else if (posterGridProps.button) {
                  handleButtonChange('enabled', e.target.checked);
                }
              }}
              className="rounded"
            />
            <label htmlFor="buttonEnabled" className="text-sm text-gray-700">
              Show Button
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Display a customizable button below the grid title
          </p>
        </div>

        {posterGridProps.button?.enabled && (
          <div className="space-y-4">
            {/* Button Text */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={posterGridProps.button?.text || 'View All'}
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
                value={posterGridProps.button?.link || ''}
                onChange={e => handleButtonChange('link', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="https://example.com"
              />
            </div>

            {/* Button Alignment */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Button Alignment</label>
              <select
                value={posterGridProps.button?.alignment || 'right'}
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
                value={posterGridProps.button?.icon || 'ArrowRight'}
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
                value={posterGridProps.button?.iconPosition || 'right'}
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
                  value={posterGridProps.button?.textColor || '#ffffff'}
                  onChange={e => handleButtonChange('textColor', e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
                <input
                  type="text"
                  value={posterGridProps.button?.textColor || '#ffffff'}
                  onChange={e => handleButtonChange('textColor', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Progress Bar Settings</h3>
        
        {/* Enable Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="progressBarEnabled"
              checked={posterGridProps.progressBar?.enabled || false}
              onChange={e => {
                if (!posterGridProps.progressBar && e.target.checked) {
                  initializeProgressBarProps();
                } else if (posterGridProps.progressBar) {
                  handleProgressBarChange('enabled', e.target.checked);
                }
              }}
              className="rounded"
            />
            <label htmlFor="progressBarEnabled" className="text-sm text-gray-700">
              Show Progress Bar
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Display a progress bar for each item (set percentage in item settings)
          </p>
        </div>
        
        {posterGridProps.progressBar?.enabled && (
          <div className="space-y-4">
            {/* Progress Bar Color */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Progress Bar Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={posterGridProps.progressBar?.color || '#ff0000'}
                  onChange={e => handleProgressBarChange('color', e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
                <input
                  type="text"
                  value={posterGridProps.progressBar?.color || '#ff0000'}
                  onChange={e => handleProgressBarChange('color', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  placeholder="#ff0000"
                />
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                Set the progress percentage for each item in the item settings panel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterGridForm; 