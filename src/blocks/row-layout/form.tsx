import React from 'react';
import type { BlockFormProps, BlockProps } from '@type/form';
import { useSelection } from '@context/SelectionContext';
import { useBlockEditing } from '@context/BlockEditingContext';
import { useHistory } from '@context/HistoryContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { RowLayoutBlock, RowLayoutPreset, GapSize } from './schema';
import { MinColumns, MaxColumns } from './schema';
import { ROW_LAYOUT_PRESETS } from './constants';
import { createBlock } from '@domain/blockFactory';
import { findBlockPositionById } from '@domain/blockTraversal';
import type { SectionBlock } from '@blocks/section/schema';

interface GutterControlProps {
  label: string;
  value?: GapSize;
  onChange: (val: GapSize) => void;
}

const GutterControl: React.FC<GutterControlProps> = ({ 
  label, 
  value, 
  onChange 
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-xs font-medium text-gray-600">{label}</label>
    </div>
    <div className="flex border border-gray-200 rounded-md overflow-hidden">
      {(['none', 'sm', 'md', 'lg'] as const).map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
            (value || 'md') === size
              ? 'bg-blue-50 text-blue-600'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          } ${size !== 'lg' ? 'border-r border-gray-200' : ''}`}
        >
          {size.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

const RowLayoutForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const { selectedBlockId } = useSelection();
  const { modifyRowColumnCount } = useBlockEditing();
  const { pageSchema, updatePageWithHistory } = useHistory();
  
  const rowBlock = block as RowLayoutBlock;
  const columnCount = rowBlock.children.length;
  const props = rowBlock.props || {};

  const canDecrease = columnCount > MinColumns;
  const canIncrease = columnCount < MaxColumns;

  const handlePresetChange = (presetId: RowLayoutPreset, requiredCols: number) => {
    if (!selectedBlockId) return;

    const newBlocks = structuredClone(pageSchema.blocks);
    const blockPosition = findBlockPositionById(newBlocks, selectedBlockId);
    if (!blockPosition || !blockPosition.children) return;

    const targetBlock = blockPosition.children[blockPosition.index] as RowLayoutBlock;

    targetBlock.props = { ...targetBlock.props, preset: presetId };

    const currentLen = targetBlock.children.length;
    const diff = requiredCols - currentLen;

    if (diff > 0) {
      // Add missing columns
      for (let i = 0; i < diff; i++) {
        targetBlock.children.push(createBlock('section') as SectionBlock);
      }
    } else if (diff < 0) {
      // Remove extra columns (Splice from the end)
      targetBlock.children.splice(currentLen + diff, Math.abs(diff));
    }

    updatePageWithHistory({ ...pageSchema, blocks: newBlocks });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Columns
          </label>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-2 py-1">
            <button
              onClick={() => modifyRowColumnCount('decrease')}
              disabled={!canDecrease}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-gray-900 w-8 text-center">{columnCount}</span>
            <button
              onClick={() => modifyRowColumnCount('increase')}
              disabled={!canIncrease}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Layout</label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ROW_LAYOUT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id, preset.cols)}
                title={preset.label}
                className={`h-10 border rounded flex items-center justify-center p-1 transition-all ${
                  props.preset === preset.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className={`w-full h-full grid gap-0.5 ${preset.previewClass}`}>
                  {Array.from({ length: preset.cols }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-[1px] ${
                        props.preset === preset.id ? 'bg-blue-300' : 'bg-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <GutterControl
            label="Column Gutter"
            value={props.columnGap}
            onChange={(val) => updateProps({ columnGap: val } as Partial<BlockProps>)}
          />
        </div>
      </div>
    </div>
  );
};

export default RowLayoutForm;

