import React from 'react';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar />
      <div className="flex-1 flex">
        <Canvas />
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
