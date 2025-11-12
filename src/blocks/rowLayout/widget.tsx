import React from 'react';
import BaseWidget, { type BaseWidgetProps } from '@blocks/shared/BaseWidget';
import BlockManager from '@domain/BlockManager';
import type { RowLayoutBlock } from './schema';
import type { VisibilityContext } from '@blocks/shared/Visibility';


interface RowLayoutWidgetProps extends Omit<BaseWidgetProps<RowLayoutBlock>, 'block'> {
  block: RowLayoutBlock;
  visibilityContext: VisibilityContext;
  showDebug?: boolean;
  selectedBlockId?: string | null;
  onSelect?: (block: RowLayoutBlock) => void;
}

const RowLayoutWidget: React.FC<RowLayoutWidgetProps> = ({
  block,
  onSelect,
  isSelected,
  visibilityContext,
  showDebug = false,
  selectedBlockId,
  ...widgetControlProps
}) => {
  const columnCount = block.children.length;
  
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columnCount] || 'grid-cols-1';

  const layoutClass = `grid ${gridColsClass} gap-4`;

  const { style } = block;
  const paddingClass = style?.padding === 'lg' ? 'p-8' : 
                      style?.padding === 'md' ? 'p-6' : 
                      style?.padding === 'sm' ? 'p-4' : 
                      style?.padding === 'none' ? 'p-0' : 'p-6';
  const marginClass = style?.margin === 'lg' ? 'm-8' : 
                     style?.margin === 'md' ? 'm-6' : 
                     style?.margin === 'sm' ? 'm-4' : 
                     style?.margin === 'none' ? 'm-0' : 'm-0';
  const borderRadiusClass = style?.borderRadius === 'lg' ? 'rounded-lg' : 
                           style?.borderRadius === 'md' ? 'rounded-md' : 
                           style?.borderRadius === 'sm' ? 'rounded-sm' : 
                           style?.borderRadius === 'none' ? 'rounded-none' : '';

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

  const hasCustomBackground = !!style?.backgroundColor;
  const backgroundClass = hasCustomBackground ? '' : '';

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
      <BaseWidget
        block={block}
        onSelect={onSelect}
        isSelected={isSelected}
        className={`relative ${paddingClass} ${marginClass} ${borderRadiusClass} ${backgroundClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
        }}
        {...widgetControlProps}
      >
      <div className={layoutClass}>
        {block.children.map((childSection) => (
          <BlockManager
            key={childSection.id}
            block={childSection}
            visibilityContext={visibilityContext}
            showDebug={showDebug}
            onSelect={(sectionBlock) => onSelect?.(sectionBlock as RowLayoutBlock)}
            isSelected={selectedBlockId === childSection.id}
            selectedBlockId={selectedBlockId}
            isColumn={true}
            columnCount={block.children.length}
          />
        ))}
      </div>
      </BaseWidget>
    </div>
  );
};

export default RowLayoutWidget;

