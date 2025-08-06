import React from 'react';
import type { StyleProps } from '@blocks/shared/Style';
import type { VisibilityProps } from '@blocks/shared/Visibility';
import { useSelection } from '@context/SelectionContext';
import { VisibilityForm, StyleForm, type BlockFormProps } from '@blocks/settings';
import HeroForm from '@blocks/hero/form';
import TextForm from '@blocks/text/form';
import SectionForm from '@blocks/section/form';

interface SettingsPanelProps {
  showDebug: boolean;
  onToggleShowDebug: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ showDebug, onToggleShowDebug }) => {
  const { selectedBlock, updateSelectedBlockProps, updateSelectedBlockStyle } = useSelection();

  // Block editor registry for dynamic lookup
  const BlockPropEditors: Record<string, React.FC<BlockFormProps>> = {
    hero: HeroForm,
    text: TextForm,
    section: SectionForm,
  };

  const handleVisibilityChange = (newVisibility: VisibilityProps) => {
    if (!selectedBlock) return;

    // TODO: Implement visibility update logic. This should update the selected block's visibility property.
    console.log('Updating visibility for block:', selectedBlock.id, newVisibility);
  };

  const handleStyleChange = (newStyle: StyleProps) => {
    if (!selectedBlock) return;
    
    updateSelectedBlockStyle(newStyle);
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