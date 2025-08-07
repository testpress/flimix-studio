import React from 'react';
import type { StyleProps } from '@blocks/shared/Style';
import type { VisibilityProps } from '@blocks/shared/Visibility';
import { useSelection } from '@context/SelectionContext';
import { VisibilityForm, StyleForm, ItemForm, type BlockFormProps } from '@blocks/settings';
import HeroForm from '@blocks/hero/form';
import TextForm from '@blocks/text/form';
import SectionForm from '@blocks/section/form';
import PosterGridForm from '@blocks/poster-grid/form';
import type { PosterGridItem } from '@blocks/poster-grid/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';

interface SettingsPanelProps {
  showDebug: boolean;
  onToggleShowDebug: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ showDebug, onToggleShowDebug }) => {
  const { 
    selectedBlock, 
    selectedItemId, 
    selectedItemBlockId,
    updateSelectedBlockProps, 
    updateSelectedBlockStyle, 
    updateSelectedBlockVisibility,
    updateBlockItem,
  } = useSelection();

  // Block editor registry for dynamic lookup
  const BlockPropEditors: Record<string, React.FC<BlockFormProps>> = {
    hero: HeroForm,
    text: TextForm,
    section: SectionForm,
    posterGrid: PosterGridForm,
  };

  const handleVisibilityChange = (newVisibility: VisibilityProps) => {
    if (!selectedBlock) return;
    
    updateSelectedBlockVisibility(newVisibility);
  };

  const handleStyleChange = (newStyle: StyleProps) => {
    if (!selectedBlock) return;
    
    updateSelectedBlockStyle(newStyle);
  };

  const getArrayItemFields = (blockType: string) => {
    switch (blockType) {
      case 'posterGrid':
        return [
          {
            key: 'image' as keyof PosterGridItem,
            label: 'Image URL',
            type: 'url' as const,
            placeholder: 'Enter image URL...',
            required: true
          },
          {
            key: 'title' as keyof PosterGridItem,
            label: 'Title',
            type: 'text' as const,
            placeholder: 'Enter item title...',
            required: true
          },
          {
            key: 'link' as keyof PosterGridItem,
            label: 'Link (optional)',
            type: 'url' as const,
            placeholder: 'Enter link URL...',
            required: false
          }
        ];
      default:
        return [];
    }
  };

  const renderItemEditor = () => {
    if (!selectedBlock || !selectedItemId || !selectedItemBlockId) return null;

    // Only show item editor if the selected item belongs to the currently selected block
    if (selectedItemBlockId !== selectedBlock.id) return null;

    const fields = getArrayItemFields(selectedBlock.type);
    if (fields.length === 0) return null;

    switch (selectedBlock.type) {
      case 'posterGrid': {
        const items = (selectedBlock.props as PosterGridBlockProps).items || [];
        const item = items.find((i: PosterGridItem) => i.id === selectedItemId);
        
        if (!item) return null;

        const handleItemChange = (updatedItem: PosterGridItem) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };


        return (
          <ItemForm<PosterGridItem>
            item={item}
            onChange={handleItemChange}
            title="Poster Grid Item"
            fields={fields}
          />
        );
      }
      
      default:
        return null;
    }
  };

  const renderBlockPropsEditor = () => {
    if (!selectedBlock) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
          <p className="text-sm text-gray-500">Select a block to edit properties</p>
        </div>
      );
    }

    const EditorComponent = BlockPropEditors[selectedBlock.type];
    
    if (EditorComponent) {
      return (
        <EditorComponent 
          block={selectedBlock} 
          updateProps={updateSelectedBlockProps}
          updateStyle={updateSelectedBlockStyle}
        />
      );
    }

    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Properties</h3>
        <p className="text-sm text-gray-500">No editable props available for this block type</p>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Block Settings</h2>
        <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between mb-4">
            <label className="font-medium text-gray-700">Debug</label>
            <input
              type="checkbox"
              checked={showDebug}
              onChange={onToggleShowDebug}
              className="h-4 w-4 rounded"
            />
          </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Selected Block</h3>
            {selectedBlock ? (
              <div className="text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Type:</span> {selectedBlock.type}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">ID:</span> {selectedBlock.id}
                </p>
                {selectedItemId && (
                  <p className="text-gray-700">
                    <span className="font-medium">Selected Item:</span> {selectedItemId}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No block selected</p>
            )}
          </div>
          
          {selectedBlock && (
            <VisibilityForm
              block={selectedBlock}
              visibility={selectedBlock.visibility || {}}
              onUpdateVisibility={handleVisibilityChange}
            />
          )}
          
          {renderBlockPropsEditor()}
          
          {selectedItemId && renderItemEditor()}
          
          {selectedBlock && (
            <StyleForm
              style={selectedBlock.style || {}}
              onChange={handleStyleChange}
            />
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Page Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Page Title</h3>
            <input 
              type="text" 
              placeholder="Enter page title"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Meta Description</h3>
            <textarea 
              placeholder="Enter meta description"
              className="w-full p-2 border border-gray-300 rounded text-sm h-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 