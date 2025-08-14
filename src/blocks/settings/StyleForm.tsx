import React from 'react';
import type { StyleProps, Theme, Padding, TextAlign, BorderRadius, BoxShadow, TabAlignment, TabStyle, StyleValue } from '@blocks/shared/Style';

interface StyleFormProps {
  style: StyleProps;
  onChange: (newStyle: StyleProps) => void;
  blockType?: string; // Add block type to determine which options to show
}

const StyleForm: React.FC<StyleFormProps> = ({ style, onChange, blockType }) => {
  const handleStyleChange = (key: keyof StyleProps, value: StyleValue) => {
    onChange({
      ...style,
      [key]: value
    });
  };

  // Helper function to render Theme field
  const renderThemeField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Theme</label>
      <select
        value={style.theme || 'light'}
        onChange={(e) => handleStyleChange('theme', e.target.value as Theme)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );

  // Helper function to render Padding field
  const renderPaddingField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Padding</label>
      <select
        value={style.padding || 'md'}
        onChange={(e) => handleStyleChange('padding', e.target.value as Padding)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="none">None</option>
        <option value="sm">Small</option>
        <option value="md">Medium</option>
        <option value="lg">Large</option>
      </select>
    </div>
  );

  // Helper function to render Margin field
  const renderMarginField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Margin</label>
      <select
        value={style.margin || 'none'}
        onChange={(e) => handleStyleChange('margin', e.target.value as Padding)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="none">None</option>
        <option value="sm">Small</option>
        <option value="md">Medium</option>
        <option value="lg">Large</option>
      </select>
    </div>
  );

  // Helper function to render Text Alignment field
  const renderTextAlignField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {blockType === 'cta-button' ? 'Alignment' : 'Text Alignment'}
      </label>
      <select
        value={style.textAlign || 'left'}
        onChange={(e) => handleStyleChange('textAlign', e.target.value as TextAlign)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
    </div>
  );

  // Helper function to render Background Color field
  const renderBackgroundColorField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Background Color</label>
      <input
        type="color"
        value={style.backgroundColor || '#ffffff'}
        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded text-sm"
      />
    </div>
  );

  // Helper function to render Text Color field
  const renderTextColorField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Text Color</label>
      <input
        type="color"
        value={style.textColor || '#000000'}
        onChange={(e) => handleStyleChange('textColor', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded text-sm"
      />
    </div>
  );

  // Helper function to render Border Radius field
  const renderBorderRadiusField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Border Radius</label>
      <select
        value={style.borderRadius || 'none'}
        onChange={(e) => handleStyleChange('borderRadius', e.target.value as BorderRadius)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="none">None</option>
        <option value="sm">Small</option>
        <option value="md">Medium</option>
        <option value="lg">Large</option>
      </select>
    </div>
  );

  // Helper function to render Box Shadow field
  const renderBoxShadowField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Box Shadow</label>
      <select
        value={style.boxShadow || 'none'}
        onChange={(e) => handleStyleChange('boxShadow', e.target.value as BoxShadow)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="none">None</option>
        <option value="sm">Small</option>
        <option value="md">Medium</option>
        <option value="lg">Large</option>
      </select>
    </div>
  );

  // Helper function to render Max Width field
  const renderMaxWidthField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Max Width</label>
      <input
        type="text"
        value={style.maxWidth || ''}
        onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
        placeholder="e.g., 1200px, 100%"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
  );

  // Helper function to render Tab Alignment field
  const renderTabAlignmentField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Tab Alignment</label>
      <select
        value={style.tabAlignment || 'center'}
        onChange={(e) => handleStyleChange('tabAlignment', e.target.value as TabAlignment)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
    </div>
  );

  // Helper function to render Tab Style field
  const renderTabStyleField = () => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Tab Style</label>
      <select
        value={style.tabStyle || 'pill'}
        onChange={(e) => handleStyleChange('tabStyle', e.target.value as TabStyle)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="underline">Underline</option>
        <option value="pill">Pill</option>
        <option value="boxed">Boxed</option>
      </select>
    </div>
  );

  // Function to get which fields to render based on block type
  const getFieldsToRender = (blockType?: string) => {
    // Define field groups for different styling needs
    const allFields = [
      renderThemeField(),
      renderPaddingField(),
      renderMarginField(),
      renderTextAlignField(),
      renderBackgroundColorField(),
      renderTextColorField(),
      renderBorderRadiusField(),
      renderBoxShadowField(),
      renderMaxWidthField(),
    ];

    const layoutOnlyFields = [
      renderPaddingField(),
      renderMarginField(),
      renderBackgroundColorField(),
      renderBorderRadiusField(),
      renderBoxShadowField(),
    ];

    const tabsFields = [
      renderPaddingField(),
      renderMarginField(),
      renderBackgroundColorField(),
      renderBorderRadiusField(),
      renderBoxShadowField(),
      renderTabAlignmentField(),
      renderTabStyleField(),
    ];

    switch (blockType) {
      case 'image':
        // Image blocks: only show layout and visual styling, no text-related options
        return layoutOnlyFields;
      
      case 'section':
        // Section blocks: show layout options and text color, but no theme or text alignment
        return [
          ...layoutOnlyFields,
          renderTextColorField(),
        ];

      case 'tabs':
        // Tabs blocks: show layout options and tab-specific styling
        return tabsFields;

      case 'video':
        return [
          ...layoutOnlyFields,
          renderTextAlignField(),
          renderTextColorField(),
        ];

      case 'faq-accordion':
      case 'testimonial':
      case 'featureCallout':
      case 'hero':
      case 'text':
      case 'posterGrid':
      case 'carousel':
      case 'footer':
      case 'cta-button':
        // Standard blocks: show all options
        return allFields;
      
      default:
        // Default: show all options for unknown block types
        return allFields;
    }
  };

  const fieldsToRender = getFieldsToRender(blockType);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-4">Style Settings</h3>
      
      <div className="space-y-4">
        {fieldsToRender.map((field, index) => (
          <div key={`style-field-${index}`}>
            {field}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleForm;