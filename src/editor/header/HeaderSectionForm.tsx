import React from 'react';
import type { HeaderItem, HeaderSchema } from '@editor/header/schema';
import LogoForm from '@editor/header/LogoForm';
import NavigationForm from '@editor/header/NavigationForm';

interface HeaderSectionEditorProps {
  headerSchema: HeaderSchema;
  updateHeaderSchema: (updatedSchema: HeaderSchema) => void;
  selectedItemId?: string | null;
  onSelectItem?: (id: string) => void;
}

const HeaderSectionForm: React.FC<HeaderSectionEditorProps> = ({ 
  headerSchema, 
  updateHeaderSchema,
  selectedItemId,
  onSelectItem
}) => {
  const logoItem = headerSchema.items.find(item => item.type === 'logo');
  const titleItem = headerSchema.items.find(item => item.type === 'title');
  const navigationItems = headerSchema.items.filter(item => 
    item.type !== 'logo' && item.type !== 'title'
  );

  const handleUpdateLogo = (updatedLogo: HeaderItem) => {
    const updatedItems = headerSchema.items.map(item => 
      item.type === 'logo' ? updatedLogo : item
    );
    
    updateHeaderSchema({
      ...headerSchema,
      items: updatedItems
    });
  };

  const handleUpdateTitle = (updatedTitle: HeaderItem) => {
    const updatedItems = headerSchema.items.map(item => 
      item.type === 'title' ? updatedTitle : item
    );
    
    updateHeaderSchema({
      ...headerSchema,
      items: updatedItems
    });
  };

  const handleUpdateNavigationItems = (updatedNavigationItems: HeaderItem[]) => {
    // Preserve logo and title, replace all other items
    const nonNavigationItems = headerSchema.items.filter(item => 
      item.type === 'logo' || item.type === 'title'
    );
    
    updateHeaderSchema({
      ...headerSchema,
      items: [...nonNavigationItems, ...updatedNavigationItems]
    });
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHeaderSchema({
      ...headerSchema,
      style: {
        ...headerSchema.style,
        backgroundColor: e.target.value
      }
    });
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHeaderSchema({
      ...headerSchema,
      style: {
        ...headerSchema.style,
        textColor: e.target.value
      }
    });
  };

  const handleLayoutChange = (field: keyof NonNullable<HeaderSchema['layout']>, value: string | boolean) => {
    onUpdate({
      ...headerSchema,
      layout: {
        ...headerSchema.layout,
        [field]: value,
      },
    });
  };

  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHeaderSchema({
      ...headerSchema,
      style: {
        ...headerSchema.style,
        padding: e.target.value
      }
    });
  };


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!titleItem) {
      // Create new title item if it doesn't exist
      const newTitleItem: HeaderItem = {
        id: `title-${Date.now()}`,
        type: 'title',
        label: e.target.value,
        style: { fontSize: '24px', color: '#ffffff' }
      };
      
      updateHeaderSchema({
        ...headerSchema,
        items: [...headerSchema.items, newTitleItem]
      });
    } else {
      // Update existing title
      const updatedTitle = {
        ...titleItem,
        label: e.target.value
      };
      
      handleUpdateTitle(updatedTitle);
    }
  };

  const handleTitleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!titleItem) return;
    
    const updatedTitle = {
      ...titleItem,
      style: {
        ...titleItem.style,
        fontSize: e.target.value
      }
    };
    
    handleUpdateTitle(updatedTitle);
  };

  const handleTitleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!titleItem) return;
    
    const updatedTitle = {
      ...titleItem,
      style: {
        ...titleItem.style,
        color: e.target.value
      }
    };
    
    handleUpdateTitle(updatedTitle);
  };


  return (
    <div className="space-y-4">
      {/* Header Layout */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Header Layout</h3>
        
        <div className="space-y-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Logo Position</label>
            <select
              value={headerSchema.layout?.logoPosition || 'start'}
              onChange={(e) => handleLayoutChange('logoPosition', e.target.value as 'start' | 'end')}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="start">Start (Left)</option>
              <option value="end">End (Right)</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Show Title</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={headerSchema.layout?.showTitle !== false}
                onChange={(e) => handleLayoutChange('showTitle', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-300">Enable header title</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Navigation Alignment</label>
            <select
              value={headerSchema.layout?.navigationAlignment || 'left'}
              onChange={(e) => handleLayoutChange('navigationAlignment', e.target.value as 'left' | 'center' | 'right')}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header Styles */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Header Styles</h3>
        
        <div className="space-y-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Background Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={headerSchema.style?.backgroundColor || '#111111'}
                onChange={handleBackgroundColorChange}
                className="w-10 h-10 rounded mr-2 border-0"
              />
              <input
                type="text"
                value={headerSchema.style?.backgroundColor || '#111111'}
                onChange={handleBackgroundColorChange}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white flex-1"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Text Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={headerSchema.style?.textColor || '#ffffff'}
                onChange={handleTextColorChange}
                className="w-10 h-10 rounded mr-2 border-0"
              />
              <input
                type="text"
                value={headerSchema.style?.textColor || '#ffffff'}
                onChange={handleTextColorChange}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white flex-1"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-300">Padding</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Vertical</label>
                <input
                  type="number"
                  value={parseInt(headerSchema.style?.padding?.split(' ')[0] || '10px')}
                  onChange={(e) => {
                    const horizontal = headerSchema.style?.padding?.split(' ')[1] || '20px';
                    handlePaddingChange({ target: { value: `${e.target.value}px ${horizontal}` } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-full"
                  min="0"
                  max="50"
                  step="1"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Horizontal</label>
                <input
                  type="number"
                  value={parseInt(headerSchema.style?.padding?.split(' ')[1] || '20px')}
                  onChange={(e) => {
                    const vertical = headerSchema.style?.padding?.split(' ')[0] || '10px';
                    handlePaddingChange({ target: { value: `${vertical} ${e.target.value}px` } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-full"
                  min="0"
                  max="50"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logo Editor */}
      {logoItem && (
        <div 
          className="p-4 bg-gray-800 rounded-lg"
          data-item-id={logoItem.id}
        >
          <h3 className="text-lg font-semibold text-white mb-3">Logo</h3>
            <LogoForm
            logoItem={logoItem} 
            updateLogo={handleUpdateLogo} 
          />
        </div>
      )}
      
      {/* Title Settings */}
      <div 
        className="p-4 bg-gray-800 rounded-lg"
        data-item-id={titleItem?.id}
      >
        <h3 className="text-lg font-semibold text-white mb-3">Title</h3>
        
        <div className="space-y-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Title Text</label>
            <input
              type="text"
              value={titleItem?.label || ''}
              onChange={handleTitleChange}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="Website Title"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Font Size (px)</label>
            <input
              type="number"
              value={parseInt(titleItem?.style?.fontSize || '24px')}
              onChange={(e) => handleTitleFontSizeChange({ target: { value: e.target.value + 'px' } } as React.ChangeEvent<HTMLInputElement>)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              min="8"
              max="72"
              step="1"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={titleItem?.style?.color || '#ffffff'}
                onChange={handleTitleColorChange}
                className="w-10 h-10 rounded mr-2 border-0"
              />
              <input
                type="text"
                value={titleItem?.style?.color || '#ffffff'}
                onChange={handleTitleColorChange}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white flex-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Editor */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Navigation Items</h3>
          <NavigationForm
          navigationItems={navigationItems} 
          updateNavigationItems={handleUpdateNavigationItems}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      </div>
    </div>
  );
};

export default HeaderSectionForm;
