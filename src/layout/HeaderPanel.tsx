import React from 'react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { HeaderItem } from '@header/schema';
import LogoForm from '@header/forms/LogoForm';
import NavigationForm from '@header/forms/NavigationForm';

const HeaderPanel: React.FC = () => {
  const { headerSchema, updateHeaderSchema, selectedId } = useHeaderFooter();
  
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

  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'vertical' | 'horizontal') => {
    const currentPadding = headerSchema.style?.padding || '10px 20px';
    const parts = currentPadding.trim().split(/\s+/);
    
    const currentVertical = parts[0] || '10px';
    const currentHorizontal = parts[1] || '20px';
    
    let val = parseInt(e.target.value) || 0;

    // Enforce Limits (same as Footer: max 50 vertical, max 400 horizontal)
    if (type === 'vertical') {
      if (val > 50) val = 50;
      if (val < 0) val = 0;
    } else {
      if (val > 400) val = 400;
      if (val < 0) val = 0;
    }
    
    let newPadding = '';
    if (type === 'vertical') {
      newPadding = `${val}px ${currentHorizontal}`;
    } else {
      newPadding = `${currentVertical} ${val}px`;
    }
    
    updateHeaderSchema({
      ...headerSchema,
      style: {
        ...headerSchema.style,
        padding: newPadding
      }
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!titleItem) {
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
      {/* Header Styles */}
      <div className="p-4 bg-gray-700 rounded-lg">
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
                  value={parseInt(headerSchema.style?.padding?.split(' ')[0] || '10')}
                  onChange={(e) => handlePaddingChange(e, 'vertical')}
                  className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white w-full text-sm focus:border-blue-500 outline-none"
                  min="0"
                  max="50"
                  step="1"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Horizontal</label>
                <input
                  type="number"
                  value={parseInt(headerSchema.style?.padding?.split(' ')[1] || '20')}
                  onChange={(e) => handlePaddingChange(e, 'horizontal')}
                  className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white w-full text-sm focus:border-blue-500 outline-none"
                  min="0"
                  max="400"
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
          id={logoItem.id ? `panel-item-${logoItem.id}` : undefined}
          className="p-4 bg-gray-700 rounded-lg"
          data-item-id={logoItem.id}
        >
          <h3 className="text-lg font-semibold text-white mb-3">Logo</h3>
          <LogoForm logoItem={logoItem} updateLogo={handleUpdateLogo} />
        </div>
      )}
      
      {/* Title Settings */}
      <div 
        id={titleItem?.id ? `panel-item-${titleItem.id}` : undefined}
        className="p-4 bg-gray-700 rounded-lg"
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
      <div className="p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Navigation Items</h3>
        <NavigationForm
          navigationItems={navigationItems} 
          updateNavigationItems={handleUpdateNavigationItems}
          selectedItemId={selectedId}
        />
      </div>
    </div>
  );
};

export default HeaderPanel;
