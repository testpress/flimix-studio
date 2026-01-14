import React from 'react';
import BlockWidgetWrapper, { type BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import BlockRenderer from '@layout/BlockRenderer';
import type { RowLayoutBlock, RowLayoutPreset } from './schema';
import type { VisibilityContext } from '@type/visibility';
import type { Block, BlockType } from '@type/block';
import LayoutSelector from './LayoutSelector';
import { ROW_LAYOUT_PRESETS } from './constants';
import { useHistory } from '@context/HistoryContext';
import { createBlock } from '@domain/blockFactory';
import type { SectionBlock } from '@blocks/section/schema';
import { useSelection } from '@context/SelectionContext';
import { findBlockPositionById } from '@domain/blockTraversal';


interface RowLayoutWidgetProps extends Omit<BlockWidgetWrapperProps<RowLayoutBlock>, 'block' | 'onSelect'> {
  block: RowLayoutBlock;
  visibilityContext: VisibilityContext;
  showDebug?: boolean;
  selectedBlockId?: string | null;
  onSelect?: (block: Block) => void;
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
  const { pageSchema, updatePageWithHistory } = useHistory();
  const { setSelectedBlock } = useSelection();

  const handleLayoutSelect = (presetId: RowLayoutPreset, cols: number) => {
    const newChildren = Array.from({ length: cols }).map(() =>
      createBlock('section')
    ) as SectionBlock[];

    const newBlocks = structuredClone(pageSchema.blocks);
    const blockPosition = findBlockPositionById(newBlocks, block.id);

    if (blockPosition && blockPosition.children) {
      const updatedBlock = {
        ...block,
        props: {
          ...block.props,
          preset: presetId,
          column_gap: 'md' as const
        },
        children: newChildren
      };

      blockPosition.children[blockPosition.index] = updatedBlock as BlockType;

      updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
      setSelectedBlock(updatedBlock);
    }
  };

  const getColumnGapClass = (gap: string | undefined) => {
    switch (gap) {
      case 'none': return 'gap-x-0';
      case 'sm': return 'gap-x-2';
      case 'lg': return 'gap-x-8';
      case 'md':
      default: return 'gap-x-4';
    }
  };

  const gapClass = getColumnGapClass(block.props.column_gap);
  const currentPreset = ROW_LAYOUT_PRESETS.find(p => p.id === block.props.preset);
  const actualChildrenCount = block.children.length;

  const gridTemplateClass = (currentPreset && currentPreset.cols === actualChildrenCount)
    ? currentPreset.class
    : ({
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    }[actualChildrenCount] || 'grid-cols-1');

  const layoutClass = `grid ${gridTemplateClass} ${gapClass}`;

  const { style } = block;
  const borderRadiusClass = style?.border_radius === 'lg' ? 'rounded-lg' :
    style?.border_radius === 'md' ? 'rounded-md' :
      style?.border_radius === 'sm' ? 'rounded-sm' :
        style?.border_radius === 'none' ? 'rounded-none' : '';

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

  const boxShadowStyle = getBoxShadowStyle(style?.box_shadow);

  const hasCustomBackground = !!style?.background_color;

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
      <BlockWidgetWrapper
        block={block}
        onSelect={() => onSelect?.(block)}
        isSelected={isSelected}
        className={`relative ${borderRadiusClass}`}
        style={{
          backgroundColor: hasCustomBackground ? style.background_color : undefined,
          paddingTop: style?.padding_top,
          paddingRight: style?.padding_right,
          paddingBottom: style?.padding_bottom,
          paddingLeft: style?.padding_left,
          marginTop: style?.margin_top,
          marginRight: style?.margin_right,
          marginBottom: style?.margin_bottom,
          marginLeft: style?.margin_left,
        }}
        {...widgetControlProps}
      >
        {block.children.length === 0 ? (
          <LayoutSelector onLayoutSelect={handleLayoutSelect} />
        ) : (
          <div className={layoutClass}>
            {block.children.map((childSection) => (
              <BlockRenderer
                key={childSection.id}
                block={childSection}
                visibilityContext={visibilityContext}
                showDebug={showDebug}
                onSelect={onSelect}
                isSelected={selectedBlockId === childSection.id}
                selectedBlockId={selectedBlockId}
                isColumn={true}
                columnCount={block.children.length}
              />
            ))}
          </div>
        )}
      </BlockWidgetWrapper>
    </div>
  );
};

export default RowLayoutWidget;

