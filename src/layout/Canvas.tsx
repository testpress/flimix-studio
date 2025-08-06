import React from 'react';
import BlockRenderer from '@renderer/BlockRenderer';
import BlockInsertDropdown from '@layout/BlockInsertDropdown';
import type { Platform, VisibilityContext } from '@blocks/shared/Visibility';
import type { Block } from '@blocks/shared/Block';
import { useSelection } from '@context/SelectionContext';
import { Search } from 'lucide-react';

interface CanvasProps {
  showDebug: boolean;
}

const initialVisibilityContext: VisibilityContext = {
  isLoggedIn: true,
  isSubscribed: false,
};

const Canvas: React.FC<CanvasProps> = ({ showDebug }) => {
  const { 
    selectedBlockId, 
    setSelectedBlockId,
    setSelectedBlock,
    pageSchema 
  } = useSelection();
  const [visibilityContext, setVisibilityContext] = React.useState<VisibilityContext>(initialVisibilityContext);

  const handleBlockSelect = (block: Block) => {
    setSelectedBlockId(block.id);
    setSelectedBlock(block);
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
                  value={visibilityContext.platform || 'all'}
                  onChange={e => setVisibilityContext(ctx => ({ 
                    ...ctx, 
                    platform: e.target.value === 'all' ? undefined : e.target.value as Platform 
                  }))}
                >
                  <option value="all">All Platforms</option>
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                  <option value="tv">TV</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Region:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={visibilityContext.region || 'all'}
                  onChange={e => setVisibilityContext(ctx => ({ 
                    ...ctx, 
                    region: e.target.value === 'all' ? undefined : e.target.value 
                  }))}
                >
                  <option value="all">All Regions</option>
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
                  value={visibilityContext.subscriptionTier || 'all'}
                  onChange={e => setVisibilityContext(ctx => ({ 
                    ...ctx, 
                    subscriptionTier: e.target.value === 'all' ? undefined : e.target.value 
                  }))}
                >
                  <option value="all">All Tiers</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Login Status:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={visibilityContext.isLoggedIn!.toString()}
                  onChange={e => setVisibilityContext(ctx => ({ 
                    ...ctx, 
                    isLoggedIn: e.target.value === 'true'
                  }))}
                >
                  <option value="true">Logged In User</option>
                  <option value="false">Logged Out User</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Subscription:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={visibilityContext.isSubscribed!.toString()}
                  onChange={e => setVisibilityContext(ctx => ({ 
                    ...ctx, 
                    isSubscribed: e.target.value === 'true'
                  }))}
                >
                  <option value="true">Subscribed User</option>
                  <option value="false">Unsubscribed User</option>
                </select>
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
            {pageSchema.blocks.map((block: Block) => (
              <div key={block.id}>
                <BlockInsertDropdown position="above" blockId={block.id} visibilityContext={visibilityContext} />
                <BlockRenderer 
                  block={block} 
                  showDebug={showDebug} 
                  visibilityContext={visibilityContext}
                  onSelect={handleBlockSelect}
                  isSelected={selectedBlockId === block.id}
                  selectedBlockId={selectedBlockId}
                />
                <BlockInsertDropdown position="below" blockId={block.id} visibilityContext={visibilityContext} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas; 