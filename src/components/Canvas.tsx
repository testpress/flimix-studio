import React, { useState } from 'react';
import WidgetRenderer from './WidgetRenderer';
import { useSelection } from '../context/SelectionContext';
import type { Platform } from '../schema/blockTypes';
import type { VisibilityContext } from '../schema/blockVisibility';
import WidgetInsertionMenu from './WidgetInsertionMenu';
import { Search } from 'lucide-react';

// Debug flag for development - shows hidden blocks due to visibility rules
const showDebug = true; // Enables debug placeholder for hidden blocks

const initialVisibilityContext: VisibilityContext = {
  isLoggedIn: true,
  isSubscribed: false,
  subscriptionTier: 'basic',
  region: 'IN',
  platform: 'mobile',
};

const Canvas: React.FC = () => {
  const { 
    selectedBlockId, 
    setSelectedBlockId, 
    setSelectedBlock, 
    pageSchema 
  } = useSelection();
  const [visibilityContext, setVisibilityContext] = useState<VisibilityContext>(initialVisibilityContext);

  const handleBlockSelect = (block: any) => {
    setSelectedBlock(block);
    setSelectedBlockId(block.id);
  };

  return (
    <div className="flex-1 bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {pageSchema.title}
            </h2>
            
            {/* Render Context Controls */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Platform:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={visibilityContext.platform}
                  onChange={e => setVisibilityContext(ctx => ({ ...ctx, platform: e.target.value as Platform }))}
                >
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                  <option value="tv">TV</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Region:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={visibilityContext.region}
                  onChange={e => setVisibilityContext(ctx => ({ ...ctx, region: e.target.value }))}
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Tier:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={visibilityContext.subscriptionTier}
                  onChange={e => setVisibilityContext(ctx => ({ ...ctx, subscriptionTier: e.target.value }))}
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={visibilityContext.isLoggedIn}
                    onChange={e => setVisibilityContext(ctx => ({ ...ctx, isLoggedIn: e.target.checked }))}
                    className="rounded"
                  />
                  Logged In
                </label>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={visibilityContext.isSubscribed}
                    onChange={e => setVisibilityContext(ctx => ({ ...ctx, isSubscribed: e.target.checked }))}
                    className="rounded"
                  />
                  Subscribed
                </label>
              </div>
            </div>
            
            <p className="text-gray-600">Rendering {pageSchema.blocks.length} blocks</p>
            {showDebug && (
              <>
                <p className="text-xs text-yellow-600 mt-2 bg-yellow-50 p-2 rounded flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Debug mode enabled - hidden blocks will show debug messages
                </p>
                <pre className="text-xs text-gray-700 bg-gray-50 rounded p-2 mt-2 overflow-x-auto">
                  {JSON.stringify(visibilityContext, null, 2)}
                </pre>
              </>
            )}
          </div>
          
          <div className="space-y-6">
            {pageSchema.blocks.map((block) => (
              <div key={block.id}>
                <WidgetInsertionMenu position="above" blockId={block.id} />
                <WidgetRenderer 
                  block={block} 
                  showDebug={showDebug} 
                  visibilityContext={visibilityContext}
                  onSelect={handleBlockSelect}
                  isSelected={selectedBlockId === block.id}
                  selectedBlockId={selectedBlockId}
                />
                <WidgetInsertionMenu position="below" blockId={block.id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas; 