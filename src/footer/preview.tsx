import React from 'react';
import { useHeaderFooter } from '@context/HeaderFooterContext';
import type { ExpansionPath } from '@context/HeaderFooterContext';
import type { ItemAlignment, LinkOrientation, IconSize, Size, FooterItem, ColumnChild, FooterColumn } from './schema';
import { FOOTER_LAYOUT_PRESETS } from './constants';

const PADDING_MAP: Record<Size, string> = {
  none: 'p-0', xs: 'p-1', sm: 'p-2', base: 'p-3', md: 'p-4', lg: 'p-6', xl: 'p-8', '2xl': 'p-10', '3xl': 'p-12',
};

const MARGIN_MAP: Record<Size, string> = {
  none: 'm-0', xs: 'm-1', sm: 'm-2', base: 'm-3', md: 'm-4', lg: 'm-6', xl: 'm-8', '2xl': 'm-10', '3xl': 'm-12',
};

const FONT_SIZE_MAP: Partial<Record<Size, string>> = {
  xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl',
};

const GAP_MAP: Record<Size, string> = {
  none: 'gap-0', xs: 'gap-1', sm: 'gap-2', base: 'gap-3', md: 'gap-4', lg: 'gap-6', xl: 'gap-8', '2xl': 'gap-10', '3xl': 'gap-12',
};

const ICON_SIZE_MAP: Record<IconSize, string> = {
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px'
};

const MAX_WIDTH_MAP: Record<Size, string> = {
  none: 'max-w-none',
  xs: 'max-w-2xl',
  sm: 'max-w-2xl',
  base: 'max-w-4xl',
  md: 'max-w-4xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  '2xl': 'max-w-screen-2xl',
  '3xl': 'max-w-screen-2xl',
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

  const renderColumnChildren = (
    items: ColumnChild[],
    path: ExpansionPath,
    fontSizeClass: string
  ): React.ReactNode[] => {
    return items.map((child): React.ReactNode => {
      
      if (child.type === 'column') {
        const nestedCol = child as FooterColumn;
        const newPath = [...path, nestedCol.id] as ExpansionPath;
        
        return renderSelectableItem(
          nestedCol.id,
          'footer',
          path,
          `flex ${nestedCol.orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'}
           ${getAlignmentClass(nestedCol.orientation, nestedCol.alignment)}`,
          
          nestedCol.items.length > 0 
            ? renderColumnChildren(nestedCol.items, newPath, fontSizeClass)
            : <div className="text-[10px] text-gray-600 text-center">Empty Nested Column</div>
        );
      }

      const item = child as FooterItem;
      const isExternal = item.linkType === 'external';
      const iconSize = ICON_SIZE_MAP[item.style?.size || 'md'];
      
      return (
        renderSelectableItem(
          item.id,
          'footer',
          path,
          'inline-block',
          <a 
            href={item.url || '#'} 
            className="hover:opacity-80 transition-opacity block"
            style={{ color: item.style?.color }}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onClick={(e) => { e.preventDefault(); }}
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
              <span 
                className={`leading-none ${fontSizeClass}`}
              >
                {item.label}
              </span>
            )}
          </a>
        )
      );
    });
  };

  const paddingClass = PADDING_MAP[footerSchema.style?.padding || 'lg'];
  const marginClass = MARGIN_MAP[footerSchema.style?.margin || 'none'];
  const maxWidthClass = MAX_WIDTH_MAP[footerSchema.style?.maxWidth || 'lg'];
  const rowGapClass = GAP_MAP[footerSchema.style?.rowGap || 'xl'];
  const fontSizeClass = FONT_SIZE_MAP[footerSchema.style?.fontSize || 'sm'] || 'text-sm';

  return (
    <footer 
      className={`w-full transition-all duration-200 ${paddingClass} ${marginClass}`}
      style={{
        backgroundColor: footerSchema.style?.backgroundColor || 'transparent',
        color: footerSchema.style?.textColor || '#cccccc',
      }}
    >
      <div className={`${maxWidthClass} mx-auto flex flex-col ${rowGapClass} w-full`}>
        {footerSchema.rows?.map((row) => {
          const presetConfig = FOOTER_LAYOUT_PRESETS.find(p => p.id === row.preset);
          const gridClass = presetConfig ? presetConfig.class : 'grid-cols-1';
          const columnGapClass = GAP_MAP[row.style?.columnGap || 'none'];

          return (
            renderSelectableItem(
              row.id,
              'footer',
              [],
              `w-full min-h-[50px]`,
              <div
                className={`grid ${gridClass} w-full ${columnGapClass}`}
              >
                {row.columns.map((col) => {
                  const itemGapClass = GAP_MAP[col.itemGap || (col.orientation === 'vertical' ? 'sm' : 'md')];

                  return renderSelectableItem(
                    col.id,
                    'footer',
                    [row.id],
                    `flex ${col.orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} ${itemGapClass}
                      ${getAlignmentClass(col.orientation, col.alignment)}
                      min-h-[30px] p-1
                    `,
                    col.items.length > 0 ? (
                      renderColumnChildren(col.items, [row.id, col.id], fontSizeClass)
                    ) : (
                      <div className="text-[10px] text-gray-600 border border-dashed border-gray-700 p-2 w-full text-center rounded">
                        Empty Col
                      </div>
                    )
                  )
                })}
              </div>
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
