// src/footer/preview.tsx
import React from 'react';
import type { FooterSchema, FooterItem, ItemAlignment, LinkOrientation, IconSize } from './schema';
import { FOOTER_LAYOUT_PRESETS } from './constants';
import { FOOTER_ROOT_ID } from '@/footer/constants';

interface FooterPreviewProps {
  footerSchema: FooterSchema;
  selectedItemId: string | null;
  onItemSelect: (id: string) => void;
}

const ICON_SIZE_MAP: Record<IconSize, string> = {
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px'
};

// Helper for visual selection feedback
const getSelectionClass = (isSelected: boolean) => 
  isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black relative z-10' : '';

const renderFooterItem = (item: FooterItem, isSelected: boolean, onSelect: (id: string) => void) => {
  const selectionClass = getSelectionClass(isSelected);
  const isExternal = item.linkType === 'external';
  
  const iconSize = ICON_SIZE_MAP[item.style?.size || 'md'];

  const anchorProps = {
    href: item.url || '#',
    target: isExternal ? '_blank' : undefined,
    rel: isExternal ? 'noopener noreferrer' : undefined,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Stop bubbling to column
      onSelect(item.id);
    },
    className: `transition-opacity hover:opacity-80 inline-flex items-center gap-2 ${selectionClass}`,
    style: { color: item.style?.color }
  };

  return (
    <a {...anchorProps}>
      {item.icon && (
        <img 
          src={item.icon} 
          alt={item.label || 'icon'}
          className="block object-contain shrink-0"
          style={{ 
            width: iconSize, 
            height: 'auto',
            maxWidth: '100%'
          }} 
        />
      )}
      
      {item.label && (
        <span className="text-sm leading-none">
          {item.label}
        </span>
      )}
    </a>
  );
};

const FooterPreview: React.FC<FooterPreviewProps> = ({
  footerSchema,
  selectedItemId,
  onItemSelect
}) => {
  
  const getAlignmentClass = (orientation: LinkOrientation, alignment?: ItemAlignment) => {
    const align = alignment || 'start';
    if (orientation === 'vertical') {
      if (align === 'center') return 'items-center text-center';
      if (align === 'end') return 'items-end text-right';
      return 'items-start text-left';
    } else {
      if (align === 'center') return 'justify-center';
      if (align === 'end') return 'justify-end';
      return 'justify-start';
    }
  };

  const paddingString = footerSchema.style?.padding || '40px 20px';
  const [verticalPadding, horizontalPadding] = paddingString.split(' ');

  return (
    <footer 
      className={`w-full transition-all duration-200 cursor-pointer ${getSelectionClass(selectedItemId === FOOTER_ROOT_ID)}`}
      style={{
        backgroundColor: footerSchema.style?.backgroundColor || '#111111',
        color: footerSchema.style?.textColor || '#cccccc',
        paddingTop: verticalPadding || '40px',
        paddingBottom: verticalPadding || '40px',
      }}
      onClick={() => {
        onItemSelect(FOOTER_ROOT_ID);
      }}
    >
      <div 
        className="max-w-7xl mx-auto flex flex-col gap-8"
        style={{
          paddingLeft: horizontalPadding || '20px',
          paddingRight: horizontalPadding || '20px',
        }}
              >
        {footerSchema.rows?.map((row) => {
           const presetConfig = FOOTER_LAYOUT_PRESETS.find(p => p.id === row.preset);
           const gridClass = presetConfig ? presetConfig.class : 'grid-cols-1';

           return (
             <div 
               key={row.id} 
               className={`
                 grid ${gridClass} gap-8 w-full p-2 rounded transition-all 
                 ${getSelectionClass(selectedItemId === row.id)}
               `}
              onClick={(e) => {
                 e.stopPropagation();
                 onItemSelect(row.id);
               }}
             >
               {row.columns.map((col) => (
            <div 
                   key={col.id} 
                   className={`
                     flex ${col.orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'}
                     ${getAlignmentClass(col.orientation, col.alignment)}
                     p-2 rounded transition-all
                     ${getSelectionClass(selectedItemId === col.id)}
                   `}
                  onClick={(e) => {
                     e.stopPropagation(); // 3. Select Column (Stop bubbling to Row)
                     onItemSelect(col.id);
                  }}
                >
                   {col.items.length > 0 ? (
                     col.items.map((item) => (
                       <div key={item.id}>
                         {renderFooterItem(item, selectedItemId === item.id, onItemSelect)}
                       </div>
                     ))
                   ) : (
                     <div className="w-full h-full min-h-[50px] border border-dashed border-gray-700 rounded flex items-center justify-center opacity-30">
                       <span className="text-xs">Empty</span>
                     </div>
                  )}
                </div>
              ))}
            </div>
           );
        })}
        
        {(!footerSchema.rows || footerSchema.rows.length === 0) && (
          <div className="text-center py-10 text-gray-600 border-2 border-dashed border-gray-800 rounded-lg">
            Footer Content Area (Click to select Footer)
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterPreview;
