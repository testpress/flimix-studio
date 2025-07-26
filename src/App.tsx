import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import type { Block, VisibilityProps } from './schema/blockTypes';

function App() {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleUpdateVisibility = (visibility: VisibilityProps) => {
    if (selectedBlock) {
      // In a real app, this would update the block in the schema
      // For now, we'll just log the change
      console.log('Updating visibility for block:', selectedBlock.id, visibility);
    }
  };

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
    setSelectedBlockId(block.id);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar />
      <div className="flex-1 flex">
        <Canvas 
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
          onBlockSelect={handleBlockSelect}
        />
        <Sidebar 
          selectedBlock={selectedBlock}
          onUpdateVisibility={handleUpdateVisibility}
        />
      </div>
    </div>
  );
}

export default App;
