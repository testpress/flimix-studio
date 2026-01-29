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
          className={`flex-1 py-1.5 text-xs font-medium transition-colors ${(value || 'md') === size
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

  const getCurrentWidths = (): number[] => {
    if (props.custom_widths && props.custom_widths.length === columnCount) {
      return props.custom_widths;
    }
    
    // Get widths from preset
    const preset = ROW_LAYOUT_PRESETS.find(p => p.id === props.preset);
    if (preset && preset.cols === columnCount) {
      return preset.widths;
    }
    
    // Fallback: equal distribution
    const equalWidth = Math.floor(100 / columnCount);
    const widths = Array(columnCount).fill(equalWidth);
    widths[0] += 100 - (equalWidth * columnCount); // Add remainder to first
    return widths;
  };

  const currentWidths = getCurrentWidths();
  const isCustomized = !!props.custom_widths;

  const handleWidthChange = (index: number, value: number) => {
    const newWidths = [...currentWidths];
    const oldValue = newWidths[index];
    const delta = value - oldValue;
    
    newWidths[index] = value;
    
    // Distribute the delta across other columns proportionally
    const otherIndices = newWidths
      .map((_, i) => i)
      .filter(i => i !== index);
    
    if (otherIndices.length > 0) {
      const totalOther = otherIndices.reduce((sum, i) => sum + newWidths[i], 0);
      
      if (totalOther > 0) {
        otherIndices.forEach(i => {
          const proportion = newWidths[i] / totalOther;
          newWidths[i] = Math.max(5, newWidths[i] - (delta * proportion));
        });
      }
      
      // Ensure total is exactly 100
      const total = newWidths.reduce((sum, w) => sum + w, 0);
      newWidths[0] += 100 - total;
    }
    
    // Round all values
    const roundedWidths = newWidths.map(w => Math.round(w));
    
    updateProps({ custom_widths: roundedWidths } as Partial<BlockProps>);
  };

  const handleResetToPreset = () => {
    updateProps({ custom_widths: undefined } as Partial<BlockProps>);
  };

  const handlePresetChange = (presetId: RowLayoutPreset, requiredCols: number) => {
    if (!selectedBlockId) return;

    const newBlocks = structuredClone(pageSchema.blocks);
    const blockPosition = findBlockPositionById(newBlocks, selectedBlockId);
    if (!blockPosition || !blockPosition.children) return;

    const targetBlock = blockPosition.children[blockPosition.index] as RowLayoutBlock;

    // Update preset and clear custom widths
    targetBlock.props = { 
      ...targetBlock.props, 
      preset: presetId,
      custom_widths: undefined  // Reset custom widths when changing preset
    };

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

  const totalWidth = currentWidths.reduce((sum, w) => sum + w, 0);
  const isValidTotal = Math.abs(totalWidth - 100) < 1; // Allow 1% tolerance for rounding


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
                className={`h-10 border rounded flex items-center justify-center p-1 transition-all ${props.preset === preset.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
              >
                <div className={`w-full h-full grid gap-0.5 ${preset.previewClass}`}>
                  {Array.from({ length: preset.cols }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${props.preset === preset.id ? 'bg-blue-300' : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Column Widths Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Column Widths
              {isCustomized && (
                <span className="ml-2 text-xs text-blue-600 font-normal">(Customized)</span>
              )}
            </label>
            {isCustomized && (
              <button
                onClick={handleResetToPreset}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Reset to Preset
              </button>
            )}
          </div>

          <div className="space-y-4">
            {currentWidths.map((width, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">
                    Column {index + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-900">
                    {Math.round(width)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="1"
                  value={Math.round(width)}
                  onChange={(e) => handleWidthChange(index, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>5%</span>
                  <span>95%</span>
                </div>
              </div>
            ))}

            <div className={`text-xs font-medium ${
              isValidTotal ? 'text-green-600' : 'text-red-600'
            }`}>
              Total: {Math.round(totalWidth)}% {isValidTotal ? '✓' : '⚠ Must equal 100%'}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-gray-100">
          <GutterControl
            label="Column Gutter"
            value={props.column_gap}
            onChange={(val) => updateProps({ column_gap: val } as Partial<BlockProps>)}
          />
        </div>
      </div>
    </div>
  );
};

export default RowLayoutForm;

