import React from 'react';
import BlockRenderer from '../BlockRenderer';
import BaseBlock from './BaseBlock';
import BlockInsertionMenu from '../BlockInsertionMenu';
import type { BaseBlockProps } from './BaseBlock';
import type { SectionBlock as SectionBlockType, Theme, Padding, TextAlign, BorderRadius, BoxShadow, Block } from '../../schema/blockTypes';
import type { RenderContext } from '../../types/RenderContext';

interface SectionBlockProps extends Omit<BaseBlockProps, 'block'> {
  block: SectionBlockType;
  renderContext: RenderContext;
  showDebug?: boolean;
  selectedBlockId?: string | null;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ 
  block, 
  renderContext, 
  showDebug = false, 
  onSelect, 
  isSelected = false,
  selectedBlockId
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

  return (
    <BaseBlock 
      block={block} 
      onSelect={onSelect} 
      isSelected={isSelected}
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
              <BlockInsertionMenu position="above" blockId={childBlock.id} />
              <BlockRenderer 
                block={childBlock} 
                renderContext={renderContext} 
                showDebug={showDebug}
                onSelect={onSelect}
                selectedBlockId={selectedBlockId}
                isSelected={selectedBlockId === childBlock.id}
              />
              <BlockInsertionMenu position="below" blockId={childBlock.id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-center">No content blocks in this section</p>
        </div>
      )}
    </BaseBlock>
  );
};

export default SectionBlock; 