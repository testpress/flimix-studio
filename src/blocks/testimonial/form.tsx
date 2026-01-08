import React from 'react';
import PropertiesForm from '@components/block-settings/PropertiesForm';
import type { BlockFormProps } from '@type/form';
import type { Field } from '@type/field';
import type { TestimonialBlockProps, TestimonialLayout, ItemShape, ItemSize, GridDimension } from './schema';
import { TESTIMONIAL_ITEM_LIMIT } from './schema';
import type { GridGap, StyleProps, StyleValue } from '@type/style';
import { AlertCircle } from 'lucide-react';

// Testimonial block editor schema - only basic properties
const testimonialEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'Testimonial Title', 
    type: 'text',
    placeholder: 'Enter testimonial title (e.g., "What Our Viewers Say", "Customer Reviews")...'
  }
];

const TestimonialForm: React.FC<BlockFormProps> = ({ block, updateProps, updateStyle }) => {
  const { props, style } = block;
  const testimonialProps = props as TestimonialBlockProps;
  const itemCount = testimonialProps.items?.length || 0;
  
  // Calculate max items based on layout
  const getMaxItems = () => {
    if (testimonialProps.layout === 'carousel') {
      return TESTIMONIAL_ITEM_LIMIT;
    } else if (testimonialProps.layout === 'grid') {
      return (testimonialProps.columns || 3) * (testimonialProps.rows || 3);
    } else {
      return 1; // single layout
    }
  };
  
  const maxItems = getMaxItems();
  const isAtLimit = itemCount >= maxItems;

  const handleStyleChange = (key: keyof StyleProps, value: StyleValue) => {
    if (updateStyle) {
      updateStyle({ [key]: value });
    }
  };

  const handleLayoutChange = (newLayout: TestimonialLayout) => {
    const currentItems = testimonialProps.items || [];
    let updatedItems = [...currentItems];
    let newColumns = testimonialProps.columns || 3;
    let newRows = testimonialProps.rows || 3;

    // Handle layout-specific transitions
    if (newLayout === 'grid') {
      // When switching to grid, default to 3×3 and remove excess items
      newColumns = 3;
      newRows = 3;
      const maxGridItems = newColumns * newRows;
      
      if (currentItems.length > maxGridItems) {
        updatedItems = currentItems.slice(0, maxGridItems);
        console.log(`${currentItems.length - maxGridItems} items removed when switching to grid layout (3×3)`);
      }
    } else if (newLayout === 'single') {
      // When switching to single, keep only the first item
      if (currentItems.length > 1) {
        updatedItems = currentItems.slice(0, 1);
        console.log(`${currentItems.length - 1} items removed when switching to single layout`);
      }
    } else if (newLayout === 'carousel') {
      // When switching to carousel, keep all items (up to 12 limit)
      const maxCarouselItems = TESTIMONIAL_ITEM_LIMIT;
      if (currentItems.length > maxCarouselItems) {
        updatedItems = currentItems.slice(0, maxCarouselItems);
        console.log(`${currentItems.length - maxCarouselItems} items removed when switching to carousel layout (max ${maxCarouselItems})`);
      }
    }

    updateProps({
      ...testimonialProps,
      layout: newLayout,
      columns: newColumns,
      rows: newRows,
      items: updatedItems
    });
  };

  const handleGridSizeChange = (newColumns: GridDimension, newRows: GridDimension) => {
    const newMaxItems = newColumns * newRows;
    const currentItems = testimonialProps.items || [];
    
    // Remove extra items if the new grid is smaller
    const updatedItems = currentItems.slice(0, newMaxItems);
    
    // Log if items were removed
    if (currentItems.length > newMaxItems) {
      console.log(`${currentItems.length - newMaxItems} items removed due to grid size change from ${testimonialProps.columns}×${testimonialProps.rows} to ${newColumns}×${newRows}`);
    }
    
    updateProps({
      ...testimonialProps,
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
        fieldDefinitions={testimonialEditorFields}
        updateProps={updateProps}
      />
      
      {/* Layout Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-4">Layout Settings</h3>
        
        {/* Item Count and Limit Warning */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Items: {itemCount}/{maxItems}
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
              Maximum of {maxItems} items allowed for {testimonialProps.layout} layout. Remove some items before adding more.
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Layout Type */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Layout Type</label>
            <select
              value={testimonialProps.layout || 'carousel'}
              onChange={e => handleLayoutChange(e.target.value as TestimonialLayout)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="carousel">Carousel</option>
              <option value="grid">Grid</option>
              <option value="single">Single</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose how testimonials are displayed
            </p>
          </div>

          {/* Carousel-specific settings */}
          {testimonialProps.layout === 'carousel' && (
            <>
              {/* Item Size */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Item Size</label>
                <select
                  value={testimonialProps.itemSize || 'large'}
                  onChange={e => updateProps({ ...testimonialProps, itemSize: e.target.value as ItemSize })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              {/* Show Navigation Arrows */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Navigation</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showArrows"
                    checked={testimonialProps.showArrows !== false}
                    onChange={e => updateProps({ ...testimonialProps, showArrows: e.target.checked })}
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
                    checked={testimonialProps.autoplay || false}
                    onChange={e => updateProps({ ...testimonialProps, autoplay: e.target.checked })}
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
              {testimonialProps.autoplay && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Scroll Speed (ms)</label>
                  <input
                    type="number"
                    min={1000}
                    max={10000}
                    step={500}
                    value={testimonialProps.scrollSpeed || 1000}
                    onChange={e => updateProps({ 
                      ...testimonialProps, 
                      scrollSpeed: Math.max(1000, Math.min(10000, parseInt(e.target.value, 10) || 1000))
                    })}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Time between scroll actions in milliseconds (1000-10000ms)
                  </p>
                </div>
              )}
            </>
          )}

          {/* Grid-specific settings */}
          {testimonialProps.layout === 'grid' && (
            <>
              {/* Grid Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Columns</label>
                  <select
                    value={testimonialProps.columns || 3}
                    onChange={e => handleGridSizeChange(+e.target.value as GridDimension, testimonialProps.rows || 3)}
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
                    value={testimonialProps.rows || 3}
                    onChange={e => handleGridSizeChange(testimonialProps.columns || 3, +e.target.value as GridDimension)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Common settings */}
          {/* Item Shape */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Item Shape</label>
            <select
              value={testimonialProps.itemShape || 'circle'}
              onChange={e => updateProps({ ...testimonialProps, itemShape: e.target.value as ItemShape })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          {/* Gap */}
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
        </div>
      </div>
    </div>
  );
};

export default TestimonialForm; 