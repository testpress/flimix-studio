import React, { useState, useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import BlockInserterSidebar from './components/BlockInserterSidebar';
import DragOverlayContent from './components/DragOverlayContent';
import { SelectionProvider, useSelection } from './context/SelectionContext';
import type { PageSchema, Theme, Platform } from './schema/blockTypes';

// Move the sample schema here so it can be shared
const sampleSchema: PageSchema = {
  title: "Flimix Landing",
  theme: "dark" as Theme,
  visibility: {
    platform: ["mobile", "desktop"] as Platform[]
  },
  blocks: [
    {
      type: "hero",
      id: "hero-001",
      props: {
        title: "Watch Anywhere",
        subtitle: "Stream your favorites",
        backgroundImage: "https://cdn.example.com/bg.jpg",
        ctaButton: {
          label: "Start Watching",
          link: "/subscribe"
        }
      },
      style: {
        theme: "dark" as Theme,
        padding: "lg"
      },
      visibility: {
        platform: ["mobile", "desktop"],
        region: ["IN", "US"]
      }
    },
    {
      type: "section",
      id: "section-001",
      props: {
        title: "Featured Content",
        description: "Discover our latest releases and popular shows"
      },
      style: {
        theme: "light" as Theme,
        padding: "lg",
        backgroundColor: "#f8f9fa",
        borderRadius: "lg"
      },
      visibility: {
        isLoggedIn: true,
        platform: ["mobile", "desktop"]
      },
      children: [
        {
          type: "text",
          id: "text-001",
          props: {
            content: "Enjoy Flimix across all your devices."
          },
          style: {
            textAlign: "center",
            padding: "md",
            backgroundColor: "#f8f9fa"
          },
          visibility: {
            isSubscribed: false
          }
        },
        {
          type: "text",
          id: "text-002",
          props: {
            content: "From blockbuster movies to binge-worthy series, we have something for everyone."
          },
          style: {
            textAlign: "center",
            padding: "sm",
            backgroundColor: "#f8f9fa"
          },
          visibility: {
            subscriptionTier: "premium"
          }
        },
        {
          type: "text",
          id: "text-004",
          props: {
            content: "This message is shown only to VIP users in the US."
          },
          style: {
            textAlign: "center",
            padding: "md",
            backgroundColor: "#fff",
            borderRadius: "md",
            boxShadow: "sm"
          },
          visibility: {
            platform: ["mobile", "desktop"],
            region: ["US"],
            subscriptionTier: "vip",
            isLoggedIn: true
          }
        }
      ]
    },
    {
      type: "text",
      id: "text-003",
      props: {
        content: "This block should be hidden for mobile users."
      },
      style: {
        textAlign: "center",
        padding: "md",
        backgroundColor: "#e9ecef"
      },
      visibility: {
        platform: ["desktop", "tv"]
      }
    }
  ]
};

// Main app content with drag and drop functionality
const AppContent: React.FC = () => {
  const { insertBlockAtEnd } = useSelection();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
  
    // Reset activeId immediately (this disables DragOverlay instantly)
    setActiveId(null);
  
    if (over && over.id === 'canvas-drop-zone' && active.data.current) {
      const { type, blockType } = active.data.current;
  
      if (type === 'block-template' && blockType) {
        insertBlockAtEnd(blockType);
      }
    }
  }, [insertBlockAtEnd]);
  

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="h-screen flex flex-col bg-gray-50">
        <TopBar />
        <div className="flex-1 flex">
          <BlockInserterSidebar />
          <Canvas />
          <Sidebar />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        <DragOverlayContent activeId={activeId} />
      </DragOverlay>
    </DndContext>
  );
};

function App() {
  return (
    <SelectionProvider initialSchema={sampleSchema}>
      <AppContent />
    </SelectionProvider>
  );
}

export default App;
