// src/footer/preview.tsx
import React from 'react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { ExpansionPath } from '@context/HeaderFooterContext';
import type { ItemAlignment, LinkOrientation, IconSize } from './schema';
import { FOOTER_LAYOUT_PRESETS } from './constants';

const ICON_SIZE_MAP: Record<IconSize, string> = {
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px'
};

const FooterPreview: React.FC = () => {
  const { footerSchema, selectedId, selectItem } = useHeaderFooter();

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

  const renderSelectableItem = (
    id: string,
    tab: 'header' | 'footer',
    path: ExpansionPath = [],
    className: string = '',
    children: React.ReactNode
  ) => {
    const isSelected = selectedId === id;
    
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      selectItem(id, tab, path);
    };

    return (
      <div 
        id={`canvas-item-${id}`}
        className={`relative group transition-all duration-200 p-1.5 ${className}
          ${isSelected 
            ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent z-10' 
            : 'hover:ring-1 hover:ring-blue-500/30'}
        `}
        onClick={handleClick}
        data-selection-id={id}
      >
        {/* Selection Label (Visible on Hover or Selection) */}
        <div className={`absolute -top-3 left-0 px-1.5 rounded-t text-[9px] font-bold uppercase tracking-wider z-20 transition-opacity
          ${isSelected 
            ? 'bg-blue-600 text-white opacity-100' 
            : 'bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100'}
        `}>
        </div>
        {children}
      </div>
    );
  };

  const paddingString = footerSchema.style?.padding || '40px 20px';
  const [verticalPadding, horizontalPadding] = paddingString.split(' ');

  return (
    <footer 
      className="w-full transition-all duration-200"
      style={{
        backgroundColor: footerSchema.style?.backgroundColor || '#111111',
        color: footerSchema.style?.textColor || '#cccccc',
        paddingTop: verticalPadding || '40px',
        paddingBottom: verticalPadding || '40px',
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
            renderSelectableItem(
              row.id,
              'footer',
              [],
              `grid ${gridClass} gap-8 w-full min-h-[50px]`,
              row.columns.map((col) => (
                renderSelectableItem(
                  col.id,
                  'footer',
                  [row.id],
                  `flex ${col.orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'}
                    ${getAlignmentClass(col.orientation, col.alignment)}
                    min-h-[30px] p-1
                  `,
                  col.items.length > 0 ? (
                    col.items.map((item) => {
                      const isExternal = item.linkType === 'external';
                      const iconSize = ICON_SIZE_MAP[item.style?.size || 'md'];
                      
                      return (
                        renderSelectableItem(
                          item.id,
                          'footer',
                          [row.id, col.id],
                          'inline-block',
                          <a 
                            href={item.url || '#'} 
                            className="hover:opacity-80 transition-opacity block"
                            style={{ color: item.style?.color }}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            onClick={(e) => {
                              e.preventDefault(); 
                            }}
                          >
                            {item.icon && (
                              <img 
                                src={item.icon} 
                                alt={item.label || 'icon'}
                                className="block object-contain shrink-0 inline-block mr-2"
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
                        )
                      );
                    })
                  ) : (
                    <div className="text-[10px] text-gray-600 border border-dashed border-gray-700 p-2 w-full text-center rounded">
                      Empty Col
                    </div>
                  )
                )
              ))
            )
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
