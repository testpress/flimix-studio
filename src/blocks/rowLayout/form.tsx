import React from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import { useSelection } from '@context/SelectionContext';
import { Plus, Minus } from 'lucide-react';
import type { RowLayoutBlock } from './schema';
import { MinColumns, MaxColumns } from './schema';

const RowLayoutForm: React.FC<BlockFormProps> = ({ block }) => {
  const { modifyRowColumnCount } = useSelection();
  const rowBlock = block as RowLayoutBlock;
  const columnCount = rowBlock.children?.length || 0;

  const canDecrease = columnCount > MinColumns;
  const canIncrease = columnCount < MaxColumns;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-4">Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Columns
          </label>
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-medium">{columnCount}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => modifyRowColumnCount('decrease')}
                disabled={!canDecrease}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Remove last column"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => modifyRowColumnCount('increase')}
                disabled={!canIncrease}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Add new column"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowLayoutForm;

