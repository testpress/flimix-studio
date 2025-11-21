import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';
import type { TextBlock } from './schema';

// Text block editor schema
const textEditorFields: Field[] = [
  { 
    key: 'content', 
    label: 'Content', 
    type: 'textarea',
    placeholder: 'Enter text content...',
    required: true
  }
];

const TextForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const textBlock = block as TextBlock;
  const { props } = textBlock;

  const handleFontChange = (key: keyof TextBlock['props'], value: string) => {
    updateProps({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      <PropertiesForm
        block={block}
        fieldDefinitions={textEditorFields}
        updateProps={updateProps}
      />
      
      {/* Font Styling Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800">Typography Settings</h3>
        
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Font Family</label>
          <select
            value={props.fontFamily || 'sans'}
            onChange={(e) => handleFontChange('fontFamily', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
          >
            <option value="sans">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
            <option value="display">Display</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Font Size</label>
          <select
            value={props.fontSize || 'base'}
            onChange={(e) => handleFontChange('fontSize', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
          >
            <option value="xs">Extra Small (xs)</option>
            <option value="sm">Small (sm)</option>
            <option value="base">Base (base)</option>
            <option value="lg">Large (lg)</option>
            <option value="xl">Extra Large (xl)</option>
            <option value="2xl">2XL</option>
            <option value="3xl">3XL</option>
            <option value="4xl">4XL</option>
            <option value="5xl">5XL</option>
            <option value="6xl">6XL</option>
          </select>
        </div>

        {/* Font Weight */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Font Weight</label>
          <select
            value={props.fontWeight || 'normal'}
            onChange={(e) => handleFontChange('fontWeight', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
          >
            <option value="thin">Thin</option>
            <option value="extralight">Extra Light</option>
            <option value="light">Light</option>
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="semibold">Semi Bold</option>
            <option value="bold">Bold</option>
            <option value="extrabold">Extra Bold</option>
          </select>
        </div>

        {/* Font Style */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Font Style</label>
          <select
            value={props.fontStyle || 'normal'}
            onChange={(e) => handleFontChange('fontStyle', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </div>

        {/* Text Decoration */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Text Decoration</label>
          <select
            value={props.textDecoration || 'none'}
            onChange={(e) => handleFontChange('textDecoration', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
          >
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="line-through">Line Through</option>
            <option value="overline">Overline</option>
          </select>
        </div>

        {/* Line Height */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Line Height</label>
          <select
            value={props.lineHeight || 'normal'}
            onChange={(e) => handleFontChange('lineHeight', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
          >
            <option value="none">None</option>
            <option value="tight">Tight</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
            <option value="loose">Loose</option>
          </select>
        </div>

        {/* Letter Spacing */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Letter Spacing</label>
          <select
            value={props.letterSpacing || 'normal'}
            onChange={(e) => handleFontChange('letterSpacing', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
          >
            <option value="tighter">Tighter</option>
            <option value="tight">Tight</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
            <option value="wider">Wider</option>
            <option value="widest">Widest</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextForm; 