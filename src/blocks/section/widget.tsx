import React from 'react';
import BlockManager from '@domain/BlockManager';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { SectionBlock } from './schema';
import BlockInsertDropdown from '@layout/BlockInsertDropdown';
import type { VisibilityContext } from '@blocks/shared/Visibility';
import type { Block } from '@blocks/shared/Block';

interface SectionWidgetProps extends Omit<BaseWidgetProps<SectionBlock>, 'block'> {
  block: SectionBlock;
  visibilityContext: VisibilityContext;
  showDebug?: boolean;
  selectedBlockId?: string | null;
  onSelect?: (block: Block) => void;
}

const SectionWidget: React.FC<SectionWidgetProps> = ({ 
  block, 
  visibilityContext, 
  showDebug = false, 
  onSelect, 
  isSelected = false,
  selectedBlockId,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove
}) => {
  const { props, style, children } = block;
  const { title, description, backgroundImage } = props;
  
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 'p-6';
  const marginClass = style?.margin === 'lg' ? 'm-8' : 
                     style?.margin === 'md' ? 'm-6' : 
                     style?.margin === 'sm' ? 'm-4' : 'm-0';
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' : 
                        style?.textAlign === 'right' ? 'text-right' : 'text-left';
  const borderRadiusClass = style?.borderRadius === 'lg' ? 'rounded-lg' : 
                           style?.borderRadius === 'md' ? 'rounded-md' : 
                           style?.borderRadius === 'sm' ? 'rounded-sm' : '';
  // Custom box shadow styles for better visibility on any background
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg':
        return '0 35px 60px -12px rgba(255, 255, 255, 0.25), 0 20px 25px -5px rgba(255, 255, 255, 0.1)';
      case 'md':
        return '0 20px 25px -5px rgba(255, 255, 255, 0.15), 0 10px 10px -5px rgba(255, 255, 255, 0.08)';
      case 'sm':
        return '0 10px 15px -3px rgba(255, 255, 255, 0.12), 0 4px 6px -2px rgba(255, 255, 255, 0.06)';
      case 'none':
      default:
        return 'none';
    }
  };
  
  const boxShadowStyle = getBoxShadowStyle(style?.boxShadow);

  // Handle background color - default to black
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-white';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  // Handle text color - default to white text
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  const handleSelect = (sectionBlock: SectionBlock) => {
    onSelect?.(sectionBlock as Block);
  };

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
      <BaseWidget 
        block={block} 
        onSelect={handleSelect}
        isSelected={isSelected}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        className={`relative overflow-hidden ${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
        }}
      >
        {/* Background Image */}
        {backgroundImage && (
          <>
            <img 
              src={backgroundImage} 
              alt={title || 'Section background'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability when background image is present */}
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        )}

        {/* Content container with relative positioning for proper layering */}
        <div className="relative z-10 w-full">
          {/* Section header */}
          {(title || description) && (
            <div className={`mb-6 ${textAlignClass}`}>
              {title && (
                <h2 className={`text-2xl font-semibold mb-2 ${textColorClass}`} style={textColorStyle}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={`text-lg ${textColorClass}`} style={textColorStyle}>
                  {description}
                </p>
              )}
            </div>
          )}
          
          {/* Render nested children */}
          {children && children.length > 0 ? (
            <div className="space-y-0 w-full">
              {children.map((childBlock) => (
                <div key={childBlock.id} className="w-full" data-block-id={childBlock.id}>
                  <BlockInsertDropdown position="above" blockId={childBlock.id} visibilityContext={visibilityContext} />
                  <BlockManager 
                    block={childBlock} 
                    visibilityContext={visibilityContext} 
                    showDebug={showDebug}
                    onSelect={onSelect}
                    selectedBlockId={selectedBlockId}
                    isSelected={selectedBlockId === childBlock.id}
                  />
                  <BlockInsertDropdown position="below" blockId={childBlock.id} visibilityContext={visibilityContext} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-neutral-600 bg-neutral-800 rounded-lg">
              <p className="text-neutral-300 text-center">No content blocks in this section</p>
            </div>
          )}
        </div>
      </BaseWidget>
    </div>
  );
};

export default SectionWidget; 