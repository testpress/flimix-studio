import React from 'react';
import { 
  Eye, EyeOff, AlignLeft, AlignCenter, AlignRight, 
  Layers,
} from 'lucide-react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { HeaderItem, NavigationAlignment, Size } from '@header/schema';
import LogoForm from '@header/forms/LogoForm';
import NavigationForm from '@header/forms/NavigationForm';

interface StyleSelectProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

const StyleSelect: React.FC<StyleSelectProps> = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-300 mb-1.5 font-medium">{label}</label>
    <select
      value={value || options[0].value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:border-blue-500 outline-none"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const sizeOptions = [
  { label: 'None', value: 'none' },
  { label: 'X-Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'X-Large', value: 'xl' },
];

const fontSizeOptions = [
  { label: 'X-Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Large', value: 'lg' },
  { label: 'X-Large', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
];

const navigationFontSizeOptions = [
  { label: 'X-Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Large', value: 'lg' },
  { label: 'X-Large', value: 'xl' },
];

const iconSizeOptions = [
  { label: 'Small', value: 'xs' },
  { label: 'Base', value: 'sm' },
  { label: 'Large', value: 'md' },
  { label: 'X-Large', value: 'lg' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
];

const HeaderPanel: React.FC = () => {
  const { headerSchema, updateHeaderSchema, selectedId } = useHeaderFooter();
  
  const logoItem = headerSchema.items.find(item => item.type === 'logo');
  const titleItem = headerSchema.items.find(item => item.type === 'title');
  const navigationItems = headerSchema.items.filter(item => item.type !== 'logo' && item.type !== 'title');

  const updateGlobalStyle = (key: string, value: string | boolean | Size | undefined) => {
    updateHeaderSchema({
      ...headerSchema,
      style: { ...headerSchema.style, [key]: value }
    });
  };

  const handleUpdateLogo = (updated: HeaderItem) => {
    const updatedItems = headerSchema.items.map(item => item.type === 'logo' ? updated : item);
    updateHeaderSchema({ ...headerSchema, items: updatedItems });
  };
  const handleUpdateTitle = (updated: HeaderItem) => {
    const updatedItems = headerSchema.items.map(item => item.type === 'title' ? updated : item);
    updateHeaderSchema({ ...headerSchema, items: updatedItems });
  };
  const toggleVisibility = (item: HeaderItem) => {
    const updatedItems = headerSchema.items.map(i => 
      i.id === item.id ? { ...i, isVisible: i.isVisible === undefined ? false : !i.isVisible } : i
    );
    updateHeaderSchema({ ...headerSchema, items: updatedItems });
  };
  const handleUpdateNavigationItems = (items: HeaderItem[]) => {
    const nonNavigationItems = headerSchema.items.filter(item => item.type === 'logo' || item.type === 'title');
    updateHeaderSchema({ ...headerSchema, items: [...nonNavigationItems, ...items] });
  };
  const setNavAlignment = (align: NavigationAlignment) => {
    updateGlobalStyle('navigationAlignment', align);
  };

  return (
    <div className="space-y-4">
      {/* Header Styles */}
      <div className="p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
           <Layers size={16}/> Header Styles
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-5">
             <div className="flex flex-col">
               <label className="text-xs text-gray-400 mb-1">Background</label>
               <div className="flex items-center gap-2">
                  <input type="color" value={headerSchema.style?.backgroundColor || '#111111'} onChange={(e) => updateGlobalStyle('backgroundColor', e.target.value)} className="w-6 h-6 cursor-pointer"/>
                  <input type="text" value={headerSchema.style?.backgroundColor || '#111111'} onChange={(e) => updateGlobalStyle('backgroundColor', e.target.value)} className="bg-gray-600 border-gray-500 rounded px-2 py-1 text-xs text-white w-full border" />
               </div>
             </div>
             <div className="flex flex-col">
               <label className="text-xs text-gray-400 mb-1">Text Color</label>
               <div className="flex items-center gap-2">
                  <input type="color" value={headerSchema.style?.textColor || '#ffffff'} onChange={(e) => updateGlobalStyle('textColor', e.target.value)} className="w-6 h-6 cursor-pointer"/>
                  <input type="text" value={headerSchema.style?.textColor || '#ffffff'} onChange={(e) => updateGlobalStyle('textColor', e.target.value)} className="bg-gray-600 border-gray-500 rounded px-2 py-1 text-xs text-white w-full border" />
               </div>
             </div>
        </div>

        {/* 2. LAYOUT & SPACING */}
        <div className="space-y-5 pt-4 border-t border-gray-600 mb-5">
            <StyleSelect
              label="Padding"
              value={headerSchema.style?.padding}
              onChange={(value) => updateGlobalStyle('padding', value as Size)}
              options={sizeOptions}
            />

            <StyleSelect
              label="Margin"
              value={headerSchema.style?.margin}
              onChange={(value) => updateGlobalStyle('margin', value as Size)}
              options={sizeOptions}
            />

            <StyleSelect
              label="Border Radius"
              value={headerSchema.style?.borderRadius}
              onChange={(value) => updateGlobalStyle('borderRadius', value as Size)}
              options={sizeOptions}
            />
        </div>
        
        <div className="pt-4 border-t border-gray-600">
            {/* Alignment */}
            <div className="flex justify-between items-center mb-4">
               <label className="text-xs text-gray-300 font-semibold">Navigation Alignment</label>
               <div className="flex bg-gray-900 rounded border border-gray-600 p-0.5">
                  <button onClick={() => setNavAlignment('left')} className={`p-1.5 rounded ${headerSchema.style?.navigationAlignment === 'left' ? 'bg-blue-600 text-white' : 'text-gray-400'}`} title="Left"><AlignLeft size={14}/></button>
                  <button onClick={() => setNavAlignment('center')} className={`p-1.5 rounded ${headerSchema.style?.navigationAlignment === 'center' ? 'bg-blue-600 text-white' : 'text-gray-400'}`} title="Center"><AlignCenter size={14}/></button>
                  <button onClick={() => setNavAlignment('right')} className={`p-1.5 rounded ${(!headerSchema.style?.navigationAlignment || headerSchema.style?.navigationAlignment === 'right') ? 'bg-blue-600 text-white' : 'text-gray-400'}`} title="Right"><AlignRight size={14}/></button>
               </div>
            </div>

            {/* Nav Font Size */}
            <div className="mb-5">
              <StyleSelect
                label="Navigation Font Size"
                value={headerSchema.style?.navigationFontSize}
                onChange={(value) => updateGlobalStyle('navigationFontSize', value as Size)}
                options={navigationFontSizeOptions}
              />
            </div>
            
            <div className="mb-5">
              <StyleSelect
                label="Navigation Icon Size"
                value={headerSchema.style?.navigationIconSize}
                onChange={(value) => updateGlobalStyle('navigationIconSize', value as Size)}
                options={iconSizeOptions}
              />
            </div>
               
            {/* HOVER CONTAINER */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-600/50 p-4">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                        Hover Effect
                    </label>
                    <button 
                        onClick={() => updateGlobalStyle('disableHover', !headerSchema.style?.disableHover)}
                        className={`text-[10px] px-3 py-1 rounded border uppercase tracking-wider font-bold transition-colors ${
                            headerSchema.style?.disableHover 
                            ? 'bg-gray-700 text-gray-400 border-gray-600' 
                            : 'bg-blue-600 text-white border-blue-500'
                        }`}
                    >
                        {headerSchema.style?.disableHover ? 'OFF' : 'ON'}
                    </button>
                </div>

                {!headerSchema.style?.disableHover && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-gray-400">Active Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={headerSchema.style?.hoverColor || '#3b82f6'} onChange={(e) => updateGlobalStyle('hoverColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0"/>
                                <span className="text-xs text-gray-400 font-mono">{headerSchema.style?.hoverColor || '#3b82f6'}</span>
                            </div>
                        </div>
                        
                        {headerSchema.style?.hoverEffect === 'background' && (
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-400">Hover Text Color</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={headerSchema.style?.hoverTextColor || '#ffffff'} onChange={(e) => updateGlobalStyle('hoverTextColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0"/>
                                    <span className="text-xs text-gray-400 font-mono">{headerSchema.style?.hoverTextColor || '#ffffff'}</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                            <button 
                                onClick={() => updateGlobalStyle('hoverEffect', 'text')} 
                                className={`flex-1 text-xs py-1.5 rounded-md flex items-center justify-center gap-2 transition-all ${(!headerSchema.style?.hoverEffect || headerSchema.style?.hoverEffect === 'text') ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Text
                            </button>
                            <button 
                                onClick={() => updateGlobalStyle('hoverEffect', 'background')} 
                                className={`flex-1 text-xs py-1.5 rounded-md flex items-center justify-center gap-2 transition-all ${headerSchema.style?.hoverEffect === 'background' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Background
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Show Icons Toggle */}
            <div className="flex items-center justify-between mt-4 pt-2">
                <label className="text-xs text-gray-400 flex items-center gap-2">Show Navigation Item Icons</label>
                <button 
                    onClick={() => updateGlobalStyle('hideNavIcons', !headerSchema.style?.hideNavIcons)} 
                    className={`text-[10px] font-bold uppercase ${headerSchema.style?.hideNavIcons ? 'text-gray-500' : 'text-blue-400'}`}
                >
                    {headerSchema.style?.hideNavIcons ? 'Hidden' : 'Visible'}
                </button>
            </div>
        </div>
      </div>
      
      {/* Logo Editor */}
      {logoItem && (
        <div id={`panel-item-${logoItem.id}`} className={`p-4 rounded-lg border transition-all ${logoItem.isVisible === false ? 'bg-gray-800 border-gray-700 opacity-60' : 'bg-gray-700 border-transparent'}`} data-item-id={logoItem.id}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-white">Logo</h3>
            <button onClick={(e) => { e.stopPropagation(); toggleVisibility(logoItem); }} className="text-gray-400 hover:text-white">
              {logoItem.isVisible === false ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {logoItem.isVisible !== false && (
            <div className="space-y-4">
              <StyleSelect
                label="Logo Size (Max Height)"
                value={headerSchema.style?.logoSize}
                onChange={(value) => updateGlobalStyle('logoSize', value as Size)}
                options={iconSizeOptions}
              />
              <LogoForm logoItem={logoItem} updateLogo={handleUpdateLogo} />
            </div>
          )}
        </div>
      )}
      
      {/* Title Editor */}
      <div id={titleItem ? `panel-item-${titleItem.id}` : undefined} className={`p-4 rounded-lg border transition-all ${titleItem?.isVisible === false ? 'bg-gray-800 border-gray-700 opacity-60' : 'bg-gray-700 border-transparent'}`} data-item-id={titleItem?.id}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-white">Title</h3>
            {titleItem && (
              <button onClick={(e) => { e.stopPropagation(); toggleVisibility(titleItem); }} className="text-gray-400 hover:text-white">
                {titleItem.isVisible === false ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
        </div>
        {titleItem?.isVisible !== false && (
           <div className="space-y-4">
               <div className="flex flex-col">
                   <label className="text-xs text-gray-400 mb-1">Text</label>
                   <input type="text" value={titleItem?.label || ''} onChange={(e) => titleItem && handleUpdateTitle({...titleItem, label: e.target.value})} className="bg-gray-600 border border-gray-500 rounded px-2 py-1.5 text-white text-sm w-full" placeholder="Site Title"/>
               </div>

               {/* Title Font Size */}
               <StyleSelect
                  label="Title Font Size"
                  value={titleItem?.style?.fontSize}
                  onChange={(value) => titleItem && handleUpdateTitle({
                    ...titleItem,
                    style: { ...titleItem.style, fontSize: value as Size }
                  })}
                  options={fontSizeOptions}
                />

               {/* Title Color */}
               <div className="flex flex-col">
                   <label className="text-xs text-gray-400 mb-1">Text Color</label>
                   <div className="flex items-center gap-2">
                      <input 
                         type="color" 
                         value={titleItem?.style?.color || '#ffffff'} 
                         onChange={(e) => titleItem && handleUpdateTitle({
                             ...titleItem, 
                             style: { ...titleItem.style, color: e.target.value }
                         })} 
                         className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                      />
                      <input 
                         type="text" 
                         value={titleItem?.style?.color || '#ffffff'} 
                         onChange={(e) => titleItem && handleUpdateTitle({
                             ...titleItem, 
                             style: { ...titleItem.style, color: e.target.value }
                         })} 
                         className="bg-gray-600 border-gray-500 rounded px-2 py-1 text-xs text-white w-full border" 
                      />
                   </div>
               </div>
           </div>
        )}
      </div>
      
      {/* Navigation Editor */}
      <div className="p-4 bg-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold text-white mb-3">Navigation Items</h3>
        <NavigationForm navigationItems={navigationItems} updateNavigationItems={handleUpdateNavigationItems} selectedItemId={selectedId} />
      </div>
    </div>
  );
};

export default HeaderPanel;
