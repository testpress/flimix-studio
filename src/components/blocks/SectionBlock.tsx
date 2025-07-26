import React from 'react';
import BlockRenderer from '../BlockRenderer';
import type { SectionBlock as SectionBlockType, Theme, Padding, TextAlign, BorderRadius, BoxShadow } from '../../schema/blockTypes';
import type { RenderContext } from '../../types/RenderContext';

interface SectionBlockProps {
  block: SectionBlockType;
  renderContext: RenderContext;
  showDebug?: boolean;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ block, renderContext, showDebug = false }) => {
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

  return (
    <section 
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
            <h2 className={`text-2xl font-semibold mb-2 ${
              style?.textColor || (isDark ? 'text-white' : 'text-gray-900')
            }`}>
              {title}
            </h2>
          )}
          {description && (
            <p className={`text-lg ${
              style?.textColor || (isDark ? 'text-gray-300' : 'text-gray-600')
            }`}>
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Render nested children */}
      {children && children.length > 0 ? (
        <div className="space-y-4">
          {children.map((childBlock) => (
            <BlockRenderer key={childBlock.id} block={childBlock} renderContext={renderContext} showDebug={showDebug} />
          ))}
        </div>
      ) : (
        <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-center">No content blocks in this section</p>
        </div>
      )}
    </section>
  );
};

export default SectionBlock; 