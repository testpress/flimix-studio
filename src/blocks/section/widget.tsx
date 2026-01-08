import React from 'react';
import BlockRenderer from '@layout/BlockRenderer';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { SectionBlock } from './schema';
import BlockInsertDropdown from '@layout/BlockInsertDropdown';
import type { VisibilityContext } from '@type/visibility';
import type { Block } from '@type/block';
import { Plus } from 'lucide-react';
import { usePanel } from '@context/PanelContext';

interface SectionWidgetProps extends Omit<BlockWidgetWrapperProps<SectionBlock>, 'block'> {
  block: SectionBlock;
  visibilityContext: VisibilityContext;
  showDebug?: boolean;
  selectedBlockId?: string | null;
  onSelect?: (block: Block) => void;
  isColumn?: boolean;
}

const SectionWidget: React.FC<SectionWidgetProps> = ({ 
  block, 
  visibilityContext, 
  showDebug = false, 
  onSelect, 
  isSelected = false,
  selectedBlockId,
  isColumn = false,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove
}) => {
  const { props, style, children } = block;
  const { title, description, backgroundImage } = props;
  const { openLibrary } = usePanel();
  const hasChildren = children && children.length > 0;

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
  const emptyColumnClasses = isColumn
    ? `min-h-[100px] ${!hasChildren ? 'border-2 border-dashed border-gray-300' : ''}`
    : '';

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

  const handleAddBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelect(block);
    openLibrary();
  };

  return (
    <div style={{ boxShadow: boxShadowStyle }} className="h-full">
      <BlockWidgetWrapper 
        block={block} 
        onSelect={handleSelect}
        isSelected={isSelected}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        className={`relative overflow-hidden ${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass} ${emptyColumnClasses} h-full flex flex-col`}
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

        <div className="relative z-10 w-full flex-1 flex flex-col">
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
          
          {hasChildren ? (
            <div className="space-y-0 w-full">
              {children.map((childBlock) => (
                <div key={childBlock.id} className="w-full" data-block-id={childBlock.id}>
                  <BlockInsertDropdown position="above" blockId={childBlock.id} visibilityContext={visibilityContext} />
                  <BlockRenderer 
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
          ) : isColumn ? (
            <div className="flex-1 flex items-center justify-center">
              <button
                onClick={handleAddBlock}
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-200 shadow-sm border border-gray-200"
                title="Add block to this column"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-gray-600 bg-gray-800 rounded-lg">
              <p className="text-gray-300 text-center">No content blocks in this section</p>
            </div>
          )}
        </div>
      </BlockWidgetWrapper>
    </div>
  );
};

export default SectionWidget; 