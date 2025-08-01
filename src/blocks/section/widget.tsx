import React from 'react';
import BlockRenderer from '@renderer/BlockRenderer';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { SectionBlock } from './schema';
import LibraryMenu from '@layout/LibraryMenu';
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
  const { title, description } = props;
  
  const isDark = style?.theme === 'dark';
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
  const boxShadowClass = style?.boxShadow === 'lg' ? 'shadow-lg' : 
                        style?.boxShadow === 'md' ? 'shadow-md' : 
                        style?.boxShadow === 'sm' ? 'shadow-sm' : '';

  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || (isDark ? 'text-gray-900' : 'text-gray-900')) : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  const handleSelect = (sectionBlock: SectionBlock) => {
    onSelect?.(sectionBlock as Block);
  };

  return (
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
      className={`${paddingClass} ${marginClass} ${borderRadiusClass} ${boxShadowClass} ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        backgroundColor: style?.backgroundColor,
        maxWidth: style?.maxWidth,
      }}
    >
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
        <div className="space-y-4">
          {children.map((childBlock) => (
            <div key={childBlock.id}>
              <LibraryMenu position="above" blockId={childBlock.id} />
              <BlockRenderer 
                block={childBlock} 
                visibilityContext={visibilityContext} 
                showDebug={showDebug}
                onSelect={onSelect}
                selectedBlockId={selectedBlockId}
                isSelected={selectedBlockId === childBlock.id}
              />
              <LibraryMenu position="below" blockId={childBlock.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-center">No content blocks in this section</p>
        </div>
      )}
    </BaseWidget>
  );
};

export default SectionWidget; 