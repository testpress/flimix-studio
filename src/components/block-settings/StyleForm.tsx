import React from 'react';
import type { StyleProps, Padding, TextAlign, BorderRadius, BoxShadow, TabAlignment, TabStyle, StyleValue } from '@type/style';

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

  // Utility function to parse color and opacity from a color value
  const parseColorAndOpacity = (colorValue: string | undefined, defaultColor: string = '#ffffff') => {
    if (!colorValue) return { color: defaultColor, opacity: 100 };

    // Check if it's rgba format
    const rgbaMatch = colorValue.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaMatch) {
      const [, r, g, b, a] = rgbaMatch;
      const opacity = Math.round(parseFloat(a) * 100);
      // Convert RGB to hex
      const hexColor = `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
      return { color: hexColor, opacity };
    }

    // If it's a hex color
    return { color: colorValue, opacity: 100 };
  };

  // Utility function to convert hex color and opacity to rgba
  const convertToRgba = (hexColor: string, opacityValue: number) => {
    if (opacityValue < 100) {
      // Convert hex to rgba
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const a = opacityValue / 100;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
      // Use hex color directly at 100% opacity
      return hexColor;
    }
  };


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
        {blockType === 'cta-button' || blockType === 'badge-strip' || blockType === 'hero' ? 'Alignment' : 'Text Alignment'}
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

  // Helper function to render Background Color field with transparency support
  const renderBackgroundColorField = () => {
    const { color, opacity } = parseColorAndOpacity(style.backgroundColor, '#ffffff');

    const handleColorChange = (hexColor: string, opacityValue: number) => {
      handleStyleChange('backgroundColor', convertToRgba(hexColor, opacityValue));
    };

    return (
      <div>
        <label className="block text-sm text-gray-700 mb-1">Background Color</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 relative">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value, opacity)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
            <div
              className="absolute top-0 right-0 h-full w-5 flex items-center justify-center cursor-pointer"
              onClick={() => handleColorChange('#ffffff', 0)} // Set transparent on click
              title="Set transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Opacity: {opacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => handleColorChange(color, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render Text Color field with transparency support
  const renderTextColorField = () => {
    const { color, opacity } = parseColorAndOpacity(style.textColor, '#000000');

    const handleColorChange = (hexColor: string, opacityValue: number) => {
      handleStyleChange('textColor', convertToRgba(hexColor, opacityValue));
    };

    return (
      <div>
        <label className="block text-sm text-gray-700 mb-1">Text Color</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 relative">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value, opacity)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
            <div
              className="absolute top-0 right-0 h-full w-5 flex items-center justify-center cursor-pointer"
              onClick={() => handleColorChange('#000000', 0)} // Set transparent on click
              title="Set transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Opacity: {opacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => handleColorChange(color, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render Color field (for divider blocks) with transparency support
  const renderColorField = () => {
    const { color, opacity } = parseColorAndOpacity(style.backgroundColor, '#000000');

    const handleColorChange = (hexColor: string, opacityValue: number) => {
      handleStyleChange('backgroundColor', convertToRgba(hexColor, opacityValue));
    };

    return (
      <div>
        <label className="block text-sm text-gray-700 mb-1">Color</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 relative">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value, opacity)}
              className="w-full h-10 border border-gray-300 rounded text-sm"
            />
            <div
              className="absolute top-0 right-0 h-full w-5 flex items-center justify-center cursor-pointer"
              onClick={() => handleColorChange('#000000', 0)} // Set transparent on click
              title="Set transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Opacity: {opacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => handleColorChange(color, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  };


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
      renderPaddingField(),
      renderMarginField(),
      renderTextAlignField(),
      renderBackgroundColorField(),
      renderTextColorField(),
      renderBorderRadiusField(),
      renderBoxShadowField(),
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
      case 'badge-strip':
        // Badge strip blocks: show layout, visual styling, and alignment options
        return [
          ...layoutOnlyFields,
          renderTextAlignField(),
        ];

      case 'divider':
        // Divider blocks: only show color option
        return [
          renderColorField(),
        ];
      case 'hero':
        return [
          renderMarginField(),
          renderBackgroundColorField(),
          renderTextAlignField(),
          renderTextColorField(),
        ];
      case 'rowLayout':
        return [
          renderPaddingField(),
          renderMarginField(),
          renderBackgroundColorField(),
          renderBorderRadiusField(),
          renderBoxShadowField(),
        ];
      case 'contentLibrary':
        return [
          renderPaddingField(),
          renderMarginField(),
          renderBackgroundColorField(),
        ];
      case 'faq-accordion':
      case 'testimonial':
      case 'featureCallout':
      case 'text':
      case 'posterGrid':
      case 'carousel':
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

      <div className="space-y-6">
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