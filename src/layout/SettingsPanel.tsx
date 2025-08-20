import React from 'react';
import { useSelection } from '@context/SelectionContext';
import type { 
  BlockFormProps
} from '@blocks/shared/FormTypes';
import type { VisibilityProps } from '@blocks/shared/Visibility';
import type { StyleProps } from '@blocks/shared/Style';
import { VisibilityForm, StyleForm } from '@blocks/settings';
import HeroForm from '@blocks/hero/form';
import TextForm from '@blocks/text/form';
import SectionForm from '@blocks/section/form';
import PosterGridForm from '@blocks/poster-grid/form';
import PosterGridItemForm from '@blocks/poster-grid/ItemForm';
import type { PosterGridItem } from '@blocks/poster-grid/schema';
import type { PosterGridBlockProps } from '@blocks/poster-grid/schema';
import type { CarouselBlockProps } from '@blocks/carousel/schema';
import CarouselItemForm from '@blocks/carousel/ItemForm';
import type { CarouselItem } from '@blocks/carousel/schema';
import CarouselForm from '@blocks/carousel/form';
import TestimonialForm from '@blocks/testimonial/form';
import TestimonialItemForm from '@blocks/testimonial/ItemForm';
import type { TestimonialItem } from '@blocks/testimonial/schema';
import type { TestimonialBlockProps } from '@blocks/testimonial/schema';
import SpacerForm from '@blocks/spacer/form';
import DividerForm from '@blocks/divider/form';
import FeatureCalloutForm from '@blocks/feature-callout/form';
import FeatureCalloutItemForm from '@blocks/feature-callout/ItemForm';
import type { FeatureCalloutItem } from '@blocks/feature-callout/schema';
import type { FeatureCalloutBlockProps } from '@blocks/feature-callout/schema';
import FAQAccordionForm from '@blocks/faq-accordion/form';
import FAQAccordionItemForm from '@blocks/faq-accordion/ItemForm';
import type { FAQAccordionItem } from '@blocks/faq-accordion/schema';
import type { FAQAccordionBlockProps } from '@blocks/faq-accordion/schema';
import ImageForm from '@blocks/image/form';
import VideoForm from '@blocks/video/form';
import TabsForm from '@blocks/tabs/form';
import FooterForm from '@blocks/footer/form';
import FooterItemForm from '@blocks/footer/ItemForm';
import type { FooterBlockProps, FooterColumn } from '@blocks/footer/schema';
import CTAButtonForm from '@blocks/cta-button/form';
import { BadgeStripForm, BadgeStripItemForm } from '@blocks/badge-strip';
import type { BadgeStripBlockProps, BadgeStripItem } from '@blocks/badge-strip/schema';
import { useSettingsPanel } from '@context/SettingsPanelContext';

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
  const { isSettingsOpen, openSettings } = useSettingsPanel();

  // Auto-open settings when a block gets selected
  React.useEffect(() => {
    if (selectedBlock) {
      openSettings();
    }
  }, [selectedBlock, openSettings]);

  // Block editor registry for dynamic lookup
  const BlockPropEditors: Record<string, React.FC<BlockFormProps>> = {
    hero: HeroForm,
    text: TextForm,
    section: SectionForm,
    posterGrid: PosterGridForm,
    carousel: CarouselForm,
    testimonial: TestimonialForm,
    spacer: SpacerForm,
    divider: DividerForm,
    featureCallout: FeatureCalloutForm,
    'faq-accordion': FAQAccordionForm,
    image: ImageForm,
    video: VideoForm,
    tabs: TabsForm,
    'footer': FooterForm,
    'cta-button': CTAButtonForm,
    'badge-strip': BadgeStripForm,
  };

  const handleVisibilityChange = (newVisibility: VisibilityProps) => {
    if (!selectedBlock) return;
    
    updateSelectedBlockVisibility(newVisibility);
  };

  const handleStyleChange = (newStyle: StyleProps) => {
    if (!selectedBlock) return;
    
    updateSelectedBlockStyle(newStyle);
  };

  const renderItemEditor = () => {
    if (!selectedBlock || !selectedItemId || !selectedItemBlockId) return null;

    // Only show item editor if the selected item belongs to the currently selected block
    if (selectedItemBlockId !== selectedBlock.id) return null;

    switch (selectedBlock.type) {
      case 'posterGrid': {
        const items = (selectedBlock.props as PosterGridBlockProps).items || [];
        const item = items.find((i: PosterGridItem) => i.id === selectedItemId);
        
        if (!item) return null;

        const handleItemChange = (updatedItem: PosterGridItem) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };

        return (
          <PosterGridItemForm
            item={item}
            onChange={handleItemChange}
            title="Poster Grid Item"
            progressBarEnabled={(selectedBlock.props as PosterGridBlockProps).progressBar?.enabled || false}
          />
        );
      }
      
      case 'carousel': {
        const items = (selectedBlock.props as CarouselBlockProps).items || [];
        const item = items.find((i: CarouselItem) => i.id === selectedItemId);
        
        if (!item) return null;
        
        const handleItemChange = (updatedItem: CarouselItem) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };

        return (
          <CarouselItemForm
            item={item}
            onChange={handleItemChange}
            title="Carousel Item"
            progressBarEnabled={(selectedBlock.props as CarouselBlockProps).progressBar?.enabled || false}
          />
        );
      }
      
      case 'testimonial': {
        const items = (selectedBlock.props as TestimonialBlockProps).items || [];
        const item = items.find((i: TestimonialItem) => i.id === selectedItemId);
        
        if (!item) return null;
        
        const handleItemChange = (updatedItem: TestimonialItem) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };

        return (
          <TestimonialItemForm
            item={item}
            onChange={handleItemChange}
            title="Testimonial Item"
          />
        );
      }
      
      case 'featureCallout': {
        const items = (selectedBlock.props as FeatureCalloutBlockProps).items || [];
        const item = items.find((i: FeatureCalloutItem) => i.id === selectedItemId);
        
        if (!item) return null;
        
        const handleItemChange = (updatedItem: FeatureCalloutItem) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };

        return (
          <FeatureCalloutItemForm
            item={item}
            onChange={handleItemChange}
            title="Feature Callout Item"
          />
        );
      }
      
      case 'faq-accordion': {
        const items = (selectedBlock.props as FAQAccordionBlockProps).items || [];
        const item = items.find((i: FAQAccordionItem) => i.id === selectedItemId);
        
        if (!item) return null;
        
        const handleItemChange = (updatedItem: FAQAccordionItem) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };

        return (
          <FAQAccordionItemForm
            item={item}
            onChange={handleItemChange}
            title="FAQ Item"
          />
        );
      }
      
      case 'footer': {
        const items = (selectedBlock.props as FooterBlockProps).items || [];
        const item = items.find((i: FooterColumn) => i.id === selectedItemId);
        
        if (!item) return null;
        
        const handleItemChange = (updatedItem: FooterColumn) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };

        return (
          <FooterItemForm
            item={item}
            onChange={handleItemChange}
            title="Footer Item"
          />
        );
      }
      
      case 'badge-strip': {
        const items = (selectedBlock.props as BadgeStripBlockProps).items || [];
        const item = items.find((i: BadgeStripItem) => i.id === selectedItemId);
        
        if (!item) return null;
        
        const handleItemChange = (updatedItem: BadgeStripItem) => {
          updateBlockItem(selectedBlock.id, selectedItemId, updatedItem);
        };

        return (
          <BadgeStripItemForm
            item={item}
            onChange={handleItemChange}
            title="Badge Editor"
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
    <div className={`${isSettingsOpen ? 'w-[28rem] bg-white border-l border-gray-200' : 'w-0 bg-transparent border-0'} sticky top-16 self-start h-[calc(100vh-4rem)] min-h-0 transition-all duration-300 ease-in-out overflow-hidden`}>
      <div className={`${isSettingsOpen ? 'p-8' : 'p-0'} min-w-0 h-full min-h-0 flex flex-col`}>
        <div className="mb-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Block Settings</h2>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showDebug}
                onChange={onToggleShowDebug}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Debug</span>
            </label>
          </div>
        </div>
        <div className="space-y-6 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
          
          {selectedItemId && renderItemEditor()}
          
          {renderBlockPropsEditor()}
          
          {selectedBlock && selectedBlock.type !== 'spacer' && selectedBlock.type !== 'divider' && (
            <StyleForm
              style={selectedBlock.style || {}}
              onChange={handleStyleChange}
              blockType={selectedBlock.type}
            />
          )}
          
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
      </div>
    </div>
  );
};

export default SettingsPanel; 